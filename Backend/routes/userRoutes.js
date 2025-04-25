const express = require("express");
const { signup, login, getCart, addToCart, removeFromCart, checkout } = require("../controllers/userController");
const fetchUser = require("../middleware/auth");
const Order = require('../models/Order');

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/getcart", fetchUser, getCart);
router.post("/addtocart", fetchUser, addToCart);
router.post("/removefromcart", fetchUser, removeFromCart);
router.post("/checkout", fetchUser, checkout);

// Lấy tất cả đơn hàng (cho admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name');
    // Map lại để chỉ trả về name thay vì userId
    const mappedOrders = orders.map(order => {
      const obj = order.toObject();
      return {
        ...obj,
        userName: obj.userId?.name || 'Unknown',
      };
    });
    res.json({ success: true, orders: mappedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng', error });
  }
});

module.exports = router;
