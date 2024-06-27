import request from 'supertest';
import app from '../../index.js';
import Motorista from '../../models/motorista.js';

describe('Testes da Rota /get-all-drivers', () => {
  beforeAll(async () => {
    // Crie alguns motoristas fictícios para listar nos testes
    const motoristas = [
      { nome: 'João' },
      { nome: 'Maria' },
      { nome: 'José' },
    ];

    await Motorista.bulkCreate(motoristas);
  });

  // Teste para listar todos os motoristas cadastrados
  it('Deve listar todos os motoristas cadastrados e retornar status 200', async () => {
    const response = await request(app).get('/get-all-drivers');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste para listar motoristas filtrados por nome
  it('Deve listar motoristas filtrados por nome e retornar status 200', async () => {
    const nome = 'João';
    const response = await request(app).get('/get-all-drivers').query({ nome });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((motorista) => {
      expect(motorista.nome).toBe(nome);
    });
  });

  // Teste para verificar se retorna vazio quando o nome não existe
  it('Deve retornar uma lista vazia se o nome não existir', async () => {
    const nome = 'Inexistente';
    const response = await request(app).get('/get-all-drivers').query({ nome });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
});
