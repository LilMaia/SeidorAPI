import request from 'supertest';
import app from '../../index.js';
import Motorista from "../../models/motorista.js";

describe("Testes da Rota /delete-driver/:id", () => {
  let motoristaId;

  beforeAll(async () => {
    // Crie um motorista fictício para deletar nos testes
    const novoMotorista = {
      nome: "João Silva",
    };
    const response = await request(app).post("/create-driver").send(novoMotorista);
    motoristaId = response.body.motoristaId; // Obtém o ID correto do motorista
  });

  // Teste para deletar um motorista existente
  it("Deve deletar um motorista existente e retornar status 200", async () => {
    const response = await request(app).delete(`/delete-driver/${motoristaId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Motorista deletado");

    // Verificar se o motorista foi realmente removido do banco de dados
    const motoristaDeletado = await Motorista.findByPk(motoristaId);
    expect(motoristaDeletado).toBeNull();
  });

  // Teste para verificar se retorna 404 quando o motorista não existe
  it("Deve retornar status 404 se o motorista não existir", async () => {
    const idInexistente = 9999;

    const response = await request(app).delete(`/delete-driver/${idInexistente}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});
