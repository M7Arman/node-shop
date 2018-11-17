const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

// Decide how to store images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
    cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 mb
  },
  fileFilter: fileFilter
});

router.get('/', ProductController.products_get_all);

router.get('/:productId', checkAuth, ProductController.get_product);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.add_product
);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
