import React from 'react'
import './ListProduct.css'
import { useState } from 'react'
import { useEffect } from 'react';
import cross_icon from '../../assets/cross_icon.png'
const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    
    const handleEdit = (product) => {
      setEditProduct(product);
      setShowEditPopup(true);
    };

    const handleUpdate = async () => {
      await fetch('http://localhost:4000/products/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });
      setShowEditPopup(false);
      await fetchInfo(); // refresh lại danh sách
    };

    const fetchInfo = async () => {
      await fetch('http://localhost:4000/products')
        .then((res) => res.json())
        .then((data) => {
          setAllProducts(data);
        });
    };
  
    useEffect(() => {
      fetchInfo();
    }, []);
  
    const remove_product = async (id) => {
      await fetch('http://localhost:4000/products/remove', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      await fetchInfo();
    };
  
    
  
    return (
      <div className='list-product'>
        <h1>All Products List</h1>
        {showEditPopup && (
          <div className="edit-popup">
            <div className="edit-popup-content">
              <h2>Edit Product</h2>
              <label>Title:</label>
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              />
              <label>Old Price:</label>
              <input
                type="number"
                value={editProduct.old_price}
                onChange={(e) => setEditProduct({ ...editProduct, old_price: e.target.value })}
              />
              <label>New Price:</label>
              <input
                type="number"
                value={editProduct.new_price}
                onChange={(e) => setEditProduct({ ...editProduct, new_price: e.target.value })}
              />
              <label>Category:</label>
              <input
                type="text"
                value={editProduct.category}
                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              />
              <div className="edit-popup-actions">
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setShowEditPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Actions</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product, index) => {
            return (
              <React.Fragment key={index}>
                <div className="listproduct-format-main listproduct-format">
                  <img src={product.image} alt="" className='listproduct-product-icon' />
                  <p>{product.name}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>
                  <div className="listproduct-actions">
                    <button
                      className="listproduct-edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="listproduct-remove-button"
                      onClick={() => remove_product(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <hr />
              </React.Fragment>
            );
          })}
        </div>
        
      </div>
    );
  };
  
  export default ListProduct;