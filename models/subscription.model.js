import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [ true, "Subscription name is required" ],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: { 
        type: Number,
        required: [true, "Subscription price is required" ],
        min: [0, "Price cannot be negative"],
    },
    currency: { 
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'productivity', 'education', 'health', 'lifestyle', 'technology', 'finance', 'politics','other'],
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
        status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: { 
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date cannot be in the future"
        }
    },
    renewalDate: { 
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after start date"
        }
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

}, { timestamps: true });


// Auto-calculate renewalDate if missing before saving
subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    };

    // Auto-update the status if renewal date has passed
    if (this.renewalDate <= new Date()) {
        this.paymentMethod = 'expired';
    };
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;