export type GenerationCountry = "France" | "Britain" | "Germany";
export type ErrorType = "delete" | "add" | "swap";
export type ErrorLocation = "fullName" | "phone" | "fullAddress";
export interface GeneratedPersonData {
  fullName: string,
  phone: string,
  fullAddress: string,
  ID: number,
}

export interface GetRandomUsersRequestBodyType {
  country: GenerationCountry,
  errorNumber: number,
  seed: number,
}