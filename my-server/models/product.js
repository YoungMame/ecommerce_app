const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
        },
        product_code : {
            type: String,
            required: true,
        },
        price : {
            type: Number,
            required: true,
        },
        description : {
            type: String,
            required: true,
        },
        tags : {
            type: [String],
            required: true,
        },
        featured : {
            type: Boolean,
            required: true,
        },
        quantity : {
            type: Number,
            required: true,
        },
        pictures : {
            type: [String],
            required: true,
        },
        delivery_weight : {
            type: Number
        },
        special_delivery : {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('product', productSchema)