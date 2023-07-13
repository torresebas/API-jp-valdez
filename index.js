import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRoutes from "./routes/usersRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
const app = express();
app.use(express.json()); // Habilita JSON

dotenv.config();

dbConnect();

//Conf CORS

const whiteList = [process.env.FRONTEND_URL] 

//ver doc de cors
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //puede consultar la api
      callback(null, true);
    } else {
      callback(new Error("Cors Error"));
    }
  },
};
app.use(cors(corsOptions));

//ROUTING
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;

// Se borra abajo de aca Esto es para pruebas
app.get("/students", (req, res) => {
  const { limit, offset } = req.query;
  if (limit || offset) {
    res.json({
      limit,
      offset,
    });
  } else {
    res.send("Todos");
  }
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "sebastian", age: 21 },
    { id: 2, name: "bruno", age: 2 },
    { id: 3, name: "max", age: 2 },
  ]);
});

app.get("/pets/:petId", (req, res) => {
  const petId = req.params.petId;
  res.json({
    petId,
    name: "Name Pet ",
  });
});
// Se borra arriba de aca

app.listen(PORT, () => {
  console.log(`Server port : ${PORT}`);
});
