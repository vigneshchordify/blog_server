const express = require('express')
const { userRegistration, userLogin, Authentication, postBlog, registerSchema, getBlogs,getspecific ,getSingleBlog} = require('../controllers/controllers')
const validator = require('express-joi-validation').createValidator({})










const router = express.Router()





router.post('/register', validator.body(registerSchema), userRegistration)

router.post('/login', userLogin)

router.post('/postblog', Authentication, postBlog)

router.get('/getall', getBlogs)

router.post('/particularblogs',getspecific)

router.get('/singleblog/:id',getSingleBlog)








module.exports = router