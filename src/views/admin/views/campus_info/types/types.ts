import {
  CampusLineItemCard,
  DistrictRef,
  GetSchoolCampusLineItemsResponse,
} from "../../../../../profile-sdk";
import { CampusFormValues } from "../temp/form_to_domain";

export type CampusInformationSlide = 0 | 1;

export type CampusInformationContextStore = {
  district: DistrictRef | null;
  setSelectedSlide: React.Dispatch<React.SetStateAction<CampusInformationSlide>>;
  setSlide1Screen: React.Dispatch<React.SetStateAction<CampusInformationSlide1Screen>>;
  table: CampusInformationFetchedTable | null;
};
export type CampusInformationSlide1Screen =
  | CampusInformationAddScreen
  | CampusInformationEditScreen;

export type CampusInformationAddScreen = { id: "add" };
export type CampusInformationEditScreen = { id: "edit"; params: CampusEditScreenParameters };

export type CampusInformationFetchedTable = {
  campusLineItemsRes: GetSchoolCampusLineItemsResponse | null;
  refetch: () => void;
};

export type CampusEditScreenParameters = { campusID: string; defaultFormValues: CampusFormValues };
