const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
module.exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: `${errors.array()[0].param} must be ${errors.array()[0].msg}`,
      })
    }
    const user = new User(req.body)
    await user.save()

    res.status(200).json(user)
  } catch {
    res.status(400).json({
      message: 'Not able to signup',
    })
  }
}

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: `${errors.array()[0].param} must be ${errors.array()[0].msg}`,
      })
    }

    const user = await User.findOne({ email }).exec()
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email and password doesn't match",
      })
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)

    //Save token to cookie
    res.cookie('token', token, { expire: new Date() + 9999 })

    //Send response to frontend
    const { name, role, _id } = user
    return res.json({ token, user: { _id, name, role, email } })
  } catch (err) {
    return res.status(400).json({
      message: 'email does exist',
    })
  }
}

module.exports.signout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'User signout successfully' })
}

module.exports.isSignedin = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
})

module.exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  if (!checker) {
    return res.status(403).json({
      message: 'ACCESS DENIED',
    })
  }
  next()
}

module.exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      message: "You're not a admin, ACCCESS DENIED",
    })
  }
  next()
}
