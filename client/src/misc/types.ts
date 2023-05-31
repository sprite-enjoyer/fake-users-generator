export interface GeneratedPersonData {
  fullName: string,
  phone: string,
  fullAddress: string,
  index: number,
};

export type FilterStateType = { country: string, seed: number, errorNumber: number };
export type DispatchFilterActionType = { type?: string, payload: Partial<FilterStateType> };
