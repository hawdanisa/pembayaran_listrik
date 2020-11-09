const { urlencoded } = require('express')
const express = require('express')
const app = express()

const tagihan = require('../models/index').tagihan
const penggunaan = require('../models/index').penggunaan

app.use(express.urlencoded({ extended:true }))

// auth
const verifyToken = require('./VerifyToken')
app.use(verifyToken)

app.get('/', async (req, res) => {
    tagihan.findAll({
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
    let param = { id_penggunaan: req.body.id_penggunaan }

    // auto calculation jumlah_meter
    let dataPenggunaan = await penggunaan.findOne({ where: param })
    let jumlahMeter = dataPenggunaan.meter_akhir - dataPenggunaan.meter_awal

    let data = {
        id_penggunaan: param.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: jumlahMeter,
        status: req.body.status
    }

    tagihan.create(data)
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
    let param = { id_tagihan: req.body.id_tagihan }
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: req.body.jumlah_meter,
        status: req.body.status
    }
    tagihan.update(data,{where:param})
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

app.delete('/:id_tagihan', async (req, res) => {
    let param = { id_tagihan: req.params.id_tagihan }
    tagihan.destroy({where:param})
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