import ResSpecialization from '../models/ResSpecialization.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

class ResSpecializationController {
  async index(req, res) {
    try {
      const specializations = await ResSpecialization.find()
      if( !specializations ) { throw { code: 404, message: "SPECIALIZATION_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_SPECIALIZATION",
        data: specializations
      })
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async store(req, res) {
    try {
      const {name} = req.body
      if(!name) { throw { code: 428, message: "NAME_IS_REQUIRED", data: null, status: false } }
      
      const data = new ResSpecialization({ name: name })
      const specialization = await data.save()
      if( !specialization ) { throw { code: 500, message: "FAILED_CREATE_SPECIALIZATION", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_SPECIALIZATION",
        data: specialization,
      })
    } catch (err) {
      return res.status( err.code || 500 ).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async show(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResSpecialization, "SPECIALIZATION", true)
      if(!checkObjId.status) return checkObjId

      return res.status(200).json({
        status: true,
        message: "SPECIALIZATION_FOUND",
        data: { ...checkObjId.data }
      })
    } catch (err) {
      if(!err.code) { err.code = 500 }
      return res.status(err.code).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async update(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 420, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResSpecialization, "SPECIALIZATION")
      if(!checkObjId.status) return checkObjId

      const specialization = await ResSpecialization.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!specialization) { throw { code: 500, message: "SPECIALIZATION_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SPECIALIZATION_UPDATE_SUCCESS",
        data: specialization,
      })
    } catch (err) {
      return res.status(err.code || 500 ).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async destroy(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 420, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResSpecialization, "SPECIALIZATION")
      if(!checkObjId.status) return checkObjId

      const specialization = await Specialization.findOneAndDelete({ _id: id })
      if(!specialization) { throw { code: 500, message: "SPECIALIZATION_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SPECIALIZATION_DELETE_SUCCESS",
        data: specialization,
      })
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }
}

export default new ResSpecializationController