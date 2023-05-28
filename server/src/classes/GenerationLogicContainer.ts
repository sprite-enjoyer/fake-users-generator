import { fakerDE, fakerFR, fakerEN_GB, Faker } from '@faker-js/faker';
import { GeneratedPersonData, GenerationCountry } from "../types";

class GenerationLogicContainer {

  country: GenerationCountry = "Britan";

  faker: Faker = fakerEN_GB;

  errorNumber = 0;

  page = 1;

  seed = 0;

  numberOfGeneratedUsersPerSeedAndCountry: Map<string, number> = new Map();

  setCountry(newValue: GenerationCountry) {
    this.country = newValue;
    return this;
  }

  setFakerByCountry(country: GenerationCountry) {
    switch (country) {
      case "Britan":
        this.faker = fakerEN_GB;
        break;
      case "France":
        this.faker = fakerFR;
        break;
      case "Germany":
        this.faker = fakerDE;
        break;
    }
    return this;
  }

  setFakerSeed() {
    this.faker.seed(this.seed);
    return this;
  }

  setErrorNumber(newValue: number) {
    this.errorNumber = newValue
    return this;
  }

  setPage(newValue: number) {
    this.page = newValue;
    return this;
  }

  setSeed(newValue: number) {
    this.seed = newValue;
    return this;
  }

  generateData(count: number): GeneratedPersonData[] {
    const data = [];

    for (let i = 0; i < count; i++) {
      const fullName = this.faker.person.fullName();
      const city = this.faker.location.city();
      const street = this.faker.location.street();
      const house = this.faker.location.buildingNumber();
      const phone = this.faker.phone.number();

      data.push({ fullName: fullName, fullAddress: city + " " + street + " " + house, phone: phone });
    }

    this.recordGeneratedUsersCount(count, this.seed, this.country);
    return data;
  }

  afterSeedOrCountryChange(newSeed: number, newCountry: GenerationCountry) {
    if (newSeed === this.seed && newCountry === this.country) return this;
    console.log("seed or country changed!")
    const generatedUsersCount = this.numberOfGeneratedUsersPerSeedAndCountry
      .get(newSeed.toString() + newCountry) ?? 0;

    this.generateData(generatedUsersCount);
    return this;
  }

  private recordGeneratedUsersCount(count: number, seed: number, country: GenerationCountry) {
    const currentValue = this.numberOfGeneratedUsersPerSeedAndCountry.get(seed.toString() + country) ?? 0;
    this.numberOfGeneratedUsersPerSeedAndCountry.set(seed.toString() + country, currentValue + count);
  }

}


export default GenerationLogicContainer;