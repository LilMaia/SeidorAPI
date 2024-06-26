import { Router } from "express";
const router = Router();
import UsoAutomovel from "../models/usoAutomovel.js";
import Automovel from "../models/automovel.js";
import Motorista from "../models/motorista.js";
import { gerarRegistrosDeUso } from "../mocks/usoAutomovelMock.js";

// Criar um registro de utilização de um automóvel
router.post("/create-carUsage", async (req, res) => {
  try {
    const { automovelId, motoristaId, dataDeInicio, motivo } = req.body;
    // Verificar se o automóvel está em uso
    const automovelEmUso = await UsoAutomovel.findOne({
      where: { automovelId, dataDeTermino: null },
    });
    if (automovelEmUso) {
      return res.status(400).json({ error: "Este automóvel já está em uso." });
    }
    // Verificar se o motorista está utilizando outro automóvel
    const motoristaEmUso = await UsoAutomovel.findOne({
      where: { motoristaId, dataDeTermino: null },
    });
    if (motoristaEmUso) {
      return res
        .status(400)
        .json({ error: "Este motorista já está utilizando outro automóvel." });
    }

    const usoAutomovel = await UsoAutomovel.create({
      automovelId,
      motoristaId,
      dataDeInicio,
      motivo,
    });
    res.status(201).json(usoAutomovel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Finalizar a utilização de um automóvel
router.put("/update-carUsage/:id", async (req, res) => {
  try {
    const usoAutomovel = await UsoAutomovel.findByPk(req.params.id);
    if (usoAutomovel) {
      await usoAutomovel.update({ dataDeTermino: req.body.dataDeTermino });
      res.json(usoAutomovel);
    } else {
      res
        .status(404)
        .json({ error: "Não foi encontrado registro de uso do carro" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar os registros de utilização cadastrados
router.get("/get-all-carUsage", async (req, res) => {
  try {
    const usoAutomovels = await UsoAutomovel.findAll({
      include: [
        { model: Automovel, as: "automovel" },
        { model: Motorista, as: "motorista" },
      ],
    });
    res.json(usoAutomovels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Gerar relatórios falsos de utilização de automóveis
router.post("/generate-carUsage", async (req, res) => {
  try {
    const { quantidade } = req.body;

    // Buscar todos os automóveis e motoristas
    const automoveis = await Automovel.findAll();
    const motoristas = await Motorista.findAll();

    if (automoveis.length === 0 || motoristas.length === 0) {
      return res.status(400).json({
        error:
          "É necessário ter automóveis e motoristas cadastrados para gerar registros de uso.",
      });
    }

    // Gerar registros de uso
    const registrosDeUso = gerarRegistrosDeUso(
      quantidade,
      automoveis,
      motoristas
    );

    // Inserir registros de uso no banco de dados
    const registrosCriados = await UsoAutomovel.bulkCreate(registrosDeUso);

    res.status(201).json(registrosCriados);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
