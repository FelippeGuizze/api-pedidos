const { ErroHttp, validarPedido, validarTransicao } = require('../handles/pedidoHandler')

let pedidos = []
let proximoId = 1

function criar(dados) {
    validarPedido(dados)
    const pedido = {
        id: proximoId++,
        cliente: dados.cliente.trim(),
        tipo: dados.tipo,
        valor: dados.valor,
        prioridade: dados.prioridade,
        status: 'recebido'
    }
    pedidos.push(pedido)
    return pedido
}

function listar() {
    return pedidos
}

function buscarPorId(id) {
    const pedido = pedidos.find(function (p) {
        return String(p.id) === String(id)
    })
    if (!pedido) {
        throw new ErroHttp(404, 'Pedido não encontrado.')
    }
    return pedido
}

function atualizarStatus(id, dados) {
    const pedido = buscarPorId(id)
    const novoStatus = dados && dados.status
    validarTransicao(pedido.status, novoStatus)
    pedido.status = novoStatus
    return pedido
}

function limpar() {
    pedidos = []
    proximoId = 1
}

module.exports = { criar, listar, buscarPorId, atualizarStatus, limpar }
