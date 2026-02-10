const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { all, get, run } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// GET /products
// List all products with their average rating
app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT p.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            GROUP BY p.id
        `;
        const products = await all(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /products/:id
// Get a single product with all reviews
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { intent } = req.query; // strict filtering

    try {
        // Get product details
        const productQuery = `
            SELECT p.*, AVG(r.rating) as avg_rating
            FROM products p
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.id = ?
            GROUP BY p.id
        `;
        const product = await get(productQuery, [id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get reviews
        let reviewsQuery = `
            SELECT * FROM reviews 
            WHERE product_id = ?
        `;
        const params = [id];

        if (intent && intent !== 'All') {
            reviewsQuery += ` AND intent = ?`;
            params.push(intent);
        }
        
        reviewsQuery += ` ORDER BY created_at DESC`;
        const reviews = await all(reviewsQuery, params);

        // Calculate rating distribution (always over ALL reviews for this product, ignoring filter for context)
        // We need a separate query for distribution if filtering reviews, or just compute from all reviews if we fetched all.
        // For simplicity, let's just do a quick aggregation query.
        const distQuery = `
            SELECT rating, COUNT(*) as count 
            FROM reviews 
            WHERE product_id = ? 
            GROUP BY rating
        `;
        const distRows = await all(distQuery, [id]);
        
        const rating_distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        distRows.forEach(row => {
            rating_distribution[row.rating] = row.count;
        });

        res.json({ ...product, reviews, rating_distribution });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /products/:id/reviews
// Submit a review
app.post('/api/products/:id/reviews', async (req, res) => {
    const { id } = req.params;
    const { rating, intent, problem_solved, what_worked, what_didnt, unexpected_insight } = req.body;

    // Basic validation
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!intent) {
        return res.status(400).json({ error: 'Please select an intent.' });
    }
    if (!problem_solved || !what_worked) {
        return res.status(400).json({ error: 'Please provide context (problem solved) and what worked.' });
    }

    try {
        // Check if product exists
        const product = await get('SELECT id FROM products WHERE id = ?', [id]);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const result = await run(
            `INSERT INTO reviews (product_id, rating, intent, problem_solved, what_worked, what_didnt, unexpected_insight)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, rating, intent, problem_solved, what_worked, what_didnt, unexpected_insight]
        );

        // Fetch back the created review
        const newReview = await get('SELECT * FROM reviews WHERE id = ?', [result.id]);

        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
