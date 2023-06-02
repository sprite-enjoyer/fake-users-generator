import { fakerDE, fakerFR, fakerEN_GB, Faker } from '@faker-js/faker';
import { ErrorLocation, ErrorType, GeneratedPersonData, GenerationCountry } from "../types";
import seedRandom from "seedrandom";
import seedrandom from 'seedrandom';

class GenerationLogicContainer {

  country: GenerationCountry = "Britain";

  currentFaker: Faker = fakerEN_GB;

  private fakerBritain: Faker = this.currentFaker;

  private fakerFrance = fakerFR;

  private fakerGermany = fakerDE;

  errorNumber = 0;

  seed = 1;

  ID = 1;

  rand = seedRandom("0");

  setCountry(newValue: GenerationCountry) {
    this.country = newValue;
    return this;
  }

  reset() {
    this.country = "Britain";
    this.currentFaker = this.fakerBritain;
    this.fakerBritain = fakerEN_GB;
    this.fakerFrance = fakerFR;
    this.fakerGermany = fakerDE;
    this.errorNumber = 0;
    this.doForAllFakers(faker => faker.seed(1));
    this.seed = 1;
    this.ID = 1;
    this.rand = seedrandom("1");
  }

  setFakerByCountry(country: GenerationCountry) {
    if (this.country === country) return this;
    switch (country) {
      case "Britain":
        this.currentFaker = this.fakerBritain;
        break;
      case "France":
        this.currentFaker = this.fakerFrance;
        break;
      case "Germany":
        this.currentFaker = this.fakerGermany;
        break;
    }
    return this;
  }

  setErrorNumber(newValue: number) {
    if (newValue > 1000 || newValue < 0) return this;
    this.errorNumber = newValue
    return this;
  }

  setSeed(newValue: number) {
    this.seed = newValue;
    return this;
  }

  setFakerSeed(seed: number) {
    this.doForAllFakers((faker) => faker.seed(seed));
    return this;
  }

  setMathSeed() {
    this.rand = seedRandom(this.seed.toString());
    return this;
  }

  generateData(count: number, isRealData: boolean): GeneratedPersonData[] {
    const data = [];

    for (let i = 0; i < count; i++) {
      const fullName = this.currentFaker.person.fullName();
      const city = this.currentFaker.location.city();
      const street = this.currentFaker.location.street();
      const house = this.currentFaker.location.buildingNumber();
      const phone = this.currentFaker.phone.number();
      data.push({ ID: this.ID, fullName: fullName, fullAddress: city + " " + street + " " + house, phone: phone });
      if (isRealData) this.ID++;
    }
    return this.introduceErrors(data);
  }

  getRandomNumber() {
    const TEN_MILLION = 10 ** 7;
    return parseInt((this.rand() * TEN_MILLION).toFixed(0), 10);
  }

  doForAllFakers(cb: (faker: Faker) => void) {
    cb(this.fakerBritain);
    cb(this.fakerFrance);
    cb(this.fakerGermany);
  }

  private determineIferrorShouldBeIntroduced(j: number) {
    if (j + 1 > this.errorNumber && j + 1 !== this.errorNumber) {
      const chanceOfError = this.errorNumber - (j + 1);
      if (chanceOfError < this.rand()) return false;
    }
    return true;
  }

  private introduceErrors(data: GeneratedPersonData[]) {
    const changedDataArray: GeneratedPersonData[] = [];

    data.forEach(data => {
      let changedData = data;
      for (let j = 0; j < this.errorNumber; j++) {
        const shouldIntroduceError = this.determineIferrorShouldBeIntroduced(j);
        if (shouldIntroduceError) changedData = this.callRespectiveErrorIntroducingFunction(changedData);
      }
      changedDataArray.push(changedData);
    });
    return changedDataArray;
  }

  private callRespectiveErrorIntroducingFunction(data: GeneratedPersonData) {
    const errorTypes: ErrorType[] = ["add", "delete", "swap"];
    let changedData = data;
    const currentErrorType = errorTypes[this.getRandomNumber() % 3];
    switch (currentErrorType) {
      case "add": changedData = this.introduceLetterAdditionError(changedData);
        break;
      case "delete":
        changedData = this.introduceLetterDeletionError(changedData);
        break;
      case "swap":
        changedData = this.introduceLetterSwappingError(changedData);
        break;
    }
    return changedData;
  }

  private getDataFieldReady(data: GeneratedPersonData): [string[], ErrorLocation] {
    const errorLocations: ErrorLocation[] = ["fullAddress", "fullName", "phone"];
    const currentLocation = errorLocations[this.getRandomNumber() % 3];
    const errorField = data[currentLocation];
    const stringArr = errorField.split("");
    return [stringArr, currentLocation];
  }

  private introduceLetterSwappingError(data: GeneratedPersonData): GeneratedPersonData {
    const [stringArr, currentLocation] = this.getDataFieldReady(data);
    const [index1, index2] = [this.getRandomNumber() % stringArr.length, this.getRandomNumber() % stringArr.length];
    [stringArr[index1], stringArr[index2]] = [stringArr[index2], stringArr[index1]];
    const newData = { ...data };
    newData[currentLocation] = stringArr.join("");
    return newData;
  }

  private introduceLetterAdditionError(data: GeneratedPersonData): GeneratedPersonData {
    const generateRandomLetterOrNumber = () => {
      const lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";
      const randomIndex = this.getRandomNumber() % lettersAndNumbers.length;
      return lettersAndNumbers[randomIndex];
    };

    const letterToAdd = generateRandomLetterOrNumber();
    const [stringArr, currentLocation] = this.getDataFieldReady(data);
    const index = this.getRandomNumber() % stringArr.length;
    stringArr.splice(index, 0, letterToAdd);
    const newData = { ...data };
    newData[currentLocation] = stringArr.join("");

    return newData;
  }

  private introduceLetterDeletionError(data: GeneratedPersonData): GeneratedPersonData {
    const [stringArr, currentLocation] = this.getDataFieldReady(data);
    const index = this.getRandomNumber() % stringArr.length;
    stringArr.splice(index, 1);
    const newData = { ...data };
    newData[currentLocation] = stringArr.join("");
    return newData;
  }

}


export default GenerationLogicContainer;