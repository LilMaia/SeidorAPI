import request from "supertest";
import app from "../../index.js";
import Automovel from "../../models/automovel.js";

describe("Testes da Rota /get-all-cars", () => {
  beforeAll(async () => {
    // Crie alguns automóveis fictícios para listar nos testes
    const automoveis = [
      { placa: "AAA1111", marca: "Toyota", cor: "Prata" },
      { placa: "BBB2222", marca: "Honda", cor: "Preto" },
      { placa: "CCC3333", marca: "Ford", cor: "Vermelho" },
    ];

    await Automovel.bulkCreate(automoveis);
  });

  // Teste para listar todos os automóveis cadastrados
  it("Deve listar todos os automóveis cadastrados e retornar status 200", async () => {
    const response = await request(app).get("/get-all-cars");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste para listar automóveis filtrados por cor
  it("Deve listar automóveis filtrados por cor e retornar status 200", async () => {
    const cor = "Preto";
    const response = await request(app).get("/get-all-cars").query({ cor });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((automovel) => {
      expect(automovel.cor).toBe(cor);
    });
  });

  // Teste para listar automóveis filtrados por marca
  it("Deve listar automóveis filtrados por marca e retornar status 200", async () => {
    const marca = "Honda";
    const response = await request(app).get("/get-all-cars").query({ marca });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((automovel) => {
      expect(automovel.marca).toBe(marca);
    });
  });
});
