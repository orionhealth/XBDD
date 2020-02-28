import React, { useState, useEffect, FC, useRef } from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';

import { notificationsStream$, UniqueNotification } from './notifications';
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
  const [visibleNotifications, setVisibleNotifications] = useState([] as UniqueNotification[]);
  const styles = useStyles();
  const ref = useRef(null);

  useClickOutside(ref, () => setVisibleNotifications([]));

  useEffect(() => {
    notificationsStream$.subscribe((notification: UniqueNotification): void => {
      setVisibleNotifications(oldState => [...oldState, notification]);
    });

    return (): void => notificationsStream$.unsubscribe();
  }, []);

  return (
    <div ref={ref} className={styles.root}>
      {visibleNotifications.map(note => (
        <Alert
          key={note.id}
          className={styles.alert}
          elevation={6}
          variant="filled"
          severity={note.severity}
          onClose={(): void => {
            setVisibleNotifications(visibleNotifications.filter(vis => vis.id !== note.id));
          }}
        >
          {note.message}
        </Alert>
      ))}
    </div>
  );
};

export default React.memo(NotificationsView);
