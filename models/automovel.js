import sequelize from "../db.js";
import { INTEGER, STRING } from "sequelize";

const Automovel = sequelize.define("Automovel", {
  AutomovelId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  placa: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  marca: {
    type: STRING,
    allowNull: false,
  },
  cor: {
    type: STRING,
    allowNull: false,
  },
});

export default Automovel;
