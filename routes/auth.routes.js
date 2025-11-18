import { Router } from "express";

const authRouter = Router();

authRouter.post('/sign-up', (req, res) => res.send({title: 'Sign Up Endpoint'}));
authRouter.post('/sign-in', (req, res) => res.send({title: 'Sign In Endpoint'}));
authRouter.post('/sign-out', (req, res) => res.send({title: 'Sign Out Endpoint'}));

export default authRouter;