import mongoose from "mongoose"

import Order from "./Order.js"
import OrderPenalty from "./OrderPenalty.js"

const Schema = mongoose.Schema({
  classYear: { type: String },
  idNumber: { type: String },
  name: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  role: {
    type: String,
    enum: [
      'admin',
      'lecture',
      'staff',
      'student',
    ],
    default: 'student'
  },
  status: {
    type: String,
    enum: [
      'active',
      'inactive',
    ],
    default: 'active'
  },
  image: { type: String },
  createdAt: { type: Number },
  updatedAt: { type: Number },
},  {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

export default mongoose.model('ResUser', Schema)