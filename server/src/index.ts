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

export let dataGenerator = new GenerationLogicContainer();

app.listen(PORT, () => {
  console.log("Express server started! 🚀");
});

const getRandomUsers = async (req: Request<any, any, GetRandomUsersRequestBodyType>, res: Response) => {
  const { country, errorNumber, seed } = req.body;

  dataGenerator
    .setFakerByCountry(country)
    .setFakerSeed(seed)
    .afterSeedOrCountryChange(seed, country)
    .setErrorNumber(errorNumber)
    .setCountry(country)
    .setSeed(seed)
    .setMathSeed()
    .recordGeneratedUsersCount(20, seed, country);

  const forTesting = () => {
    const { country, seed, errorNumber } = dataGenerator;
    console.log(country, seed, errorNumber);
  };

  forTesting();

  const result = dataGenerator.generateData(20, true);
  console.log(result[0]);

  return res
    .status(200)
    .json({ message: "success", data: result });
};

const resetData = (req: Request, res: Response) => {
  const temp = new GenerationLogicContainer();
  dataGenerator = temp;

  return res
    .status(200)
    .json({ message: "success" });
}

app.post("/getRandomUsers", getRandomUsers);
app.get("/reset", resetData, () => console.log("data reset request!"));

