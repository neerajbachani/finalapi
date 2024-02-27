const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")

router.post('/signup', authController.register)
router.post('/signin', authController.login)
router.post('/admin/login', authController.adminLogin)

module.exports = router
