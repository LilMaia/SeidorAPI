// Importando os módulos necessários
import express from "express";
import helmet from "helmet";
import { PORT } from "./config/config.js";
import sequelize from "./db/db.js";
import automovelRoutes from "./routes/automovelRoutes.js";
import motoristaRoutes from "./routes/motoristaRoutes.js";
import usoAutomovelRoutes from "./routes/usoAutomovelRoutes.js";

// Criando uma instância do aplicativo Express
const app = express();

// Middleware: Configurando o uso do módulo Helmet para melhorar a segurança do aplicativo
app.use(helmet());

// Middleware: Habilitando o parser de JSON para lidar com dados JSON nas requisições
app.use(express.json());

// Middleware: Habilitando o parser de dados enviados através de formulários (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware: Configurando o cabeçalho CORS para permitir requisições de qualquer origem (*), com quaisquer métodos (*),
// e especificando quais cabeçalhos podem ser usados na requisição
app.use((req, res, next) => {
  const allowedHeaders = [
    "Accept",
    "Accept-Language",
    "Content-Language",
    "Content-Type",
    "Authorization", // Include the Authorization header
    "verify-token" // Include the custom verify-token header
  ];

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", ")); // Join the headers with a comma and space
  next();
});

// Middleware: Configurando as rotas do aplicativo, agrupadas no módulo routes
app.use(automovelRoutes,motoristaRoutes,usoAutomovelRoutes);

// Iniciando o servidor para escutar na porta especificada
app.listen(PORT, (err) => {
  if (err) {
    console.error("Erro ao iniciar o servidor:", err);
  } else {
    console.log(`Servidor está rodando na porta ${PORT}`);
  }
});

// Iniciando a conexão com o banco de dados
sequelize.sync().then(
  () => {
    console.log("Conectado ao banco de dados");
  },
  (error) => {
    console.error("Erro ao conectar ao banco de dados");
  }
);
