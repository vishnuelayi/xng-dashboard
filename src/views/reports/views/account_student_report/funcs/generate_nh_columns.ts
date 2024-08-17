import { NhReportRecordUI } from "@xng/reporting";
import { ColumnHeader } from "../../../../../hooks/use_datagrid_base";
import dayjs from "dayjs";

export function generateNhColumns() {
  const DAYJS_FORMAT = "M/D/YYYY";
  const COLUMN_MIN_WIDTHS: Record<"lg" | "md" | "sm", number> = { sm: 80, md: 120, lg: 150 };

  const columnsWithoutDefaults: ColumnHeader<NhReportRecordUI>[] = [
    { title: "Last Name", key: "lastName" },
    { title: "First Name", key: "firstName" },
    { title: "X Logs ID", key: "xLogsId" },
    { title: "Student ID", key: "studentId" },
    {
      title: "DOB",
      key: "dateOfBirth",
      columnProps: { valueFormatter: (v) => dayjs(v.value).format(DAYJS_FORMAT) },
    },
    { title: "Gender", key: "gender", columnProps: { minWidth: COLUMN_MIN_WIDTHS.sm } },
    { title: "Grade Assigned", key: "grade", columnProps: { minWidth: COLUMN_MIN_WIDTHS.sm } },
    { title: "District of Liability", key: "districtOfLiability" },
    { title: "Campus", key: "campus" },
    { title: "Medicaid ID", key: "medicaidId" },
    { title: "Is Eligible", key: "isMedicaidEligible" },
    { title: "SPED Status", key: "spedStatus" },
    { title: "X Logs Status", key: "xLogsStatus" },
    { title: "Parental Consent", key: "parentalConsentStatus" },
    { title: "Parental Consent Date", key: "parentalConsentDate" },
    { title: "Personal Care Ordered", key: "personalCareOrdered" },
    { title: "Transportation Ordered", key: "transportationOrdered" },
    { title: "Primary Disability", key: "primaryDisability" },
    { title: "Secondary Disability", key: "secondaryDisability" },
    { title: "Tertiary Disability", key: "tertiaryDisability" },
    { title: "Ok to Bill", key: "okToBillMedicaid" },
    { title: "ABA Prescription", key: "hasAppliedBehaviorAnalysisPrescription" },
    { title: "ABA Presc Start Date", key: "appliedBehaviorAnalysisPrescriptionStartDate" },
    { title: "ABA Presc End Date", key: "appliedBehaviorAnalysisPrescriptionEndDate" },
    { title: "ABA Prescribing Provider", key: "appliedBehaviorAnalysisPrescribingProviderName" },
    { title: "ABA Prescribing Provider NPI", key: "appliedBehaviorAnalysisPrescribingProviderNPI" },
    { title: "Audiology Prescription", key: "hasAudiologyPrescription" },
    { title: "Audiology Presc Start Date", key: "audiologyPrescriptionStartDate" },
    { title: "Audiology Presc End Date", key: "audiologyPrescriptionEndDate" },
    { title: "Audiology Prescribing Provider", key: "audiologyPrescribingProviderName" },
    { title: "Audiology Prescribing Provider NPI", key: "audiologyPrescribingProviderNPI" },
    { title: "Mental Health Prescription", key: "hasMentalHealthPrescription" },
    { title: "Mental Health Presc Start Date", key: "mentalHealthPrescriptionStartDate" },
    { title: "Mental Health Presc End Date", key: "mentalHealthPrescriptionEndDate" },
    { title: "Mental Health Prescribing Provider", key: "mentalHealthPrescribingProviderName" },
    { title: "Mental Health Prescribing Provider NPI", key: "mentalHealthPrescribingProviderNPI" },
    { title: "Nursing Prescription", key: "hasNursingPrescription" },
    { title: "Nursing Presc Start Date", key: "nursingPrescriptionStartDate" },
    { title: "Nursing Presc End Date", key: "nursingPrescriptionEndDate" },
    { title: "Nursing Prescribing Provider", key: "nursingPrescribingProviderName" },
    { title: "Nursing Prescribing Provider NPI", key: "nursingPrescribingProviderNPI" },
    { title: "OT Prescription", key: "hasOccupationalTherapyPrescription" },
    { title: "OT Presc Start Date", key: "occupationalTherapyPrescriptionStartDate" },
    { title: "OT Presc End Date", key: "occupationalTherapyPrescriptionEndDate" },
    { title: "OT Prescribing Provider", key: "occupationalTherapyPrescribingProviderName" },
    { title: "OT Prescribing Provider NPI", key: "occupationalTherapyPrescribingProviderNPI" },
    { title: "PT Prescription", key: "hasPhysicalTherapyPrescription" },
    { title: "PT Presc Start Date", key: "physicalTherapyPrescriptionStartDate" },
    { title: "PT Presc End Date", key: "physicalTherapyPrescriptionEndDate" },
    { title: "PT prescribing Provider", key: "physicalTherapyPrescribingProviderName" },
    { title: "PT Prescribing Provider NPI", key: "physicalTherapyPrescribingProviderNPI" },
    { title: "Psychology Prescription", key: "hasPsychologyPrescription" },
    { title: "Psychology Presc Start Date", key: "psychologyPrescriptionStartDate" },
    { title: "Psychology Presc End Date", key: "psychologyPrescriptionEndDate" },
    { title: "Psychology prescribing Provider", key: "psychologyPrescribingProviderName" },
    { title: "Psychology Prescribing Provider NPI", key: "psychologyPrescribingProviderNPI" },
    { title: "Psychiatry Prescription", key: "hasPsychiatryPrescription" },
    { title: "Psychiatry Presc Start Date", key: "psychiatryPrescriptionStartDate" },
    { title: "Psychiatry Presc End Date", key: "psychiatryPrescriptionEndDate" },
    { title: "Psychiatry prescribing Provider", key: "psychiatryPrescribingProviderName" },
    { title: "Psychiatry Prescribing Provider NPI", key: "psychiatryPrescribingProviderNPI" },
    { title: "RA Prescription", key: "hasRehabilitativeAssistancePrescription" },
    { title: "RA Presc Start Date", key: "rehabilitativeAssistancePrescriptionStartDate" },
    { title: "RA Presc End Date", key: "rehabilitativeAssistancePrescriptionEndDate" },
    { title: "RA Prescribing Provider", key: "rehabilitativeAssistancePrescribingProviderName" },
    { title: "RA Prescribing Provider NPI", key: "rehabilitativeAssistancePrescribingProviderNPI" },
    { title: "Speech Prescription", key: "hasSpeechTherapyPrescription" },
    { title: "Speech Presc Start Date", key: "speechTherapyPrescriptionStartDate" },
    { title: "Speech Presc End Date", key: "speechTherapyPrescriptionEndDate" },
    { title: "Speech Prescribing Provider", key: "speechTherapyPrescribingProviderName" },
    { title: "Speech Prescribing Provider NPI", key: "speechTherapyPrescribingProviderNPI" },
    { title: "Vision Prescription", key: "hasVisionPrescription" },
    { title: "Vision Presc Start Date", key: "visionPrescriptionStartDate" },
    { title: "Vision Presc End Date", key: "visionPrescriptionEndDate" },
    { title: "Vision Prescribing Provider", key: "visionPrescribingProviderName" },
    { title: "Vision Prescribing Provider NPI", key: "visionPrescribingProviderNPI" },
  ];

  const columnsWithDefaults: ColumnHeader<NhReportRecordUI>[] = columnsWithoutDefaults.map((c) => {
    // Default to large
    c.columnProps = { ...{ minWidth: COLUMN_MIN_WIDTHS.lg, ...c.columnProps } };
    return c;
  });

  return columnsWithDefaults;
}
