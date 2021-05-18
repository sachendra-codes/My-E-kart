const express = require('express')
const router = express.Router()
const {
  signout,
  signup,
  signin,
  isSignedin,
} = require('../controllers/auth.js')
const { body, validationResult } = require('express-validator')

// SignUp Route
router.post(
  '/signup',
  body('name')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars long'),
  body('email').isEmail().withMessage('valid'),
  body('password')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars long'),
  signup
)

// SignIn Route
router.post(
  '/signin',
  body('email').isEmail().withMessage('valid'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Email and password are not valid'),
  signin
)

//SignOut Route
router.get('/signout', signout)

module.exports = router
