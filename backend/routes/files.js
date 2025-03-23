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
    format: async (req, file) => undefined, // garder le format original
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Ajouter un identifiant unique basé sur le timestamp
  },
});

const upload = multer({ storage: storage });

/* 📤 POST – Upload document */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { filename, date, department, fileHash } = req.body;
    const fileUrl = req.file.path;

    // 🔍 Vérifier doublon par fileHash
    const [existing] = await db.query('SELECT * FROM documents WHERE fileHash = ?', [fileHash]);
    if (existing.length > 0) {
      return res.status(409).json({ error: '❌ Un document avec le même contenu existe déjà.' });
    }

    // ✅ Extraire le public_id depuis req.file.filename (sans extension)
    const public_id = req.file.filename.split('.')[0];

    // 💾 Insertion en BDD
    const sql = `INSERT INTO documents (filename, date, department, cloudinaryUrl, fileHash, public_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [filename, date, department, fileUrl, fileHash, public_id]);

    res.status(201).json({ message: '✅ Document uploadé avec succès' });
  } catch (error) {
    console.error('❌ Erreur upload :', error);
    res.status(500).json({ error: 'Erreur lors de l’upload du document' });
  }
});

/* 📥 GET – Tous les documents */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM documents');
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Erreur récupération documents :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
});

/* ✏️ PUT – Modifier document */
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

/* 🗑️ DELETE – Supprimer document (Cloudinary + BDD) */
router.delete('/:id', async (req, res) => {
  const docId = req.params.id;

  try {
    // 🔍 Récupérer le document depuis la base de données
    const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [docId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const public_id = rows[0].public_id;
    const fileUrl = rows[0].cloudinaryUrl;

    console.log('🧨 Suppression Cloudinary avec public_id:', public_id);

    // 🧠 Déterminer le type du fichier (image ou autre)
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const resourceType = isImage ? 'image' : 'raw'; // Si c'est une image, on utilise 'image', sinon 'raw'

    // 🚀 Encoder le public_id pour éviter les problèmes d'espaces ou caractères spéciaux
    const encodedPublicId = encodeURIComponent(public_id);

    // ✅ Supprimer depuis Cloudinary avec le bon type
    await cloudinary.uploader.destroy(encodedPublicId, { resource_type: resourceType });

    // ✅ Supprimer le document de la BDD
    await db.query('DELETE FROM documents WHERE id = ?', [docId]);

    res.status(200).json({ message: '🗑️ Document supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur suppression document :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du document' });
  }
});

module.exports = router;

