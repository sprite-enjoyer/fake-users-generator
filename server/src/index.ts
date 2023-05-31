import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import GenerationLogicContainer from "./classes/GenerationLogicContainer";
import { GetRandomUsersRequestBodyType } from "./types";
import { Server } from "socket.io";
import { EventEmitter } from "node:events";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const PORT = 4000;

export let dataGenerator = new GenerationLogicContainer();

server.listen(PORT, () => {
  console.log("Express server started! 🚀");
});

const getRandomUsers = async (req: Request<any, any, GetRandomUsersRequestBodyType>, res: Response) => {
  const { country, errorNumber, seed } = req.body;
  console.log(req.body);

  dataGenerator
    .setFakerByCountry(country)
    .setFakerSeed(seed)
    .afterSeedOrCountryChange(seed, country)
    .setErrorNumber(errorNumber)
    .setCountry(country)
    .setSeed(seed)
    .setMathSeed()
    .recordGeneratedUsersCount(20, seed, country);

  return res
    .status(200)
    .json({ message: "success", data: dataGenerator.generateData(20, true) });
};

io.on("connection", (socket) => {

  socket.on('disconnect', () => {
    dataGenerator = new GenerationLogicContainer();
  });
});

app.post("/getRandomUsers", getRandomUsers);
