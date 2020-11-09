const { urlencoded } = require('express')
const express = require('express')
const app = express()

const penggunaan = require('../models/index').penggunaan

app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')
app.use(verifyToken)

app.get('/', async (req, res) => {
    penggunaan.findAll({
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }
    penggunaan.create(data)
    .then(result => {
        res.json({
            message: 'Data been inserted',
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
    let param = { id_penggunaan: req.body.id_penggunaan }
    let data = {
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }
    penggunaan.update(data,{where:param})
    .then(result => {
        res.json({
            message: 'Data been Updated',
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete('/:id_penggunaan', async (req, res) => {
    let param = { id_penggunaan: req.params.id_penggunaan }
    penggunaan.destroy({where:param})
    .then(result => {
        res.json({
            message: 'Data been Destroyed',
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