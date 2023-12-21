import mongoose from "mongoose"

const Schema = mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Number },
  updatedAt: { type: Number },
},  {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

export default mongoose.model('StockLocation', Schema)