import {
  StaffDirectoryProfile,
  StaffDirectorySortableColumnType,
} from "../../../../../profile-sdk";

const RemapStaffDirectorySortableColumnTypeKeyToEnum = (column: keyof StaffDirectoryProfile) => {
  switch (column) {
    case "firstName":
      return StaffDirectorySortableColumnType.NUMBER_0;
    case "lastName":
      return StaffDirectorySortableColumnType.NUMBER_1;
    case "email":
      return StaffDirectorySortableColumnType.NUMBER_2;
    case "docType":
      return StaffDirectorySortableColumnType.NUMBER_3;
    case "serviceProviderType":
      return StaffDirectorySortableColumnType.NUMBER_4;
    case "primaryCampus":
      return StaffDirectorySortableColumnType.NUMBER_5;
    case "employeeId":
      return StaffDirectorySortableColumnType.NUMBER_6;
    case "districtStatus":
      return StaffDirectorySortableColumnType.NUMBER_7;
    default:
      return StaffDirectorySortableColumnType.NUMBER_0;
  }
};

export default RemapStaffDirectorySortableColumnTypeKeyToEnum;
