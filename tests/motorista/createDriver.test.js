import request from 'supertest';
import app from '../../index.js';
import Motorista from "../../models/motorista.js";

describe('Testes da Rota /create-driver', () => {
  // Teste para cadastrar um novo motorista
  it('Deve cadastrar um novo motorista e retornar status 201', async () => {
    const novoMotorista = {
      nome: 'Teste Motorista',
    };

    const response = await request(app)
      .post('/create-driver')
      .send(novoMotorista);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('motoristaId'); // Verifica se o motoristaId está presente na resposta
    expect(response.body).toMatchObject({
      ...novoMotorista,
      motoristaId: expect.any(Number),
    });

    // Verificar se o motorista foi realmente salvo no banco de dados
    const motoristaSalvo = await Motorista.findByPk(response.body.motoristaId);
    expect(motoristaSalvo).toBeTruthy();
    expect(motoristaSalvo.nome).toBe(novoMotorista.nome);
  });

  // Teste para validar se o nome é obrigatório
  it('Deve retornar status 400 se não fornecer nome', async () => {
    const motoristaSemNome = {};

    const response = await request(app)
      .post('/create-driver')
      .send(motoristaSemNome);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
