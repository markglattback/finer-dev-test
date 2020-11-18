import Head from 'next/head';
import Form from '../components/Form/Form';
import styles from '../styles/index.module.scss';

export default function Home() {
  return (
    <div className={styles.grid}>
      <Form />
    </div>
  )
}
