import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//routes
import authRoutes from './modules/auth/auth.route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('api/v1/auth', authRoutes)

export default app;