import * as yup from "yup";
import session_date_filter_options from "../../../../data/get_session_date_filter_options";
import dayjs from "dayjs";
import { DistrictRef, SchoolCampusRef, Service, ServiceProviderRef } from "../../../../profile-sdk";

/**
 * Defines the schema for the session log's view filters form data.
 */
export const filters_form_schema = yup.object().shape({
  session_date_filter: yup
    .string()
    .oneOf(["Week of School Year", "Date Range" /* , "Medical Date Range" */])
    .required("Please select a date range.")
    .test("session_date_filter", "Please select a valid date range.", function (value) {
      const { start_year, end_year, week, start_date, end_date } = this.parent.date_filter_options;

      const session_date_filters = session_date_filter_options;
      switch (value) {
        case session_date_filters[0]:
          if (!start_year || !end_year || !week.start || !week.end || start_year > end_year) {
            return false;
          }
          break;
        case session_date_filters[1]:
        case session_date_filters[2]:
          if (!start_date || !end_date) {
            return false;
          }
          break;
      }

      return true;
    })
    .test(
      "session_date_filter_date_range",
      "The end date must be after The start date",
      function (value) {
        const { start_date, end_date } = this.parent.date_filter_options;

        const session_date_filters = session_date_filter_options;
        switch (value) {
          case session_date_filters[1]:
          case session_date_filters[2]:
            if (!start_date || !end_date) {
              return false;
            }
            if (dayjs(start_date).isAfter(dayjs(end_date))) {
              return false;
            }
            break;
          default:
            return true;
        }

        return true;
      },
    ),
  date_filter_options: yup.object().shape({
    start_year: yup.string(),
    end_year: yup.string(),
    week: yup.object().shape({
      start: yup.date(),
      end: yup.date(),
      week_number: yup.number().nullable(),
    }),
    start_date: yup.date(),
    end_date: yup.date(),
  }),
  session_filter: yup.array().of(yup.string()).min(1, "Please select at least one session filter."),
  show_iep_service_data: yup.boolean(),
  student_with_session: yup.boolean(),
  medical_eligible_only: yup.boolean(),
  provider_absent: yup
    .string()
    .oneOf(["Both", "Yes", "No"])
    .required("Please select a provider absent filter."),
  make_up_session: yup
    .string()
    .oneOf(["Both", "Yes", "No"])
    .required("Please select a make up session filter."),
  service_providers: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        firstName: yup.string(),
        lastName: yup.string(),
        email: yup.string(),
      }),
    )
    .min(1, "Please select at least one service provider."),
  dols: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string(),
      }),
    )
    .min(1, "Please select at least one district of liability."),
  service_types: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string(),
      }),
    )
    .min(1, "Please select at least one service provider type."),
  schools: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string(),
      }),
    )
    .min(1, "Please select at least one school."),
});

/**
 * Represents the type of the form data for filters in the session logs form.
 */
export type FiltersFormType = yup.InferType<typeof filters_form_schema>;

/**
 * Represents the filter data for the session logs form.
 */
type SessionLogsFormFilterData = {
  serviceProviders: ServiceProviderRef[];
  districtsOfLiability: DistrictRef[];
  service_types: Service[];
  campuses: SchoolCampusRef[];
};

export default SessionLogsFormFilterData;
