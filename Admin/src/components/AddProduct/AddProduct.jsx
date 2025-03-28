import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: '',
        category: "women",
        new_price: '',
        old_price: '',
        image: null
    });

    // Xử lý khi chọn ảnh
    const imageHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setProductDetails({...productDetails, image: file});
    };

    // Xử lý khi nhập thông tin
    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value});
    };

    // Thêm sản phẩm
    const Add_Product = async () => {
        console.log(productDetails);
        let formData = new FormData();
        formData.append('image', productDetails.image);
        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('new_price', productDetails.new_price);
        formData.append('old_price', productDetails.old_price);

        // Gửi ảnh lên server
        let response = await fetch('http://localhost:4000/products/upload', {
            method: "POST",
            body: formData
        });

        let responseData = await response.json();

        if (responseData.success) {
            alert("Sản phẩm đã được thêm")
        } else {
            alert("Lỗi thêm sản phẩm")
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" id="file-input" name="image" hidden />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>Add product</button>
        </div>
    );
};

export default AddProduct;
