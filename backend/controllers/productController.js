import asynHandler from 'express-async-handler'
import Product from '../models/productModel.js'



// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asynHandler( async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber)  || 1

    const keyword = req.query.keyword ?{
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

    res.json({products, page, pages: Math.ceil(count / pageSize)})
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  private/ admin
const deleteProduct = asynHandler( async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product){
        await product.remove()
        res.json({message: 'product removed'})
    } else {
        res.status(404)
        throw new Error('product not found')
    }
})


// @desc    Create a product
// @route   Post /api/products
// @access  private/ admin
const createProduct = asynHandler( async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/samples.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)

})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  private/ admin
const updateProduct = asynHandler( async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updateProduct = await product.save()
        res.json(updateProduct)
        
    } else {
        res.status(404)
        throw new Error('product not found')
    }


})


// @desc    Create new review
// @route   PUT /api/products/:id/reviews
// @access  private
const createProductReview = asynHandler( async (req, res) => {
    const {
        rating, comment
    } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
       const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        
       if(alreadyReviewed){
           res.status(400)
           throw new Error('Product already reviewed')
       }

       const review = {
           name: req.user.name,
           rating: Number(rating),
           comment,
           user: req.user._id
       }
       product.reviews.push(review)
       product.numReviews = product.reviews.length
       product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

       await product.save()
       res.status(201).json({message: 'review added'})
    } else {
        res.status(404)
        throw new Error('product not found')
    }


})



// @desc    Get top reated products
// @route   Get /api/products/top
// @access  public
const getTopProducts = asynHandler( async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3)

    res.json(products)

})



export {
    getProducts,
    getProductsById, 
    deleteProduct,
    createProduct, 
    updateProduct,
    createProductReview,
    getTopProducts
}