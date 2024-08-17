import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../../../../context/store";
import { SchoolCampus, SchoolCampusResponse } from "../../../../../profile-sdk";

// This file houses the logic for translating our campus domain model into our RHF form backing values, and vice versa.
// It is currently stored in a /temp folder as I will be discussing a more efficient approach with the back end and need one
// area to isolate the code in question.

/**
 * Backing model for our RHF values.
 */
export interface CampusFormValues {
  campusName: string;
  stateId: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  contactRole: string;
  phone: string;
}

// Translation Function: Campus Form Model to Campus Domain Model

export type FormToCampusFunction = (props: CampusFormValues) => SchoolCampus;
export function useFormToDomain(): FormToCampusFunction {
  const stateInUS = useXNGSelector(selectStateInUS);

  function formToDomain(props: CampusFormValues): SchoolCampus {
    const res: SchoolCampus = {
      name: props.campusName,
      stateId: props.stateId,
      address: {
        addressLine1: props.address1,
        addressLine2: props.address2,
        city: props.city,
        state: stateInUS,
        zipCode: props.zipCode,
      },
      campusContact: { role: props.contactRole, phoneNumber: props.phone },
    };

    return res;
  }

  return formToDomain;
}

// Translation Function: Campus Domain Model to Campus Form Model

export function domainToForm(c: SchoolCampusResponse): CampusFormValues {
  const res: CampusFormValues = {
    address1: c.address?.addressLine1 ?? "",
    address2: c.address?.addressLine2 ?? "",
    campusName: c.name ?? "",
    city: c.address?.city ?? "",
    contactRole: c.campusContact?.role ?? "",
    phone: c.campusContact?.phoneNumber ?? "",
    stateId: c.stateId ?? "",
    zipCode: c.address?.zipCode ?? "",
  };

  return res;
}
