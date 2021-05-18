const Product = require('../models/product')
const _ = require('lodash')
const fs = require('fs')
var path = require('path')
const { body, validationResult } = require('express-validator')
const product = require('../models/product')

//Add product to req object
module.exports.getProductById = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id).populate('category')
    req.product = product
    // console.log(product)
    next()
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: 'Product not found',
    })
  }
}
//Create product controller
module.exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    sold: req.body.sold,
    stock: req.body.stock,
    photo: {
      data: fs.readFileSync(
        path.join(__dirname, '../uploads/', req.file.filename)
      ),
      contentType: req.file.mimetype,
    },
  })
  // console.log(typeof product)

  //Save to DB
  try {
    product = await product.save()
    res.json(product)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Unable to save',
    })
  }
}

//Get a single product
module.exports.getProduct = (req, res) => {
  req.product.photo = undefined
  // console.log('reqafgak')
  res.json(req.product)
}

//Getting all products
module.exports.getAllProduct = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.limit ? req.query.sortBy : '_id'
  try {
    let products = await Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, 'asc']])
      .limit(limit)
  } catch (err) {
    console.log(err)
    res.json({
      message: 'No product found',
    })
  }
}

module.exports.getAllUniqueCategories = (req, res) => {
  Product.distinct('category', {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: 'No category found',
      })
    }
    res.json(category)
  })
}
//Optimizing binary data, such type of middleware help in fast reloading
module.exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}
//Delete a product
module.exports.removeProduct = async (req, res) => {
  product = req.product
  try {
    deletedProduct = await product.remove()
    res.json({
      message: 'succefully deleted',
      deletedProduct,
    })
  } catch {
    res.status(400).json({
      message: 'failed to delete product',
    })
  }
}

//Update a product
module.exports.updateProduct = async (req, res) => {
  let product = req.product
  if (req.file) {
    product.photo = {
      data: fs.readFileSync(
        path.join(__dirname, '../uploads/', req.file.filename)
      ),
      contentType: req.file.mimetype,
    }
  }

  product = _.extend(product, req.body)

  //Save to DB
  try {
    product = await product.save()
    res.json(product)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Unable to update',
    })
  }
}

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    }
  })
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: 'Bulk operation failed',
      })
    }
    next()
  })
}
