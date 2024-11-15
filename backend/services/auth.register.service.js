const { model: User } = require('../models/user.model')
const jwt = require('jsonwebtoken')

const registerService = async (email, username, password, res) => {
  // throw error when email already registered
  const isEmailExist = await User.findOne({ email: email })

  if (isEmailExist) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  // throw error when username already registered
  const isUsernameExist = await User.findOne({ username: username })

  if (isUsernameExist) {
    return res.status(400).json({ err: 'Username already exists' })
  }

  try {
   const user = await User.create({
      email,
      username,
      password // hashed password
    })
    // create token
  const token = jwt.sign(
    // payload data
    {
      name: username,
      id: user._id
    },
    process.env.TOKEN_SECRET
  )
  res.header('auth-token', token).json({
    status: 'ok',
    error: null,
    data: {
      token,
      username: username
    }
  })

   
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error! Cannot register user' })
  }
}

module.exports = {
  registerService
}
