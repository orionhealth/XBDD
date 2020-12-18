import React, { FC, MouseEvent } from 'react';

interface Props {
  text: string;
}

const urlRegex = /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

const LinkifiedText: FC<Props> = ({ text }) => {
  const splitTexts = text.split(urlRegex);
  const processed = splitTexts.map(splitText => {
    if (splitText.match(urlRegex)) {
      return (
        <a
          key={splitText}
          href={splitText}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e: MouseEvent): void => e.stopPropagation()}
        >
          {splitText}
        </a>
      );
    }
    return splitText;
  });
  return <>{processed}</>;
};

export default LinkifiedText;
