import { useMemo } from "react";
import { CampusInformationFetchedTable } from "../types/types";
import * as yup from "yup";

const FEEDBACK_MSGS = {
  required: "Entry is required",
  campusNameAlreadyExists: "Campus name already exists!",
};

export type CampusInformationValidationSchema = yup.ObjectSchema<
  {
    campusName: string;
  },
  yup.AnyObject,
  {
    campusName: undefined;
  },
  ""
>;

/**
 * Optimally creates a validation schema any time the table changes.
 */
export function useValidationSchema(props: {
  validationMode: "add" | "edit";
  dependencies: { table: CampusInformationFetchedTable | null };
}): CampusInformationValidationSchema {
  const { table } = props.dependencies;

  const campusNames = useMemo(() => {
    return table?.campusLineItemsRes?.lineItemCards?.map((row) => row.name);
  }, [table]);

  function checkIfCampusNameAlreadyExists(v: string | undefined) {
    return !campusNames?.includes(v);
  }

  function getSchema() {
    switch (props.validationMode) {
      case "add":
        return yup.object().shape({
          campusName: yup
            .string()
            .test("check-campus-name", FEEDBACK_MSGS.campusNameAlreadyExists, (v) =>
              checkIfCampusNameAlreadyExists(v),
            )
            .required(FEEDBACK_MSGS.required),
        });
      case "edit":
        return yup.object().shape({
          campusName: yup.string().required(FEEDBACK_MSGS.required),
        });
      default:
        throw new Error("");
    }
  }

  const validationSchema = useMemo(() => getSchema(), [table]);

  return validationSchema;
}
