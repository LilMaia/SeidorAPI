const express = require('express');
const router = express.Router();
const { UsoAutomovel, Automovel, Motorista } = require('../models');

// Criar um registro de utilização de um automóvel
router.post('/', async (req, res) => {
  try {
    const { automovelId, motoristaId, dataDeInicio, motivo } = req.body;
    
    // Verificar se o automóvel está em uso
    const automovelEmUso = await UsoAutomovel.findOne({
      where: { automovelId, dataDeTermino: null }
    });
    if (automovelEmUso) {
      return res.status(400).json({ error: 'Este automóvel já está em uso.' });
    }
    
    // Verificar se o motorista está utilizando outro automóvel
    const motoristaEmUso = await UsoAutomovel.findOne({
      where: { motoristaId, dataDeTermino: null }
    });
    if (motoristaEmUso) {
      return res.status(400).json({ error: 'Este motorista já está utilizando outro automóvel.' });
    }

    const usoAutomovel = await UsoAutomovel.create({ automovelId, motoristaId, dataDeInicio, motivo });
    res.status(201).json(usoAutomovel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Finalizar a utilização de um automóvel
router.put('/:id', async (req, res) => {
  try {
    const usoAutomovel = await UsoAutomovel.findByPk(req.params.id);
    if (usoAutomovel) {
      await usoAutomovel.update({ dataDeTermino: req.body.dataDeTermino });
      res.json(usoAutomovel);
    } else {
      res.status(404).json({ error: 'Não foi encontrado registro de uso do carro' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar os registros de utilização cadastrados
router.get('/', async (req, res) => {
  try {
    const usoAutomovels = await UsoAutomovel.findAll({
      include: [
        { model: Automovel, as: 'automovel' },
        { model: Motorista, as: 'motorista' },
      ],
    });
    res.json(usoAutomovels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;