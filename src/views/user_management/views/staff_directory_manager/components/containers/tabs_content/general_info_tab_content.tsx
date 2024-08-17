import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField } from "@mui/material";
import produce from "immer";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import useApiQueryGetServiceProviderTypesByDate from "../../../../../../../api/hooks/state_snapshots/use_api_query_get_service_provider_types_by_date";
import useApiMutatePatchUserById from "../../../../../../../api/hooks/user/use_api_mutate_patch_user_by_id";
import { XLogsRoleStrings } from "../../../../../../../context/types/xlogsrole";
import GetDocTypesArrayOptions from "../../../../../../../data/get_doc_types_array_options";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import {
  ConstructRoleAssignmentsFromXLogsRoleEnumOrString,
  GetXlogsRoleFromRoleAssignments,
  GetXlogsRoleOptions,
  GetXlogsRoleStringFromEnumOrAssignment,
} from "../../../../../../../utils/xlogs_role_mapper";
import XNGDropDown from "../../../../../../../design/low-level/dropdown2";
import XNGInput2 from "../../../../../../../design/low-level/input_2";
import QueryStatusModal from "../../../../../../../design/modal_templates/query_status_modal";
import {
  ClassType,
  ClientAssignment,
  DistrictRef,
  DocumentationType,
  EmployeeType,
  RoleAssignments,
  ServiceProviderResponse,
  UserResponse,
  XLogsRole,
  ClientAssignmentStatus,
} from "../../../../../../../profile-sdk";
import {
  getClassTypeEnumFromString,
  getClassTypeStringFromEnum,
} from "../../../../../../../utils/xlogs_class_type_mapper";
import {
  getDocTypeEnumFromString,
  getDocTypeStringFromEnum,
} from "../../../../../../../utils/xlogs_doc_type_mapper";
import {
  getEmployeeTypeEnumFromString,
  getEmployeeTypeStringFromEnum,
} from "../../../../../../../utils/xlogs_employee_type_mapper";
import useApiMutatePatchServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_mutate_patch_service_provider_by_id";
import {
  GeneralInfoTabFromInputType,
  generalInfoTabFormSchema,
} from "../../../data/general_info_tab_form_data";
import StaffDirectoryProfileTabToolbar from "../interactive/staff_directory_profile_tab_toolbar";
import useApiQueryServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_query_service_provider_by_id";
import useApiQueryUserByServiceProviderAndUserId from "../../../../../../../api/hooks/service_provider/use_api_query_user_by_service_provider_and_user_id";
import {
  getClientAssignmentStatusStringFromEnum,
  getClientAssignmentStatusEnumFromString,
} from "../../../../../../../utils/xlogs_client_assignment_status_mapper";
import { useNavigate } from "react-router";

type Props = {
  serviceProvider: ServiceProviderResponse;
  serivceProviderUserProfile: UserResponse;
  districtOptions: DistrictRef[];
  stateInUs: string;
  clientAssignment: ClientAssignment;
  refetchServiceProvider: ReturnType<typeof useApiQueryServiceProviderById>["refetch"];
  refetchUserProfile: ReturnType<typeof useApiQueryUserByServiceProviderAndUserId>["refetch"];
  client_id: string;
};

const GeneralInfoTabContent = (props: Props) => {
  // query provider types list for dropdown
  const { data: serviceProviderTypesOptionsResponse } = useApiQueryGetServiceProviderTypesByDate({
    queryParams: {
      state: props.stateInUs,
    },
  });

  const navigate = useNavigate();
  const [shouldDirectoryRefresh, setShouldDirectoryRefresh] = React.useState(false);

  const defaultClientAssignmentStatus = props.serviceProvider.clientAssignmentStatus
    ? getClientAssignmentStatusStringFromEnum(props.serviceProvider.clientAssignmentStatus)
    : undefined;

  const defaultRoleType = props.clientAssignment
    ? GetXlogsRoleStringFromEnumOrAssignment(
        GetXlogsRoleFromRoleAssignments({
          isApprover: props.clientAssignment?.isApprover,
          isAutonomous: props.clientAssignment?.isAutonomous,
          isDelegatedAdmin: props.clientAssignment?.isDelegatedAdmin,
          isExecutiveAdmin: props.clientAssignment?.isExecutiveAdmin,
          isProxyDataEntry: props.clientAssignment?.isProxyDataEntry,
        }),
      )
    : undefined;

  // mutate service provider
  const {
    mutate: mutateServiceProvider,
    status: mutateServiceProviderStatus,
    isPending: isMutateServiceProviderByPending,
    isError: isMutateServiceProviderError,
  } = useApiMutatePatchServiceProviderById({
    queryParams: {
      id: props.serviceProvider?.id || "",
      clientId: props.client_id,
      state: props.stateInUs,
    },
    options: {
      onMutate: () => {
        setShowMutationStatusModal(true);
      },
      onSuccess: () => {
        props.refetchServiceProvider();
      },
    },
  });

  // mutate user profile
  const {
    mutate: mutateUserProfile,
    status: mutateUserProfileStatus,
    isPending: isMutateUserProfilePending,
    isError: isMutateUserProfileError,
  } = useApiMutatePatchUserById({
    queryParams: {
      id: props.serivceProviderUserProfile?.id || "",
      state: props.stateInUs,
    },
    options: {
      onSuccess() {
        props.refetchUserProfile();
      },
    },
  });

  const apiRequestsIsPendingOrIsError =
    isMutateServiceProviderByPending ||
    isMutateUserProfilePending ||
    isMutateServiceProviderError ||
    isMutateUserProfileError;

  const [showMutationStatusModal, setShowMutationStatusModal] = React.useState(false);
  const mutationStatus =
    mutateServiceProviderStatus !== "idle" ? mutateServiceProviderStatus : mutateUserProfileStatus;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<GeneralInfoTabFromInputType>({
    resolver: yupResolver(generalInfoTabFormSchema),
    defaultValues: {
      firstName: props.serviceProvider?.firstName,
      lastName: props.serviceProvider?.lastName,
      middleName: props.serviceProvider?.middleName,
      loginEmailAddress: props.serviceProvider?.email,
      xlogsStatus: getClientAssignmentStatusStringFromEnum(
        props.serviceProvider?.clientAssignmentStatus as ClientAssignmentStatus,
      ),
      xlogsRoleType: defaultRoleType,
      serviceProviderType: props.serviceProvider?.serviceProviderType,
      docType: getDocTypeStringFromEnum(
        props.serviceProvider?.documentationType as DocumentationType,
      ),
      employeeType: getEmployeeTypeStringFromEnum(
        props.serviceProvider?.employeeType as EmployeeType,
      ),
      jobTitle: props.serviceProvider?.jobTitle,
      employeeId: props.serviceProvider?.employeeId,
      notificationEmailAddress: props.serviceProvider?.notificationEmail,
      rmtsEmailAddress: props.serviceProvider?.rtmsEmail,
      phoneNumber: props.serviceProvider?.phoneNumber,
      classType: getClassTypeStringFromEnum(props.serviceProvider?.classType as ClassType),
    },
  });

  //for required professional oversight dropdown, not needed in the form or as a part of form validation
  const [requiredProfessionalOversight, setRequiredProfessionalOversight] = React.useState<
    "Yes" | "No"
  >(
    getValues("xlogsRoleType") === GetXlogsRoleStringFromEnumOrAssignment(XLogsRole.NUMBER_5)
      ? "Yes"
      : "No",
  );

  // watching xlogsRoleType input for updating required professional oversight dropdown
  const xlogsRoleType = watch("xlogsRoleType");

  //#region METHODS
  // submit Form handler
  const onSubmit: SubmitHandler<GeneralInfoTabFromInputType> = (data) => {
    onSaveGeneralInfo(data);
  };

  // this is used to handle hook forms incompatible types with service provider data model
  const constructServiceProviderType = (
    serviceProviderType: GeneralInfoTabFromInputType["serviceProviderType"],
  ) => {
    return {
      id: serviceProviderType?.id ?? undefined,
      name: serviceProviderType?.name ?? undefined,
      legacyId: serviceProviderType?.legacyId ?? undefined,
      serviceArea: {
        id: serviceProviderType?.serviceArea?.id ?? undefined,
        name: serviceProviderType?.serviceArea?.name ?? undefined,
      },
    };
  };

  // where we perform the mutation
  const onSaveGeneralInfo: SubmitHandler<GeneralInfoTabFromInputType> = async (data) => {
    // service provider request body
    const serviceProviderRequestBody = produce(props.serviceProvider, (draft) => {
      draft.firstName = data.firstName;
      draft.middleName = data.middleName ?? undefined;
      draft.lastName = data.lastName;
      draft.email = data.loginEmailAddress;
      draft.rtmsEmail = data.rmtsEmailAddress ?? undefined;
      draft.notificationEmail = data.notificationEmailAddress ?? undefined;
      draft.employeeId = data.employeeId ?? undefined;
      draft.phoneNumber = data.phoneNumber ?? undefined;
      draft.serviceProviderType = constructServiceProviderType(data.serviceProviderType);
      draft.documentationType = getDocTypeEnumFromString(data.docType || ""); //remap
      draft.classType = getClassTypeEnumFromString(data.classType || ""); //remap
      draft.jobTitle = data.jobTitle ?? undefined;
      draft.employeeType = getEmployeeTypeEnumFromString(data.employeeType || ""); //remap
      draft.clientAssignmentStatus = getClientAssignmentStatusEnumFromString(
        data.xlogsStatus || "",
      );
    });

    const getRoleAssignmentsAccessProperty = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(
      data.xlogsRoleType as XLogsRoleStrings,
    );

    const constructRoleAssignments: RoleAssignments = {
      isApprover: getRoleAssignmentsAccessProperty?.isApprover ?? false,
      isAutonomous: getRoleAssignmentsAccessProperty?.isAutonomous ?? false,
      isDelegatedAdmin: getRoleAssignmentsAccessProperty?.isDelegatedAdmin ?? false,
      isExecutiveAdmin: getRoleAssignmentsAccessProperty?.isExecutiveAdmin ?? false,
      isProxyDataEntry: getRoleAssignmentsAccessProperty?.isProxyDataEntry ?? false,
    };

    // spread the client assignments array and update the client assignment that matches the client id
    //and find the client assignment that matches the client id and update it
    const clientAssignmentsPatch = [
      ...(props.serivceProviderUserProfile?.clientAssignments || []),
    ]?.map((clientAssignment) => {
      if (clientAssignment.client?.id === props.clientAssignment?.client?.id) {
        const assignment = { ...clientAssignment };
        const updatedAssignment = { ...assignment, ...constructRoleAssignments };
        return updatedAssignment;
      } else {
        return clientAssignment;
      }
    });

    // user profile request body
    const patchUserRequestBody = produce(props.serivceProviderUserProfile, (draft) => {
      draft.firstName = data.firstName;
      draft.lastName = data.lastName;
      draft.emailAddress = data.loginEmailAddress;
      draft.clientAssignments = clientAssignmentsPatch;
      draft.serviceProviderType = constructServiceProviderType(data.serviceProviderType);
    });

    mutateServiceProvider(serviceProviderRequestBody);
    mutateUserProfile(patchUserRequestBody);
    if (
      props.serviceProvider.clientAssignmentStatus !==
      serviceProviderRequestBody.clientAssignmentStatus
    ) {
      setShouldDirectoryRefresh(true);
    }
  };
  //#endregion

  //#region USE EFFECTS
  // strictly for re rendering the component when the default role type changes for populating our the required professional oversight dropdown
  React.useEffect(() => {
    if (xlogsRoleType === GetXlogsRoleStringFromEnumOrAssignment(XLogsRole.NUMBER_5)) {
      setRequiredProfessionalOversight("Yes");
    } else {
      setRequiredProfessionalOversight("No");
    }
  }, [xlogsRoleType]);

  //#endregion

  //#region SECTIONS
  const demographicsSection = (
    <GridSectionLayout
      headerConfig={{
        title: "Demographics",
      }}
      divider
      rows={[
        {
          cells: [
            <XNGInput2
              type={"text"}
              label="First Name"
              id={"first-name-id"}
              {...register("firstName")}
              useError={errors?.firstName?.message}
              fullWidth
            />,
            <XNGInput2
              type={"text"}
              label="Middle Name"
              id={"middle-name-id"}
              {...register("middleName")}
              fullWidth
            />,
            <XNGInput2
              type={"text"}
              label="Last Name"
              id={"last-name-id"}
              {...register("lastName")}
              useError={errors?.lastName?.message}
              fullWidth
            />,
          ],
        },
        {
          cells: [
            <XNGInput2
              type={"email"}
              label="Login Email Address"
              id={"login-email-id"}
              {...register("loginEmailAddress")}
              useError={errors?.loginEmailAddress?.message}
              fullWidth
            />,
            props.stateInUs === "TX" ? (
              <XNGInput2
                type={"email"}
                label="RMTS Email Address"
                id={"rmts-email-id"}
                fullWidth
                {...register("rmtsEmailAddress")}
              />
            ) : undefined,
            <XNGInput2
              type={"email"}
              label="Email/Notification Email Address"
              id={"email-notification-id"}
              {...register("notificationEmailAddress")}
              fullWidth
            />,
          ],
        },
        {
          cells: [
            <XNGInput2
              type={"string"}
              label="Employee ID"
              id={"emloyee-id-id"}
              fullWidth
              {...register("employeeId")}
            />,
            <Controller
              name={"phoneNumber"}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PatternFormat
                  value={field.value}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  label="Phone Number"
                  format="+1 (###) ###-####"
                  mask="_"
                  customInput={TextField}
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  size="medium"
                />
              )}
            />,
          ],
        },
      ]}
    />
  );

  const statusSection = (
    <GridSectionLayout
      headerConfig={{
        title: "Status",
      }}
      divider
      rows={[
        {
          cells: [
            <Controller
              name="xlogsStatus"
              control={control}
              render={({ field }) => (
                <XNGDropDown
                  id={"x-logs-status"}
                  items={["Active", "Inactive"]}
                  label={"X Logs Status"}
                  ref={field.ref}
                  defaultValue={defaultClientAssignmentStatus}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  value={field.value}
                  fullWidth
                  enableButtomMargin
                  maxwidth="100%"
                />
              )}
            />,
            <Controller
              name="serviceProviderType"
              control={control}
              render={({ field }) => {
                return (
                  <XNGDropDown //mutation happens in both service provider and user profile
                    id={"service-provider-type"}
                    name={field.name}
                    ref={field.ref}
                    useTypedDropDown={{
                      value: field.value,
                      items: serviceProviderTypesOptionsResponse?.serviceProviderTypes || [],
                      onChange: (value) => {
                        // console.log(value);

                        setValue("serviceProviderType", value);
                      },

                      getRenderedValue: (value) => value?.name || "",
                    }}
                    onBlur={field.onBlur}
                    label={"Service Provider Type"}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                  />
                );
              }}
            />,
            <Controller
              name="xlogsRoleType"
              control={control}
              render={({ field }) => (
                <XNGDropDown
                  id={"x-logs-role-type"}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                  items={GetXlogsRoleOptions()}
                  label={"X Logs Role Type"}
                  fullWidth
                  enableButtomMargin
                  maxwidth="100%"
                />
              )}
            />,
            <XNGDropDown
              id={"requires-professional-oversight"}
              items={["Yes", "No"]}
              value={requiredProfessionalOversight}
              onChange={(e) => {
                if (e.target.value === "Yes") {
                  setRequiredProfessionalOversight("Yes");
                  setValue(
                    "xlogsRoleType",
                    GetXlogsRoleStringFromEnumOrAssignment(XLogsRole.NUMBER_5),
                  );
                } else {
                  setRequiredProfessionalOversight("No");
                  setValue(
                    "xlogsRoleType",
                    GetXlogsRoleStringFromEnumOrAssignment(XLogsRole.NUMBER_0),
                  );
                }
              }}
              label={"Requires Professional Oversight"}
              fullWidth
              enableButtomMargin
              maxwidth="100%"
            />,
          ],
        },
      ]}
    />
  );

  const employeeInfoSection = (
    <GridSectionLayout
      headerConfig={{
        title: "Employee Info",
      }}
      bottomMargin={"10rem"}
      rows={[
        {
          cells: [
            <Controller
              name={"docType"}
              control={control}
              render={({ field }) => {
                return (
                  <XNGDropDown
                    id={"documentation-type"}
                    label={"Documentation Type"}
                    value={field.value}
                    items={GetDocTypesArrayOptions()}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    name={field.name}
                    ref={field.ref}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                  />
                );
              }}
            />,
            <Controller
              name="classType"
              control={control}
              render={({ field }) => {
                return (
                  <XNGDropDown
                    id={"class-type"}
                    label={"Class Type"}
                    value={field.value || "Life Skills"}
                    items={["Life Skills"]}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    name={field.name}
                    ref={field.ref}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                  />
                );
              }}
            />,
            <XNGInput2
              type={"text"}
              label="Job Title"
              id={"job-title"}
              {...register("jobTitle")}
              useError={errors?.jobTitle?.message}
              fullWidth
            />,
            <Controller
              control={control}
              name="employeeType"
              render={({ field }) => {
                return (
                  <XNGDropDown
                    id={"employee-type"}
                    items={["Full Time", "Part Time", "Contract", "Out of District Employee"]}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    name={field.name}
                    ref={field.ref}
                    label={"Employee Type"}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                  />
                );
              }}
            />,
          ],
        },
      ]}
    />
  );

  //#endregion

  return (
    <>
      <Box
        sx={{
          opacity: apiRequestsIsPendingOrIsError ? 0.6 : 1,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <StaffDirectoryProfileTabToolbar />
          {demographicsSection} {statusSection} {employeeInfoSection}
        </form>
      </Box>
      <>
        <QueryStatusModal
          isOpen={showMutationStatusModal}
          status={mutationStatus}
          content={{
            pendingTitle: "Saving General Information",
            successTitle: "Thank You!",
            errorTitle: "Error",
            errorBody: "Failed to save General Information. Please refresh window and try again.",
            successBody: "General Information Saved Successfully",
          }}
          onSettledClose={() => {
            setShowMutationStatusModal(false);
            if (shouldDirectoryRefresh) {
              navigate(0);
            }
          }}
        />
      </>
    </>
  );
};

export default GeneralInfoTabContent;
