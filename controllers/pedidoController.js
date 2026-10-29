const pedidoService = require('../services/pedidoService')

function tratarErro(res, error) {
    if (error.status) {
        return res.status(error.status).json({ erro: error.message })
    }
    console.error(error)
    return res.status(500).json({ erro: 'Erro interno do servidor.' })
}

function criar(req, res) {
    try {
        const pedido = pedidoService.criar(req.body)
        res.status(201).json(pedido)
    } catch (error) {
        tratarErro(res, error)
    }
}

function listar(req, res) {
    try {
        res.status(200).json(pedidoService.listar())
    } catch (error) {
        tratarErro(res, error)
    }
}

function buscarPorId(req, res) {
    try {
        res.status(200).json(pedidoService.buscarPorId(req.params.id))
    } catch (error) {
        tratarErro(res, error)
    }
}

function atualizarStatus(req, res) {
    try {
        const pedido = pedidoService.atualizarStatus(req.params.id, req.body)
        res.status(200).json(pedido)
    } catch (error) {
        tratarErro(res, error)
    }
}

module.exports = { criar, listar, buscarPorId, atualizarStatus }
