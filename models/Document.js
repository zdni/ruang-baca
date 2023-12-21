import mongoose from "mongoose"

const Schema = mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  cover: { type: String },
  studentIdNumber: { type: String },
  year: { type: Number },
  lectures: {
    mentor: {
      main: { type: String },
      second: { type: String },
    },
    examiner: {
      main: { type: String },
      second: { type: String },
      third: { type: String },
    }
  },
  publisher: { type: String },
  place_of_publication: { type: String },
  qty: { type: Number },
  currentQty: { type: Number },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentCategory'
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentType'
  },
  specializationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResSpecialization'
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'StockLocation'
  },
  volume: { type: String },
  identifier: { type: String },
  classification: { type: String },
  language: { 
    type: String,
    enum: [ 'id', 'en' ],
    default: 'id'
  },
  content: { type: String },
  physicalDescription: { type: String },
  doi: { type: String },
  accessed: { type: Number, default: 0 },
  createdAt: { type: Number },
  updatedAt: { type: Number },
},  {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

export default mongoose.model('Document', Schema)