import express from 'express';
import imageRoutes from './routes/imageRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use('/api/images', imageRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
