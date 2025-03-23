// routes/files.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const db = require('../db');

// 🔧 Configuration Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ged_documents',
    resource_type: 'auto',
    format: async (req, file) => 'pdf', // tu peux mettre undefined si tu veux garder le format original
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

/* 📤 Route POST – Upload d’un document */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { filename, date, department, fileHash } = req.body;
    const fileUrl = req.file.path;

    // 🔍 Vérification de doublon par fileHash
    const [existing] = await db.query('SELECT * FROM documents WHERE fileHash = ?', [fileHash]);
    if (existing.length > 0) {
      return res.status(409).json({ error: '❌ Un document avec le même contenu existe déjà.' });
    }

    // 💾 Insertion dans la base de données (correction ici ✅)
    const sql = `INSERT INTO documents (filename, date, department, cloudinaryUrl, fileHash)
                 VALUES (?, ?, ?, ?, ?)`;
    await db.query(sql, [filename, date, department, fileUrl, fileHash]);

    res.status(201).json({ message: '✅ Document uploadé avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de l’upload :', error);
    res.status(500).json({ error: 'Erreur lors de l’upload du document' });
  }
});

/* 📥 Route GET – Récupérer tous les documents */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents');
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Erreur récupération documents :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
});

/* ✏️ Route PUT – Modifier un document */
router.put('/:id', async (req, res) => {
  const docId = req.params.id;
  const { filename, date, department } = req.body;

  try {
    const sql = `UPDATE documents SET filename = ?, date = ?, department = ? WHERE id = ?`;
    await db.query(sql, [filename, date, department, docId]);
    res.status(200).json({ message: '✅ Document modifié avec succès' });
  } catch (error) {
    console.error('❌ Erreur modification document :', error);
    res.status(500).json({ error: 'Erreur lors de la modification du document' });
  }
});

/* 🗑️ Route DELETE – Supprimer un document (Cloudinary + BDD) */
router.delete('/:id', async (req, res) => {
  const docId = req.params.id;

  try {
    // 1️⃣ Récupérer l’URL du document
    const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [docId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const fileUrl = rows[0].cloudinaryUrl;
    const publicId = fileUrl.split('/').pop().split('.')[0]; // extraire le public_id sans l’extension

    // 2️⃣ Supprimer le fichier sur Cloudinary
    await cloudinary.uploader.destroy(`ged_documents/${publicId}`);

    // 3️⃣ Supprimer de la base de données
    await db.query('DELETE FROM documents WHERE id = ?', [docId]);

    res.status(200).json({ message: '🗑️ Document supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression document :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du document' });
  }
});

module.exports = router;
