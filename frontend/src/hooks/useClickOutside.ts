import { useEffect, MutableRefObject } from 'react';

const handleClick = (e: MouseEvent, ref: MutableRefObject<HTMLElement | null>, callback: () => void): void => {
  if (ref.current && e.target instanceof HTMLElement && !ref.current.contains(e.target)) {
    callback();
  }
};

const useClickOutside = (ref: MutableRefObject<HTMLElement | null>, callback: () => void): void => {
  useEffect(() => {
    const eventHandler = (e: MouseEvent): void => handleClick(e, ref, callback);
    document.addEventListener('click', eventHandler);
    return (): void => document.removeEventListener('click', eventHandler);
  }, [ref, callback]);
};

export default useClickOutside;
