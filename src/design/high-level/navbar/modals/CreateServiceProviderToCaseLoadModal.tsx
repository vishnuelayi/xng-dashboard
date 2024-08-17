import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useXNGDispatch, useXNGSelector } from "../../../../context/store";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { object, string, number, date, InferType, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import XNGClose from "../../../low-level/button_close";
import { API_STATESNAPSHOTS, API_USERS } from "../../../../api/api";
import {
  CreateUnregisteredProviderRequest,
  ServiceProviderRef,
  ServiceProviderType,
  ServiceProviderTypesResponse,
  StateSnapshotsApi,
} from "../../../../profile-sdk";
import dayjs from "dayjs";
import { KeyboardEventHandler, useEffect, useState } from "react";
import { thankYouModalActions } from "../../../../context/slices/thankYouModalSlice";

type Props = {
  open: boolean;
  handleClose: () => void;
  dataTrue: boolean;
  addProviderToApproverCaseload: Function;
  addProviderToProxyCaseload: Function;
};

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  ServiceProviderType: string;
};

export const CreateNewProvider = (props: Props) => {
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const authorizedDistricts = userClientAssignment.authorizedDistricts;
  const state = useXNGSelector(selectStateInUS);
  const [serviceProviderTypeOptions, setServiceProviderTypeOptions] =
    useState<ServiceProviderTypesResponse>();

  let formSchema = object().shape({
    firstName: string().trim().required("First Name is a required field"),
    lastName: string().trim().required("Last Name is a required field"),
    email: string().trim().required("Email is a required field"),
    ServiceProviderType: string().trim().required("This is a required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      ServiceProviderType: "",
    },
  });

  const dispach = useXNGDispatch();

  async function getProviderTypes() {
    const typesResponse = await API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet(
      state,
      dayjs().toDate(),
    );
    setServiceProviderTypeOptions(typesResponse);
  }

  const addUnregisteredProvider = () => async (data: FormInputs) => {
    let typeToAdd = serviceProviderTypeOptions?.serviceProviderTypes?.find(
      (ele) => ele.name === data.ServiceProviderType,
    );
    let body = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      client: { id: userClientAssignment.client?.id, name: userClientAssignment.client?.name },
      serviceProviderType: typeToAdd,
    } as CreateUnregisteredProviderRequest;
    const addResponse = await API_USERS.v1UsersUnregisteredProviderPost(state, body);
    if (props.dataTrue) {
      props.addProviderToProxyCaseload(addResponse.serviceProvider);
    } else {
      props.addProviderToApproverCaseload(addResponse.serviceProvider);
    }
    props.handleClose();
  };

  const inputProps_sx = { mt: "10px", mb: "10px", width: "100%" };
  const inputProps = { required: true };

  useEffect(() => {
    getProviderTypes();
  }, []);
  if (serviceProviderTypeOptions === undefined) {
    return <></>;
  }
  return (
    <Dialog
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.stopPropagation();
        }
      }}
      open={props.open}
      // onClose={props.handleClose}
    >
      <DialogTitle component={"div"}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" component={"h2"}>
            Create New User
          </Typography>
          <XNGClose onClick={() => props.handleClose()} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          id="cs-first-name"
          label="First Name"
          variant="outlined"
          sx={{ ...inputProps_sx }}
          {...inputProps}
          {...register("firstName")}
          // error={!!errors?.firstName}
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
          // error={!!errors?.lastName}
          helperText={
            <FormHelperText sx={{ marginInline: 0 }} error={!!errors?.lastName}>
              {errors?.lastName?.message}
            </FormHelperText>
          }
        />
        <TextField
          id="cs-email"
          label="Email"
          variant="outlined"
          sx={{ ...inputProps_sx }}
          {...inputProps}
          {...register("email")}
          // error={!!errors?.lastName}
          helperText={
            <FormHelperText sx={{ marginInline: 0 }} error={!!errors?.email}>
              {errors?.email?.message}
            </FormHelperText>
          }
        />
        <FormControl sx={{ ...inputProps_sx }}>
          <InputLabel id="cs-provider-select-label">Service Provider Type</InputLabel>
          <Select
            labelId="cs-label-service-provider"
            id="cs-service-provider"
            // value={gender}
            label="Service Provider Type"
            // onChange={(e) => setGender(e.target.value)}
            {...inputProps}
            {...register("ServiceProviderType")}
            // error={!!errors.gender}
          >
            {serviceProviderTypeOptions!.serviceProviderTypes!.map(
              (g: ServiceProviderType, i: number) => (
                <MenuItem key={i} value={g.name}>
                  {g.name}
                </MenuItem>
              ),
            )}
          </Select>
          <FormHelperText sx={{ marginInline: 2 }} error={!!errors?.ServiceProviderType}>
            {errors?.ServiceProviderType?.message}
          </FormHelperText>
        </FormControl>
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
            <Box sx={{ width: "100%" }} gap={"1rem"} display={"flex"} flexDirection={"column"}>
              <Button
                onClick={() => {
                  handleSubmit(addUnregisteredProvider())();
                }}
                variant="contained"
                size="small"
                fullWidth
                sx={{ boxSizing: "border-box" }}
              >
                Create New
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
