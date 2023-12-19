
const { User, Post } = require('../models')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { where } = require('sequelize')
const Joi = require('joi')

const jwtsecret = '32716b297df0651e2867c59195e1c07a983e68642abfbdb6fa16892bb453cda91e3b1c'

//joi validation schema
const registerSchema=Joi.object({
    email:Joi.string().email().required(),
    name:Joi.string().required(),
    password:Joi.string().required()
    
})

const userRegistration = async (req, res) => {
    const { email, name, password } = req.body

    const regdetails = await User.findOne({ where: { email: email } })

    try {
        if (regdetails) {
            res.status(401).json(
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
                        token: token
                    })

                }
                else {
                    res.status(404).json({
                        message: 'invalid password'
                    })
                }
            })



        }
        else {
            res.status(404).json({
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
        const { uuid, email, title, description, image } = req.body

        const userdata = await User.findOne({ where: { uuid: uuid } })
        if (userdata) {
            const createBlog = await Post.create({ id: userdata.id, email: email, title: title, description: description, image: image })
            res.status(200).json({
                message: "post added successfully"
            })
        }
        else {
            res.status(200).json({
                message: "post added successfully"
            })

        }
    }
    catch (err) {

        res.status(400).json({
            message: err
        })

    }

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
    registerSchema

}