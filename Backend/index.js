const port = 4000;
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer")
const path = require("path");
const cors = require("cors");


app.use(express.json());
app.use(cors());

//mongodb
mongoose.connect("mongodb+srv://hoangtienquan2003:tienquan0212@cluster1.ti9dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");

// tao api
app.get("/",(req,res)=>{
    res.send("express app is running")
})

// image storage engine
const storage = multer.diskStorage({
    destination : './upload/images',
    filename : (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`)
    }
})


const upload=multer({storage:storage})

// Creating upload
app.use('/images',express.static('upload/images'))
app.post("/upload", upload.single('product'),(req,res) =>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

const Product= mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
        },
    name:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        require:true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id; 
    if(products.length >0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id = 1;

    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

// tao api de xoa san pham
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Remove");
    res.json({
        success:true,
        name:req.body.name
    })
})

// tao api de lay tat ca san pham
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetch");
    res.send(products);
})

// tao schema cho mo hih nguoi dung

const Users = mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//tao endpoint cho dky nguoi dung
app.post('/signup', async(req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart= {};
    for (let i = 0; i < 300; i++ ){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({
        success:true,token
    })

})
// tao endpoint cho user login
app.post('/login', async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"User not found"})
    }
})

// tao endpoint cho newcollection data
app.get('/newcollections', async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("newcollection Fetched");
    res.send(newcollection);
})

// tao endpoint popular in women secion
app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("popular Fetched");
    res.send(popular_in_women);

})

// create middleware to Fetch user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if(!token) {
            res.status(401).send({errors: "Please authenticate using valid token"})
        }
        else{
            try{
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error){
                res.status(401).send({errors: "Invalid token"})
            }    
        }       
    }


// creating endpoint for adding products in cartData
app.post('/addtocart',fetchUser, async(req,res)=>{
    console.log("removed", req.body.itemId);

    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added")
})

app.post('/removefromcart', fetchUser, async(req,res)=>{
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Removed")
})

// creating endpoint to get cartData

app.post('/getcart', fetchUser, async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=> {
    if(error) {
        console.log("Error: "+error)
    }
    else{
        
        console.log("Sever running on Port" + port)
    }
})
