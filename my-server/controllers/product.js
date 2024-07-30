ProductModel = require("../models/product")

class Product {
    static products = []

    constructor(_id, title, productCode, price, description, tags, featured, quantity, pictures, delivery_weight, special_delivery) {
        this._id = _id.toString(),
        this.title = title
        this.productCode = productCode
        this.price = price
        this.description = description
        this.tags = tags
        this.featured = featured
        this.quantity = quantity
        this.pictures = pictures        
        this.delivery_weight = delivery_weight
        this.special_delivery = special_delivery
    }

    static isValidProductCode(code) {
        const regex = /^[A-Z][0-9]{4}$/
        return regex.test(code)
    }

    static async create(data) {
        try {
            if(!Product.isValidProductCode(data.product_code)) {
                console.log("invalid product code")
                throw "Invalid product code"
            }
            const product = new ProductModel(data)
            const result = await product.save()
            console.log(result)
            const productObject = new Product(
                result._id,
                result.title,
                result.product_code,
                result.price,
                result.description,
                result.tags,
                result.featured,
                result.quantity,
                result.pictures,
                result.delivery_weight,
                result.special_delivery
            )
            Product.products.push(productObject)
            return result  
        } catch (error) {
            throw error
        }
    }

    static async delete(productId) {
        try {
            const result = await ProductModel.findByIdAndDelete(productId)
            if(result) {
                Product.products = Product.products.filter(product => product._id !== productId)
                return result
            } else throw "Erreur during product delete in db"
        } catch (error) {
            throw error
        }
    }

    static async edit(productId, data) {
        const foundProduct = Product.products.find(product => product._id === productId)
        if(!foundProduct) {
            throw "No product found with ID:"+productId
        }
        let productObject = {
            title : data.title || foundProduct.title,
            description : data.description || foundProduct.description,
            product_code : data.product_code || foundProduct.productCode,
            price : data.price || foundProduct.price,
            tags : data.tags || foundProduct.tags,
            quantity : data.quantity || foundProduct.quantity,
            featured : data.featured || foundProduct.featured 
        }
        try {
            const result = await ProductModel.updateOne({ _id: productId}, productObject)
            if(result) {
                console.log(`Edited product with ID:${productId} in DB`)
                Object.assign(foundProduct, productObject)
                return result
            } else throw "Erreur during product edit in db"
        } catch (error) {
            throw error
        }
    }

    static async initialize() {
        const fetchedProducts = await ProductModel.find({})
        Product.products = fetchedProducts.map(p => new Product(p._id, p.title, p.product_code, p.price, p.description, p.tags, p.featured, p.quantity, p.pictures, p.delivery_weight, p.special_delivery))
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.log("no files")
            //return res.status(400).json({ message: 'Aucune image téléchargée' })
        }

        //req.body.pictures = req.files.map(file => {
            //return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;                  //Merci ChatGPT
        //})
        req.body.pictures = []  //need to be delete after

        req.body.tags = req.body.tags.split(",").map(tag => tag.trim())
        await Product.create(req.body)
        res.status(201).send("Product created")
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const result = await Product.delete(productId)
        if(result) {
            res.status(204).send(`Product with id ${productId} was deleted`)
            // if(result.pictures || Array.isArray(result.pictures)) {
            //     try {
            //         await result.pictures.forEach( filename => fs.unlink(filename))
            //     } catch (error) {
            //         throw error
            //     }
            // }
        } else throw "Error during product delete in DB"
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.editProduct = async (req, res) => {
    try {
        if(req.body.tags) {
            req.body.tags = req.body.tags.split(",").map(tag => tag.trim())
        }
        await Product.edit(req.params.id, req.body)
        res.status(200).send("Product edited")
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || Product.products.length
    const search = req.query.search.toLowerCase() || ""

    const startIndex = ( page - 1) * limit 
    const endIndex = page * limit 

    const filteredProducts = Product.products.filter( product => {
        return product.title.toLowerCase().includes(search) || 
        product.description.toLowerCase().includes(search) ||
        product.tags.some( tag => tag.toLowerCase().includes(search))
    })

    const slicedProducts = filteredProducts.slice(startIndex, endIndex)

    let result = {
        result : slicedProducts
    }

    if(page > 1) {
        result.previous = {
            limit: limit,
            page: page - 1
        }
    }

    if(endIndex < Product.products.length) {
        result.next = {
            limit: limit,
            page: page + 1,
            maxPage: Math.ceil(Product.products.length/limit)
        }
    }


    try {
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.initializeProducts = async () => {
    await Product.initialize()
}


//if you want to store images use imageUpload middleware and store image url with `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`
//filename is edited by the middleware