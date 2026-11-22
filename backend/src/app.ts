import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './lib/prisma';
// import locationRoutes from './routes/location.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '4mb' })); // Mengamankan batas payload serverless Vercel (4.5 MB)

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      service: 'sukaketemu-backend',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// app.use('/api/locations', locationRoutes);

export default app;