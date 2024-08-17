import { FormHelperText, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { maxWidth } from "@mui/system";
import XNGInput from "../../../design/low-level/input";
import { getSizing } from "../../../design/sizing";
import usePalette from "../../../hooks/usePalette";
import { EditStudentFunctionType } from "../types";
import Box from "../../../design/components-dev/BoxExtended";
import {
  Address,
  StudentResponse,
  SchoolCampusAssignment,
  DistrictOfLiability,
  Grade,
} from "../../../profile-sdk";
import XNGSelect from "../../../design/low-level/dropdown";
import { useEffect, useMemo, useState } from "react";
import XNGDatePicker from "../../../design/low-level/calendar";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import genderOptions from "../../../data/genderOptionsData";
import gradeOptions from "../../../data/gradeOptionsData";
import produce from "immer";
import { useStudentProfileContext } from "../context/context";
import { useXNGSelector } from "../../../context/store";
import { selectAuthorizedDistricts } from "../../../context/slices/userProfileSlice";
import useApiQuerySchoolCampusesDropdownDisplaysGet from "../../../api/hooks/districts/use_api_query_school_campuses_drop_down_displays_get";
import { XNGIconRenderer } from "../../../design";
import { MSBInputErrorWrapper, MSBICONS } from "../../../fortitude";


function Demographics(props: {
  editStudent: EditStudentFunctionType;
  editedStudent: StudentResponse | null;
  selectedDistrict: DistrictOfLiability | undefined;
  setSelectedDistrict: (district: DistrictOfLiability) => void;
  selectedCampus: SchoolCampusAssignment | undefined;
  setSelectedCampus: (campus: SchoolCampusAssignment) => void;
  districts: string[];
  state:string
}) {
  const INPUT_SIZE = "large";
  const palette = usePalette();
  const student = props.editedStudent;

  const [gender] = useState<string[]>(genderOptions);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [gradeOptionValues] = useState<string[]>(gradeOptions);
  const [selectGrade, setSelectGrade] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const districtsOptions = useXNGSelector(selectAuthorizedDistricts);
  const districtOfLiabilityOptions = useMemo(() => {
    return districtsOptions.map((d) => {
      return {
        liableDistrict: d,
        startDate: dayjs(),
        endDate: null,
      };
    });
  }, [districtsOptions]);

  const {
    data: campusOptionsResponse,
    isError: isCampusOptionsError,
    isLoading: isCampusOptionsLoading,
    refetch: refetchCampusOptions,
  } = useApiQuerySchoolCampusesDropdownDisplaysGet({
    queryParams: {
      districtIds: districtsOptions.map((district) => district.id!).join(","),
      state: props.state,
    },
  });

  const { setEditedStudent } = useStudentProfileContext();

  if (props.editedStudent?.mailingAddress === null) {
    props.editStudent("mailingAddress", {} as Address);
  }

  const handleSelectGender = (e: any) => {
    setSelectedGender(e.target.value);
    let temp = props.editedStudent;
    switch (e.target.value) {
      case "Male":
        temp!.gender = 0;
        break;
      case "Female":
        temp!.gender = 1;
        break;
      case "Unkown":
        temp!.gender = 2;
        break;
    }
    props.editStudent("gender", temp?.gender);
  };
  const handleSelectGrade = (e: any) => {
    setSelectGrade(e.target.value);
    let temp = props.editedStudent;
    const selectedGrade = gradeOptions.indexOf(e.target.value);
    temp!.grade = selectedGrade === -1 ? Grade.NUMBER_14 : selectedGrade;
    props.editStudent("grade", temp?.grade);
  };


  useEffect(() => {
    props.editStudent("dateOfBirth", birthDate);
  }, [birthDate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(1) }}>
      <Typography variant="h6">Demographics</Typography>
      <Box sx={{ display: "flex", gap: getSizing(1) }}>
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("firstName", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder={"First"}
          defaultValue={student?.firstName}
        />
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("middleName", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder={"Middle"}
          defaultValue={student?.middleName}
        />
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("lastName", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder={"Last"}
          defaultValue={student?.lastName}
        />
      </Box>
      <Box sx={{ display: "flex", gap: getSizing(1), alignItems: "center" }}>
        <XNGSelect
          options={gradeOptionValues}
          value={selectGrade || gradeOptions[student?.grade!]}
          handle={handleSelectGrade}
          title="Grade"
          size="large"
          sx={{ backgroundColor: palette.contrasts[5] }}
        />
        <XNGDatePicker
          setValue={setBirthDate}
          title="Date of Birth"
          defaultValue={dayjs(student?.dateOfBirth)}
        />
        <Typography color={palette.primary[2]}>{/* derive */}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: getSizing(1) }}>
        <XNGSelect
          options={gender}
          value={gender[student?.gender!] || selectedGender}
          handle={handleSelectGender}
          title="Gender"
          size="large"
          sx={{ backgroundColor: palette.contrasts[5] }}
        />
        <XNGInput
          size={INPUT_SIZE}
          placeholder="Primary Language"
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("primaryLanguage", e.target.value);
          }}
          defaultValue={student?.primaryLanguage}
        />
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h6">Identification</Typography>
      <Box sx={{ display: "flex", gap: getSizing(1) }}>
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "")
              props.editStudent("studentIdGivenBySchoolDistrict", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder="Student ID"
          defaultValue={student?.studentIdGivenBySchoolDistrict}
          label="Student ID"
        />
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("medicaidId", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder="Medicaid ID"
          defaultValue={student?.medicaidId}
          label="Medicaid ID"
        />
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("socialSecurityNumber", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder="SSN"
          defaultValue={student?.socialSecurityNumber}
          label="SSN"
        />
        <XNGInput
          onBlur={(e) => {
            if (e.target.value != "") props.editStudent("studentIdGivenByState", e.target.value);
          }}
          size={INPUT_SIZE}
          placeholder="Student State ID"
          defaultValue={student?.studentIdGivenByState}
          label="Student State ID"
        />
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h6">District Assignment</Typography>
      <Box sx={{ display: "flex", gap: getSizing(1) }} alignItems={"start"}>
        <MSBInputErrorWrapper
          isError={isCampusOptionsError}
          refetch={refetchCampusOptions}
          errorText="Failed to retrieve list of campuses, please click refresh icon to try again."
        >
          <Select
            value={JSON.stringify(props.selectedCampus)}
            onChange={(v) => {
              const campus: SchoolCampusAssignment = JSON.parse(v.target.value);
              props.setSelectedCampus({
                ...campus,
                attendanceStartDate: dayjs().toDate(),
              });
            }}
            renderValue={(value) => (JSON.parse(value) as SchoolCampusAssignment).name || ""}
            size="small"
            sx={{
              minWidth: "100px",
            }}
            disabled={isCampusOptionsLoading || isCampusOptionsError}
          >
            {campusOptionsResponse?.schoolCampuses?.map((campus, i) => {
              return (
                <MenuItem key={i} value={JSON.stringify(campus)}>
                  {campus?.name}
                </MenuItem>
              );
            })}
          </Select>
        </MSBInputErrorWrapper>
        <Select
          value={JSON.stringify(props.selectedDistrict)}
          onChange={(v) => {
            props.setSelectedDistrict(JSON.parse(v.target.value));
          }}
          renderValue={(value) =>
            (JSON.parse(value) as DistrictOfLiability).liableDistrict?.name || ""
          }
          size="small"
          sx={{
            minWidth: "175px",
          }}
        >
          {districtOfLiabilityOptions.map((dol, i) => {
            return (
              <MenuItem key={i} value={JSON.stringify(dol)}>
                {dol.liableDistrict?.name}
              </MenuItem>
            );
          })}
        </Select>
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h6">Addresses</Typography>
      <Box sx={{ display: "flex", gap: getSizing(1) }}>
        <Box
          sx={{
            display: "flex",
            gap: getSizing(1),
            flexDirection: "column",
            maxWidth: getSizing(40),
          }}
        >
          <XNGInput
            size={INPUT_SIZE}
            placeholder="Student Address"
            onBlur={(e) => {
              if (e.target.value != "")
                props.editStudent("mailingAddress.addressLine1", e.target.value);
            }}
            defaultValue={student?.mailingAddress?.addressLine1}
          />
          <XNGInput
            size={INPUT_SIZE}
            placeholder="Street"
            onBlur={(e) => {
              if (e.target.value != "")
                props.editStudent("mailingAddress.addressLine2", e.target.value);
            }}
            defaultValue={student?.mailingAddress?.addressLine2}
          />
          <Box sx={{ display: "flex", gap: getSizing(1) }}>
            <XNGInput
              size={INPUT_SIZE}
              placeholder="City"
              onBlur={(e) => {
                if (e.target.value != "") props.editStudent("mailingAddress.city", e.target.value);
              }}
              defaultValue={student?.mailingAddress?.city}
            />
            <XNGInput
              size={INPUT_SIZE}
              placeholder="State"
              onBlur={(e) => {
                if (e.target.value != "") props.editStudent("mailingAddress.state", e.target.value);
              }}
              defaultValue={student?.mailingAddress?.state}
            />
          </Box>
        </Box>
        {/*   <Box sx={{ display: "flex", gap: getSizing(1), flexDirection:"column", maxWidth:getSizing(40)}}>
        <XNGInput size={INPUT_SIZE} placeholder="Student Address" onBlur={(e)=>{
            if(e.target.value != "")
            props.editStudent("mailingAddress.addressLine1", e.target.value)
          }}/>
          <XNGInput size={INPUT_SIZE} placeholder="Street" onBlur={(e)=>{
            if(e.target.value != "")
              props.editStudent("mailingAddress.addressLine2", e.target.value)
            }}/>
          <Box sx={{ display: "flex", gap:getSizing(1)}}>
            <XNGInput size={INPUT_SIZE} placeholder="City" onBlur={(e)=>{
            if(e.target.value != "")
                props.editStudent("mailingAddress.city", e.target.value)
              }}/>
            <XNGInput size={INPUT_SIZE} placeholder="State" onBlur={(e)=>{
            if(e.target.value != "")
                props.editStudent("mailingAddress.state", e.target.value)
              }}/>
          </Box>
          </Box>
      <Box sx={{ display: "flex", gap: getSizing(1), flexDirection:"column", maxWidth:getSizing(40)}}>
        <XNGInput size={INPUT_SIZE} placeholder="Student Address" onBlur={(e)=>{
            if(e.target.value != "")
            props.editStudent("mailingAddress.addressLine1", e.target.value)
          }}/>
          <XNGInput size={INPUT_SIZE} placeholder="Street" onBlur={(e)=>{
            if(e.target.value != "")
              props.editStudent("mailingAddress.addressLine2", e.target.value)
            }}/>
          <Box sx={{ display: "flex", gap:getSizing(1)}}>
            <XNGInput size={INPUT_SIZE} placeholder="City" onBlur={(e)=>{
            if(e.target.value != "")
                props.editStudent("mailingAddress.city", e.target.value)
              }}/>
            <XNGInput size={INPUT_SIZE} placeholder="State" onBlur={(e)=>{
            if(e.target.value != "")
                props.editStudent("mailingAddress.state", e.target.value)
              }}/>
          </Box>
          </Box>
          */}
      </Box>
      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />
    </Box>
  );
}

export default Demographics;
