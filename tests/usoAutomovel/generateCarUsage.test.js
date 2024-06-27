import request from "supertest";
import app from "../../index.js";
import Automovel from "../../models/automovel.js";
import Motorista from "../../models/motorista.js";

describe("Testes da Rota /generate-carUsage", () => {
  beforeAll(async () => {
    // Limpar dados existentes de automóveis e motoristas antes dos testes
    await Automovel.destroy({ where: {} });
    await Motorista.destroy({ where: {} });
  });

  it("Deve gerar registros falsos de uso de automóveis e retornar status 201", async () => {
    const quantidade = 5;

    // Criar um automóvel e um motorista para o teste
    const novoAutomovel = {
      placa: "ABC1234",
      marca: "Toyota",
      cor: "Azul",
    };
    const novoMotorista = {
      nome: "Maria Oliveira",
    };

    await request(app)
      .post("/create-car")
      .send(novoAutomovel);

    await request(app)
      .post("/create-driver")
      .send(novoMotorista);

    const response = await request(app)
      .post("/generate-carUsage")
      .send({ quantidade });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(quantidade);
  });
});
