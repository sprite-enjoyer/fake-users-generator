import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import GenerationLogicContainer from "./classes/GenerationLogicContainer";
import { GetRandomUsersRequestBodyType } from "./types";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const PORT = 4000;

const dataGenerator = new GenerationLogicContainer();

app.listen(PORT, () => {
  console.log("Express server started! 🚀");
});

const getRandomUsers = async (req: Request<any, any, GetRandomUsersRequestBodyType>, res: Response) => {
  const { country, errorNumber, seed } = req.body;
  console.log(req.body)

  if (isNaN(errorNumber) || isNaN(seed)) return res.status(400).json({ message: "NaN value not accepted", data: [] });
  if (seed === undefined || seed === null) return res.status(400).json({ message: "invalid seed", data: [] });

  dataGenerator
    .setFakerByCountry(country)
    .setFakerSeed(seed)
    .setErrorNumber(errorNumber)
    .setCountry(country)
    .setSeed(seed)
    .setMathSeed()

  return res
    .status(200)
    .json({ message: "success", data: dataGenerator.generateData(20, true) });
};

const resetData = (req: Request, res: Response) => {
  dataGenerator.reset();
  return res
    .status(200)
    .json({ message: "success" });
};

app.post("/getRandomUsers", getRandomUsers);
app.get("/reset", resetData, () => console.log("data reset request!"));
