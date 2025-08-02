import React, { useState } from 'react';

function CustomerForm({ onCustomerAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) throw new Error('Failed to add customer');

      // Reset form
      setName('');
      setEmail('');
      setPhone('');

      // Call parent to refetch customers
      if (onCustomerAdded) onCustomerAdded();

      // Show success message
      setMessage('✅ Customer added successfully!');

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add customer.');
    }
  };

  return (
    <div className="mb-4">
      <h3>Add Customer</h3>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            className="form-control"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Customer
        </button>
      </form>
    </div>
  );
}

export default CustomerForm;
