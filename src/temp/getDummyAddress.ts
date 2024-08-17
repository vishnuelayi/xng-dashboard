import { Address } from "../profile-sdk";

export function getDummyAddress(): Address {
  return {
    addressLine1: "Abc 123 St",
    addressLine2: "Apt 333",
    city: "Dusseldorf",
    state: "Germany",
    zipCode: "12345",
  };
}
