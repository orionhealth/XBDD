import { useEffect } from 'react';

const useClickOutside = (ref, callback): void => {
  const handleClick = (event: MouseEvent): void => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return (): void => document.removeEventListener('click', handleClick);
  });
};

export default useClickOutside;
