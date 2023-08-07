const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();

app.use(express.json());
const users = [];

// Middlewares = Tem o pode de parar ou alterar dados da requisição
const checkUserId = (request, response, next) => {
  // Vai receber o Id quer vai ser gerado pelo uuid v4
  const { id } = request.params;

  // Vai receber o id do usuario e verificar se está certo
  const index = users.findIndex((user) => user.id === id);

  /* Se o Id for menor do que 0 vai receber um mansagem
     dizendo que está errado. 
  */
  if (index < 0) {
    return response.status(404).json({ message: "User nor found." });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

const checkMethod = (request, response, next) => {
  const method = request.method;
  const url = request.url;

  console.log(`[${method}] - ${url}`);
  next();
};

// Get = leitora
app.get("/order", checkMethod, (request, response) => {
  return response.json(users);
});

// Post = Criar o pedido
app.post("/order", checkMethod, (request, response) => {
  const { order, clientName, price, orderStatus } = request.body;
  const user = {
    id: uuid.v4(),
    order,
    clientName,
    price,
    orderStatus,
  };

  users.push(user);

  return response.status(201).json(user);
});

// Put = fazer atulização do pedido
app.put("/order/:id", checkUserId, checkMethod, (request, response) => {
  const id = request.userId;
  const index = request.userIndex;
  const { order, clientName, price, orderStatus } = request.body;

  const updatedUser = { id, order, clientName, price, orderStatus };
  users[index] = updatedUser;

  return response.json(updatedUser);
});

// Delete
app.delete("/order/:id", checkUserId, checkMethod, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);
  return response.status(204).json();
});

//get com id
app.get("/order/:id", checkUserId, checkMethod, (request, response) => {
  const index = request.userIndex;
  const selectOrder = users[index];

  return response.json(selectOrder);
});

// Patch Atulização parcial. Dizer que o pedido está pronto
app.patch("/order/:id", checkUserId, checkMethod, (request, response) => {
  const index = request.userIndex;

  users[index].orderStatus = "Pedido está pronto";
  return response.json(users[index]);
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
