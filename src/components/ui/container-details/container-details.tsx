import { FC, ReactNode } from 'react';
import styles from './container-details.module.css';

type ContainerDetailsProps = {
  children: ReactNode;
  title?: string;
};

export const ContainerDetails: FC<ContainerDetailsProps> = ({
  title,
  children
}) => (
  <div className={styles.wrapper}>
    <h1 className={'text text_type_main-large'}>{title}</h1>
    {children}
  </div>
);
