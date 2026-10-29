const pedidoService = require('../services/pedidoService')

const dados = { cliente: '  Carlos Silva  ', tipo: 'entrega', valor: 350, prioridade: 'normal' }

beforeEach(() => {
    pedidoService.limpar()
})

describe('Service de pedidos', () => {
    test('Deve criar pedido com id sequencial, status recebido e cliente sem espaços', () => {
        const pedido = pedidoService.criar(dados)
        expect(pedido).toEqual({
            id: 1,
            cliente: 'Carlos Silva',
            tipo: 'entrega',
            valor: 350,
            prioridade: 'normal',
            status: 'recebido'
        })
        expect(pedidoService.criar(dados).id).toBe(2)
    })

    test('Deve listar os pedidos cadastrados', () => {
        expect(pedidoService.listar()).toHaveLength(0)
        pedidoService.criar(dados)
        expect(pedidoService.listar()).toHaveLength(1)
    })

    test('Deve buscar pedido existente por id', () => {
        const criado = pedidoService.criar(dados)
        expect(pedidoService.buscarPorId(criado.id)).toEqual(criado)
        expect(pedidoService.buscarPorId(String(criado.id))).toEqual(criado)
    })

    test('Deve lançar erro 404 para id inexistente', () => {
        expect.assertions(2)
        try {
            pedidoService.buscarPorId(99)
        } catch (error) {
            expect(error.status).toBe(404)
            expect(error.message).toBe('Pedido não encontrado.')
        }
    })

    test('Deve atualizar o status com transição válida', () => {
        const criado = pedidoService.criar(dados)
        const atualizado = pedidoService.atualizarStatus(criado.id, { status: 'em_preparacao' })
        expect(atualizado.status).toBe('em_preparacao')
    })

    test('Deve lançar erro 400 em transição inválida e manter o status', () => {
        const criado = pedidoService.criar(dados)
        expect(() => pedidoService.atualizarStatus(criado.id, { status: 'entregue' })).toThrow('Transição não permitida')
        expect(pedidoService.buscarPorId(criado.id).status).toBe('recebido')
    })

    test('Deve lançar erro 400 quando o corpo não tem status', () => {
        const criado = pedidoService.criar(dados)
        expect(() => pedidoService.atualizarStatus(criado.id, undefined)).toThrow('Status inválido')
    })

    test('Deve lançar erro 404 ao atualizar pedido inexistente', () => {
        expect(() => pedidoService.atualizarStatus(5, { status: 'cancelado' })).toThrow('Pedido não encontrado.')
    })
})
