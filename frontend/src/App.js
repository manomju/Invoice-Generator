import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('❌ Failed to fetch customers:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="text-white text-center py-3 m-0">MJS STORE</h1>
      </header>

      {/* Main content */}
      <main className="content-area container mt-4 mb-5">
        <h2 className="text-center mb-4">INVOICE GENERATOR</h2>
        <hr />

        <CustomerForm onCustomerAdded={fetchCustomers} />
        <hr />

        <ProductForm onProductAdded={fetchProducts} />
        <hr />

        <ProductList products={products} />
        <hr />

        <InvoiceForm customers={customers} products={products} />
        <hr />

        <InvoiceList />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="text-white text-center m-0 py-3">
          © {new Date().getFullYear()} MJS STORE | www.mjsstore.com | contact@mjsstore.com
        </p>
      </footer>
    </div>
  );
}

export default App;



