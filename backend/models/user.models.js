import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
});

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: addressSchema, required: false },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
}, {
    timestamps: true
});

const Address = mongoose.model("Address", addressSchema);
const User = mongoose.model("User", userSchema);

export { Address, User };
