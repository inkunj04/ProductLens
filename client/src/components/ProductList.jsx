import { useState, useEffect } from 'react';

function ProductList({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Evaluations</h1>
        <div className="page-subtitle">Structured reviews focus on use cases, trade-offs, and signal.</div>
      </header>
      
      <section className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="card-header">
              <h3>{product.name}</h3>
            </div>

            <p className="card-description">{product.description}</p>
            
            <div className="card-meta">
              <span className="rating">
                {product.avg_rating ? parseFloat(product.avg_rating).toFixed(1) : '—'} ★
              </span>
              <span className="reviews">
                ({product.review_count || 0} reviews)
              </span>
            </div>
            
            <div className="card-action">
              <button onClick={() => onSelectProduct(product.id)}>
                View Details →
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ProductList;
