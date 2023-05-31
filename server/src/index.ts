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

export const dataGenerator = new GenerationLogicContainer();

app.listen(PORT, () => {
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

const resetData = (req: Request, res: Response) => {
  dataGenerator.resetData();

  return res
    .status(200)
    .json({ message: "success" });

}



app.post("/getRandomUsers", getRandomUsers);
app.purge("/reset", resetData);

