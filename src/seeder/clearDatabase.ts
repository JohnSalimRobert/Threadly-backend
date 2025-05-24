import commentModel from "../models/comment.model";
import postModel from "../models/post.model";
import userModel from "../models/user.model";

export const clearDatabase = async () => {
    try {
      await Promise.all([
        userModel.deleteMany({}),
        postModel.deleteMany({}),
        commentModel.deleteMany({}), // Add more collections as needed
      ]);
  
      console.log('🧹 Database cleared successfully');
    } catch (err) {
      console.error('❌ Error clearing database:', err);
    }
  };