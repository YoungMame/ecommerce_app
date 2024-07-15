const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true
        },
        admin : {
            type: Boolean,
            required: true
        },
        basket : {
            type: String,
            required: true,
            default: "[]"
        },
        firstname : {
            type: String,
            required: true
        },
        lastname : {
            type: String,
            required: true
        },
        birthday : {
            type: Date,
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('user', userSchema)