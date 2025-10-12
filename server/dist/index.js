import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { createServer } from 'http';
import webSocketService from './v1/services/webSocketService.js';
import { setupRoutes } from './v1/routes/index.js';
// Configure dotenv
dotenv.config();
//App initialization
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Setup routes
setupRoutes(app);
// Error handling
app.use(errorHandler);
const server = createServer(app);
webSocketService.init(server);
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map