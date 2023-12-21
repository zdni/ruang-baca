import ResUser from '../models/ResUser.js'

const usernameExist = async (username) => {
  try {
    const user = await ResUser.findOne({ username: username })
    if(!user) return false
    return true
  } catch (err) {
    return false
  }
}

export default usernameExist