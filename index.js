const express =require('express')
const {sequelize} =require('./models/index')
const cors=require('cors')
const bodyParser = require('body-parser')


const app=express()
 const port =4000
 app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/',require('./Routes/routes'))

app.listen(port,async()=>{
    console.log(`server running in port:${port}`);
    await sequelize.authenticate()
    console.log("database connected");
})