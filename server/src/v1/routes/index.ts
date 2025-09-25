import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to TestWise Server 🚀');
});

export default router;
