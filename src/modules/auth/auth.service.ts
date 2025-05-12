import User from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async ({ username, email, password, bio, profilePicture }: { username: string; email: string; password: string, bio: string, profilePicture: string }) => {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) throw new Error("User already exists");
    const user = await User.create({ username, email, password, bio, profilePicture });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return {token, user: { username: user.username, email: user.email, bio: user.bio, profilePicture: user.profilePicture }};
}

export const login = async ({ email, password }: { email: string; password: string }) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid credentials");
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return { token, user: { username: user.username, email: user.email, bio: user.bio, profilePicture: user.profilePicture } };
}