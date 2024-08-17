import { Box, Button } from "@mui/material";
import React from "react";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import XNGDropDown from "../../../../../../../design/low-level/dropdown2";
import { XNGDateField } from "../../../../../../unposted_sessions/components/common/date_field";
import XNGRadioGroup from "../../../../../../../design/low-level/radio_group";
import { ServiceProviderResponse, TrainingType } from "../../../../../../../profile-sdk";
import StaffDirectoryProfileTabToolbar from "../interactive/staff_directory_profile_tab_toolbar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  GetTrainingTypeEnumFromString,
  GetTrainingTypeStringFromEnum,
} from "../../../../../../../utils/xlogs_training_type_mapper";
import GetTrainingTypeOptions from "../../../../../../../data/get_training_type_options";
import dayjs from "dayjs";
import produce from "immer";
import useApiMutatePatchServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_mutate_patch_service_provider_by_id";
import FullPageLoadingScreen from "../../../../../../../design/high-level/common/full_page_loading_screen";
import useFeedbackModal from "../../../../../../../hooks/use_feedback_modal";
import useApiQueryServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_query_service_provider_by_id";

const training_info_schema = yup.object({
  certificateSent: yup.boolean().required(),
  trainingDate: yup.date().required("Training Date is required"),
  trainingType: yup.string().required("Training Type is required"),
});

const schema = yup.object({
  training_info_log: yup.array().of(training_info_schema).required(),
});

type TrainingInfoFormType = yup.InferType<typeof schema>;

type Props = {
  service_provider: ServiceProviderResponse;
  state_in_us: string;
  client_id: string;
  refetchServiceProvider: ReturnType<typeof useApiQueryServiceProviderById>["refetch"];
};

const TrainingInformationTabContent = (props: Props) => {
  // console.log("TrainingInformationTabContent", props.service_provider);

  //#region CUSTOM HOOKS
  const { onSuccessfulSave, onFailedSave } = useFeedbackModal();
  //#endregion

  //#region API

  const { mutateAsync: mutateServiceProvider, status: mutate_service_provider_status } =
    useApiMutatePatchServiceProviderById({
      queryParams: {
        id: props.service_provider.id || "",
        clientId: props.client_id,
        state: props.state_in_us,
      },
      options: {
        onSuccess: () => {
          props.refetchServiceProvider();
        },
      },
    });

  const tabLoading = mutate_service_provider_status === "pending";

  //#endregion

  //#region HOOKFORMS
  const { control, watch, handleSubmit, setValue } = useForm<TrainingInfoFormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      training_info_log: props.service_provider.trainingInformationLog?.map((training_info) => {
        return {
          certificateSent: training_info.certificateSent ?? false,
          trainingDate: training_info.trainingDate ?? new Date(),
          trainingType: GetTrainingTypeStringFromEnum(
            training_info.trainingType ?? TrainingType.NUMBER_0,
          ),
        };
      }),
    },
  });

  const training_info_log_input = watch("training_info_log");
  //#endregion

  //#region METHODS
  function onSubmitTrainingInfoFormData(data: TrainingInfoFormType) {
    // console.log("onSubmit", data);
    onSaveTrainingTabInfo(data);
  }

  async function onSaveTrainingTabInfo(data: TrainingInfoFormType) {
    const request_body = produce(props.service_provider, (draft) => {
      draft.trainingInformationLog = data.training_info_log.map((training_info) => {
        return {
          certificateSent: training_info.certificateSent,
          trainingDate: training_info.trainingDate,
          trainingType: GetTrainingTypeEnumFromString(training_info.trainingType),
          visibleOnProfile: true,
        };
      });
    });

    await mutateServiceProvider(request_body);
    // console.log("request body: ", request_body);
  }
  //#endregion

  //#region SIDE EFFECTS
  React.useEffect(() => {
    if (mutate_service_provider_status === "success") {
      onSuccessfulSave("Training Information Saved successfully");
    } else if (mutate_service_provider_status === "error") {
      onFailedSave("Failed to save Training Information. Please refresh window and try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate_service_provider_status]);
  //#endregion

  //#region SECTIONS
  const trainingInformation = (
    <GridSectionLayout
      headerConfig={{
        title: "Training Information",
      }}
      maxHeight={"550px"}
      rows={training_info_log_input?.map((_, row_index, array) => {
        return {
          fullwidth: true,
          cells: [
            <GridSectionLayout
              headerConfig={{}}
              rows={[
                {
                  useCellStyling: {
                    indexes: 2,
                    sx: {
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                  cells: [
                    <Controller
                      control={control}
                      name={`training_info_log.${row_index}.trainingType`}
                      render={({ field, fieldState: { error } }) => (
                        <XNGDropDown
                          id={"training-type" + row_index}
                          ref={field.ref}
                          value={field.value}
                          name={field.name}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          useError={error?.message}
                          items={GetTrainingTypeOptions()}
                          label={"Training Type"}
                          maxwidth="100%"
                          fullWidth
                        />
                      )}
                    />,
                    <Controller
                      name={`training_info_log.${row_index}.trainingDate`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <XNGDateField
                          label={"Training Date"}
                          useError={error?.message}
                          value={dayjs(field.value).utc()}
                          onChange={field.onChange}
                          fullWidth
                        />
                      )}
                    />,
                    <Button
                      variant="outlined"
                      sx={{
                        borderWidth: "2px",
                        display: row_index === array.length - 1 ? "flex" : "none",
                      }}
                      onClick={() =>
                        setValue(
                          "training_info_log",
                          produce(training_info_log_input, (draft) => {
                            draft.push({
                              certificateSent: false,
                              trainingDate: new Date(),
                              trainingType: GetTrainingTypeStringFromEnum(TrainingType.NUMBER_0),
                            });
                          }),
                        )
                      }
                    >
                      Add Another
                    </Button>,
                  ],
                },
                {
                  useCellStyling: {
                    indexes: 0,
                    sx: {
                      pt: 3,
                    },
                  },
                  cells: [
                    <Controller
                      control={control}
                      name={`training_info_log.${row_index}.certificateSent`}
                      render={({ field, fieldState: { error } }) => (
                        <XNGRadioGroup
                          value={field.value ? "yes" : "no"}
                          onChange={(e) => {
                            field.onChange(e.target.value === "yes" ? true : false);
                          }}
                          radioSx={{}}
                          options={["Yes", "No"]}
                          values={["yes", "no"]}
                          formLabel={"Certificate sent?"}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            pl: "5px",
                            mb: 2,
                          }}
                        />
                      )}
                    />,
                  ],
                },
              ]}
            />,
          ],
        };
      })}
    />
  );
  //#endregion

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmitTrainingInfoFormData)}>
        <StaffDirectoryProfileTabToolbar />
        {trainingInformation}
      </form>
      {tabLoading ? <FullPageLoadingScreen text={"Saving Training Information"} /> : null}
    </Box>
  );
};

export default TrainingInformationTabContent;
