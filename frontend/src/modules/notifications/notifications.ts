import { Subject } from 'rxjs';
import uuid from 'uuid';

export interface Notification {
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface UniqueNotification extends Notification {
  id: string;
}

export const notificationsStream$ = new Subject<UniqueNotification>();

export const showNotification = (nextNotification: Notification): void => {
  notificationsStream$.next({ ...nextNotification, id: uuid.v4() });
};
