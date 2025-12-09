import { api } from '@/lib/api';
import styles from './DocumentsWidget.module.scss';
import { useEffect, useState } from 'react';
import { ERoutes, USER_TOKEN_KEY } from '@/lib/constants';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export const DocumentsWidget = ({}) => {
  const [data, setData] = useState<any[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(USER_TOKEN_KEY) || '{}');

    const getDocuments = async () => {
      const { data } = await api.get(`/apiv1/documents/by-user/${userData?.id}`);

      setData(data);
    };

    getDocuments();
  }, []);

  return (
    <div className={styles.DocumentsWidget}>
      <div className={styles.widgetTitle}>Мои документы</div>
      <div className={styles.documentList}>
        {data &&
          data.map((document) => {
            return (
              <div
                className={styles.documentItem}
                onClick={() => navigate(`/${ERoutes.EDITOR}`, { state: { docId: document.id } })}
              >
                <div className={styles.documentTitle}>{document.title}</div>
                <div className={styles.documentLastUpdate}>
                  {dayjs(document.updatedAt).format('mm:HH DD.MM.YYYY')}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
