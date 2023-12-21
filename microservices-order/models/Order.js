import mongoose from "mongoose"

const Schema = mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
  },
  document: {
    id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String },
  },
  date: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    return: { type: Date }
  },
  status: {
    type: String,
    enum: [
      'draft',
      'process',
      'late',
      'done',
      'cancel'
    ],
    default: 'draft'
  },
  qty: { type: Number, default: 1 },
  createdAt: { type: Number },
  updatedAt: { type: Number },
},  {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

export default mongoose.model('Order', Schema)