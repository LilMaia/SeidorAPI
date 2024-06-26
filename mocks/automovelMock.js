import faker from "faker";

// Função para gerar automóveis falsos
export function gerarAutomoveis(quantidade) {
  let automoveis = [];

  for (let i = 0; i < quantidade; i++) {
    automoveis.push({
      placa: faker.vehicle.vin(),
      marca: faker.vehicle.manufacturer(),
      cor: faker.vehicle.color(),
    });
  }

  return automoveis;
}