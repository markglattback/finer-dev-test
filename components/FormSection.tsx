import { ReactNode } from 'react';
import styles from '../styles/formsection.module.scss';

type FormSectionProps = {
  step: number;
  sectionTitle: string;
  active: boolean;
  children: ReactNode;
  action: () => void;
}

export default function FormSection({ step, sectionTitle, active, children, action }: FormSectionProps) {
  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          {`Step ${step}: ${sectionTitle}`}
        </div>
        <div className={`${styles.sectionInputsWrapper} ${!active && styles.sectionInputsWrapperHidden}`}>
          <div className={styles.sectionInputs}>
            {children}
          </div>
          <div className={styles.sectionButton}>
            <button type="button" onClick={() => action()}>{`Next >`}</button>
          </div>
        </div>
      </div>
    </div>
  )
}