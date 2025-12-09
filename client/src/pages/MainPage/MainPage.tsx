import React from 'react';
import styles from './MainPage.module.scss';
import { DocumentsWidget } from './components/DocumentsWidget/DocumentsWidget';

const MainPage: React.FC = () => {
  return (
    <div className={styles.mainPage}>
      <div className={styles.widgetGrid}>
        <DocumentsWidget />
      </div>
    </div>
  );
};

export default MainPage;
