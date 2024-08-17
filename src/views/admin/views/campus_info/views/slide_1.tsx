import { XNGBack } from "../../../../../design";
import { useContext, useState, useRef, useEffect } from "react";
import { CampusInformationContext } from "../campus_info";
import { useForm, Controller, Control } from "react-hook-form";
import { Box, TextField, Grid, Button, Typography, Stack } from "@mui/material";
import {
  CampusInformationSlide1Screen,
  CampusEditScreenParameters,
  CampusInformationEditScreen,
} from "../types/types";
import ShowHideBox from "../../../../../design/components-dev/show_hide_box";
import { yupResolver } from "@hookform/resolvers/yup";
import { PatternFormat } from "react-number-format";
import { API_DISTRICTS } from "../../../../../api/api";
import { CampusFormValues, useFormToDomain } from "../temp/form_to_domain";
import { AddSchoolCampusRequest, UpdateSchoolCampusRequest } from "../../../../../profile-sdk";
import { useXNGSelector } from "../../../../../context/store";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import LoadingOverlayLayout from "../../../../../design/low-level/transparent_loading_overlay";
import { useValidationSchema } from "../hooks/use_validation_schema";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";

const FORM_GAP_REM = "1rem";

export function CampusInformationSlide1(props: { screen: CampusInformationSlide1Screen }) {
  // Dependency References
  const { screen } = props;
  const { district } = useContext(CampusInformationContext);
  const stateInUS = useXNGSelector(selectStateInUS);
  const buildCampus = useFormToDomain();

  // Local Callbacks
  async function handleAddSubmit(formData: CampusFormValues) {
    await handlePatchRequest();

    async function handlePatchRequest() {
      const campus = buildCampus(formData);
      const req: AddSchoolCampusRequest = { campus };
      if (!district?.id) return;
      await API_DISTRICTS.v1DistrictsDistrictIdCampusesAddPatch(district.id, stateInUS, req);
    }
  }

  async function handleEditSubmit(formData: CampusFormValues) {
    await handlePatchRequest();

    async function handlePatchRequest() {
      const campus = buildCampus(formData);
      const req: UpdateSchoolCampusRequest = { campus };
      if (!district?.id) return;
      const campusID = props.screen.id === "edit" ? props.screen.params.campusID : null;
      if (!campusID) throw new Error(placeholderForFutureLogErrorText);

      await API_DISTRICTS.v1DistrictsDistrictIdCampusesUpdatePatch(
        district.id,
        campusID,
        stateInUS,
        req,
      );
    }
  }

  return (
    <Box>
      <ShowHideBox
        if={screen.id === "add"}
        show={
          <CampusForm
            submitText="Add"
            onSubmitAsync={(fd) => handleAddSubmit(fd)}
            title="Add Campus"
            validationMode="add"
          />
        }
      />
      <ShowHideBox
        if={screen.id === "edit"}
        show={
          <CampusForm
            submitText="Save"
            onSubmitAsync={handleEditSubmit}
            title="Edit Campus"
            useEditScreenParameters={(props.screen as CampusInformationEditScreen).params}
            validationMode="edit"
          />
        }
      />
    </Box>
  );
}

function CampusForm(props: {
  title: string;
  onSubmitAsync: (fd: CampusFormValues) => Promise<void>;
  submitText: string;
  useEditScreenParameters?: CampusEditScreenParameters;
  validationMode: "add" | "edit";
}) {
  // Dependency References
  const { setSelectedSlide, table, district } = useContext(CampusInformationContext);
  const stateInUS = useXNGSelector(selectStateInUS);
  const { validationMode } = props;

  // Local hook usages
  const [isLoadingOverlayOpen, setIsLoadingOverlayOpen] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // RHF

  const validationSchema = useValidationSchema({
    validationMode,
    dependencies: { table },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<CampusFormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: props.useEditScreenParameters?.defaultFormValues ?? undefined,
  });

  useEffect(() => {
    const defaultValues = props.useEditScreenParameters?.defaultFormValues;
    if (!defaultValues) return;

    resetForm(defaultValues);
  }, [props.useEditScreenParameters?.defaultFormValues]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [errors]);

  // Local Callbacks
  async function onSubmit(fd: CampusFormValues) {
    scrollRef.current?.scrollTo({ top: 0 });

    setIsLoadingOverlayOpen(true);
    await props.onSubmitAsync(fd);
    setIsLoadingOverlayOpen(false);

    resetUI();

    function resetUI() {
      resetForm();
      setSelectedSlide(0);
      table!.refetch();
    }
  }
  function handleBack() {
    setSelectedSlide(0);
  }

  return (
    <LoadingOverlayLayout isOpen={isLoadingOverlayOpen}>
      <XNGBack onClick={() => handleBack()} />

      <Typography mt="1rem" variant="h6">
        {props.title}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        ref={scrollRef}
        sx={{
          width: "100%",
          overflowY: "auto",
          maxHeight: "calc(100vh - 25rem)",
          p: "1rem",
          pt: "2rem",
          scrollBehavior: "smooth",
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          sx={{
            width: "30rem",
            display: "flex",
            flexDirection: "column",
            gap: FORM_GAP_REM,
          }}
        >
          <Box>
            <Subheader>Campus Name</Subheader>
            <ValidatedFormInputField
              control={control}
              name="campusName"
              label="Campus Name"
              placeholder="Enter Campus Name"
            />
          </Box>
          <Grid item spacing={2}>
            <Subheader>State ID</Subheader>
            <ValidatedFormInputField
              control={control}
              name="stateId"
              label="State ID"
              placeholder="Enter State ID"
            />
          </Grid>
          <Box>
            <Subheader>Address</Subheader>
            <ValidatedFormInputField
              control={control}
              name="address1"
              label="Address 1"
              placeholder="Address 1"
            />
          </Box>
          <ValidatedFormInputField
            control={control}
            name="address2"
            label="Address 2"
            placeholder="Address 2"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ValidatedFormInputField
                control={control}
                name="city"
                label="City"
                placeholder="City"
              />
            </Grid>
            <Grid item xs={6}>
              <ValidatedFormInputField
                control={control}
                name="zipCode"
                label="Zip Code"
                placeholder="12345"
              />
            </Grid>
          </Grid>
          <Box>
            <Subheader>Contact Role</Subheader>
            <ValidatedFormInputField
              control={control}
              name="contactRole"
              label="Contact Role"
              placeholder="Enter Role"
            />
          </Box>
          <Grid item spacing={2}>
            <Subheader>Phone</Subheader>
            <Controller
              name={"phone"}
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <PatternFormat
                  {...field}
                  format="+1 (###) ###-####"
                  allowEmptyFormatting
                  mask="_"
                  customInput={TextField}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  size="small"
                />
              )}
            />
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: FORM_GAP_REM }}>
            <Button variant="outlined" onClick={() => handleBack()}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {props.submitText}
            </Button>
          </Box>
        </Box>
      </Box>
    </LoadingOverlayLayout>
  );
}

function Subheader(props: { children: React.ReactNode }) {
  return (
    <Typography
      className="noselect"
      variant="body1"
      sx={{ fontWeight: "bold", color: "#444", mb: "1rem" }}
    >
      {props.children}
    </Typography>
  );
}

function ValidatedFormInputField(props: {
  control: Control<CampusFormValues, any>;
  name: keyof CampusFormValues;
  label: string;
  placeholder: string;
}) {
  const { control, name, label, placeholder } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          size="small"
          {...field}
          label={label}
          placeholder={placeholder}
          fullWidth
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  );
}
