const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

router.post('/eventos', eventosController.createEvento);
router.get('/eventos', eventosController.getAllEventos);
router.get('/eventos/:id', eventosController.getEventoById);
router.put('/eventos/:id', eventosController.updateEvento);
router.delete('/eventos/:id', eventosController.deleteEvento);

module.exports = router;
