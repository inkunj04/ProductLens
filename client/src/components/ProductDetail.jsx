import { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';

function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterIntent, setFilterIntent] = useState('All');

  const fetchProduct = () => {
    // Basic fetch for product info + filtered reviews if needed
    // Note: Our API supports ?intent= but for distribution we want ALL data usually.
    // To keep it simple, we'll fetch with the filter applied to the review list.
    const url = `http://localhost:3000/api/products/${productId}${filterIntent !== 'All' ? `?intent=${filterIntent}` : ''}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, filterIntent]);

  const handleReviewSubmitted = () => {
    fetchProduct(); 
  };

  if (loading) return <div>Loading details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const intents = ['All', 'Exploring', 'Evaluating', 'Daily Use', 'Power User'];

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{marginBottom: '20px'}}>
        &larr; Back to Products
      </button>

      <div className="card">
        <h1>{product.name}</h1>
        <p style={{fontSize: '1.1rem', color: '#555'}}>{product.description}</p>
        
        <div className="rating-summary">
          {/* Left Column: Primary Signal */}
          <div className="rating-primary">
            <div className="avg-rating-large">
              {product.avg_rating ? parseFloat(product.avg_rating).toFixed(1) : '—'}
            </div>
            <span className="avg-label">Average Rating</span>
            <div className="review-count">
              {product.reviews ? product.reviews.length : 0} reviews
              {filterIntent !== 'All' && ' (filtered)'}
            </div>
          </div>

          {/* Right Column: Distribution */}
          <div className="rating-distribution">
             {[5,4,3,2,1].map(star => {
               const count = product.rating_distribution ? (product.rating_distribution[star] || 0) : 0;
               const total = product.rating_distribution ? Object.values(product.rating_distribution).reduce((a, b) => a + b, 0) : 0;
               const percent = total > 0 ? (count / total) * 100 : 0;
               
               return (
                 <div key={star} className="dist-row">
                   <div className="dist-label">{star} ★</div>
                   <div className="dist-bar-container">
                     <div className="dist-bar-fill" style={{width: `${percent}%`}}></div>
                   </div>
                   <div className="dist-count">{count}</div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
        <h2>Reviews</h2>
        <div>
          <span style={{marginRight: '10px', fontWeight: 'bold'}}>Filter by Intent:</span>
          {intents.map(intent => (
            <button 
              key={intent} 
              className={`filter-btn ${filterIntent === intent ? 'active' : ''}`}
              onClick={() => setFilterIntent(intent)}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 ? (
        product.reviews.map(review => (
          <div key={review.id} className="card review-item">
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
              <div className="rating-display" style={{fontSize: '1rem', marginRight: '15px'}}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
              </div>
              <span className={`intent-badge intent-${review.intent?.replace(' ', '-')}`}>
                {review.intent || 'Unknown'}
              </span>
              <div className="review-meta" style={{margin: 0, marginLeft: 'auto'}}>
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="review-section">
              <span className="review-label">Context</span>
              <div>{review.problem_solved}</div>
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px'}}>
                <div className="review-section" style={{flex: 1}}>
                <span className="review-label" style={{color: 'green'}}>What Worked</span>
                <div>{review.what_worked}</div>
                </div>

                {review.what_didnt && (
                <div className="review-section" style={{flex: 1}}>
                    <span className="review-label" style={{color: '#d9534f'}}>What Didn't</span>
                    <div>{review.what_didnt}</div>
                </div>
                )}
            </div>

            {review.unexpected_insight && (
                <div className="insight-box">
                    <strong>💡 Unexpected Insight:</strong> {review.unexpected_insight}
                </div>
            )}
          </div>
        ))
      ) : (
        <div className="card">
            <p>No reviews found for this filter.</p>
        </div>
      )}

      <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
}

export default ProductDetail;
