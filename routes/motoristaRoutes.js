import { Router } from 'express';
const router = Router();
import Motorista from '../models/motorista.js';
import { gerarMotoristas } from '../mocks/motoristaMock.js';
import { Op } from 'sequelize';

// Cadastrar um novo motorista
router.post('/create-driver', async (req, res) => {
  try {
    const motorista = await Motorista.create(req.body);
    res.status(201).json(motorista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar um motorista cadastrado
router.put('/update-driver/:id', async (req, res) => {
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
router.delete('/delete-driver/:id', async (req, res) => {
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
router.get('/get-driver/:id', async (req, res) => {
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
router.get('/get-all-drivers', async (req, res) => {
  try {
    const { nome } = req.query;
    const where = {};
    if (nome) where.nome = { [Op.like]: `%${nome}%` };

    const motoristas = await Motorista.findAll({ where });
    res.json(motoristas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Gerar motoristas falsos
router.post('/generate-drivers', async (req, res) => {
  try {
    const { quantidade } = req.body;
    const motoristas = gerarMotoristas(quantidade);

    // Salvar motoristas no banco de dados
    const motoristasCriados = await Motorista.bulkCreate(motoristas);

    res.status(201).json(motoristasCriados);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
