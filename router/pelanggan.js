const { urlencoded } = require('express')
const express = require('express')
const app = express()
const md5 = require('md5')

const pelanggan = require('../models/index').pelanggan

app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')

app.get('/', verifyToken, async (req, res) => {
    pelanggan.findAll({
        include: [{ all: true, nested: true }]
    }) 
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
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }
    pelanggan.create(data)
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
    let param = { id_pelanggan: req.body.id_pelanggan }
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nomor_kwh: req.body.nomor_kwh,
        nama_pelanggan: req.body.nama_pelanggan,
        alamat: req.body.alamat,
        id_tarif: req.body.id_tarif
    }
    pelanggan.update(data,{where:param})
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

app.delete('/:id_pelanggan', verifyToken, async (req, res) => {
    let param = { id_pelanggan: req.params.id_pelanggan }
    pelanggan.destroy({where:param})
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