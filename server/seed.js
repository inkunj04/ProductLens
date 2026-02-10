const { run, db } = require('./db');

async function seed() {
    try {
        // Clear existing data
        await run('DELETE FROM reviews');
        await run('DELETE FROM products');
        
        // Reset auto-increment counters
        await run("DELETE FROM sqlite_sequence WHERE name='reviews' OR name='products'");

        console.log('Cleared existing data.');

        // Insert Products
        const products = [
            { name: 'ErgoChair Pro', description: 'Ergonomic office chair with adjustable lumbar support.' },
            { name: 'SoundMax 3000', description: 'High-fidelity noise-cancelling headphones for audiophiles.' },
            { name: 'CodeStream Deck', description: 'Programmable macro pad for developers and streamers.' },
            { name: 'FocusFlow Planner', description: 'Minimal productivity planner designed for deep work and task prioritization.' }
        ];

        for (const p of products) {
            await run('INSERT INTO products (name, description) VALUES (?, ?)', [p.name, p.description]);
        }

        console.log(`Seeded ${products.length} products.`);

        // Insert some initial reviews
        // Get product IDs first (assuming 1, 2, 3 due to reset, but let's be safe usually. For seed, we can assume sequential or fetch)
        // For simplicity in this seed script, we'll just insert based on knowing the order.

        const reviews = [
            {
                product_id: 1,
                rating: 5,
                intent: 'Daily Use',
                problem_solved: 'Back pain from 8+ hours of sitting.',
                what_worked: 'The lumbar support is aggressive but effective. Mesh back is breathable.',
                what_didnt: 'Headrest is a bit wobbly.',
                unexpected_insight: 'The recline tension is perfect for diverse weights.'
            },
            {
                product_id: 1,
                rating: 4,
                intent: 'Evaluating',
                problem_solved: 'Needed a chair for home office setup.',
                what_worked: 'Very adjustable. Assembly was easy.',
                what_didnt: 'Armrests are a bit hard.',
                unexpected_insight: null
            },
            {
                product_id: 2,
                rating: 2,
                intent: 'Power User',
                problem_solved: 'Focus in noisy open office.',
                what_worked: 'Noise cancellation is top tier.',
                what_didnt: 'Battery life is significantly lower than advertised. Uncomfortable after 2 hours.',
                unexpected_insight: 'Connects to two devices but switching is laggy.'
            }
        ];

        for (const r of reviews) {
            await run(
                `INSERT INTO reviews (product_id, rating, intent, problem_solved, what_worked, what_didnt, unexpected_insight) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [r.product_id, r.rating, r.intent, r.problem_solved, r.what_worked, r.what_didnt, r.unexpected_insight]
            );
        }

        console.log(`Seeded ${reviews.length} reviews.`);

    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

// Wait for DB connection
setTimeout(seed, 1000);
