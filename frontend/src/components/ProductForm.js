import React, { useState } from 'react';

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tax_percentage: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('✅ Product added successfully!');
        setFormData({ name: '', description: '', price: '', tax_percentage: '' });

        // 👇 Call the parent callback to refresh the product list
        if (onProductAdded) onProductAdded();
      } else {
        const data = await res.json();
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Product</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Tax Percentage (%)</label>
          <input
            type="number"
            className="form-control"
            name="tax_percentage"
            step="0.01"
            value={formData.tax_percentage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

