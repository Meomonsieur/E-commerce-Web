const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword , cartData: {} });
    await user.save();

    res.json({ success: true, message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập", error });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cartData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy giỏ hàng", error });
  }
};

const addToCart = async (req, res) => {
  try {
    console.log("req.user.id: ", req.user.id);

    console.log("req.body.itemId: ", req.body.itemId);
    const user = await User.findById(req.user.id);
    console.log("user: ", user.cartData);
    user.cartData[req.body.itemId] = (user.cartData[req.body.itemId] || 0) + 1;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm vào giỏ hàng", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    delete user.cartData[req.body.itemId];
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa khỏi giỏ hàng", error });
  }
};

const checkout = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    await newOrder.save();

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

module.exports = { signup, login, getCart, addToCart, removeFromCart, checkout };
