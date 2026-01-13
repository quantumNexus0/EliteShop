import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { products } from './data/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  let connection;
  try {
    // Determine connection based on whether DB_PASSWORD is set or not.
    // XAMPP default is usually empty password.
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      multipleStatements: true
    };
    if (process.env.DB_PASSWORD) {
        dbConfig.password = process.env.DB_PASSWORD;
    }
    
    connection = await mysql.createConnection(dbConfig);

    console.log('Connected to MySQL server');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Run schema commands
    await connection.query(schemaSql);
    console.log('Database schema executed');

    // Switch to database
    await connection.changeUser({ database: process.env.DB_NAME || 'eliteshop' });

    // Clear existing products
    await connection.query('DELETE FROM products');
    console.log('Cleared existing products');

    // Insert new products
    const insertQuery = `
      INSERT INTO products (
        id, name, description, price, originalPrice, images, category, subcategory, 
        brand, rating, reviewCount, inStock, stockQuantity, tags, featured, sizes, 
        colors, material, gender, sku, discount, isNew, isBestseller
      ) VALUES ?
    `;

    const values = products.map(p => [
      p.id,
      p.name,
      p.description,
      p.price,
      p.originalPrice || null,
      JSON.stringify(p.images),
      p.category,
      p.subcategory,
      p.brand,
      p.rating,
      p.reviewCount,
      p.inStock,
      p.stockQuantity,
      JSON.stringify(p.tags),
      p.featured,
      JSON.stringify(p.sizes),
      JSON.stringify(p.colors),
      p.material,
      p.gender,
      p.sku,
      p.discount || 0,
      p.isNew || false,
      p.isBestseller || false
    ]);

    await connection.query(insertQuery, [values]);
    console.log(`${values.length} products inserted`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
};

seedDatabase();
