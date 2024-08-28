import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    file: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
