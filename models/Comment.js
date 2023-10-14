import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  user: {
    fullName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
  },
  text: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Comment', CommentSchema);
