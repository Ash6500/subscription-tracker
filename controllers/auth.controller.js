import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async(req, res,next) => {
    
    // Logic for user sign-up
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Logic to create a new user
        const {name,email,password} = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.status = 409;
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword,
        }], { session });

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ 
            success: true, 
            message: 'User created successfully', 
            data: {
                token,
                user: newUsers[0],
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async(req, res,next) => {
    // Logic for user sign-in
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({ 
            success: true, 
            message: 'User signed in successfully',
            data: {
                token,
                user,
            } 
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res) => {
    // Logic for user sign-out
    res.status(200).json({ message: 'User signed out successfully' });
}