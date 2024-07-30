const express = require("express")

const router = express.Router()

const { createProduct, getProducts, deleteProduct, editProduct } = require("../controllers/product")

const auth = require("../middlewares/auth")

const admin = require("../middlewares/auth")

router.post("/", admin, createProduct)

router.delete("/:id", admin, deleteProduct)

router.patch("/:id", admin, editProduct)

router.get("/", getProducts)

module.exports = router