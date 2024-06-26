import faker from "faker";

// Função para gerar motoristas falsos
export function gerarMotoristas(quantidade) {
  let motoristas = [];

  for (let i = 0; i < quantidade; i++) {
    motoristas.push({
      nome: faker.name.findName(),
    });
  }

  return motoristas;
}
