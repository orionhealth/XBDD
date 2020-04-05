import React, { useState, FC } from 'react';
import { parse } from 'query-string';

import { authenticateWithGithubCode } from 'lib/services/FetchAuthToken';

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

  if (!savedCode) {
    const code = getCodeFromQueryParam();
    console.log(code);
    code && setSavedCode(code);
  }

  if (savedCode) {
    authenticateWithGithubCode(savedCode).then((response: Response) => {
      if (response.ok) {
        response.json().then(console.log);
      } else {
        console.log(response);
      }
    });
  }

  return <div>{savedCode ? 'Getting token' : 'Next'}</div>;
};

export default RedirectPage;
