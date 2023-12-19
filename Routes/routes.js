const express=require('express')
const {userRegistration,userLogin,Authentication,postBlog,registerSchema}=require ('../controllers/controllers')
const validator = require('express-joi-validation').createValidator({})










const router=express.Router()





router.post('/register',validator.body(registerSchema),userRegistration)

router.post('/login',userLogin)

router.post('/postblog',Authentication,postBlog)








module.exports=router