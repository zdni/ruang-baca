import mongoose from "mongoose"

const Schema = mongoose.Schema({
  order: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
  },
  description: { type: String, required: true },
  date: {
    init: { type: Date, required: true },
    done: { type: Date }
  },
  status: {
    type: String,
    enum: [
      'process',
      'done',
      'cancel'
    ],
    default: 'process'
  },
  createdAt: { type: Number },
  updatedAt: { type: Number },
},  {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

export default mongoose.model('OrderPenalty', Schema)