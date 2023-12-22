
const { User, Post } = require('../models')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { where } = require('sequelize')
const Joi = require('joi')

const jwtsecret = '32716b297df0651e2867c59195e1c07a983e68642abfbdb6fa16892bb453cda91e3b1c'

//joi validation schema
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    confirmpassword: Joi.string().required()

})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()

})


const userRegistration = async (req, res) => {
    const { email, name, password } = req.body

    // Check if email is provided
    if (!email) {
        return res.status(200).json({
            message: 'Email is required',
        });
    }

    const regdetails = await User.findOne({ where: { email: email } })

    try {
        if (regdetails) {
            res.status(200).json(
                {
                    message: "user already exists"
                }
            )
        }
        else {
            bycrypt.hash(password, 10).then(async (hash) => {
                const adduser = await User.create({ email: email, name: name, password: hash })
            })


            res.status(200).json({
                message: 'registration successfull'
            })
        }
    }
    catch (err) {
        console.log(err);
    }

}



const userLogin = async (req, res) => {
    const { email, password } = req.body
    const loginDetails = await User.findOne({ where: { email: email } })

    try {
        if (loginDetails) {
            bycrypt.compare(password, loginDetails.password).then((data) => {
                if (data) {
                    const maxAge = 3 * 60 * 60
                    const token = jwt.sign({ uuid: data.uuid }, jwtsecret, { expiresIn: maxAge })
                    res.status(200).json({
                        message: 'login success',
                        token: token,
                        id: loginDetails.uuid

                    })

                }
                else {
                    res.status(200).json({
                        message: 'invalid password'
                    })
                }
            })



        }
        else {
            res.status(200).json({
                message: 'invalid credentials'
            })
        }
    }
    catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

const postBlog = async (req, res) => {


    try {
        const { uuid, title, description, image } = req.body


        const userdata = await User.findOne({ where: { uuid: uuid } })

        if (userdata) {

            const createBlog = await Post.create({ uuid: uuid,name:userdata.name, email: userdata.email, title: title, description: description, image: image })
            res.status(200).json({
                message: "post added successfully"
            })
        }
        else {
            res.status(200).json({
                message: "error adding post"
            })

        }
    }
    catch (err) {

        res.status(400).json({
            message: err
        })

    }

}

//get all blogs

const getBlogs = async (req, res) => {
    try {
        const blogs = await Post.findAll()
        res.status(200).json(blogs)
    }
    catch (err) {
        console.log(err);
    }

}

const getspecific = async (req, res) => {
    try {

       const  {uuid}=req.body
       const userdata = await Post.findAll({ where: { uuid: uuid } })

       res.status(200).json(userdata)



    }
    catch (err) {

        res.send(err)

    }
}

//single blog controller

const getSingleBlog=async(req,res)=>{
    const {id}=req.params
    console.log(id);
    res.send(id)
}

//jwt authentication

const Authentication = async (req, res, next) => {
    const apitoken = req.body.token

    try {

        const data = jwt.verify(apitoken, jwtsecret)
        const userData = await User.findOne(data.uuid)
        if (!userData) {
            return res.status(200).json({ message: "User not found" })
        }
        else {
            console.log(userData.email);
            next()

        }
    }
    catch (err) {
        res.send(err)
    }


}



module.exports = {
    userRegistration,
    userLogin,
    Authentication,
    postBlog,
    getBlogs,
    getspecific,
    getSingleBlog,
    registerSchema

}