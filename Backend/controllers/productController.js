const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const imagePath = "http://localhost:4000/images/";

// Cấu hình multer để lưu file vào thư mục upload/images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file để tránh trùng lặp
    }
});
const upload = multer({ storage: storage });

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy sản phẩm", error });
    }
};

// Thêm sản phẩm (dùng JSON, không có ảnh)
const addProduct = async (req, res) => {
    try {
        const { name, image, category, new_price, old_price } = req.body;
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct ? lastProduct.id + 1 : 1;

        const product = new Product({ id, name, image, category, new_price, old_price });
        await product.save();
        res.json({ success: true, message: "Sản phẩm đã được thêm" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm sản phẩm", error });
    }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, message: "Sản phẩm đã được xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa sản phẩm", error });
    }
};

// Upload sản phẩm kèm ảnh
const uploadProduct = async (req, res) => {
    try {

        const { name, category, new_price, old_price } = req.body;
        const image = req.file ? req.file.filename : null; // Lưu tên file vào database

        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct ? lastProduct.id + 1 : 1;

        const product = new Product({ id, name, image : imagePath + image, category, new_price, old_price });
        await product.save();

        res.json({ success: true, message: "Sản phẩm đã được thêm", image_url: `/upload/images/${image}` });
    } catch (error) {
        res.status(500).json({ message: "Lỗi thêm sản phẩm", error });
    }
};
const getNewCollections = async (req, res) => {
  try {
      const newCollections = await Product.find().sort({ date: -1 }).limit(10);
      res.json(newCollections);
  } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy bộ sưu tập mới", error });
  }
};

// Lấy sản phẩm phổ biến cho nữ
const getPopularInWomen = async (req, res) => {
  try {
      const popularWomenProducts = await Product.find({ category: "women" }).sort({ new_price: -1 }).limit(10);
      res.json(popularWomenProducts);
  } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy sản phẩm phổ biến cho nữ", error });
  }
};


// Xuất các hàm
module.exports = { getAllProducts, addProduct, removeProduct, uploadProduct, getNewCollections, getPopularInWomen };
