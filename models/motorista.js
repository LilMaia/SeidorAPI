import sequelize from "../db/db.js";
import { INTEGER, STRING } from "sequelize";

const Motorista = sequelize.define("Motorista", {
  motoristaId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: STRING,
    allowNull: false,
  },
});

export default Motorista;
