import styles from '../../styles/inputs.module.scss';
import { FieldProps } from 'formik';

interface TextInputProps extends FieldProps {
  label: string;
}

export default function TextInput({ field, form: { touched, errors }, label, ...props }: TextInputProps) {  return (
    <div className={styles.formInputGroup}>
      <label className={styles.label} htmlFor={field.name}>{label}</label>
      <input type="text" {...field} className={`${styles.input} ${(touched[field.name] && errors[field.name]) && styles.inputInvalid}`} {...props} />
    </div>
  )
}