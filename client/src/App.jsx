import { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import './index.css';

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);

  return (
    <div className="container">
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{ color: '#333' }}>Product Review Platform</h2>
      </header>
      <main>
        {selectedProductId ? (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={() => setSelectedProductId(null)} 
          />
        ) : (
          <ProductList onSelectProduct={(id) => setSelectedProductId(id)} />
        )}
      </main>
    </div>
  );
}

export default App;
