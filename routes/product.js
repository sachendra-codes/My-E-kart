const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
//controllers for product
const {
  getProductById,
  getProduct,
  createProduct,
  photo,
  removeProduct,
  updateProduct,
  getAllProduct,
  getAllUniqueCategories,
} = require('../controllers/product.js')

//controllers for authentication
const {
  isAdmin,
  isSignedin,
  isAuthenticated,
} = require('../controllers/auth.js')

//controllers for category
const { getCategoryById } = require('../controllers/category')

//controller for user
const { getUserById } = require('../controllers/user.js')

//configuration of multer
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  },
})
const upload = multer({ storage: storage })

//Handlilg param
router.param('productId', getProductById)
router.param('userId', getUserById)
router.param('categoryId', getCategoryById)

//Actual routes
//Creating new Product
router.post(
  '/product/create/:userId',
  upload.single('productImage'),
  isSignedin,
  isAuthenticated,
  isAdmin,
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name should be atleast 3 character long'),
  body('price').isNumeric().withMessage('Price should be numeric'),
  body('description')
    .isLength({ min: 20 })
    .withMessage('Description should be atleast 20 character long'),
  createProduct
)
//Getting product
router.get('/product/:productId', getProduct)
router.get('/product/photo/:productId', photo) //Used to do some optimization so that image loads fast

//Getting all products
router.get('/products', getAllProduct)

//Getting all Categories]
router.get('/products/categories', getAllUniqueCategories)
//Deleting Product
router.delete(
  '/product/:productId/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  removeProduct
)

//Updating Product
router.put(
  '/product/:productId/:userId',
  upload.single('productImage'),
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateProduct
)

module.exports = router
