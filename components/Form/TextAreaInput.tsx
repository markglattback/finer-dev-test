import styles from '../../styles/inputs.module.scss';
import { FieldProps } from 'formik';

interface TextAreaInputProps extends FieldProps {
  label: string;
}

export default function TextAreaInput({ field, form: { touched, errors }, label, ...props }: TextAreaInputProps) {  return (
    <div className={styles.formInputGroup}>
      <label className={styles.label} htmlFor={field.name}>{label}</label>
      <textarea {...field} className={`${styles.textarea} ${(touched[field.name] && errors[field.name]) && styles.inputInvalid}`} {...props} />
    </div>
  )
}