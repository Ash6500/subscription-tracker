import Subscription from '../models/subscription.model.js';

import {workflowClient} from '../config/upstash.js';
import {SERVER_URL} from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user:req.user._id,
        });

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: { 
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries:0,
        })

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription,
        });

    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check if the user is authorized to access this data
        if (req.user.id.toString() !== req.params.id) {
            const error = new Error('Unauthorized access');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
        
    } catch (error) {
        next(error);
    }
};