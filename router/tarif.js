const { urlencoded } = require('express')
const express = require('express')
const app = express()

// call model tarif
const tarif = require('../models/index').tarif
// middleware req body 
app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')
app.use(verifyToken)

app.get('/', async (req, res) => {
    tarif.findAll() // get data
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
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }
    tarif.create(data)
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
    let param = { id_tarif: req.body.id_tarif }
    let data = { 
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }
    tarif.update(data,{where:param})
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

app.delete('/:id_tarif', async (req, res) => {
    let param = { id_tarif: req.params.id_tarif }
    tarif.destroy({where:param})
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