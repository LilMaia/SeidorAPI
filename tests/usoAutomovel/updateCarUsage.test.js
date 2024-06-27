import request from "supertest";
import app from "../../index.js";
import UsoAutomovel from "../../models/usoAutomovel.js";
import Motorista from "../../models/motorista.js"; // Importe o modelo de Motorista aqui
import Automovel from "../../models/automovel.js"; // Importe o modelo de Automóvel aqui

describe("Testes da Rota /update-carUsage/:id", () => {
  let usoAutomovelId;
  let motoristaId;
  let automovelId;

  beforeAll(async () => {
    // Cria um motorista no banco de dados
    const novoMotorista = await Motorista.create({
      nome: "Exemplo Motorista",
    });
    motoristaId = novoMotorista.motoristaId;

    // Cria um automóvel no banco de dados
    const novoAutomovel = await Automovel.create({
      placa: "ABC1234",
      marca: "Exemplo Marca",
      cor: "Preto",
    });
    automovelId = novoAutomovel.AutomovelId;

    // Cria um registro de uso de automóvel para atualizar nos testes
    const novoUso = {
      automovelId: automovelId,
      motoristaId: motoristaId,
      dataDeInicio: "2024-06-28T10:00:00Z",
      motivo: "Viagem de negócios",
    };

    const response = await request(app)
      .post("/create-carUsage")
      .send(novoUso);
    usoAutomovelId = response.body.usoAutomovelId;
  });

  it("Deve atualizar um registro de uso de automóvel existente e retornar status 200", async () => {
    const novosDados = {
      dataDeTermino: "2024-06-28T18:00:00Z",
    };

    const response = await request(app)
      .put(`/update-carUsage/${usoAutomovelId}`)
      .send(novosDados);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      usoAutomovelId: usoAutomovelId,
      dataDeTermino: new Date(novosDados.dataDeTermino).toISOString(), // Convertendo para ISO para comparação precisa
    });

    // Verifica se os dados foram realmente atualizados no banco de dados
    const usoAtualizado = await UsoAutomovel.findByPk(usoAutomovelId);
    expect(usoAtualizado.dataDeTermino.toISOString()).toBe(new Date(novosDados.dataDeTermino).toISOString());
  });

  it("Deve retornar status 404 se o registro de uso de automóvel não existir", async () => {
    const novosDados = {
      dataDeTermino: "2024-06-28T18:00:00Z",
    };

    const idInexistente = 9999;

    const response = await request(app)
      .put(`/update-carUsage/${idInexistente}`)
      .send(novosDados);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});
