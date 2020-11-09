const express = require('express')
const app = express()

// panggil router
let pelanggan = require('./router/pelanggan')
let penggunaan = require('./router/penggunaan')
let tagihan = require('./router/tagihan')
let pembayaran = require('./router/pembayaran')
let admin = require('./router/admin')
let level = require('./router/level')
let tarif = require('./router/tarif')
let auth = require('./router/auth')
let verifyPembayaran = require('./router/verifyPembayaran')

// use router
app.use('/pelanggan', pelanggan)
app.use('/penggunaan', penggunaan)
app.use('/tagihan', tagihan)
app.use('/pembayaran', pembayaran)
app.use('/admin', admin)
app.use('/level', level)
app.use('/tarif', tarif)
app.use('/auth', auth)
app.use('/verifyPembayaran', verifyPembayaran)

app.listen(8000, () => {
    console.log("server is running");
})