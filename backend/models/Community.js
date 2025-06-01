import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const postSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  sensor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sensor",
  },
  description: {
    type: String,
    required: true,
  },
  media: [mediaSchema],
  timestamp: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["waiting", "approved", "rejected"],
    default: "waiting",
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const communitySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  members_count: {
    type: Number,
    default: 0,
  },
  community_posts: [postSchema],
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
