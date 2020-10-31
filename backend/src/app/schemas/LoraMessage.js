import mongoose from 'mongoose';

const LoraMessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // required: true,
    },
    meta: {
      type: Object,
      // required: true,
    },
    params: {
      type: Object,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('LoraMessage', LoraMessageSchema);
