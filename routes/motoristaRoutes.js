const express = require('express');
const router = express.Router();
const Motorista = require('../models/motorista').default;

// Cadastrar um novo motorista
router.post('/', async (req, res) => {
  try {
    const motorista = await Motorista.create(req.body);
    res.status(201).json(motorista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar um motorista cadastrado
router.put('/:id', async (req, res) => {
  try {
    const motorista = await Motorista.findByPk(req.params.id);
    if (motorista) {
      await motorista.update(req.body);
      res.json(motorista);
    } else {
      res.status(404).json({ error: 'Motorista não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Excluir um motorista cadastrado
router.delete('/:id', async (req, res) => {
  try {
    const motorista = await Motorista.findByPk(req.params.id);
    if (motorista) {
      await motorista.destroy();
      res.json({ message: 'Motorista deletado' });
    } else {
      res.status(404).json({ error: 'Motorista não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Recuperar um motorista cadastrado pelo seu identificador único
router.get('/:id', async (req, res) => {
  try {
    const motorista = await Motorista.findByPk(req.params.id);
    if (motorista) {
      res.json(motorista);
    } else {
      res.status(404).json({ error: 'Motorista não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar os motoristas cadastrados
router.get('/', async (req, res) => {
  try {
    const { nome } = req.query;
    const where = {};
    if (nome) where.nome = nome;
    const motoristas = await Motorista.findAll({ where });
    res.json(motoristas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
