const express = require('express');  // Importation d'Express, framework pour créer le serveur HTTP.
const router = express.Router();  // Création d'un routeur Express pour définir des routes d'API.
const multer = require('multer');  // Importation de Multer pour gérer les téléchargements de fichiers.
const cloudinary = require('../config/cloudinary');  // Importation de la configuration Cloudinary pour télécharger des fichiers.
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // Importation de la classe CloudinaryStorage pour stocker les fichiers dans Cloudinary via Multer.
const db = require('../db');  // Importation de la configuration de la base de données pour interagir avec MySQL.

// 🔧 Configuration Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Utilisation de l'objet Cloudinary configuré pour stocker les fichiers.
  params: {
    folder: 'ged_documents',  // Dossier dans lequel les fichiers seront stockés sur Cloudinary.
    resource_type: 'auto',  // Type de ressource 'auto' qui ajuste automatiquement le type de fichier.
    format: async (req, file) => undefined,  // Conservation du format d'origine du fichier (pas de conversion).
    public_id: (req, file) => {
      const timestamp = Date.now();  // Création d'un identifiant unique basé sur l'heure actuelle.
      return `${timestamp}-${file.originalname}`;  // Utilisation du timestamp et du nom original du fichier pour générer l'ID public sur Cloudinary.
    },
    resource_type: (req, file) => {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        return 'image'; // Images
      } else if (['pdf', 'docx', 'doc', 'xlsx', 'pptx'].includes(fileExtension)) {
        return 'raw'; // Documents
      }
      return 'auto'; // Autres types (Cloudinary détecte automatiquement)
    }
    
  },
});

const upload = multer({ storage: storage });  // Initialisation de Multer avec la configuration CloudinaryStorage pour gérer les uploads.

// 📤 POST – Upload document
router.post('/upload', upload.single('file'), async (req, res) => {  // Route pour télécharger un fichier, gérée par Multer avec un champ 'file'.
  try {
    const { filename, date, department, fileHash } = req.body;  // Récupération des données de formulaire envoyées dans le corps de la requête.
    const fileUrl = req.file.path;  // Récupération de l'URL du fichier sur Cloudinary.
    const public_id = req.file.filename;  // Utilisation du nom de fichier comme identifiant public sur Cloudinary.

    // 🔍 Vérifier doublon par fileHash
    const [existing] = await db.query('SELECT * FROM documents WHERE fileHash = ?', [fileHash]);  // Requête pour vérifier si un document avec le même hash existe déjà.
    if (existing.length > 0) {  // Si un document avec le même hash existe.
      return res.status(409).json({ error: '❌ Un document avec le même contenu existe déjà.' });  // Retourne une erreur 409 (conflit) avec un message.
    }

    // 💾 Insertion en BDD
    const sql = `INSERT INTO documents (filename, date, department, cloudinaryUrl, fileHash, public_id)
                 VALUES (?, ?, ?, ?, ?, ?)`;  // Requête SQL pour insérer les métadonnées du document dans la base de données.
    await db.query(sql, [filename, date, department, fileUrl, fileHash, public_id]);  // Exécution de la requête d'insertion.

    res.status(201).json({ message: '✅ Document uploadé avec succès' });  // Réponse avec succès après l'upload du fichier.
  } catch (error) {
    console.error('❌ Erreur upload :', error);  // Affichage de l'erreur dans la console en cas d'échec.
    res.status(500).json({ error: 'Erreur lors de l’upload du document' });  // Réponse avec erreur 500 en cas d'échec.
  }
});

// 📥 GET – Tous les documents
router.get('/', async (req, res) => {  // Route pour récupérer tous les documents de la base de données.
  try {
    const [rows] = await db.query('SELECT * FROM documents');  // Requête SQL pour récupérer tous les documents.
    res.status(200).json(rows);  // Réponse avec les documents récupérés.
  } catch (error) {
    console.error('❌ Erreur récupération documents :', error);  // Affichage de l'erreur dans la console.
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });  // Réponse avec erreur 500 en cas d'échec.
  }
});

// ✏️ PUT – Modifier document
router.put('/:id', async (req, res) => {  // Route pour modifier un document existant, en utilisant son ID.
  const docId = req.params.id;  // Récupération de l'ID du document à partir des paramètres de la requête.
  const { filename, date, department } = req.body;  // Récupération des nouvelles données du document envoyées dans le corps de la requête.

  try {
    const sql = `UPDATE documents SET filename = ?, date = ?, department = ? WHERE id = ?`;  // Requête SQL pour mettre à jour un document dans la base de données.
    await db.query(sql, [filename, date, department, docId]);  // Exécution de la requête de mise à jour.

    res.status(200).json({ message: '✅ Document modifié avec succès' });  // Réponse avec succès après la modification du document.
  } catch (error) {
    console.error('❌ Erreur modification document :', error);  // Affichage de l'erreur dans la console en cas d'échec.
    res.status(500).json({ error: 'Erreur lors de la modification du document' });  // Réponse avec erreur 500 en cas d'échec.
  }
});

// 🗑️ DELETE – Supprimer document (Cloudinary + BDD)
router.delete('/:id', async (req, res) => {  // Route pour supprimer un document en utilisant son ID.
  const docId = req.params.id;  // Récupération de l'ID du document à partir des paramètres de la requête.

  try {
    // 🔍 Récupérer le document depuis la base de données
    const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [docId]);  // Requête pour récupérer le document à supprimer.
    if (rows.length === 0) {  // Si aucun document trouvé.
      return res.status(404).json({ error: 'Document non trouvé' });  // Retourne une erreur 404 (document non trouvé).
    }

    let public_id = rows[0].public_id;  // Récupération de l'identifiant public du document à supprimer.
    const fileUrl = rows[0].cloudinaryUrl;  // Récupération de l'URL du fichier sur Cloudinary.

    console.log('🧨 Suppression Cloudinary avec public_id:', public_id);  // Affichage du public_id pour la suppression dans Cloudinary.

    // ⚠️ Si `public_id` ne contient pas "ged_documents/", l'ajouter manuellement
    if (!public_id.startsWith('ged_documents/')) {
      public_id = `ged_documents/${public_id}`;  // Préparation de l'identifiant pour suppression sur Cloudinary.
    }

    // 🧠 Déterminer le type du fichier (image, pdf, ou autre)
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
let resourceType = 'raw'; // Par défaut pour les fichiers autres qu'images

if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
  resourceType = 'image';
} else if (['pdf', 'docx', 'doc', 'xlsx', 'pptx'].includes(fileExtension)) {
  resourceType = 'raw';
}

await cloudinary.uploader.destroy(public_id, { resource_type: resourceType });

    // ✅ Supprimer le document de la BDD
    await db.query('DELETE FROM documents WHERE id = ?', [docId]);  // Suppression du document de la base de données.

    res.status(200).json({ message: '🗑️ Document supprimé avec succès' });  // Réponse de succès après la suppression du document.
  } catch (error) {
    console.error('❌ Erreur suppression document :', error);  // Affichage de l'erreur dans la console en cas d'échec.
    res.status(500).json({ error: 'Erreur lors de la suppression du document' });  // Réponse avec erreur 500 en cas d'échec.
  }
});

module.exports = router;  // Exportation du routeur pour qu'il puisse être utilisé dans d'autres parties de l'application.
