const express = require("express");
const { signup, login, getCart, addToCart, removeFromCart } = require("../controllers/userController");
const fetchUser = require("../middleware/auth");

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.get("/getcart", fetchUser, getCart);
router.post("/addtocart", fetchUser, addToCart);
router.post("/removefromcart", fetchUser, removeFromCart);

module.exports = router;
