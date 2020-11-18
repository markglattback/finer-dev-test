import { FormikProps } from "formik";

export type FormStepNames = '1' | '2' | '3';

export enum Gender {
  SELECT = 'Select Gender',
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-Binary',
  PREFER_NOT_TO_SAY = 'Prefer not to say'
}

export interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: Gender;
  dob: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  comments: string;
}

export type StepOneFields = Pick<FormFields, "firstName" | "lastName" | "email">;
export type StepTwoFields = Pick<FormFields, "mobile" | "gender" | "dob" | "dobDay" | "dobMonth" | "dobYear">;
export type StepThreeFields = Pick<FormFields, "comments">;

export interface FormSteps {
  [key: string]: {
    step: number;
    sectionTitle: string;
    fields: StepOneFields | StepTwoFields | StepThreeFields;
  }
}

export type InitiatedFormikProps = FormikProps<FormFields>