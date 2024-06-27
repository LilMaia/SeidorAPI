import request from "supertest";
import app from "../../index.js"; // Caminho para o arquivo principal do Express

describe("Testes da Rota /generate-cars", () => {
  it("Deve gerar automóveis falsos e retornar status 201", async () => {
    const quantidade = 5; // Quantidade de automóveis a serem gerados
    const response = await request(app)
      .post("/generate-cars")
      .send({ quantidade });

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(quantidade);
    // pode-se adicionar mais expectativas conforme necessário
  });

  // Teste para validar se a quantidade é obrigatória
  it("Deve retornar status 400 se não fornecer quantidade", async () => {
    const response = await request(app).post("/generate-cars").send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
