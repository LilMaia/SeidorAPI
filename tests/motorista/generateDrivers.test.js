import request from 'supertest';
import app from '../../index.js';

describe("Testes da Rota /generate-drivers", () => {
  it("Deve gerar motoristas falsos e retornar status 201", async () => {
    const quantidade = 5; // Quantidade de motoristas a serem gerados
    const response = await request(app)
      .post("/generate-drivers")
      .send({ quantidade });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(quantidade);
    // Pode-se adicionar mais expectativas conforme necessário
  });

  // Teste para validar se a quantidade é obrigatória
  it("Deve retornar status 400 se não fornecer quantidade", async () => {
    const response = await request(app).post("/generate-drivers").send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
