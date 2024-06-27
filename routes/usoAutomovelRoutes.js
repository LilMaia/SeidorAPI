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
    console.log(`Recebido dados para criar uso de automóvel: ${automovelId}, ${motoristaId}, ${dataDeInicio}, ${motivo}`);

    // Verificar se o automóvel está em uso
    const automovelEmUso = await UsoAutomovel.findOne({
      where: { automovelId, dataDeTermino: null },
    });
    if (automovelEmUso) {
      console.log(`Erro: Automóvel ${automovelId} já está em uso.`);
      return res.status(400).json({ error: "Este automóvel já está em uso." });
    }

    // Verificar se o motorista está utilizando outro automóvel
    const motoristaEmUso = await UsoAutomovel.findOne({
      where: { motoristaId, dataDeTermino: null },
    });
    if (motoristaEmUso) {
      console.log(`Erro: Motorista ${motoristaId} já está utilizando outro automóvel.`);
      return res.status(400).json({ error: "Este motorista já está utilizando outro automóvel." });
    }

    // Criar o registro de uso de automóvel
    const usoAutomovel = await UsoAutomovel.create({
      automovelId,
      motoristaId,
      dataDeInicio,
      motivo,
    });
    console.log(`Registro de uso de automóvel criado com sucesso: ${usoAutomovel.usoAutomovelId}`);

    res.status(201).json(usoAutomovel);
  } catch (error) {
    console.error(`Erro ao criar registro de uso de automóvel: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Rota para atualizar um registro de uso de automóvel
router.put("/update-carUsage/:id", async (req, res) => {
  try {
    const usoAutomovel = await UsoAutomovel.findByPk(req.params.id);
    
    if (usoAutomovel) {
      // Verifica se os dados a serem atualizados são válidos
      if (req.body.dataDeTermino) {
        await usoAutomovel.update({ dataDeTermino: req.body.dataDeTermino });
      }
      
      res.status(200).json(usoAutomovel);
    } else {
      res.status(404).json({ error: "Registro de uso de automóvel não encontrado" });
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
