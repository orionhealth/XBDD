import React, { useState, useEffect, FC, useRef } from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { notifications$, UniqueNotification } from './notifications';
import useClickOutside from 'hooks/useClickOutside';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    left: 10,
    bottom: 5,
  },
  alert: {
    marginBottom: 5,
  },
});

const NotificationsView: FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  const [currentNotifications, setCurrentNotifications] = useState([] as UniqueNotification[]);
  const ref = useRef(null);

  useClickOutside(ref, () => setCurrentNotifications([]));

  useEffect(() => {
    notifications$.subscribe((notification: UniqueNotification): void => {
      setCurrentNotifications(oldState => [...oldState, notification]);
    });

    return (): void => notifications$.unsubscribe();
  }, []);

  return (
    <div ref={ref} className={styles.root}>
      {currentNotifications.map(notification => (
        <Alert
          key={notification.id}
          className={styles.alert}
          elevation={6}
          variant="filled"
          severity={notification.severity}
          onClose={(): void => {
            setCurrentNotifications(currentNotifications.filter(note => note.id !== notification.id));
          }}
        >
          {t(notification.message)}
        </Alert>
      ))}
    </div>
  );
};

export default React.memo(NotificationsView);
