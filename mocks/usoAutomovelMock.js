import faker from "faker";
import moment from "moment";

// Função para gerar registros de uso de automóveis falsos
export function gerarRegistrosDeUso(quantidade, automoveis, motoristas) {
  let registrosDeUso = [];

  for (let i = 0; i < quantidade; i++) {
    const automovel = automoveis[Math.floor(Math.random() * automoveis.length)];
    const motorista = motoristas[Math.floor(Math.random() * motoristas.length)];
    
    const dataDeInicio = faker.date.recent(30); // Data de início nos últimos 30 dias
    const dataDeTermino = faker.random.boolean() ? faker.date.between(dataDeInicio, new Date()) : null;
    const motivo = faker.lorem.sentence();

    registrosDeUso.push({
      automovelId: automovel.id,
      motoristaId: motorista.id,
      dataDeInicio: moment(dataDeInicio).format('YYYY-MM-DD HH:mm:ss'),
      dataDeTermino: dataDeTermino ? moment(dataDeTermino).format('YYYY-MM-DD HH:mm:ss') : null,
      motivo: motivo,
    });
  }

  return registrosDeUso;
}
