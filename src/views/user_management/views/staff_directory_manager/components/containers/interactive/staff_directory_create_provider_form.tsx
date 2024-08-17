import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import XNGInput2 from "../../../../../../../design/low-level/input_2";
import XNGDropDown from "../../../../../../../design/low-level/dropdown2";
import XNGRadioGroup from "../../../../../../../design/low-level/radio_group";
import StaffDirectoryDialog from "../../presentational/wrappers/staff_directory_dialog";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GetDocTypesArrayOptions from "../../../../../../../data/get_doc_types_array_options";
import useApiQueryGetServiceProviderTypesByDate from "../../../../../../../api/hooks/state_snapshots/use_api_query_get_service_provider_types_by_date";
import useUserManagementCampusDropDownsOptions from "../../../../../hooks/helper/use_user_management_campus_drop_downs_options";
import React from "react";
import { getDocTypeEnumFromString } from "../../../../../../../utils/xlogs_doc_type_mapper";
import { UpdateServiceProviderRequest } from "../../../../../../../profile-sdk";
import FullPageLoadingScreen from "../../../../../../../design/high-level/common/full_page_loading_screen";
import useApiMutatePostServiceProviderByUserId from "../../../../../../../api/hooks/service_provider/use_api_mutate_post_service_provider_byUserId";
import useFeedbackModal from "../../../../../../../hooks/use_feedback_modal";

const schema = yup.object({
  firstName: yup.string().required("First Name is required").trim(),
  lastName: yup.string().required("Last Name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  xLogsStatus: yup.string().required("X logs Status is required"),
  documentationType: yup.string().required("Documentation Type is required"),
  serviceProviderType: yup
    .object({
      id: yup.string().notRequired(),
      name: yup.string().notRequired(),
      legacyId: yup.string().notRequired(),
      serviceArea: yup
        .object({
          id: yup.string().notRequired(),
          name: yup.string().notRequired(),
        })
        .notRequired()
        .optional(),
    })
    .test({
      name: "service-provider-has-id",
      message: "Service Provider Type is required",
      test: (value) => {
        return value?.id !== undefined;
      },
    }),
  primaryCampus: yup
    .object({
      id: yup.string().notRequired(),
      name: yup.string().notRequired(),
      startDate: yup.date().notRequired(),
      endDate: yup.date().notRequired(),
    })
    .test({
      name: "primary-campus-has-id",
      message: "Primary Campus is required",
      test: (value) => {
        return value?.id !== undefined;
      },
    }),
  employeeId: yup.string().required().trim(),
  isOnParticipationList: yup.boolean(),
});

type CreateProviderFormType = yup.InferType<typeof schema>;

type Props = {
  creating_user_id: string;
  isOpen: boolean;
  refetch_staff_directory?: () => void;
  onClose: () => void;
  state_in_us: string;
};

const StaffDirectoryCreateProviderForm = (props: Props) => {
  //#region API QUERIES
  const { data: service_provider_types_options_response } =
    useApiQueryGetServiceProviderTypesByDate({
      queryParams: {
        state: props.state_in_us,
      },
    });

  const { mutateAsync: mutate_post_service_provider, status: mutate_service_provider_status } =
    useApiMutatePostServiceProviderByUserId({
      queryParams: {
        creatingUserId: props.creating_user_id,
        state: props.state_in_us,
      },
      options: {
        onSuccess: () => {
          props.refetch_staff_directory?.();
        },
      },
    });
  const { campusDropdownOptions } = useUserManagementCampusDropDownsOptions(props.state_in_us);

  const form_loading = mutate_service_provider_status === "pending";
  //#endregion

  //#region REACT HOOKS
  const createAndAddAnother = React.useRef(false);

  const { onSuccessfulSave, onFailedSave } = useFeedbackModal();
  //#endregion

  //#region HOOKFORMSff
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    control,
    formState: { errors },
  } = useForm<CreateProviderFormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      documentationType: GetDocTypesArrayOptions()[0],
      isOnParticipationList: false,
    },
  });
  // console.log("serv", watch("serviceProviderType"))
  // console.log(errors);
  //#endregion

  //#region METHODS
  const onSubmit: SubmitHandler<CreateProviderFormType> = (data) => {
    onCreatedProvider(data);
    // reset();
  };

  const onCreatedProvider = async (data: CreateProviderFormType) => {
    const req: UpdateServiceProviderRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      // xLogsStatus: data.xLogsStatus,
      documentationType: getDocTypeEnumFromString(data.documentationType),
      serviceProviderType:
        (data.serviceProviderType as UpdateServiceProviderRequest["serviceProviderType"]) ||
        undefined,
      assignedSchoolCampuses:
        ([data.primaryCampus] as UpdateServiceProviderRequest["assignedSchoolCampuses"]) ||
        undefined,
      employeeId: data.employeeId,
      isOnParticipationList: data.isOnParticipationList,
      // isProviderOnParticipantList: data.isProviderOnParticipantList,
    };

    await mutate_post_service_provider(req);

    // console.log(data);
    // console.log("req", req  );

    if (!createAndAddAnother.current) {
      // console.log("create and add another")

      props.onClose();
    }

    resetField("firstName");
    resetField("lastName");
    resetField("email");
    resetField("employeeId");
  };

  //#endregion

  //#region SIDE-EFFECTS
  React.useEffect(() => {
    if (mutate_service_provider_status === "success") {
      // console.log("bando")
      // setValue("medicaidCredentials", medicaidCredentialsDefault);
      // setValue("providerRate", providerRateDefault);
      // console.log("medicaidCredentialsDefault", medicaidCredentialsDefault);
      // console.log("providerRateDefault", providerRateDefault);
      onSuccessfulSave("Service Provider created successfully");
    } else if (mutate_service_provider_status === "error") {
      onFailedSave("Failed to create Service Provider");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate_service_provider_status]);
  //#endregion

  //#region INPUT COMPONENTS
  const firstNameInput = (
    <XNGInput2
      type={"text"}
      label="First Name"
      id={"first-name-id"}
      fullWidth
      size="small"
      {...register("firstName")}
      useError={errors.firstName?.message}
    />
  );

  const lastNameInput = (
    <XNGInput2
      type={"text"}
      label="Last Name"
      id={"last-name-id"}
      fullWidth
      size="small"
      {...register("lastName")}
      useError={errors.lastName?.message}
    />
  );

  const emailInput = (
    <XNGInput2
      type={"email"}
      label="Email Address"
      id={"email-id"}
      fullWidth
      size="small"
      {...register("email")}
      useError={errors.email?.message}
    />
  );

  const xlogsStatusInput = (
    <Controller
      control={control}
      name="xLogsStatus"
      defaultValue="Active"
      render={({ field, fieldState: { error } }) => (
        <XNGDropDown
          ref={field.ref}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          id={"x-logs-status"}
          items={["Active", "Inactive"]}
          label={"X Logs Status"}
          fullWidth
          enableButtomMargin
          maxwidth="100%"
          size="small"
          useError={error?.message}
        />
      )}
    />
  );

  const documentationTypeInput = (
    <Controller
      control={control}
      name="documentationType"
      render={({ field, fieldState: { error } }) => (
        <XNGDropDown
          ref={field.ref}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          id={"document-type"}
          items={GetDocTypesArrayOptions()}
          label={"Documentation Type"}
          fullWidth
          enableButtomMargin
          maxwidth="100%"
          size="small"
          useError={error?.message}
        />
      )}
    />
  );

  const serviceProviderTypeInput = (
    <Controller
      name="serviceProviderType"
      control={control}
      render={({ field, fieldState: { error } }) => {
        // console.log("field", field);
        return (
          <XNGDropDown //mutation happens in both service provider and user profile
            id={"service-provider-type"}
            name={field.name}
            ref={field.ref}
            useTypedDropDown={{
              value: field.value,
              items: service_provider_types_options_response?.serviceProviderTypes || [],
              onChange: (value) => {
                setValue("serviceProviderType", value);
              },
              getRenderedValue: (value) => value?.name || "",
            }}
            onBlur={field.onBlur}
            label={"Service Provider Type"}
            fullWidth
            enableButtomMargin
            maxwidth="100%"
            size="small"
            useError={error?.message}
          />
        );
      }}
    />
  );

  const primaryCampusInput = (
    <Controller
      name="primaryCampus"
      control={control}
      render={({ field, fieldState: { error } }) => {
        // console.log("field", field);
        return (
          <XNGDropDown //mutation happens in both service provider and user profile
            id={"primary-campus"}
            name={field.name}
            ref={field.ref}
            useTypedDropDown={{
              value: field.value,
              items: campusDropdownOptions?.schoolCampuses || [],
              onChange: (value) => {
                setValue("primaryCampus", value);
              },
              getRenderedValue: (value) => value?.name || "",
            }}
            onBlur={field.onBlur}
            label={"Primary Campus"}
            fullWidth
            enableButtomMargin
            maxwidth="100%"
            size="small"
            useError={error?.message}
          />
        );
      }}
    />
  );

  const employeeIdInput = (
    <XNGInput2
      type={"text"}
      label="Employee ID"
      id={"employee-id"}
      fullWidth
      size="small"
      {...register("employeeId")}
      useError={errors.employeeId?.message}
    />
  );

  const participantListInput = (
    <Box>
      <Controller
        control={control}
        name="isOnParticipationList"
        render={({ field }) => (
          <XNGRadioGroup
            value={field.value ? "yes" : "no"}
            onChange={(e) => {
              field.onChange(e.target.value === "yes" ? true : false);
            }}
            options={["Yes", "No"]}
            values={["yes", "no"]}
            formLabel={"Is this provider on the Participant List?"}
            sx={{
              flexDirection: "row",
              px: 1,
            }}
            radioSx={{}}
          />
        )}
      />
    </Box>
  );

  //#endregion

  return (
    <>
      <StaffDirectoryDialog isOpen={props.isOpen} onClose={props.onClose} useCloseButton>
        <Typography component={"h3"} fontSize={"24px"} mb={1}>
          Create New Provider
        </Typography>
        <DialogContentText whiteSpace={"pre-wrap"}>
          Please fill out the information below to quickly add a new Provider. Then select that
          provider to fill in more information, if necessary.
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ px: 0 }}>
            {firstNameInput}
            {lastNameInput}
            {emailInput}
            {xlogsStatusInput}
            {documentationTypeInput}
            {serviceProviderTypeInput}
            {primaryCampusInput}
            {employeeIdInput}
            {participantListInput}
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: "1rem",
            }}
          >
            <Button
              type="submit"
              onClick={() => (createAndAddAnother.current = false)}
              sx={{
                width: {
                  width: "100%",
                  sm: "50%",
                },
              }}
            >
              Create Provider
            </Button>
            <Button
              type="submit"
              onClick={(e) => (createAndAddAnother.current = true)}
              sx={{
                width: {
                  width: "100%",
                  sm: "50%",
                  whiteSpace: "nowrap",
                },
              }}
            >
              Create and Add Another
            </Button>
          </DialogActions>
        </form>
      </StaffDirectoryDialog>
      {form_loading ? <FullPageLoadingScreen text={"Creating Service Provider"} /> : null}
    </>
  );
};

export default StaffDirectoryCreateProviderForm;
