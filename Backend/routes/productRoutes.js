const express = require('express');
const path = require("path");
const router = express.Router();
const { uploadProduct, addProduct, getAllProducts, removeProduct,getPopularInWomen, getNewCollections} = require('../controllers/productController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "upload/images/");
    },
    filename: (req, file, cb) => {
        cb(null, "product_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API lấy tất cả sản phẩm
router.get('/', getAllProducts);

// API thêm sản phẩm (JSON)
router.post('/add', addProduct);

// API xóa sản phẩm
router.post('/remove', removeProduct);

// API upload sản phẩm kèm ảnh
router.post('/upload', upload.single('image'), uploadProduct);

router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);

module.exports = router;
