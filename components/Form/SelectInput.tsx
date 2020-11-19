import styles from '../../styles/inputs.module.scss';
import { FieldProps } from 'formik';
import { ReactNode } from 'react';

interface SelectInputProps extends FieldProps {
  label: string;
  children: ReactNode;
}

export default function SelectInput({ field, form: { touched, errors }, label, children, ...props }: SelectInputProps) {
  return (
    <div className={styles.formInputGroup}>
      <label className={styles.label} htmlFor={field.name}>{label}</label>
      <select {...field} className={`${styles.select} ${(touched[field.name] && errors[field.name]) && styles.inputInvalid}`} {...props}>
        {children}
      </select>
    </div>
  )
}