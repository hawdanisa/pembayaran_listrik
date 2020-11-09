const { urlencoded } = require('express')
const express = require('express')
const app = express()
const md5 = require('md5')

// call model admin
const admin = require('../models/index').admin
// middleware req body 
app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')

app.get('/', verifyToken, async (req, res) => {
    admin.findAll({
        include: [{ all: true, nested: true }]
    }) // get data
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post('/', async (req, res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }
    admin.create(data)
    .then(result => {
        res.json({
            message: 'Data has been inserted',
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put('/', verifyToken, async (req, res) => {
    let param = { id_admin: req.body.id_admin }
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }
    admin.update(data,{where:param})
    .then(result => {
        res.json({
            message: 'Data has been Updated',
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete('/:id_admin', verifyToken, async (req, res) => {
    let param = { id_admin: req.params.id_admin }
    admin.destroy({where:param})
    .then(result => {
        res.json({
            message: 'Data has been Destroyed',
            data: result
        })
    })
    .cathc(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app