import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('EliteShop API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
