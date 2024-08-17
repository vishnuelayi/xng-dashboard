import { TxReportRecordUI } from "@xng/reporting";
import { ColumnHeader } from "../../../../../hooks/use_datagrid_base";
import dayjs from "dayjs";

export function generateTxColumns() {
  const DAYJS_FORMAT = "M/D/YYYY";
  const COLUMN_MIN_WIDTHS: Record<"lg" | "md" | "sm", number> = { sm: 80, md: 120, lg: 150 };

  const columnsWithoutDefaults: ColumnHeader<TxReportRecordUI>[] = [
    { title: "Last Name", key: "lastName" },
    { title: "First Name", key: "firstName" },
    { title: "X Logs ID", key: "xLogsId" },
    { title: "Student ID", key: "studentId" },
    {
      title: "Date of Birth",
      key: "dateOfBirth",
      columnProps: { valueFormatter: (v) => dayjs(v.value).format(DAYJS_FORMAT) },
    },
    { title: "Gender", key: "gender", columnProps: { minWidth: COLUMN_MIN_WIDTHS.sm } },
    { title: "Grade", key: "grade", columnProps: { minWidth: COLUMN_MIN_WIDTHS.sm } },
    { title: "District of Liability", key: "districtOfLiability" },
    { title: "School", key: "campus" },
    { title: "Medicaid Id", key: "medicaidId" },
    { title: "Is Eligible", key: "isMedicaidEligible" },
    { title: "SPED Status", key: "spedStatus" },
    { title: "X Logs Status", key: "xLogsStatus" },
    { title: "Parental Consent", key: "parentalConsentStatus" },
    { title: "Parental Consent Date", key: "parentalConsentDate" },
    { title: "Personal Care Ordered", key: "personalCareOrdered" },
    { title: "Primary Disability", key: "primaryDisability" },
    { title: "Secondary Disability", key: "secondaryDisability" },
    { title: "Tertiary Disability", key: "tertiaryDisability" },
    { title: "Okay To Bill Medicaid", key: "okToBillMedicaid" },
    { title: "Audiology Prescription", key: "hasAudiologyPrescription" },
    { title: "Audiology Prescription Start", key: "audiologyPrescriptionStartDate" },
    { title: "Audiology Prescription End", key: "audiologyPrescriptionEndDate" },
    { title: "Audiology Prescription Provider Name", key: "audiologyPrescribingProviderName" },
    { title: "Audiology Prescription Provider NPI", key: "audiologyPrescribingProviderNPI" },
    { title: "OT Prescription", key: "hasOccupationalTherapyPrescription" },
    { title: "OT Prescription Start", key: "occupationalTherapyPrescriptionStartDate" },
    { title: "OT Prescription End", key: "occupationalTherapyPrescriptionEndDate" },
    { title: "OT Prescribing Provider", key: "occupationalTherapyPrescribingProviderName" },
    { title: "OT Prescribing Provider NPI", key: "occupationalTherapyPrescribingProviderNPI" },
    { title: "PT Prescription", key: "hasPhysicalTherapyPrescription" },
    { title: "PT Prescription Start", key: "physicalTherapyPrescriptionStartDate" },
    { title: "PT Prescription End", key: "physicalTherapyPrescriptionEndDate" },
    { title: "PT Prescribing Provider", key: "physicalTherapyPrescribingProviderName" },
    { title: "PT Prescribing Provider NPI", key: "physicalTherapyPrescribingProviderNPI" },
    { title: "Speech Prescription", key: "hasSpeechTherapyPrescription" },
    { title: "Speech Prescription Start", key: "speechTherapyPrescriptionStartDate" },
    { title: "Speech Prescription End", key: "speechTherapyPrescriptionEndDate" },
    { title: "Speech Prescribing Provider", key: "speechTherapyPrescribingProviderName" },
    { title: "Speech Prescribing Provider NPI", key: "speechTherapyPrescribingProviderNPI" },
  ];

  const columnsWithDefaults: ColumnHeader<TxReportRecordUI>[] = columnsWithoutDefaults.map((c) => {
    // Default to large
    c.columnProps = { ...{ minWidth: COLUMN_MIN_WIDTHS.lg, ...c.columnProps } };
    return c;
  });

  return columnsWithDefaults;
}
