import { body, param, query, validationResult } from "express-validator";

// Validator para o cadastro de um novo automóvel
const validateCreateAutomovel = [
  body("placa").notEmpty().withMessage("Placa é um campo obrigatório"),
  body("marca").notEmpty().withMessage("Marca é um campo obrigatório"),
  body("cor").notEmpty().withMessage("Cor é um campo obrigatório"),
];

// Validator para a atualização de um automóvel cadastrado
const validateUpdateAutomovel = [
  param("id").isInt().withMessage("ID do automóvel deve ser um número inteiro"),
  body("placa").notEmpty().withMessage("Placa é um campo obrigatório"),
  body("marca").notEmpty().withMessage("Marca é um campo obrigatório"),
  body("cor").notEmpty().withMessage("Cor é um campo obrigatório"),
];

// Validator para o ID na rota de exclusão
const validateDeleteAutomovel = [
  param("id").isInt().withMessage("ID do automóvel deve ser um número inteiro"),
];

// Validator para o ID na rota de busca por ID
const validateGetAutomovelById = [
  param("id").isInt().withMessage("ID do automóvel deve ser um número inteiro"),
];

// Validator para os parâmetros de filtro na listagem de automóveis
const validateListAutomoveis = [
  query("cor").optional().notEmpty().withMessage("Cor deve ser fornecida"),
  query("marca").optional().notEmpty().withMessage("Marca deve ser fornecida"),
];

// Função para retornar os erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default {
  validateCreateAutomovel,
  validateUpdateAutomovel,
  validateDeleteAutomovel,
  validateGetAutomovelById,
  validateListAutomoveis,
  handleValidationErrors,
};
