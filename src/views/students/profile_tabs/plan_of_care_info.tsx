import { Alert, List, ListItem, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import usePalette from "../../../hooks/usePalette";
import { EditStudentFunctionType } from "../types";
import Box from "../../../design/components-dev/BoxExtended";
import { Disability, PlanOfCare, PlanOfCareType, StudentResponse } from "../../../profile-sdk";

import XNGCheckboxLabel from "../../../design/low-level/checkbox_label";
import useQueryICDCodes from "../hooks/useQueryICDCodes";
import TabViewPortSubSection from "../components/studentProfile/tabViewPortSubSection";
import SearchBarLabel from "../components/studentProfile/searchBarLabel";
import PlansOfCareDateRange from "../components/studentProfile/planOfCareInfo/planOfCareDateRange";

function PlanOfCareInfo(props: {
  editStudent: EditStudentFunctionType;
  editedStudent: StudentResponse | null;
}) {
  const palette = usePalette();

  // STORING METHOD IN A USEREF HOOK BECAUSE IT IS A STABLE DEPENCY
  const editStudentStableRef = useRef(props.editStudent);

  // PLANS OF CARE ARRAY INSTANCE FROM THE SPED DOSSIER NEEDED TO UPDATE EDITED STUDENT PROFILE

  const [plansOfCare, setPlansOfCare] = useState<PlanOfCare[] | null>(
    [...(props.editedStudent?.spedDossier?.plansOfCare as PlanOfCare[])] || [],
  );

  // ICD 10 CODES FETCHED FROM .txt FILE IN PUBLIC FILE
  const { icdCodes } = useQueryICDCodes();

  // REPRESENTS PRIMARY, SECONDARY AND TERTIARY SELECTED DISABILITES FROM THE ICD 10 CODES FILE
  const [selectedPrimaryDisability, setSelectedPrimaryDisability] = useState<Disability | null>(
    props.editedStudent?.spedDossier?.primaryDisability || null,
  );
  const [secondaryDisalibilySearchControl, setSecondaryDisalibilySearchControl] =
    useState<string>("");
  const [selectedSecondaryDisability, setSelectedSecondaryDisability] = useState<Disability | null>(
    props.editedStudent?.spedDossier?.secondaryDisability || null,
  );
  const [primaryDisalibilySearchControl, setPrimaryDisalibilySearchControl] = useState<string>("");
  const [selectedTertiaryDisability, setSelectedTertiaryDisability] = useState<Disability | null>(
    props.editedStudent?.spedDossier?.tertiaryDisability || null,
  );
  const [tertiaryDisalibilySearchControl, setTertiaryDisalibilySearchControl] =
    useState<string>("");

  // const planOfCareDependency = JSON.stringify(plansOfCare);

  // THIS UTILITY METHOD EXTRACTS THE FIRST WORD FROM A STRING
  // ORIGINALLY USED TO EXTRACT THE DIAGNOSIS CODE FROM THE PLAN OF CARE NAME PASSED AS A PARAMETER
  const getFirstWordFromString = (name: string) => name?.split(" ")[0];

  // our side effect responsible for mutating mapped data!
  useEffect(() => {
    editStudentStableRef.current("spedDossier.plansOfCare", plansOfCare);

    editStudentStableRef.current("spedDossier.primaryDisability", selectedPrimaryDisability);
    editStudentStableRef.current("spedDossier.secondaryDisability", selectedSecondaryDisability);
    editStudentStableRef.current("spedDossier.tertiaryDisability", selectedTertiaryDisability);
  }, [
    plansOfCare,
    selectedPrimaryDisability,
    selectedSecondaryDisability,
    selectedTertiaryDisability,
  ]);

  /* 
  This is for mapping the plan of care enum to the strings displayed on the
  frontend
*/
  const plansOfCareMap: Record<
    PlanOfCareType,
    {
      key: "NUMBER_0" | "NUMBER_1" | "NUMBER_2" | "NUMBER_3" | "NUMBER_4" | "NUMBER_5";
      label: string;
    }
  > = {
    0: { key: "NUMBER_0", label: "IEP (Special Education)" },
    1: { key: "NUMBER_1", label: "Referral" },
    2: { key: "NUMBER_2", label: "504" },
    3: { key: "NUMBER_3", label: "RTI / MTSS" },
    4: { key: "NUMBER_4", label: "ELL" },
    5: { key: "NUMBER_5", label: "Other Plan of Care" },
  };

  return (
    <Box component={List}>
      {/* TODO: SPED STATUS: THIS PARTICULAR INPUT FIELD REQUIRES MORE SCOPING BY PAUL AND KELSEY AND SO WILL BE PUT ON HOLD FOR NOW, UNTIL A FINAL
      DECISION IS MADE */}

      {/* PLANS OF CARE DATES SECTION */}
      <TabViewPortSubSection title="Plan Of Care Dates">
        <Box component={List}>
          {plansOfCare && plansOfCare?.length <= 0 && (
            <Alert icon sx={{ backgroundColor: palette.info[3], maxWidth: "1000px" }}>
              This student currently does not have an assigned plan of care. Please select one below
              to edit the plan of care dates.
            </Alert>
          )}
          {plansOfCare?.map((poc, i) => (
            <ListItem key={poc.type} disableGutters>
              <PlansOfCareDateRange
                label={getFirstWordFromString(plansOfCareMap[poc.type!].label)}
                index={i}
                planOfCare={poc}
                setPlansOfCare={setPlansOfCare}
              />
            </ListItem>
          ))}
        </Box>
      </TabViewPortSubSection>

      {/* DISABILITY INFORMATION SECTION */}
      <TabViewPortSubSection title="Disablity Information">
        <Stack gap={2}>
          <SearchBarLabel
            useSimpleSearchBar={{
              id: "Primary ICD 10 Code",
              options: icdCodes,
              size: "medium",
              value: selectedPrimaryDisability?.name || "",
              onChange: (_, newValue) => {
                setSelectedPrimaryDisability((prev) => ({
                  ...prev,
                  name: newValue as string,
                  diagnosisCode: getFirstWordFromString(newValue as string),
                }));
              },
              inputValue: primaryDisalibilySearchControl,
              onInputChange: (_, newValue) => {
                setPrimaryDisalibilySearchControl(newValue);
              },
              useInputField: {
                label: "Primary ICD 10 Code",
              },
              useFilterOptions: {
                limit: 500,
              },
            }}
            label={"Primary Disability"}
          />
          <SearchBarLabel
            useSimpleSearchBar={{
              id: "Secondary ICD 10 Code",
              options: icdCodes,
              size: "medium",
              value: selectedSecondaryDisability?.name || "",
              onChange: (_, newValue) => {
                setSelectedSecondaryDisability((prev) => ({
                  ...prev,
                  name: newValue as string,
                  diagnosisCode: getFirstWordFromString(newValue as string),
                }));
              },
              inputValue: secondaryDisalibilySearchControl,
              onInputChange: (_, newValue) => {
                setSecondaryDisalibilySearchControl(newValue);
              },
              useInputField: {
                label: "Secondary ICD 10 Code",
              },
              useFilterOptions: {
                limit: 500,
              },
            }}
            label={"Secondary Disability"}
          />
          <SearchBarLabel
            useSimpleSearchBar={{
              id: "Tertiary ICD 10 Code",
              options: icdCodes,
              size: "medium",
              value: selectedTertiaryDisability?.name || "",
              onChange: (_, newValue) => {
                setSelectedTertiaryDisability((prev) => ({
                  ...prev,
                  name: newValue as string,
                  diagnosisCode: getFirstWordFromString(newValue as string),
                }));
              },
              inputValue: tertiaryDisalibilySearchControl,
              onInputChange: (_, newValue) => {
                setTertiaryDisalibilySearchControl(newValue as string);
              },
              useInputField: {
                label: "Tertiary ICD 10 Code",
              },
              useFilterOptions: {
                limit: 500,
              },
            }}
            label={"Tertiary Disability"}
          />
        </Stack>
      </TabViewPortSubSection>

      {/* PLANS OF CARE SECTION */}
      <TabViewPortSubSection title="Plan(s) of Care">
        <Box component={List}>
          {Object.values(plansOfCareMap).map((remap, i) => (
            <ListItem key={i} disablePadding>
              <XNGCheckboxLabel
                label={remap.label}
                checked={!!plansOfCare?.find((poc) => poc.type === PlanOfCareType[remap.key])}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPlansOfCare((prev) => [
                      ...(prev || []),
                      {
                        type: PlanOfCareType[remap.key],
                        startDate: undefined,
                        endDate: undefined,
                        otherDescription: undefined,
                      },
                    ]);
                  } else {
                    setPlansOfCare(
                      (prev) => prev?.filter((p) => p.type !== PlanOfCareType[remap.key]) || prev,
                    );
                  }
                }}
              />
            </ListItem>
          ))}
        </Box>
      </TabViewPortSubSection>
    </Box>
  );
}

export default PlanOfCareInfo;
// These represent sped statuses that need to be scoped
// const [optionValues, setOptionValues] = useState([
//   "Currently Served",
//   "Referral",
//   "Transfer",
//   "Private School",
//   "Withdrawn",
//   "Dismissed",
//   "Parent Decline",
// ]);
