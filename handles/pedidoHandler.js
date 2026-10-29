const TIPOS = ['entrega', 'retirada', 'local']
const PRIORIDADES = ['baixa', 'normal', 'alta']
const STATUS = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado']

const TRANSICOES = {
    recebido: ['em_preparacao', 'cancelado'],
    em_preparacao: ['enviado', 'cancelado'],
    enviado: ['entregue', 'cancelado'],
    entregue: [],
    cancelado: []
}

class ErroHttp extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

function validarPedido(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new ErroHttp(400, 'Corpo da requisição inválido.')
    }
    if (typeof dados.cliente !== 'string' || dados.cliente.trim() === '') {
        throw new ErroHttp(400, 'O cliente é obrigatório e não pode ser vazio.')
    }
    if (typeof dados.valor !== 'number' || !Number.isFinite(dados.valor) || dados.valor <= 0) {
        throw new ErroHttp(400, 'O valor deve ser numérico e maior que zero.')
    }
    if (!TIPOS.includes(dados.tipo)) {
        throw new ErroHttp(400, 'Tipo inválido. Valores aceitos: ' + TIPOS.join(', ') + '.')
    }
    if (!PRIORIDADES.includes(dados.prioridade)) {
        throw new ErroHttp(400, 'Prioridade inválida. Valores aceitos: ' + PRIORIDADES.join(', ') + '.')
    }
    return true
}

function validarTransicao(statusAtual, novoStatus) {
    if (!STATUS.includes(novoStatus)) {
        throw new ErroHttp(400, 'Status inválido. Valores aceitos: ' + STATUS.join(', ') + '.')
    }
    if (!TRANSICOES[statusAtual].includes(novoStatus)) {
        throw new ErroHttp(400, 'Transição não permitida: ' + statusAtual + ' -> ' + novoStatus + '.')
    }
    return true
}

module.exports = {
    TIPOS,
    PRIORIDADES,
    STATUS,
    TRANSICOES,
    ErroHttp,
    validarPedido,
    validarTransicao
}
