const express = require('express')
const pedidoController = require('../controllers/pedidoController')

const router = express.Router()

router.post('/', pedidoController.criar)
router.get('/', pedidoController.listar)
router.get('/:id', pedidoController.buscarPorId)
router.patch('/:id/status', pedidoController.atualizarStatus)

module.exports = router
