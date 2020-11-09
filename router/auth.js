const express  = require('express')
const app = express()
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const admin = require('../models/index').admin
const pelanggan = require('../models/index').pelanggan
app.use(express.urlencoded({extended:true}))

app.post('/:usr/:exp', async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    let param = {
        usr: req.params.usr,
        exp: req.params.exp
    }
    let result = null
    
    if(param.usr === "pelanggan"){
        result = await pelanggan.findOne({where: data})
    } else if(param.usr === "admin"){
        result = await admin.findOne({where: data})
    }

    if(result === null){
        res.json({
            message: "Invalid Username or Password"
        })
    }else {
        // set jwt.sign
        let jwtHeader = {
            algorithm: 'HS256',
            expiresIn: param.exp
        }
        let payload = {data: result}
        let secretKey = 'BayarListrik'
        
        // generate token jwt, payload, secretKey, jwtHeader
        let token = jwt.sign(payload, secretKey, jwtHeader)
        res.json({
            data: result,
            token: token
        })
    }
})

module.exports = app