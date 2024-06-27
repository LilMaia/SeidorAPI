import request from "supertest";
import app from "../../index.js";
import Automovel from "../../models/automovel.js";

describe("Testes da Rota /update-car/:id", () => {
  let automovelId;

  beforeAll(async () => {
    // Crie um automóvel fictício para atualizar nos testes
    const novoAutomovel = {
      placa: "XYZ5678",
      marca: "Chevrolet",
      cor: "Preto",
    };
    const response = await request(app).post("/create-car").send(novoAutomovel);
    automovelId = response.body.AutomovelId;
  });

  // Teste para atualizar um automóvel existente
  it("Deve atualizar um automóvel existente e retornar status 200", async () => {
    const novosDados = {
      marca: "Honda",
      cor: "Branco",
    };

    const response = await request(app)
      .put(`/update-car/${automovelId}`)
      .send(novosDados);

    // Verificar se o status da resposta está correto
    expect(response.status).toBe(200);

    // Verificar se a estrutura do objeto retornado está correta
    expect(response.body).toMatchObject({
      AutomovelId: automovelId,
      ...novosDados,
    });

    // Verificar se os dados foram realmente atualizados no banco de dados
    const automovelAtualizado = await Automovel.findByPk(automovelId);
    expect(automovelAtualizado.marca).toBe(novosDados.marca);
    expect(automovelAtualizado.cor).toBe(novosDados.cor);
  });

  // Teste para verificar se retorna 404 quando o automóvel não existe
  it("Deve retornar status 404 se o automóvel não existir", async () => {
    const novosDados = {
      marca: "Honda",
      cor: "Branco",
    };

    const idInexistente = 9999;

    const response = await request(app)
      .put(`/update-car/${idInexistente}`)
      .send(novosDados);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});
