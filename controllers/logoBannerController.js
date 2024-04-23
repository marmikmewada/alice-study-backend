const storage = require('../config/firebase');
const multer = require('multer');

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// Upload logo
const uploadLogo = async (req, res, next) => {
  try {
    // Check if a logo already exists, delete it if it does
    const logo = storage.bucket().file('logo.jpg');
    const [exists] = await logo.exists();
    if (exists) {
      await logo.delete();
    }

    // Upload new logo
    upload.single('logo')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const blob = storage.bucket().file('logo.jpg');
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });

      blobStream.on('error', (error) => {
        next(error);
      });

      blobStream.on('finish', () => {
        res.status(200).json({ message: 'Logo uploaded successfully' });
      });

      blobStream.end(req.file.buffer);
    });
  } catch (error) {
    next(error);
  }
};

// Get logo
const getLogo = async (req, res, next) => {
  try {
    const file = storage.bucket().file('logo.jpg');
    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    const logoStream = file.createReadStream();
    logoStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// Upload banner images
const uploadBannerImages = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = files.map(async (file) => {
      const blob = storage.bucket().file(file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on('error', (error) => {
        next(error);
      });

      blobStream.on('finish', () => {
        console.log(`Uploaded ${file.originalname}`);
      });

      blobStream.end(file.buffer);
    });

    await Promise.all(uploadPromises);

    res.status(200).json({ message: 'Banner images uploaded successfully' });
  } catch (error) {
    next(error);
  }
};

// Get banner images
const getBannerImages = async (req, res, next) => {
  try {
    const [files] = await storage.bucket().getFiles();

    const fileUrls = files.map(file => {
      return {
        name: file.name,
        url: `https://storage.googleapis.com/${storage.bucket().name}/${file.name}`
      };
    });

    res.status(200).json(fileUrls);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadLogo,
  getLogo,
  uploadBannerImages,
  getBannerImages
};
