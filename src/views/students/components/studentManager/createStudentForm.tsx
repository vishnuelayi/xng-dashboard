import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { useMemo } from "react";
import genderOptions from "../../../../data/genderOptionsData";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useXNGSelector } from "../../../../context/store";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import { useSchoolCampusesDropDownDisplays } from "../../../../api/hooks/useSchoolCampusesDropDownDisplays";
import { useForm, Controller } from "react-hook-form";
import { object, string, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import XNGClose from "../../../../design/low-level/button_close";

// Enum: Iep = 0, Referral = 1, _504 = 2, RtiMtss = 3, Ell = 4, Other = 5
type Props = {
  open: boolean;
  handleClose: () => void;
  createStudent: Function;
};
const plansOfCareMap = {
  0: { name: "IEP", type: 0 },
  1: { name: "Referral", type: 1 },
  2: { name: "504", type: 2 },
  3: { name: "RTI", type: 3 },
  4: { name: "ELL", type: 4 },
  5: { name: "Other", type: 5 },
};

type FormInputs = {
  firstName: string;
  lastName: string;
  dob: Date | null;
  gender: string;
  studentID: string;
  district: string;
  campus: string;
  plansOfCare: { [key: string]: { checked: boolean; type: number } };
};

const CreateStudentForm = (props: Props) => {
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const authorizedDistricts = userClientAssignment.authorizedDistricts;
  const state = useXNGSelector(selectStateInUS);

  const plans = useMemo(() => Object.values(plansOfCareMap), []);

  let formSchema = object().shape({
    firstName: string().trim().required("First Name is a required field"),
    lastName: string().trim().required("Last Name is a required field"),
    dob: date()
      .required("Date of birth is a required field")
      .max(new Date(), "Date of birth must be earlier than today"),
    gender: string().trim().required(),
    studentID: string()
      .trim()
      .required("Student ID is a required field")
      .matches(/^[0-9a-z]+$/i, "Student ID can only consist of numbers or letters"),
    district: string().required(),
    campus: string().required(),
    plansOfCare: object(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: null,
      gender: "",
      studentID: "",
      district:
        authorizedDistricts && authorizedDistricts?.length === 1 ? authorizedDistricts[0].name : "",
      campus: "",
      plansOfCare: {},
    },
  }); //TODO: Use form line

  const createAndAddStudent = (toCaseLoad: boolean) => (data: FormInputs) => {
    const plansOfCareArray: number[] = [];

    Object.values(data.plansOfCare).forEach((poc) => {
      if (poc.checked) {
        plansOfCareArray.push(poc.type);
      }
    });

    const body = {
      client: userClientAssignment.client,
      schoolCampuses: [campusOptions?.find((campus) => campus.name === data.campus)],
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dob,
      gender: genderOptions.indexOf(data.gender),
      districtProvidingServicesRecords: [
        {
          district: authorizedDistricts?.find((district) => district.name === data.district),
        },
      ],
      studentIdGivenByState: data.studentID,
      studentIdGivenBySchoolDistrict: data.studentID,
      spedDossier: {
        plansOfCare: plansOfCareArray.map((poc) => ({ type: poc })),
      },
    };

    props.handleClose();
    props.createStudent(body, toCaseLoad);
  };

  const district = watch("district");
  const districtRef = authorizedDistricts?.find((d) => d.name === district);

  const { data: campusOptions, error } = useSchoolCampusesDropDownDisplays(districtRef, state);
  const inputProps_sx = { mb: "20px", width: "100%" };
  const inputProps = { required: true };

  if (error?.message) console.log("PROBLEM FETCHING CAMPUSES:", error.message);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "458px",
          },
        },
      }}
    >
      <DialogTitle component={"div"} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component={"h2"}>
          Create Student
        </Typography>
        <XNGClose onClick={() => props.handleClose()} />
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" mb={"2rem"} fontSize={"1.1rem"}>
          Please fill out the information below to quickly add a new student.
        </Typography>
        <TextField
          id="cs-first-name"
          label="First Name"
          variant="outlined"
          sx={{ ...inputProps_sx }}
          {...inputProps}
          {...register("firstName")}
          helperText={
            <FormHelperText sx={{ marginInline: 0 }} error={!!errors?.firstName}>
              {errors?.firstName?.message}
            </FormHelperText>
          }
        />
        <TextField
          id="cs-last-name"
          label="Last Name"
          variant="outlined"
          sx={{ ...inputProps_sx }}
          {...inputProps}
          {...register("lastName")}
          helperText={
            <FormHelperText sx={{ marginInline: 0 }} error={!!errors?.lastName}>
              {errors?.lastName?.message}
            </FormHelperText>
          }
        />
        <Controller
          name="dob"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date of Birth"
              value={field.value}
              sx={{ ...inputProps_sx }}
              {...inputProps}
              slotProps={{
                textField: {
                  helperText: (
                    <FormHelperText sx={{ marginInline: 0 }} error={!!errors.dob}>
                      {errors.dob?.message}
                    </FormHelperText>
                  ),
                },
              }}
              onChange={(d) => {
                field.onChange(d);
              }}
            />
          )}
        />
        <FormControl sx={{ ...inputProps_sx }}>
          <InputLabel id="cs-gender-select-label">Gender</InputLabel>
          <Select
            labelId="cs-label-gender"
            id="cs-gender"
            label="Gender"
            {...inputProps}
            {...register("gender")}
          >
            {genderOptions.map((g, i) => (
              <MenuItem key={i} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText
            error={!!errors.gender}
            sx={{ "&:first-letter": { textTransform: "capitalize" } }}
          >
            {errors.gender?.message}
          </FormHelperText>
        </FormControl>
        <TextField
          id="cs-student-id"
          label="Student ID"
          variant="outlined"
          sx={{ ...inputProps_sx }}
          {...inputProps}
          {...register("studentID")}
          helperText={
            <FormHelperText sx={{ marginInline: 0 }} error={!!errors.studentID}>
              {errors.studentID?.message}
            </FormHelperText>
          }
        />
        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <FormControl sx={{ ...inputProps_sx }}>
              <InputLabel id="cs-district-select-label">District</InputLabel>
              <Select
                labelId="cs-label-district"
                id="cs-district"
                value={
                  authorizedDistricts && authorizedDistricts?.length === 1
                    ? authorizedDistricts[0].name
                    : field.value
                }
                label="District"
                {...inputProps}
                onChange={(e) => {
                  field.onChange(e);
                }}
                disabled={authorizedDistricts && authorizedDistricts?.length <= 1}
              >
                {authorizedDistricts?.map((d, i) => (
                  <MenuItem key={i} value={d.name}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText
                error={!!errors.district}
                sx={{ "&:first-letter": { textTransform: "capitalize" } }}
              >
                {errors.district?.message}
              </FormHelperText>
            </FormControl>
          )}
        />

        <FormControl sx={{ ...inputProps_sx }}>
          <InputLabel id="cs-campus-select-label">Campus</InputLabel>
          <Select
            labelId="cs-label-campus"
            id="cs-campus"
            label="Campus"
            {...inputProps}
            {...register("campus")}
            {...(campusOptions ? { disabled: false } : { disabled: true })}
          >
            {campusOptions?.map((c, i) => (
              <MenuItem key={i} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText
            sx={{ "&:first-letter": { textTransform: "capitalize" } }}
            error={!!errors.campus}
          >
            {errors.campus?.message}
          </FormHelperText>
        </FormControl>

        <Typography variant="body1" sx={{ ...inputProps_sx, mb: "5px" }}>
          Plan Of Care?{" "}
          <Typography fontSize={"0.65rem"} component={"span"} sx={{ color: "#757575" }}>
            (Select all that apply)
          </Typography>
        </Typography>
        <FormGroup sx={{ ...inputProps_sx, flexDirection: "row", flexWrap: "wrap" }}>
          <Controller
            name="plansOfCare"
            control={control}
            render={({ field }) => (
              <>
                {plans.map((plan, i) => (
                  <FormControlLabel
                    key={i}
                    control={
                      <Checkbox
                        sx={{ borderWidth: "1px" }}
                        checked={field.value[plan.name]?.checked || false}
                        onChange={(e) => {
                          const fieldRef = { ...field.value };
                          if (fieldRef[plan.name]) {
                            fieldRef[plan.name].checked = e.target.checked;
                          } else {
                            fieldRef[plan.name] = {
                              checked: e.target.checked,
                              type: plan.type,
                            };
                          }

                          field.onChange(fieldRef);
                        }}
                      />
                    }
                    label={plan.name}
                  />
                ))}
              </>
            )}
          />
        </FormGroup>
        <DialogActions>
          <Box
            sx={{
              ...inputProps_sx,
              alignItems: "stretch",
              display: "flex",
              flexDirection: { flexDirection: "column", sm: "row" },
              gap: "1rem",
            }}
          >
            <Box flexGrow={"1"} sx={{ width: "100%" }}>
              <Button
                onClick={props.handleClose}
                variant="outlined"
                size="small"
                sx={{ "&": { border: "1.5px solid", whiteSpace: "nowrap" } }}
                fullWidth
              >
                Back to Search
              </Button>
            </Box>
            <Box sx={{ width: "100%" }} gap={"1rem"} display={"flex"} flexDirection={"column"}>
              <Button
                onClick={() => {
                  console.log("call handle submit");
                  handleSubmit(createAndAddStudent(false))();
                }}
                variant="contained"
                size="small"
                fullWidth
                sx={{ boxSizing: "border-box" }}
              >
                Create Student
              </Button>
              <Button
                onClick={() => handleSubmit(createAndAddStudent(true))()}
                variant="contained"
                size="small"
                fullWidth
                sx={{ boxSizing: "border-box" }}
              >
                Create & Add to Caseload
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentForm;
