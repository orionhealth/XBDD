import React, { useState, FC } from 'react';
import { parse } from 'query-string';

import { loginWithGithub } from 'lib/services/LoginService';

const getCodeFromQueryParam = (): string | undefined => {
  const { location } = window;
  const search = location.search.slice(1);
  const { code } = parse(search);
  const extractedCode = Array.isArray(code) ? code[0] : code;
  return extractedCode || undefined;
};

const RedirectPage: FC = () => {
  const [savedCode, setSavedCode] = useState('');

  if (!savedCode) {
    const code = getCodeFromQueryParam();
    console.log(code);
    code && setSavedCode(code);
  }

  if (savedCode) {
    loginWithGithub(savedCode);
  }

  return <div>{savedCode ? 'Getting token' : 'Next'}</div>;
};

export default RedirectPage;
