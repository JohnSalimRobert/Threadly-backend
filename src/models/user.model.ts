import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false, // Enforce during signup
    },
    bio: {
        type: String,
        required: false, // Enforce during signup
        maxlength: 500, // Reasonable limit
    }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Password comparison methodç
userSchema.methods.comparePassword = async function (candidate: string) {
    return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
