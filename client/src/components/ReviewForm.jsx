import { useState } from 'react';

function ReviewForm({ productId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    rating: 5,
    intent: '',
    problem_solved: '',
    what_worked: '',
    what_didnt: '',
    unexpected_insight: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.intent) {
      setError('Please select your usage context (Intent).');
      setSubmitting(false);
      return;
    }

    fetch(`http://localhost:3000/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Failed to submit') });
      return res.json();
    })
    .then(newReview => {
      setSubmitting(false);
      setFormData({
        rating: 5,
        intent: '',
        problem_solved: '',
        what_worked: '',
        what_didnt: '',
        unexpected_insight: ''
      });
      onReviewSubmitted(newReview);
    })
    .catch(err => {
      setError(err.message);
      setSubmitting(false);
    });
  };

  return (
    <div className="card" style={{marginTop: '30px', background: '#f9f9f9'}}>
      <h3>Write a Review</h3>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{display: 'flex', gap: '20px'}}>
          <div className="form-group" style={{flex: 1}}>
            <label>Rating</label>
            <select name="rating" value={formData.rating} onChange={handleChange}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          <div className="form-group" style={{flex: 1}}>
            <label>Usage Context (Intent)</label>
            <select name="intent" value={formData.intent} onChange={handleChange} required>
              <option value="">Select Intent...</option>
              <option value="Exploring">Exploring (Just started)</option>
              <option value="Evaluating">Evaluating (Testing fit)</option>
              <option value="Daily Use">Daily Use (Regular)</option>
              <option value="Power User">Power User (Deep usage)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>What problem were you trying to solve?</label>
          <input 
            type="text" 
            name="problem_solved" 
            value={formData.problem_solved} 
            onChange={handleChange}
            placeholder="e.g. Needed a quiet chair for recording calls"
            required
          />
        </div>

        <div className="form-group">
          <label>What worked well?</label>
          <textarea 
            name="what_worked" 
            value={formData.what_worked} 
            onChange={handleChange}
            placeholder="Signals: durability, specific feature that matters..."
            required
          />
        </div>

        <div className="form-group">
          <label>What didn't work? (Optional but helpful)</label>
          <textarea 
            name="what_didnt" 
            value={formData.what_didnt} 
            onChange={handleChange}
            placeholder="Trade-offs, missing features..."
          />
        </div>

        <div className="form-group">
          <label>Unexpected Insight (Optional)</label>
          <input 
            type="text" 
            name="unexpected_insight" 
            value={formData.unexpected_insight} 
            onChange={handleChange}
            placeholder="One sentence about something surprising..."
          />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
