import * as yup from "yup";

const generalInfoTabFormSchema = yup.object({
    firstName: yup.string().required("First Name is a reqiured field"),
    lastName: yup.string().required("Last Name is a required field"),
    middleName: yup.string().nullable().optional(),
    loginEmailAddress: yup
        .string()
        .email("Please enter a valid Email")
        .required("login email address is a required field"),
    xlogsRoleType: yup.string(),
    xlogsStatus: yup.string(),
    serviceProviderType: yup
        .object({
            id: yup.string().nullable().optional(),
            name: yup.string().nullable().optional(),
            legacyId: yup.string().nullable().optional(),
            serviceArea: yup
                .object({
                    id: yup.string().nullable().optional(),
                    name: yup.string().nullable().optional(),
                })
                .nullable()
                .optional(),
        })
        .optional(),
    docType: yup.string().optional(),
    classType: yup.string().optional().nullable(),
    jobTitle: yup.string().optional().nullable(),
    employeeType: yup.string().optional(),
    employeeId: yup.string().optional().nullable(),
    notificationEmailAddress: yup.string().optional().nullable().email(),
    rmtsEmailAddress: yup.string().optional().nullable().email(),
    phoneNumber: yup.string().optional().nullable(),
    clientAssignmentStatus: yup.number().optional().nullable(),
});

type GeneralInfoTabFromInputType = yup.InferType<typeof generalInfoTabFormSchema>;

export type { GeneralInfoTabFromInputType };
export { generalInfoTabFormSchema };