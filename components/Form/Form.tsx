import styles from '../../styles/form.module.scss'
import FormSection from '../FormSection';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { ChangeEvent, useState } from 'react';
import { FormFieldNames, FormStepNames, FormSteps, Gender, InitiatedFormikProps, StepOneFields, StepThreeFields, StepTwoFields } from './types';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './SelectInput';
import DateInput from './DateInput';

const inlineErrorStyle = {background: '#f8c0c0', border: '1px solid #f00'};

// Formik setup - split the initialValues into each step for easier validation checking later

const initialStepOneFields: StepOneFields = {
  firstName: '',
  lastName: '',
  email: '',
}

const initialStepTwoFields: StepTwoFields = {
  mobile: '',
  gender: Gender.SELECT,
  dob: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
}

const initialStepThreeFields: StepThreeFields = {
  comments: ''
}

const formSteps: FormSteps = {
  '1': {
    step: 1,
    sectionTitle: 'Your Details',
    fields: initialStepOneFields,
  },
  '2': {
    step: 2,
    sectionTitle: 'More Comments',
    fields: initialStepTwoFields,
  },
  '3': {
    step: 3,
    sectionTitle: 'Final Comments',
    fields: initialStepThreeFields,
  },
}

// Yup schema validation

const validationSchema = Yup.object({
  firstName: Yup.string().required('Please provide your first name'),
  lastName: Yup.string().required('Please provide your last name'),
  email: Yup.string().email('Please enter a valid email address').required('Please provide your email address'),
  mobile: Yup.string().matches(/^07\d{9}|\+*447\d{9}$/, 'Please enter a valid UK mobile number').required('Please provide your mobile number'), // match UK mobile numbers
  gender: Yup.string().oneOf([Gender.MALE, Gender.FEMALE, Gender.NON_BINARY, Gender.PREFER_NOT_TO_SAY]).required('Please select an option'), // match only the valid genders
  dobDay: Yup.string().min(2).max(2).matches(/^([0]?[1-9]|[1|2][0-9]|[3][0|1])$/, 'Please enter a valid date in dd/mm/yyyy format').required('Please provide your date of birth'),
  dobMonth: Yup.string().min(2).max(2).matches(/^([0]?[1-9]|[1][0-2])$/, 'Please enter a valid date in dd/mm/yyyy format').required('Please provide your date of birth'),
  dobYear: Yup.string().min(4).max(4).matches(/^([0-9]{4})$/, 'Please enter a valid date in dd/mm/yyyy format').required('Please provide your date of birth'),
  comments: Yup.string(),
})

export default function Form() {
  const [step, setStep] = useState<FormStepNames>('1');

  // checks if the inputs in the current section are valid
  function isCurrentStepValid(formik: InitiatedFormikProps, currentStep: number) {
    
    // if steps 1 or 2 haven't been touched yet, they're not valid
    if (currentStep < 3) {
      if (!formik.dirty) return false;
    }    
    
    // check for validation errors on fields
    for (const key in formSteps[currentStep].fields) {
      if (formik.errors[key]) return false;
    }
    
    // crack on
    return true;  

  }

  // moves form to the next step
  function nextStep(formik: InitiatedFormikProps, currentStep) {
    const nextStep = {
      1: '2',
      2: '3',
    }    

    if (isCurrentStepValid(formik, currentStep)) {
      setStep(nextStep[currentStep])
    } else {
      // touch all fields in current step to make sure errors are shown
      let touch = {};
      for (const key in formSteps[currentStep].fields) {
        touch[key] = true;
      }

      formik.setTouched({ ...touch });
    };
  }

  function updateDOBField(formik, updated, value) {
    if (updated === FormFieldNames.dobDay) formik.setFieldValue('dob', `${value}/${formik.values.dobMonth}/${formik.values.dobYear}`);
    if (updated === FormFieldNames.dobMonth) formik.setFieldValue('dob', `${formik.values.dobDay}/${value}/${formik.values.dobYear}`);
    if (updated === FormFieldNames.dobYear) formik.setFieldValue('dob', `${formik.values.dobDay}/${formik.values.dobMonth}/${value}`);
  }

  return (
      <Formik 
        initialValues={{
          ...initialStepOneFields,
          ...initialStepTwoFields,
          ...initialStepThreeFields
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          function handleFailure() {
            setSubmitting(false);

            // TODO: If I had more time
            // update the UI to display an error message
            // and guidance on what to do next
          }         

          try {
            const res = await fetch("api/createPerson", {
              method: 'POST',
              body: JSON.stringify(values),
              headers: {
                "content-type": "application/json",
              },
            })

            if (res.status >= 200 && res.status < 300) {
              setSubmitting(false);
              resetForm();
              setStep('1');
            } else {
              handleFailure();
            }
          } catch(err) {
            handleFailure();
          }
      }}>
       {(formik) => {         
         return <form className={styles.form} onSubmit={formik.handleSubmit}>
           <FormSection {...formSteps['1']} active={step === '1'} action={() => nextStep(formik, 1)}>
             <Field name={FormFieldNames.firstName} label="First Name" component={TextInput} />
             <Field name={FormFieldNames.lastName} label="Last Name"  component={TextInput} />
             <Field name={FormFieldNames.email} label="Email" component={TextInput} />
           </FormSection>
           <FormSection {...formSteps['2']} active={step === '2'} action={() => nextStep(formik, 2)}>
             <Field name={FormFieldNames.mobile} label="Telephone number" inputMode="numeric" pattern="[0-9]*" component={TextInput} />
             <Field name={FormFieldNames.gender} label="Gender" component={SelectInput}>
                  <option>{Gender.SELECT}</option>
                  <option>{Gender.MALE}</option>
                  <option>{Gender.FEMALE}</option>
                  <option>{Gender.NON_BINARY}</option>
                  <option>{Gender.PREFER_NOT_TO_SAY}</option>
             </Field>
              <div className={styles.formInputGroup}>
                <label className={styles.label} htmlFor="date">Date of Birth</label>
                <Field id="dob" name="dob" type="hidden" />
                <div className={styles.inlineInputGroup} >  
                  <Field name={FormFieldNames.dobDay} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);
                    updateDOBField(formik, FormFieldNames.dobDay, e.target.value);
                  }} minLength={2} maxLength={2} component={DateInput} />
                  <Field name={FormFieldNames.dobMonth} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);
                    updateDOBField(formik, FormFieldNames.dobMonth, e.target.value);
                  }} minLength={2} maxLength={2} component={DateInput}/>
                  <Field name={FormFieldNames.dobYear} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);                    
                    updateDOBField(formik, FormFieldNames.dobYear, e.target.value);
                  }} minLength={4} maxLength={4} component={DateInput} />
                </div>
              </div>       
           </FormSection>
           <FormSection {...formSteps['3']} active={step === '3'} action={() => formik.submitForm()}>
            <Field name={FormFieldNames.comments} label="Comments" component={TextAreaInput} />
           </FormSection>
         </form>
        }}
      </Formik>

  )
}