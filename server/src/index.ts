dotenv.config();
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const v1Routes = require('./v1/routes');

//App initialization
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', v1Routes);

//Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
