import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import GenerationLogicContainer from "./classes/GenerationLogicContainer";
import { GetRandomUsersRequestBodyType } from "./types";
dotenv.config();
import { faker } from "@faker-js/faker";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 4000;

export const dataGenerator = new GenerationLogicContainer();

app.listen(PORT, () => {
  console.log("Express server started! 🚀");
});

const getRandomUsers = async (req: Request<any, any, GetRandomUsersRequestBodyType>, res: Response) => {
  const { country, errorNumber, seed, page } = req.body;

  dataGenerator
    .afterSeedOrCountryChange(seed, country)
    .setErrorNumber(errorNumber)
    .setPage(page)
    .setCountry(country)
    .setSeed(seed)
    .setFakerSeed();

  return res
    .status(200)
    .json({ message: "success", data: dataGenerator.generateData(20) });
};



app.post("/getRandomUsers", getRandomUsers);


