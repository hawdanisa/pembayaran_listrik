const { urlencoded } = require('express')
const express = require('express')
const app = express()

// call model level
const level = require('../models/index').level
// middleware req body 
app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')
app.use(verifyToken)

app.get('/', async (req, res) => {
    level.findAll() // get data
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
        nama_level: req.body.nama_level 
    }
    level.create(data)
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

app.put('/', async (req, res) => {
    let param = { id_level: req.body.id_level }
    let data = { nama_level: req.body.nama_level }
    level.update(data,{where:param})
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

app.delete('/:id_level', async (req, res) => {
    let param = { id_level: req.params.id_level }
    level.destroy({where:param})
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