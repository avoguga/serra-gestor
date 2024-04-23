const { eventos } = require('../models');

const createEvento = async (req, res) => {
    try {
        const createEvento = await eventos.create(req.body);
        res.status(201).send(createEvento);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllEventos = async (req, res) => {
    try {
        console.log('Get all eventos');
        const eventosList = await eventos.findAll();
        console.log(eventosList)
        res.status(200).send(eventosList);
    } catch (error) {
        res.status(500).send({
            message: 'deu pau aqui',
            error: error,
        });
    }
};

const getEventoById = async (req, res) => {
    try {
        console.log('Get evento by id');
        const evento = await eventos.findByPk(req.params.id);
        if (evento) {
            res.status(200).send(evento);
        } else {
            res.status(404).send({ message: 'Evento não encontrado.' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateEvento = async (req, res) => {
    try {
        console.log('Update evento');
        const [updated] = await eventos.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedEvento = await eventos.findByPk(req.params.id);
            res.status(200).send(updatedEvento);
        } else {
            res.status(404).send({ message: 'Evento não encontrado.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const deleteEvento = async (req, res) => {
    try {
        console.log('Delete evento');
        const deleted = await eventos.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(200).send({ message: 'Evento excluído com sucesso.' });
        } else {
            res.status(404).send({ message: 'Evento não encontrado.' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createEvento,
    getAllEventos,
    getEventoById,
    updateEvento,
    deleteEvento
};
