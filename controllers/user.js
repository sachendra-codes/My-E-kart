const User = require('../models/user')
const Order = require('../models/order')
module.exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec()
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      message: 'No user found',
    })
  }
}

module.exports.getUser = (req, res) => {
  console.log(typeof req.profile)
  req.profile.salt = undefined
  req.profile.encry_password = undefined
  req.profile.createdAt = undefined
  req.profile.updatedAt = undefined
  return res.json(req.profile)
}

module.exports.updateUser = async (req, res) => {
  try {
    user = await User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    ).exec()
    user.salt = undefined
    user.encry_password = undefined
    user.createdAt = undefined
    user.updatedAt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      message: 'Updation is not successful',
    })
  }
}

module.exports.userPurchaseList = async (req, res) => {
  try {
    order = await Order.find({ user: req.profile._id }).populate(
      'user',
      '_id name'
    )
    return res.json(order)
  } catch (err) {
    return res.status(400).json({
      message: 'No Order in this account',
    })
  }
}

module.exports.pushOrderInPurchaseList = async (req, res, next) => {
  let purchases = []
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quntity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    })
  })
  try {
    purchases = User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchases: purchases } },
      { new: true }
    )
    next()
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to store in purchase List',
    })
  }
}
