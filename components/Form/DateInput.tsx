import styles from '../../styles/inputs.module.scss';
import { FieldProps } from 'formik';
import { FormFieldNames } from './types';

export default function DateInput({ field, form: { touched, errors }, ...props }: FieldProps) {
  return (  
    <input type="text" {...field} className={`${styles.input} ${field.name === FormFieldNames.dobYear ? styles.dateInputWide : styles.dateInput} ${(touched[field.name] && errors[field.name]) && styles.inputInvalid}`} {...props} />
  )
}