const express = require('express')
const pedidoRoutes = require('./routes/pedidoRoutes')
const app = express()

app.use(express.json())

app.use('/pedidos', pedidoRoutes)

app.use(function (req, res) {
    res.status(404).json({ erro: 'Rota não encontrada.' })
})

app.use(function (err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ erro: 'JSON inválido.' })
    }
    console.error(err)
    res.status(500).json({ erro: 'Erro interno do servidor.' })
})

module.exports = app
