import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = 'SELECT * FROM products';
    const queryParams = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }
    
    if (featured === 'true') {
        conditions.push('featured = TRUE');
    }

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [products] = await pool.query(query, queryParams);
    
    // Parse JSON fields
    const parsedProducts = products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        inStock: Boolean(product.inStock),
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        isBestseller: Boolean(product.isBestseller)
    }));

    res.json(parsedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    const parsedProduct = {
        ...product,
        images: JSON.parse(product.images || '[]'),
        tags: JSON.parse(product.tags || '[]'),
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        inStock: Boolean(product.inStock),
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        isBestseller: Boolean(product.isBestseller)
    };

    res.json(parsedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
