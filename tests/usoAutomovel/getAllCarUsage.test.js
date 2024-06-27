import request from "supertest";
import app from "../../index.js";

describe("Testes da Rota /get-all-carUsage", () => {
  it("Deve retornar uma lista de registros de uso de automóveis e status 200", async () => {
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

    await request(app)
      .post("/generate-carUsage")
      .send({ quantidade });

    const response = await request(app).get("/get-all-carUsage");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
