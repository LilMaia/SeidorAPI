import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mysql://root:1234@localhost:5432/seidordb");

export default sequelize;