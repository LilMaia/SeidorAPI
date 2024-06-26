import sequelize from "../db.js";
import { DATE, INTEGER, STRING } from "sequelize";
import Automovel from "./automovel.js";
import Motorista from "./motorista.js";

const UsoAutomovel = sequelize.define("UsoAutomovel", {
  usoAutomovelId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dataDeInicio: {
    type: DATE,
    allowNull: false,
  },
  dataDeTermino: {
    type: DATE,
  },
  motivo: {
    type: STRING,
    allowNull: false,
  }
});

// Relacionamento UsoAutomovel com Automovel
UsoAutomovel.belongsTo(Automovel, { as: "automovel", foreignKey: "automovelId" });
Automovel.hasMany(UsoAutomovel, { as: "usos", foreignKey: "automovelId" });

// Relacionamento UsoAutomovel com Motorista
UsoAutomovel.belongsTo(Motorista, { as: "motorista", foreignKey: "motoristaId" });
Motorista.hasMany(UsoAutomovel, { as: "usos", foreignKey: "motoristaId" });

export default UsoAutomovel;
