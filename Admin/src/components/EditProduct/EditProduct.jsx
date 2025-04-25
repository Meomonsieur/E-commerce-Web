// src/components/EditProduct/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:4000/products/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    alert('Cập nhật thành công');
  };

  return product ? (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        type="number"
        value={product.old_price}
        onChange={(e) => setProduct({ ...product, old_price: e.target.value })}
      />
      <input
        type="number"
        value={product.new_price}
        onChange={(e) => setProduct({ ...product, new_price: e.target.value })}
      />
      <button type="submit">Lưu</button>
    </form>
  ) : (
    <p>Loading...</p>
  );
};

export default EditProduct;
