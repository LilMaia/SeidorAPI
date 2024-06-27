import request from "supertest";
import app from "../../index.js";
import Motorista from "../../models/motorista.js";

describe("Testes da Rota /update-driver/:id", () => {
  let motoristaId;

  beforeAll(async () => {
    // Cria um motorista fictício para atualizar nos testes
    const novoMotorista = {
      nome: "Rosario da Silva",
    };
    // Realiza a requisição para criar o motorista fictício
    const response = await request(app).post("/create-driver").send(novoMotorista);
    // Salva o ID do motorista criado para ser usado nos testes
    motoristaId = response.body.motoristaId;
  });

  it("Deve atualizar um motorista existente e retornar status 200", async () => {
    const novosDados = {
      nome: "José Pereira",
    };

    // Realiza a requisição para atualizar o motorista com novos dados
    const response = await request(app)
      .put(`/update-driver/${motoristaId}`)
      .send(novosDados);

    // Verifica se o status da resposta está correto
    expect(response.status).toBe(200);

    // Verifica se a estrutura do objeto retornado está correta
    expect(response.body).toMatchObject({
      motoristaId: motoristaId,
      nome: novosDados.nome,
    });

    // Verifica se os dados foram realmente atualizados no banco de dados
    const motoristaAtualizado = await Motorista.findByPk(motoristaId);
    expect(motoristaAtualizado.nome).toBe(novosDados.nome);
  });

  it("Deve retornar status 404 se o motorista não existir", async () => {
    const novosDados = {
      nome: "Maria Souza",
    };

    const idInexistente = 9999;

    // Realiza a requisição para atualizar um motorista inexistente
    const response = await request(app)
      .put(`/update-driver/${idInexistente}`)
      .send(novosDados);

    // Verifica se o status da resposta está correto
    expect(response.status).toBe(404);
    // Verifica se a resposta contém uma mensagem de erro
    expect(response.body.error).toBeTruthy();
  });
});
