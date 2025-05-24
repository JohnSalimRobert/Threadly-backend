import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  justOne: false
});

commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

commentSchema.index({ post: 1, createdAt: -1 });         // for fetching comments under a post
commentSchema.index({ parentComment: 1 });               // for fetching replies
commentSchema.index({ post: 1, parentComment: 1 });      // compound index, best for hierarchical comments


export default mongoose.model('Comment', commentSchema);
