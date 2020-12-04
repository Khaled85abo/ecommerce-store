import asynHandler from 'express-async-handler'
import Product from '../models/productModel.js'



// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asynHandler( async (req, res) => {
    const products = await Product.find({})

    res.json(products)
})


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductsById = asynHandler( async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product){
        res.json(product)

    } else {
        res.status(404)
        throw new Error('product not found')
    }
})


export {
    getProducts,
    getProductsById
}