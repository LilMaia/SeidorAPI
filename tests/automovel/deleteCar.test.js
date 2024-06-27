import request from 'supertest';
import app from '../../index.js';
import Automovel from "../../models/automovel.js";

describe("Testes da Rota /delete-car/:id", () => {
  let automovelId;

  beforeAll(async () => {
    // Crie um automóvel fictício para deletar nos testes
    const novoAutomovel = {
      placa: "MNO9101",
      marca: "Toyota",
      cor: "Prata",
    };
    const response = await request(app).post("/create-car").send(novoAutomovel);
    automovelId = response.body.AutomovelId; // Corrigido para pegar o ID correto
  });

  // Teste para deletar um automóvel existente
  it("Deve deletar um automóvel existente e retornar status 200", async () => {
    const response = await request(app).delete(`/delete-car/${automovelId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Automóvel deletado");

    // Verificar se o automóvel foi realmente removido do banco de dados
    const automovelDeletado = await Automovel.findByPk(automovelId);
    expect(automovelDeletado).toBeNull();
  });

  // Teste para verificar se retorna 404 quando o automóvel não existe
  it("Deve retornar status 404 se o automóvel não existir", async () => {
    const idInexistente = 9999;

    const response = await request(app).delete(`/delete-car/${idInexistente}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBeTruthy();
  });
});
