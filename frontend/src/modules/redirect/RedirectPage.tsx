import React, { useState, FC } from 'react';
import { parse } from 'query-string';

const getCodeFromQueryParam = (): string | undefined => {
  const { location } = window;
  const search = location.search.slice(1);
  const { code } = parse(search);
  const extractedCode = Array.isArray(code) ? code[0] : code;
  return extractedCode || undefined;
};

const RedirectPage: FC = () => {
  const [savedCode, setSavedCode] = useState('');
  const [savedToken, setSavedToken] = useState(null);

  console.log('At redirect');

  if (!savedCode) {
    const code = getCodeFromQueryParam();
    console.log(code);
    code && setSavedCode(code);
  }

  if (savedCode) {
    //send to backend to retrieve token
  }

  return <div>{savedCode ? 'Getting token' : 'Next'}</div>;
};

export default RedirectPage;
