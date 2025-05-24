import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 }); // for pagination
postSchema.index({ author: 1 });     // if filtering by author in future

export default mongoose.model('Post', postSchema);
