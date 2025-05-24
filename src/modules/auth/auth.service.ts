import User from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError";


export const signup = async ({ username, email, password, bio, profilePicture }: { username: string; email: string; password: string, bio: string, profilePicture: string }) => {
   try{

       const exists = await User.findOne({ $or: [{ username }, { email }] });
       console.log(exists);
       if (exists) return { error: 'User already exists', statusCode: 409 };
       const user = await User.create({ username, email, password, bio, profilePicture });
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
       return {token, user: { username: user.username, email: user.email, bio: user.bio, profilePicture: user.profilePicture }};
    } catch (error) {
        throw new AppError('Error creating user', 500, 'USER_CREATION_ERROR');
    }
}

export const login = async ({ email, password }: { email: string; password: string }) => {
    try{
    const user = await User.findOne({email});
    if (!user) return { error: 'User not found', statusCode: 404, code: 'USER_NOT_FOUND' };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)  return { error: 'Invalid credentials', statusCode: 401, code: 'INVALID_CREDENTIALS' };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return { token, user: { username: user.username, email: user.email, bio: user.bio, profilePicture: user.profilePicture } };
    } catch (error) {
        throw new AppError('Error logging in', 500, 'LOGIN_ERROR');
    }
}