import { useEffect, MutableRefObject } from 'react';

const handleClick = (event: MouseEvent, ref: MutableRefObject<HTMLElement | null>, callback: () => void): void => {
  if (ref.current && event.target instanceof HTMLElement && !ref.current.contains(event.target)) {
    callback();
  }
};

const useClickOutside = (ref: MutableRefObject<HTMLElement | null>, callback: () => void): void => {
  useEffect(() => {
    const eventHandler = (event: MouseEvent): void => handleClick(event, ref, callback);
    document.addEventListener('click', eventHandler);
    return (): void => document.removeEventListener('click', eventHandler);
  }, [ref, callback]);
};

export default useClickOutside;
