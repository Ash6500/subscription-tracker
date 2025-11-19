import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionsRouter from './routes/subscriptions.routes.js'; 
import connectToDatabase from './database/mongodb.js';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API!');  
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;