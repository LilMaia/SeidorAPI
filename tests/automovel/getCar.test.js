import request from "supertest";
import app from "../../index.js";
import Automovel from "../../models/automovel.js";

describe("Testes da Rota /get-car/:id", () => {
  let automovel;

  beforeAll(async () => {
    // Crie um automóvel fictício para recuperar nos testes
    automovel = await Automovel.create({ placa: "XYZ1234", marca: "Chevrolet", cor: "Azul" });
  });

  // afterAll(async () => {
  //   // Limpe a tabela de automóveis após os testes
  //   await Automovel.destroy({ where: {} });
  // });

  // Teste para recuperar um automóvel cadastrado pelo seu identificador único
  it("Deve recuperar um automóvel cadastrado pelo seu identificador único e retornar status 200", async () => {
    const response = await request(app).get(`/get-car/${automovel.AutomovelId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.AutomovelId).toBe(automovel.AutomovelId);
    expect(response.body.placa).toBe(automovel.placa);
    expect(response.body.marca).toBe(automovel.marca);
    expect(response.body.cor).toBe(automovel.cor);
  });

  // Teste para recuperar um automóvel inexistente
  it("Deve retornar um erro ao tentar recuperar um automóvel inexistente e retornar status 404", async () => {
    const response = await request(app).get('/get-car/99999');

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.error).toBe('Automóvel não encontrado');
  });
});
