import React, { FC } from 'react';
import { parse } from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { loginWithGithub } from 'xbddReducer';
import Loading from 'modules/loading/Loading';
import { RootStore } from 'rootReducer';

const getCodeFromQueryParam = (): string | undefined => {
  const { location } = window;
  const search = location.search.slice(1);
  const { code } = parse(search);
  const extractedCode = Array.isArray(code) ? code[0] : code;
  return extractedCode || undefined;
};

const RedirectPage: FC = () => {
  const user = useSelector((store: RootStore) => store.app.user);
  const dispatch = useDispatch();
  const code = getCodeFromQueryParam();

  if (code && !user) {
    dispatch(loginWithGithub(code));
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return <Loading loading={true} />;
};

export default RedirectPage;
