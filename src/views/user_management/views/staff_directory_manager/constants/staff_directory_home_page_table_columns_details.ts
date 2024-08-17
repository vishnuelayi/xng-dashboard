import { StaffDirectorySortableColumnType } from "../../../../../profile-sdk";

// FirstName = 0, LastName = 1, Email = 2, DocumentationType = 3, ServiceProviderType = 4, AssignedSchoolCampuses = 5
// Enum: FirstName = 0, LastName = 1, Email = 2, DocumentationType = 3, ServiceProviderType = 4, AssignedSchoolCampuses = 5, EmployeeId = 6, ClientAssignmentStatus = 7
const STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS = {
  FirstName: {
    label: "First Name",
    key: "firstName",
    columnType: StaffDirectorySortableColumnType.NUMBER_0,
  },
  LastName: {
    label: "Last Name",
    key: "lastName",
    columnType: StaffDirectorySortableColumnType.NUMBER_1,
  },
  Email: {
    label: "Email Address",
    key: "email",
    columnType: StaffDirectorySortableColumnType.NUMBER_2,
  },
  DocumentationType: {
    label: "Doc Type",
    key: "docType",
    columnType: StaffDirectorySortableColumnType.NUMBER_3,
  },
  ServiceProviderType: {
    label: "Service Provider Type",
    key: "serviceProviderType",
    columnType: StaffDirectorySortableColumnType.NUMBER_4,
  },
  AssignedSchoolCampuses: {
    label: "Primary Campus",
    key: "primaryCampus",
    columnType: StaffDirectorySortableColumnType.NUMBER_5,
  },
  XlogsStatus: {
    label: "Xlogs Status",
    key: "clientAssignmentStatus",
    columnType: StaffDirectorySortableColumnType.NUMBER_7,
  },
  EmployeeId: {
    label: "Employee ID",
    key: "employeeId",
    columnType: StaffDirectorySortableColumnType.NUMBER_6,
  },
};

export default STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS;
