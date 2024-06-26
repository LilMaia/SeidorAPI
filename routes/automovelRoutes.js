import { Router } from 'express';
const router = Router();
import Automovel from '../models/automovel.js';
import { gerarAutomoveis } from '../mocks/automovelMock.js';

// Cadastrar um novo automóvel
router.post('/create-car', async (req, res) => {
  try {
    const automovel = await Automovel.create(req.body);
    res.status(201).json(automovel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar um automóvel cadastrado
router.put('/update-car/:id', async (req, res) => {
  try {
    const automovel = await Automovel.findByPk(req.params.id);
    if (automovel) {
      await automovel.update(req.body);
      res.json(automovel);
    } else {
      res.status(404).json({ error: 'Automóvel não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Excluir um automóvel cadastrado
router.delete('/delete-car/:id', async (req, res) => {
  try {
    const automovel = await Automovel.findByPk(req.params.id);
    if (automovel) {
      await automovel.destroy();
      res.json({ message: 'Automóvel deletado' });
    } else {
      res.status(404).json({ error: 'Automóvel não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Recuperar um automóvel cadastrado pelo seu identificador único
router.get('/get-car/:id', async (req, res) => {
  try {
    const automovel = await Automovel.findByPk(req.params.id);
    if (automovel) {
      res.json(automovel);
    } else {
      res.status(404).json({ error: 'Automóvel não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar os automóveis cadastrados
router.get('/get-all-cars', async (req, res) => {
  try {
    const { cor, marca } = req.query;
    const where = {};
    if (cor) where.cor = cor;
    if (marca) where.marca = marca;

    const automoveis = await Automovel.findAll({ where });
    res.json(automoveis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Gerar automóveis falsos
router.post('/generate-cars', async (req, res) => {
  try {
    const { quantidade } = req.body;
    const automoveis = gerarAutomoveis(quantidade);

    // Salvar automóveis no banco de dados
    const automoveisCriados = await Automovel.bulkCreate(automoveis);

    res.status(201).json(automoveisCriados);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
