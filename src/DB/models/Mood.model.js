import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    answers: {
      type: [Number],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: ["needs_care", "mixed", "supported"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

moodSchema.index({ userId: 1, day: -1 }, { unique: true });
moodSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;