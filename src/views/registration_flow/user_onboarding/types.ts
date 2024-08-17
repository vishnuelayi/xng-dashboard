import * as yup from "yup";
import { SchoolCampusRef, ServiceProviderType } from "../../../profile-sdk";

export interface FormOneValues {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  npi: string;
  stateMedicaidNumber: string;
  primaryCampus: SchoolCampusRef;
}
export const stepOneFormValidation = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().required("Email is required"),
  jobTitle: yup.string().required("Job title is required"),
  primaryCampus: yup.object<SchoolCampusRef>().typeError("Please select your primary campus"),
});

export interface FormThreeValues {
  nameOnLicense: string;
  licenseType: string;
  licenseNumber: string;
  licenseExpirationDate: Date;
}
export const stepThreeFormValidation = yup.object().shape({
  nameOnLicense: yup.string().required("Name is required"),
  licenseType: yup.object<ServiceProviderType>().required("Please select your license type"),
  licenseNumber: yup.string().matches(/^\d+$/, "Entry is not a valid number"),
  licenseExpirationDate: yup.date().nullable().required("Expiration date required"),
});

export interface FormFourValues {
  FERPAAuthorizationStatement: boolean;
  trueAccurateDataAuthorization: boolean;
  electronicSignatureConsent: boolean;
}

const STATEMENT_ERROR = "Statement is required.";
export const stepFourFormValidation = yup.object().shape({
  FERPAAuthorizationStatement: yup.boolean().oneOf([true], STATEMENT_ERROR),
  trueAccurateDataAuthorization: yup.boolean().oneOf([true], STATEMENT_ERROR),
  electronicSignatureConsent: yup.boolean().oneOf([true], STATEMENT_ERROR),
});
