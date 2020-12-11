import React, { useState, useEffect, FC, useRef, useCallback } from 'react';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';

import { notifications$, UniqueNotification } from './notifications';
import useClickOutside from 'hooks/useClickOutside';
import { useNotificationViewStyles } from './styles/NotificationViewStyles';

const NotificationsView: FC = () => {
  const { t } = useTranslation();
  const classes = useNotificationViewStyles();

  const [currentNotifications, setCurrentNotifications] = useState([] as UniqueNotification[]);
  const ref = useRef(null);

  const onClickOutside = useCallback(() => setCurrentNotifications([]), [setCurrentNotifications]);
  useClickOutside(ref, onClickOutside);

  useEffect(() => {
    notifications$.subscribe((notification: UniqueNotification): void => {
      setCurrentNotifications(oldState => [...oldState, notification]);
    });

    return (): void => notifications$.unsubscribe();
  }, []);

  return (
    <div ref={ref} className={classes.root}>
      {currentNotifications.map(notification => (
        <Alert
          key={notification.id}
          className={classes.alert}
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
