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
        validated : {
            type: Boolean,
            default: false
        },
        basket : {
            type: String,
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
        birthdate : {
            type: Date,
            required: true
        },
        phone : {
            type:String,
            required: false
        },
        lang : {
            type:String,
            required: false
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('user', userSchema)