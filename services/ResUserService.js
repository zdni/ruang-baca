import bcrypt from 'bcrypt'

import checkValidationObjectId from '../libraries/checkValidationObjectId.js'
import usernameExist from "../libraries/usernameExist.js"

import ResUser from '../models/ResUser.js'

class ResUserService {
  async generateData(req) {
    try {
      const {
        classYear,
        idNumber,
        name,
        username,
        role,
      } = req.body

      if(!idNumber) { return { status: false, code: 428, message: "ID_NUMBER_IS_REQUIRED" } }
      if(!name) { return { status: false, code: 428, message: "NAME_IS_REQUIRED" } }
      if(!username) { return { status: false, code: 428, message: "USERNAME_IS_REQUIRED" } }
      const password = username

      const isUsernameExist = await usernameExist(username)
      if(isUsernameExist) { return { status: false, code: 409, message: "USERNAME_EXIST" } }

      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(password, salt)
      
      let data = {
        idNumber,
        name,
        username,
        password: hash,
        status: 'active'
      }
      if(role) data['role'] = role
      if(role === 'student' && classYear) data['classYear'] = classYear

      return { status: true, data }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      if(!err.message) err.message = "FAILED_GENERATE_DATA"
      return err
    }
  }

  async generateQuerySearch(req) {
    try {
      let query = {}
      const { search, role, withAdmin } = req.query

      if(search) {
        query.$or = [
          { name: { $regex: search.toLowerCase(), $options: 'i' }},
          { idNumber: { $regex: search.toLowerCase(), $options: 'i' }}
        ]
      }
      if(role) query.role = role
      if(!withAdmin) query.role = { $nin: ['admin'] }

      return { status: true, query }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }

  async processChangePassword(req, password) {
    try {
      const {
        oldPassword,
        newPassword,
        confirmPassword
      } = req.body
      
      const isMatch = bcrypt.compareSync(oldPassword, password)
      if(!isMatch) { return { status: false, code: 401, message: "WRONG_OLD_PASSWORD" } }

      if(newPassword !== confirmPassword) { return { status: false, code: 403, message: "WRONG_CONFIRM_PASSWORD" } }

      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(newPassword, salt)

      return { status: true, password: hash }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }

  async processResetPassword(req) {
    try {
      const {id} = req.params

      if(!id) { return { status: false, code: 428, message: "ID_REQUIRED" } }
      const checkUserId = await checkValidationObjectId(id, ResUser, "USER")
      if (checkUserId) return checkUserId

      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(user.username, salt)

      return { status: true, password: hash }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }
}

export default new ResUserService