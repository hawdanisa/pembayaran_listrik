const { urlencoded } = require('express')
const express = require('express')
const app = express()

let date = new Date()

// call model
const pembayaran = require('../models/index').pembayaran
const tagihan = require('../models/index').tagihan

app.use(express.urlencoded({ extended:true }))

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { error } = require('console')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/img-bukti")
    },
    filename: (req, file, cb) => {
        cb(null, "bukti-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

// auth
const verifyToken = require('./VerifyToken')
app.use(verifyToken)

app.get('/', async (req, res) => {
    pembayaran.findAll({
        include:[{ all: true, nested: true }]
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

app.post('/', upload.single('bukti'), async (req, res) => {
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: date,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        bukti: req.file.filename,
        id_admin: req.body.id_admin
    }

    // change status tagihan to true
    let idTagihan = { id_tagihan: data.id_tagihan }
    let status = { status: 1 }
    tagihan.update(status, { where: idTagihan })
    
    pembayaran.create(data)
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

app.put('/', upload.single('bukti'), async (req, res) => {
    let param = { id_pembayaran: req.body.id_pembayaran }
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: dateNow[2],
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: req.body.status,
        id_admin: req.body.id_admin
    }

    if(req.file){
        let oldPembayaran = await pembayaran.findOne({ where: param })
        let oldBukti = oldPembayaran.bukti

        // delete oldBukti
        let pathFile = path.join(__dirname, "../assets/img-bukti", oldBukti)
        fs.unlink(pathFile, error => console.log(error))

        data.bukti = req.file.filename // masukin data baru
    }
    
    pembayaran.update(data,{where:param})
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

app.delete('/:id_pembayaran', async (req, res) => {
    let param = { id_pembayaran: req.params.id_pembayaran }

    let oldPembayaran = await pembayaran.findOne({ where: param })
    let oldBukti = oldPembayaran.bukti

    // delete oldCover
    let pathFile = path.join(__dirname, "../assets/img-bukti", oldBukti)
    fs.unlink(pathFile, error => console.log(error))

    pembayaran.destroy({where:param})
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