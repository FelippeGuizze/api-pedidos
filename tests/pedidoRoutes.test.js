const request = require('supertest')
const app = require('../app')
const pedidoService = require('../services/pedidoService')

const valido = { cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' }

beforeEach(() => {
    pedidoService.limpar()
})

describe('POST /pedidos', () => {
    test('Deve retornar 201 e o pedido criado', async () => {
        const res = await request(app).post('/pedidos').send(valido)
        expect(res.status).toBe(201)
        expect(res.body).toEqual({ id: 1, ...valido, status: 'recebido' })
    })

    test('Deve retornar 400 com mensagem para dados inválidos', async () => {
        const res = await request(app).post('/pedidos').send({ ...valido, cliente: '   ', valor: -5 })
        expect(res.status).toBe(400)
        expect(res.body.erro).toBeDefined()
    })

    test('Deve retornar 400 para JSON malformado', async () => {
        const res = await request(app).post('/pedidos').set('Content-Type', 'application/json').send('{ invalido')
        expect(res.status).toBe(400)
        expect(res.body.erro).toBe('JSON inválido.')
    })

    test('Deve retornar 400 quando não há corpo', async () => {
        const res = await request(app).post('/pedidos')
        expect(res.status).toBe(400)
    })
})

describe('GET /pedidos', () => {
    test('Deve retornar 200 com lista vazia e depois com pedidos', async () => {
        const vazio = await request(app).get('/pedidos')
        expect(vazio.status).toBe(200)
        expect(vazio.body).toEqual([])

        await request(app).post('/pedidos').send(valido)
        const cheio = await request(app).get('/pedidos')
        expect(cheio.body).toHaveLength(1)
    })
})

describe('GET /pedidos/:id', () => {
    test('Deve retornar 200 para pedido existente', async () => {
        await request(app).post('/pedidos').send(valido)
        const res = await request(app).get('/pedidos/1')
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(1)
    })

    test('Deve retornar 404 para pedido inexistente', async () => {
        const res = await request(app).get('/pedidos/999')
        expect(res.status).toBe(404)
        expect(res.body.erro).toBe('Pedido não encontrado.')
    })

    test('Deve retornar 404 para id não numérico', async () => {
        const res = await request(app).get('/pedidos/abc')
        expect(res.status).toBe(404)
    })
})

describe('PATCH /pedidos/:id/status', () => {
    test('Deve retornar 200 em atualização válida', async () => {
        await request(app).post('/pedidos').send(valido)
        const res = await request(app).patch('/pedidos/1/status').send({ status: 'em_preparacao' })
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('em_preparacao')
    })

    test('Deve retornar 400 para status inválido ou transição proibida', async () => {
        await request(app).post('/pedidos').send(valido)
        const invalido = await request(app).patch('/pedidos/1/status').send({ status: 'voando' })
        expect(invalido.status).toBe(400)
        const proibida = await request(app).patch('/pedidos/1/status').send({ status: 'entregue' })
        expect(proibida.status).toBe(400)
    })

    test('Deve retornar 404 para id inexistente', async () => {
        const res = await request(app).patch('/pedidos/999/status').send({ status: 'cancelado' })
        expect(res.status).toBe(404)
    })
})

describe('Rotas desconhecidas', () => {
    test('Deve retornar 404 em JSON', async () => {
        const res = await request(app).get('/outra')
        expect(res.status).toBe(404)
        expect(res.body.erro).toBe('Rota não encontrada.')
    })
})
