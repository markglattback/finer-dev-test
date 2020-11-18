import styles from '../../styles/form.module.scss'
import FormSection from '../FormSection';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { ChangeEvent, useState } from 'react';
import { FormStepNames, FormSteps, Gender, InitiatedFormikProps, StepOneFields, StepThreeFields, StepTwoFields } from './types';

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
  dobDay: Yup.string().matches(/^([0]?[1-9]|[1|2][0-9]|[3][0|1])$/).required(),
  dobMonth: Yup.string().matches(/^([0]?[1-9]|[1][0-2])$/).required(),
  dobYear: Yup.string().matches(/^([0-9]{4})$/).required(),
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

    if (isCurrentStepValid(formik, currentStep)) setStep(nextStep[currentStep]);
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
       {(formik) => (
         <form className={styles.form} onSubmit={formik.handleSubmit}>
           <FormSection {...formSteps['1']} active={step === '1'} action={() => nextStep(formik, 1)}>
             <div className={styles.formInputGroup}>
               <label className={styles.label} htmlFor="firstName">First Name</label>
               <Field id="firstName" name="firstName" className={`${(formik.touched.firstName && formik.errors.firstName) && styles.inputInvalid}`}/>
             </div>
             <div className={styles.formInputGroup}>
               <label className={styles.label} htmlFor="lastName">Surname</label>
               <Field id="lastName" name="lastName" className={`${(formik.touched.lastName && formik.errors.lastName) && styles.inputInvalid}`} />
             </div>
             <div className={styles.formInputGroup} >
               <label className={styles.label} htmlFor="email">Email</label>
               <Field id="email" name="email" className={`${(formik.touched.email && formik.errors.email) && styles.inputInvalid}`} />
             </div>             
           </FormSection>
           <FormSection {...formSteps['2']} active={step === '2'} action={() => nextStep(formik, 2)}>
              <div className={styles.formInputGroup}>
                <label className={styles.label} htmlFor="mobile">Telephone number</label>
                <Field id="mobile" name="mobile" inputMode="numeric" pattern="[0-9]" className={`${(formik.touched.mobile && formik.errors.mobile) && styles.inputInvalid}`}/>
              </div>
              <div className={styles.formInputGroup}>
                <label className={styles.label} htmlFor="gender">Gender</label>
                <Field id="gender" name="gender" as="select" className={`${(formik.touched.gender && formik.errors.gender) && styles.inputInvalid}`}>
                  <option>{Gender.SELECT}</option>
                  <option>{Gender.MALE}</option>
                  <option>{Gender.FEMALE}</option>
                  <option>{Gender.NON_BINARY}</option>
                  <option>{Gender.PREFER_NOT_TO_SAY}</option>
                </Field>
              </div>       
              <div className={styles.formInputGroup}>
                <label className={styles.label} htmlFor="date">Date of Birth</label>
                <Field id="dob" name="dob" type="hidden" />
                <div className={styles.inlineInputGroup} >  
                  <Field id="dobDay" name="dobDay" className={styles.dateInput} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);
                    formik.setFieldValue('dob', `${e.target.value}/${formik.values.dobMonth}/${formik.values.dobYear}`);
                  }} style={(formik.touched.dobDay && formik.errors.dobDay) && inlineErrorStyle} />
                  <Field id="dobMonth" name="dobMonth" className={styles.dateInput} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);
                    formik.setFieldValue('dob', `${formik.values.dobDay}/${e.target.value}/${formik.values.dobYear}`);
                  }} style={(formik.touched.dobMonth && formik.errors.dobMonth) && inlineErrorStyle} />
                  <Field id="dobYear" name="dobYear" className={styles.dateInputWide} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    formik.handleChange(e);                    
                    formik.setFieldValue('dob', `${formik.values.dobDay}/${formik.values.dobMonth}/${e.target.value}`);
                  }} style={(formik.touched.dobYear && formik.errors.dobYear) && inlineErrorStyle} />
                </div>
              </div>       
           </FormSection>
           <FormSection {...formSteps['3']} active={step === '3'} action={() => formik.submitForm()}>
             <div className={styles.formInputGroup} style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
               <label className={styles.label} htmlFor="comments">Comments</label>
               <Field id="comments" name="comments" as="textarea" rows={7} className={`${(formik.touched.comments && formik.errors.comments) && styles.inputInvalid}`} />
             </div>
           </FormSection>
         </form>
       )}
      </Formik>

  )
}