export type GenerationCountry = "France" | "Britan" | "Germany";
export interface GeneratedPersonData {
  fullName: string,
  phone: string,
  fullAddress: string,
}

export interface GetRandomUsersRequestBodyType {
  country: GenerationCountry,
  page: number,
  errorNumber: number,
  seed: number,
}