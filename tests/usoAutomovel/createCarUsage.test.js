import request from "supertest";
import app from "../../index.js";
import Automovel from "../../models/automovel.js"; // Certifique-se de importar o modelo correto
import Motorista from "../../models/motorista.js"; // Certifique-se de importar o modelo correto
import UsoAutomovel from "../../models/usoAutomovel.js";

describe("Testes da Rota /create-carUsage", () => {
  let automovelId;
  let motoristaId;

  beforeAll(async () => {
    // Limpar os dados antes de começar os testes
    await Promise.all([
      Automovel.destroy({ where: {} }),
      Motorista.destroy({ where: {} }),
      UsoAutomovel.destroy({ where: {} }),
    ]);

    // Cria um automóvel e um motorista para utilizar nos testes
    const novoAutomovel = {
      placa: "ABC1234",
      marca: "Toyota",
      cor: "Azul",
    };
    const novoMotorista = {
      nome: "Maria Oliveira",
    };

    const responseAutomovel = await request(app)
      .post("/create-car")
      .send(novoAutomovel);
    automovelId = responseAutomovel.body.AutomovelId;

    const responseMotorista = await request(app)
      .post("/create-driver")
      .send(novoMotorista);
    motoristaId = responseMotorista.body.motoristaId;
  });

  it("Deve criar um registro de uso de automóvel e retornar status 201", async () => {
    const novoUso = {
      automovelId: automovelId,
      motoristaId: motoristaId,
      dataDeInicio: "2024-06-28T10:00:00.000Z", // Garante que o formato do timestamp seja consistente
      motivo: "Viagem de negócios",
    };

    const response = await request(app)
      .post("/create-carUsage")
      .send(novoUso);

    expect(response.status).toBe(201);
    // Ajusta o formato esperado do timestamp para corresponder ao que o Sequelize retorna
    expect(response.body).toMatchObject({
      ...novoUso,
      dataDeInicio: expect.stringMatching(/^2024-06-28T10:00:00.000Z$/),
    });

    // Verifica se o registro foi criado no banco de dados
    const usoCriado = await UsoAutomovel.findByPk(response.body.usoAutomovelId);
    expect(usoCriado).toBeTruthy();
  });

  it("Deve retornar erro 400 se o automóvel já estiver em uso", async () => {
    const usoExistente = {
      automovelId: automovelId,
      motoristaId: motoristaId,
      dataDeInicio: "2024-06-28T12:00:00Z",
      motivo: "Passeio",
    };

    await UsoAutomovel.create(usoExistente);

    const response = await request(app)
      .post("/create-carUsage")
      .send(usoExistente);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });

  it("Deve retornar erro 400 se o motorista já estiver utilizando outro automóvel", async () => {
    const outroAutomovel = {
      placa: "XYZ5678",
      marca: "Honda",
      cor: "Branco",
    };

    const responseOutroAutomovel = await request(app)
      .post("/create-car")
      .send(outroAutomovel);
    const outroAutomovelId = responseOutroAutomovel.body.AutomovelId;

    const usoExistente = {
      automovelId: outroAutomovelId,
      motoristaId: motoristaId,
      dataDeInicio: "2024-06-28T14:00:00Z",
      motivo: "Lazer",
    };

    await UsoAutomovel.create(usoExistente);

    const response = await request(app)
      .post("/create-carUsage")
      .send({
        ...usoExistente,
        automovelId: automovelId,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
