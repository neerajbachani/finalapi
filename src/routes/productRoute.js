const express = require("express")
const router = express.Router()

const productController = require("../controller/productController.js")
const authenticate = require("../middleware/authenticate.js");

router.get("/" ,productController.getAllProducts)
router.get("/id/:id" ,productController.findProductById)

module.exports = router
