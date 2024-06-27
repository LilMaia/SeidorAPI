import request from "supertest";
import app from "../../index.js";
import Motorista from "../../models/motorista.js";

describe("Testes da Rota /get-driver/:id", () => {
  let motorista;

  beforeAll(async () => {
    // Crie um motorista fictício para recuperar nos testes
    motorista = await Motorista.create({ nome: "Carmo da Silva" });
  });

  // Teste para recuperar um motorista cadastrado pelo seu identificador único
  it("Deve recuperar um motorista cadastrado pelo seu identificador único e retornar status 200", async () => {
    const response = await request(app).get(`/get-driver/${motorista.motoristaId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.motoristaId).toBe(motorista.motoristaId);
    expect(response.body.nome).toBe(motorista.nome);
  });

  // Teste para recuperar um motorista inexistente
  it("Deve retornar um erro ao tentar recuperar um motorista inexistente e retornar status 404", async () => {
    const response = await request(app).get('/get-driver/99999');

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.error).toBe('Motorista não encontrado');
  });
});
