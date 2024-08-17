import { useEffect, useState } from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import XNGInput from "../../../design/low-level/input";
import { getSizing } from "../../../design/sizing";
import usePalette from "../../../hooks/usePalette";
import { XNGIconRenderer, XNGICONS } from "../../../design/icons";
import Box from "../../../design/components-dev/BoxExtended";
import XNGDatePicker from "../../../design/low-level/calendar";
import { EditStudentFunctionType } from "../types";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import {
  ConsentForMedicaidBilling,
  EligibilityRecord,
  PrescribedServiceArea,
  ServiceAreaRef,
  StudentResponse,
} from "../../../profile-sdk";
import { XLogsPalette } from "../../../design/colors/types";
import { API_STATESNAPSHOTS } from "../../../api/api";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import XNGRadioGroup from "../../../design/low-level/radio_group";
import produce from "immer";
import { useStudentProfileContext } from "../context/context";

const CONST_LARGE = "large";

/**
 * This React component 'Medicaid' is responsible for the medicaid tab of the student management screen, found in
 * the student tab. As with other student profile systems, it allows the user to modify student records in a larger
 * CRUD system.
 *
 * ## Team Decision Note 1/26/24
 * As part of our ongoing efforts to enhance the student profile's scalability and maintainability the team
 * has made several decisions that influence the development of the student profile screens going forward:
 * 1. We are transitioning to using Immer to enhance our complex state write operations.
 * 2. We are adopting a context-based approach for reading common state to enhance our read operations.
 * 3. Replacing deprecated Fortitude components with Material UI components in the instance of bug
 *    resolutions, as part of a larger progressive refactor.
 *
 * @remarks ---
 * * The subcomponent 'PrescribedServiceAreaItem' appears to handle individual service areas, showing dates and provider details.
 */
function Medicaid(props: {
  editStudent: EditStudentFunctionType;
  editedStudent: StudentResponse | null;
}) {
  const { setEditedStudent } = useStudentProfileContext();

  const state = useXNGSelector(selectStateInUS);
  const palette = usePalette();
  const radioSize = { "& .MuiSvgIcon-root": { fontSize: 20 } };
  const [select, setSelect] = useState<string>("");
  const [select2, setSelect2] = useState<string>("");
  const [prescribedServiceAreas, setPrescribedServiceAreas] = useState<
    PrescribedServiceArea[] | undefined
  >(undefined);
  const [personalCareSupplement, setPersonalCareSupplement] = useState<number>(
    props.editedStudent?.spedDossier?.personalCareSupplement === true
      ? 0
      : props.editedStudent?.spedDossier?.personalCareSupplement === false
      ? 1
      : 2,
  );
  const [personalCareServices, setPersonalCareServices] = useState<number>(
    props.editedStudent?.spedDossier?.prescribedServiceAreas?.[0]?.decision || 2,
  );
  const [consentDecision, setConsentDecision] = useState<number | undefined>(
    /**
     * This is a frontend workaround because the backend is currently always sending back
     * a sorted list of consent decision objects in which the first item is always an object with only null date values,
     * and the decision value as 3. So the second item, if it exists, is the most recent consent decision made and we use that here
     */
    props.editedStudent?.spedDossier?.consent?.[1].decision === 0 // passing 0 in a truthy evaluation results in false so we explicitly check here
      ? 0
      : !props.editedStudent?.spedDossier?.consent?.[1].decision // If the consent decision doesnt exist or hasnt been touched, we want to select 3 which corresponds to "None Selected" in the ConsentDecision enum
      ? 3
      : props.editedStudent?.spedDossier?.consent?.[1].decision, // The actual decision value if it exists
  );
  const [consentDate, setConsentDate] = useState<Dayjs | null>(null);
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [specializedTransportation, setSpecializedTransportation] = useState<number>(2);
  const [personalCareOnBus, setPersonalCareOnBus] = useState<number>(2);
  const [speciallyAdjustedVehicle, setSpeciallyAdjustedVehicle] = useState<number>(
    props.editedStudent?.spedDossier?.speciallyAdjustedVehicle === true
      ? 0
      : props.editedStudent?.spedDossier?.speciallyAdjustedVehicle === false
      ? 1
      : 2,
  );
  const [blockBilling, setBlockBilling] = useState<number>(
    props.editedStudent?.spedDossier?.billingBlockTerm === null
      ? 2
      : props.editedStudent?.spedDossier?.billingBlockTerm?.blockBilling === true
      ? 0
      : 1,
  );
  const [billStartValue, setBillStartValue] = useState<Dayjs | null>(
    props.editedStudent?.spedDossier?.billingBlockTerm
      ? dayjs(props.editedStudent?.spedDossier?.billingBlockTerm?.blockBillingStartDate)
      : null,
  );

  const [billEndValue, setBillEndValue] = useState<Dayjs | null>(
    props.editedStudent?.spedDossier?.billingBlockTerm
      ? dayjs(props.editedStudent?.spedDossier?.billingBlockTerm?.blockBillingEndDate)
      : null,
  );
  const careAreas = [
    "Personal Care Services",
    "Personal Care Supplement",
    "Specialized Transportation Services",
    "Personal Care on Bus Services",
    "Specially Adapted Vehicle",
  ];

  const radioChoices: {
    [key: string]: boolean | null;
  } = {
    "0": true,
    "1": false,
    "2": null,
  };

  const consentChoices: {
    [key: number]: string;
  } = {
    0: "yes",
    1: "no",
    2: "refuse",
    3: "none",
  };

  const onHandleConsentChoiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const values: {
      [key: string]: number | undefined;
    } = {
      yes: 0,
      no: 1,
      refuse: 2,
      none: 3,
    };

    const choice = values[e.target.value];
    setConsentDecision(choice);

    const new_edited_student = produce(props.editedStudent, (draft) => {
      if (draft && draft.spedDossier && draft.spedDossier.consent) {
        if (!consentDate) {
          setConsentDate(dayjs());
          draft.spedDossier.consent[0].startDate = dayjs().toDate();
        }
        draft.spedDossier.consent[0].decision = choice;
      }
    });
    setEditedStudent(new_edited_student);
  };

  const onHandleConsentDateChange = (e: Dayjs | null) => {
    const new_edited_student = produce(props.editedStudent, (draft) => {
      if (draft && draft.spedDossier && draft.spedDossier.consent) {
        draft.spedDossier.consent[0].startDate = dayjs(e).toDate();
      }
    });
    setEditedStudent(new_edited_student);
  };

  if (props.editedStudent?.spedDossier?.consent === null) {
    let createTemp = [] as ConsentForMedicaidBilling[];
    createTemp.push({} as ConsentForMedicaidBilling);
    props.editStudent("spedDossier.consent", createTemp);
  }

  const handleSelect = (e: any) => {
    setSelect(e.target.value);
  };

  const handleSelect2 = (e: any) => {
    setSelect2(e.target.value);
    // props.editStudent("spedDossier.prescribedServiceAreas.serviceArea.name", e.target.value)
  };

  const handlePersonalCareServices = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPersonalCareServices(parseInt(e.target.value));

    if (props.editedStudent?.spedDossier?.prescribedServiceAreas) {
      props.editStudent("spedDossier.prescribedServiceAreas.0.decision", parseInt(e.target.value));
    }
  };

  const handlePersonalCareSupplement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPersonalCareSupplement(parseInt(e.target.value));
    props.editStudent("spedDossier.personalCareSupplement", radioChoices[e.target.value]);
  };

  const handleSpecializedTransportation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSpecializedTransportation(parseInt(e.target.value));
  };

  const handleTransportationBus = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPersonalCareOnBus(parseInt(e.target.value));
  };

  const handleSpeciallyAdjustedVehicle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSpeciallyAdjustedVehicle(parseInt(e.target.value));
    props.editStudent("spedDossier.speciallyAdjustedVehicle", radioChoices[e.target.value]);
  };

  const handleBilling = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlockBilling(parseInt(e.target.value));
    if (props.editedStudent?.spedDossier?.billingBlockTerm === null) {
      props.editStudent("spedDossier.billingBlockTerm", {
        blockBilling: radioChoices[e.target.value],
        blockBillingStartDate: billStartValue !== null ? billStartValue.toDate() : null,
        blockBillingEndDate: billEndValue !== null ? billEndValue.toDate() : null,
      });
      return;
    }
    props.editStudent("spedDossier.billingBlockTerm.blockBilling", radioChoices[e.target.value]);
  };

  const handleBillStartChange = (value: Dayjs | null) => {
    props.editStudent(
      "spedDossier.billingBlockTerm.blockBillingStartDate",
      value !== null ? value.toDate() : null,
    );
  };

  const handleBillEndChange = (value: Dayjs | null) => {
    props.editStudent(
      "spedDossier.billingBlockTerm.blockBillingEndDate",
      value !== null ? value.toDate() : null,
    );
  };

  async function getPrescriptions() {
    const res = await API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceAreasGet(
      state,
      dayjs().toDate(),
      true,
    );

    const serviceAreas: ServiceAreaRef[] = res.serviceAreas!;

    const ids: string[] | undefined = props.editedStudent?.spedDossier?.prescribedServiceAreas!.map(
      (prescribedServiceArea) => {
        return prescribedServiceArea.serviceArea?.id!;
      },
    );

    const serviceAreasToAdd = serviceAreas?.filter(
      (serviceArea) => !ids!.includes(serviceArea.id!),
    );

    serviceAreasToAdd.forEach((serviceArea) => {
      props.editedStudent?.spedDossier?.prescribedServiceAreas!.push({
        decision: 0,
        serviceArea: serviceArea,
        endDate: undefined,
        prescribingProvider: undefined,
        startDate: undefined,
      });
    });

    props.editedStudent?.spedDossier?.prescribedServiceAreas!.sort((a, b) => {
      return parseInt(a.serviceArea?.id!) - parseInt(b.serviceArea?.id!);
    });

    const serviceArea_Ids = serviceAreas.map((serviceArea) => {
      return serviceArea.id;
    });

    const prescribedServiceAreas_result =
      props.editedStudent?.spedDossier?.prescribedServiceAreas!.filter((prescribedServiceArea) => {
        return serviceArea_Ids.includes(prescribedServiceArea.serviceArea?.id);
      });

    setPrescribedServiceAreas(prescribedServiceAreas_result);
  }

  // useEffect(() => {
  //   if (consentDecision != null) {
  //     props.editStudent("spedDossier.consent.0.startDate", dayjs(consentDate).toDate());
  //     props.editStudent("spedDossier.consent.0.decision", 0);
  //     console.log(props.editedStudent?.spedDossier?.consent);
  //     // setRefuseDate(null);
  //   }
  // }, [consentDecision]);

  // useEffect(() => {
  //   if (refuseDate != null) {
  //     console.log(refuseDate);
  //     props.editStudent("spedDossier.consent.0.startDate", dayjs(refuseDate).toDate());
  //     props.editStudent("spedDossier.consent.0.decision", 2);
  //     setConsentDate(null);
  //   }
  // }, [refuseDate]);

  useEffect(() => {
    if (props.editedStudent?.spedDossier?.prescribedServiceAreas === null) {
      props.editStudent("spedDossier.prescribedServiceAreas", [
        {} as PrescribedServiceArea,
      ] as PrescribedServiceArea[]);
    }
    // if (startValue != null) {
    //   props.editStudent(
    //     "spedDossier.prescribedServiceAreas.0.startDate",
    //     dayjs(startValue).toDate(),
    //   );
    // }
    // if (endValue != null) {
    //   props.editStudent("spedDossier.prescribedServiceAreas.0.endDate", dayjs(endValue).toDate());
    // }
    getPrescriptions();
  }, [startValue, endValue]);

  useEffect(() => {
    props.editedStudent?.spedDossier?.prescribedServiceAreas?.forEach((prescribedServiceArea) => {
      if (prescribedServiceArea.serviceArea?.name?.includes("Personal Care on Bus")) {
        setPersonalCareOnBus(prescribedServiceArea.decision as number);
      }

      if (prescribedServiceArea.serviceArea?.name?.includes("Specialized Transportation")) {
        setSpecializedTransportation(prescribedServiceArea.decision as number);
      }
    });
  }, []);

  const { handleEligibility } = useEligibilityDataOperations();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: getSizing(2),
        paddingBottom: getSizing(2),
      }}
    >
      <Box sx={{ display: "flex", gap: getSizing(2) }}>
        <Typography variant="h5">Eligibility</Typography>
        <XNGIconRenderer i={<XNGICONS.Files />} size={"md"} color={palette.primary[2]} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: getSizing(3),
          paddingTop: getSizing(2),
        }}
      >
        <Box sx={{ display: "flex", gap: getSizing(2) }}>
          <Box>
            <FormControl>
              <RadioGroup
                aria-labelledby="ElegibilityYN"
                name="ElegibilityYN"
                value={
                  props.editedStudent?.spedDossier?.eligibilityRecords &&
                  props.editedStudent.spedDossier.eligibilityRecords[0]?.status
                }
                onChange={handleEligibility}
                sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio sx={radioSize} />}
                  label={<Typography variant="body2">Yes</Typography>}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio sx={radioSize} />}
                  label={<Typography variant="body2">No</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <XNGInput
            size={CONST_LARGE}
            placeholder="Medicaid Number"
            onBlur={(e) => {
              props.editStudent("medicaidId", e.target.value);
            }}
            defaultValue={props.editedStudent?.medicaidId}
            label="Medicaid Number"
          />
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Box sx={{ display: "flex", gap: getSizing(2) }}>
        <Typography variant="h5">Parental Consent</Typography>
        <XNGIconRenderer i={<XNGICONS.Files />} size={"md"} color={palette.primary[2]} />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2), alignItems: "left" }}>
        <Typography variant="body1">Parent / Guardian Consent Signed</Typography>
        <XNGRadioGroup
          value={consentDecision !== undefined && consentChoices[consentDecision]}
          onChange={onHandleConsentChoiceChange}
          sx={{ flexDirection: "row" }}
          options={["Yes", "No", "Refuse", "None Selected"]}
          values={["yes", "no", "refuse", "none"]}
          radioSx={{}}
          formLabel={undefined}
        />
        <XNGDatePicker
          label="Consent Date"
          title="Consent Date"
          setValue={setConsentDate}
          onChange={onHandleConsentDateChange}
          defaultValue={
            consentDate ||
            (props.editedStudent?.spedDossier?.consent![1].decision === 3
              ? null
              : dayjs(props.editedStudent?.spedDossier?.consent![1].startDate))
          }
        />
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h5">Prescriptions</Typography>
      {prescribedServiceAreas &&
        prescribedServiceAreas.length > 0 &&
        prescribedServiceAreas.map((prescribedServiceArea, i) => {
          if (
            prescribedServiceArea.serviceArea?.name === "Transportation Services" ||
            prescribedServiceArea.serviceArea?.name === "Personal Care on Bus"
          ) {
            return;
          }

          return (
            <PrescribedServiceAreaItem
              prescribedServiceArea={prescribedServiceArea}
              editedStudent={props.editedStudent}
              editStudent={props.editStudent}
              palette={palette}
              itemKey={i}
            />
          );
        })}

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h5">Personal Care Services</Typography>
      <Typography variant="body1">
        Does {props.editedStudent?.firstName} have Personal Care Services ordered in the IEP?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="PersonalCareServices"
              name="PersonalCareServices"
              value={personalCareServices}
              onChange={handlePersonalCareServices}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Typography variant="body1">
        Does {props.editedStudent?.firstName} have Personal Care Supplement?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="PersonalCareSupplement"
              name="PersonalCareSupplement"
              value={personalCareSupplement}
              onChange={handlePersonalCareSupplement}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h5">Transportation Services</Typography>
      <Typography variant="body1">
        Does {props.editedStudent?.firstName} have Specialized Transportation Services ordered in
        the IEP?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="SpecializedTransportationServices"
              name="SpecializedTransportationServices"
              value={specializedTransportation}
              onChange={handleSpecializedTransportation}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} disabled={specializedTransportation !== 0} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} disabled={specializedTransportation !== 1} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} disabled={specializedTransportation !== 2} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Typography variant="body1">
        Does {props.editedStudent?.firstName} have Personal Care Services ordered on the bus?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="SpecializedTransportationServicesBus"
              name="SpecializedTransportationServicesBus"
              value={personalCareOnBus}
              onChange={handleTransportationBus}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} disabled={personalCareOnBus !== 0} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} disabled={personalCareOnBus !== 1} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} disabled={personalCareOnBus !== 2} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Typography variant="body1">
        Does {props.editedStudent?.firstName} require specially adjusted vehicle?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="SpecializedTransportationServicesAuto"
              name="SpecializedTransportationServicesAuto"
              value={speciallyAdjustedVehicle}
              onChange={handleSpeciallyAdjustedVehicle}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", bgcolor: palette.contrasts[3], height: "1px", marginY: getSizing(2) }}
      />

      <Typography variant="h5">
        Medicaid Billing Dates{" "}
        <Typography variant="body1" display={"inline"}>
          (Billing Override)
        </Typography>
      </Typography>
      <Typography variant="body1">
        Would you like to block billing for {props.editedStudent?.firstName}?
      </Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <Box>
          <FormControl>
            <RadioGroup
              aria-labelledby="BlockBilling"
              name="BlockBilling"
              value={blockBilling}
              onChange={handleBilling}
              sx={{ display: "flex", flexDirection: "row", gap: getSizing(2) }}
            >
              <FormControlLabel
                value="0"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">Yes</Typography>}
              />
              <FormControlLabel
                value="1"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">No</Typography>}
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={radioSize} />}
                label={<Typography variant="body2">None Selected</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Typography variant="body1">Start Medicaid Billing Date:</Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <XNGDatePicker
          title="Start Date"
          setValue={setBillStartValue}
          defaultValue={billStartValue || null}
          onChange={handleBillStartChange}
        />
      </Box>
      <Typography variant="body1">Stop Medicaid Billing Date</Typography>
      <Box
        sx={{
          display: "flex",
          columnGap: getSizing(3),
        }}
      >
        <XNGDatePicker
          title="End Date"
          setValue={setBillEndValue}
          defaultValue={billEndValue || null}
          onChange={handleBillEndChange}
        />
      </Box>
    </Box>
  );
}

function PrescribedServiceAreaItem(props: {
  prescribedServiceArea: PrescribedServiceArea;
  editedStudent: StudentResponse | null;
  editStudent: EditStudentFunctionType;
  itemKey: number;
  palette: XLogsPalette;
}) {
  const { prescribedServiceArea, editedStudent, editStudent, itemKey, palette } = props;
  const doesProviderHaveName =
    prescribedServiceArea.prescribingProvider &&
    prescribedServiceArea.prescribingProvider.firstName &&
    prescribedServiceArea.prescribingProvider.lastName
      ? true
      : false;

  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>(
    doesProviderHaveName
      ? prescribedServiceArea.prescribingProvider?.firstName! +
          " " +
          prescribedServiceArea.prescribingProvider?.lastName
      : "",
  );

  // const handleSelectedProvider = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setSelectedProvider(e.target.value);
  //   props.editStudent(`spedDossier.prescribedServiceAreas.${itemKey}.prescribingProvider`, selectedProvider);
  // }

  useEffect(() => {
    if (startValue !== null) {
      props.editStudent(
        `spedDossier.prescribedServiceAreas.${itemKey}.startDate`,
        dayjs(startValue).toDate(),
      );
    }
    if (endValue !== null) {
      props.editStudent(
        `spedDossier.prescribedServiceAreas.${itemKey}.endDate`,
        dayjs(endValue).toDate(),
      );
    }
  }, [startValue, endValue]);

  return (
    <Box sx={{ display: "flex", gap: getSizing(2), flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: getSizing(2) }}>
        <Typography variant="h6" sx={{ textDecoration: "underline" }}>
          {prescribedServiceArea.serviceArea?.name}
        </Typography>
        <XNGIconRenderer i={<XNGICONS.Files />} size={"md"} color={palette.primary[2]} />
      </Box>
      <Box sx={{ display: "flex", gap: getSizing(2) }}>
        <XNGDatePicker
          title="Start Date"
          setValue={setStartValue}
          defaultValue={
            editedStudent?.spedDossier?.prescribedServiceAreas?.[itemKey]?.startDate
              ? dayjs(editedStudent?.spedDossier?.prescribedServiceAreas?.[itemKey]?.startDate)
              : null
          }
        />
        <XNGDatePicker
          title="End Date"
          setValue={setEndValue}
          defaultValue={
            editedStudent?.spedDossier?.prescribedServiceAreas?.[itemKey]?.endDate
              ? dayjs(editedStudent?.spedDossier?.prescribedServiceAreas?.[itemKey]?.endDate)
              : null
          }
        />
      </Box>
      <Box sx={{ display: "flex", gap: getSizing(2), alignItems: "center" }}>
        <XNGInput
          size={CONST_LARGE}
          value={selectedProvider || "None Selected"}
          label="Prescribing Provider"
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              "-webkit-text-fill-color": "#212121 !important",
            },
            "& .MuiFormLabel-root.Mui-disabled": {
              color: "#212121",
            },
            "& .MuiInputBase-root.Mui-disabled": {
              "& > fieldset": {
                borderColor: "#212121",
                "-webkit-text-fill-color": "#212121 !important",
              },
            },
          }}
        />
        <Typography>NPI: {prescribedServiceArea.prescribingProvider?.npi}</Typography>
      </Box>
    </Box>
  );
}

export default Medicaid;

function useEligibilityDataOperations() {
  const { editedStudent, setEditedStudent } = useStudentProfileContext();

  const initializeEligibilityRecords = (draft: StudentResponse | null) => {
    if (!draft?.spedDossier?.eligibilityRecords) {
      if (!draft?.spedDossier) return;

      draft.spedDossier.eligibilityRecords = [{} as EligibilityRecord];
    }
  };

  const updateEligibilityStatus = (draft: StudentResponse | null, status: number) => {
    if (draft?.spedDossier?.eligibilityRecords) {
      draft.spedDossier.eligibilityRecords[0].status = status;
    }
  };

  function handleEligibility(e: any) {
    const statusValue = parseInt(e.target.value);
    if (isNaN(statusValue)) return;

    setEditedStudent((s) =>
      produce(s, (draft) => {
        if (draft?.spedDossier) {
          initializeEligibilityRecords(draft);
          updateEligibilityStatus(draft, statusValue);
        }
      }),
    );
  }

  useEffect(() => {
    const eligibilityRecords = editedStudent?.spedDossier?.eligibilityRecords;
    if (!eligibilityRecords) return;
    if (eligibilityRecords.length === 0) return;

    const currentStatus = eligibilityRecords[0].status;
    const isStatusInvalid = currentStatus !== 0 && currentStatus !== 1;

    if (isStatusInvalid) {
      setEditedStudent((s) =>
        produce(s, (draft) => {
          if (draft?.spedDossier?.eligibilityRecords) {
            draft.spedDossier.eligibilityRecords[0].startDate = dayjs().toDate();
          }
        }),
      );
    }
  }, [editedStudent?.spedDossier?.eligibilityRecords, setEditedStudent]);

  return { handleEligibility };
}
