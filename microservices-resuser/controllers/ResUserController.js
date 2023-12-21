import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import mongoose from "mongoose"

import ResUser from '../models/ResUser.js'

import checkValidationObjectId from '../libraries/checkValidationObjectId.js'
import ResUserService from '../services/ResUserService.js'

class UserController {
  async index(req, res) {
    try {
      const query = await ResUserService.generateQuerySearch(req)
      if(!query.status) throw { code: query.code, message: "ERROR_QUERY_SEARCH", data: null, status: false }
      
      const users = await ResUser.aggregate([
        { $match: query.query },
        { $addFields: {imageUrl: { $concat: [req.protocol, "://", req.get('host'), "/uploads/users/", "$image"] }} },
        { $unset: ["password"] }
      ])
      if(!users) { throw { code: 404, message: "USER_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_USER",
        data: users
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
      const data = await ResUserService.generateData(req)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }

      const document = new ResUser(data.data)
      const user = await document.save()

      if(!user) { throw { code: 500, message: "USER_REGISTER_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        data: user,
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

  async show(req, res) {
    try {
      const {id} = req.params
      
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId
      
      const user = await ResUser.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $addFields: {imageUrl: { $concat: [req.protocol, "://", req.get('host'), "/uploads/users/", "$image"] }} },
        { $unset: ["password"] }
      ])

      return res.status(200).json({
        status: true,
        message: "USER_FOUND",
        data: user[0]
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
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId
      
      const user = await ResUser.findOneAndUpdate( { _id: id }, req.body, { new: true } )
      if(!user) { throw { code: 500, message: "USER_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "USER_UPDATE_SUCCESS",
        data: user
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

  async destroy(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId

      const user = await ResUser.findOneAndDelete({ _id: id })
      if(!user) { throw { code: 500, message: "USER_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "USER_DELETE_SUCCESS",
        data: user
      })
    } catch (err) {
      return res.status(err.code).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async changePassword(req, res) {
    try {
      const { id } = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER", true)
      if(!checkObjId.status) return checkObjId
      
      const data = await ResUserService.processChangePassword(req, checkObjId.data.password)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }

      const user = await ResUser.findOneAndUpdate( { _id: id }, { password: data.password }, { new: true } )
      if(!user) { throw { code: 500, message: "CHANGE_PASSWORD_USER_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "CHANGE_PASSWORD_USER_SUCCESS",
        data: user
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

  async resetPassword(req, res) {
    try {
      const { id } = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId

      const data = await ResUserService.processResetPassword(req)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }

      const user = await ResUser.findOneAndUpdate( { _id: id }, { password: data.password }, { new: true } )
      if(!user) { throw { code: 500, message: "RESET_PASSWORD_USER_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "RESET_PASSWORD_USER_SUCCESS",
        data: user
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

  async changeProfilePicture(req, res) {
    try {
      const { id } = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId
      
      const form = {}
      if(req.file) {
        form.image = req.file.filename
      } else {
        throw { code: 428, message: 'IMAGE_NOT_FOUND', data: null, status: false }
      }

      const user = await ResUser.findOneAndUpdate( { _id: id }, form, { new: true } )
      if(!user) { throw { code: 500, message: "CHANGE_PROFILE_PICTURE_USER_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "CHANGE_PROFILE_PICTURE_USER_SUCCESS",
        data: user
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

  async userFromToken(req, res) {
    try {
      const env = dotenv.config().parsed
      const token = req.headers.authorization.split(' ')[1]

      if(!token) { throw { code: 428, message: "TOKEN_REQUIRED", data: null, status: false } }
      const {id} = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET)

      const checkObjId = await checkValidationObjectId(id, ResUser, "USER")
      if(!checkObjId.status) return checkObjId

      const user = await ResUser.findById(id).select('-password')
      if(!user) { throw { code: 404, message: "USER_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "USER_FOUND",
        data: user
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
}

export default new UserController