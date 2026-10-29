const { validarPedido, validarTransicao } = require('../handles/pedidoHandler')

const valido = { cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' }

describe('Validação de pedido', () => {
    test('Deve aceitar um pedido válido', () => {
        expect(validarPedido(valido)).toBe(true)
    })

    test('Deve rejeitar cliente vazio', () => {
        expect(() => validarPedido({ ...valido, cliente: '' })).toThrow('O cliente é obrigatório')
    })

    test('Deve rejeitar cliente composto só por espaços', () => {
        expect(() => validarPedido({ ...valido, cliente: '   ' })).toThrow('O cliente é obrigatório')
    })

    test('Deve rejeitar valor zero, negativo ou não numérico', () => {
        expect(() => validarPedido({ ...valido, valor: 0 })).toThrow('maior que zero')
        expect(() => validarPedido({ ...valido, valor: -10 })).toThrow('maior que zero')
        expect(() => validarPedido({ ...valido, valor: '350' })).toThrow('maior que zero')
        expect(() => validarPedido({ ...valido, valor: NaN })).toThrow('maior que zero')
    })

    test('Deve rejeitar tipo e prioridade desconhecidos', () => {
        expect(() => validarPedido({ ...valido, tipo: 'voo' })).toThrow('Tipo inválido')
        expect(() => validarPedido({ ...valido, prioridade: 'urgente' })).toThrow('Prioridade inválida')
    })

    test('Deve rejeitar corpo ausente', () => {
        expect(() => validarPedido(undefined)).toThrow('Corpo da requisição inválido')
    })
})

describe('Transição de status', () => {
    test('Deve permitir recebido -> em_preparacao', () => {
        expect(validarTransicao('recebido', 'em_preparacao')).toBe(true)
    })

    test('Deve permitir cancelar a partir de recebido', () => {
        expect(validarTransicao('recebido', 'cancelado')).toBe(true)
    })

    test('Deve rejeitar pular etapas', () => {
        expect(() => validarTransicao('recebido', 'entregue')).toThrow('Transição não permitida')
    })

    test('Não deve permitir sair de estados finais', () => {
        expect(() => validarTransicao('entregue', 'cancelado')).toThrow('Transição não permitida')
        expect(() => validarTransicao('cancelado', 'recebido')).toThrow('Transição não permitida')
    })

    test('Deve rejeitar status desconhecido', () => {
        expect(() => validarTransicao('recebido', 'voando')).toThrow('Status inválido')
    })
})
