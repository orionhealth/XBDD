import { Method, timeout } from 'lib/rest/RestRequests';

export const authenticateWithGithubCode = (code: string): Promise<any> => {
  const url = `https://localhost:8443/oauth/token`;

  const body = new FormData();
  body.set('username', 'github');
  body.set('password', code);
  body.set('grant_type', 'password');
  body.set('scope', 'all');

  return timeout(
    fetch(url, {
      method: Method.POST,
      headers: { Authorization: `Basic ${btoa('xbdd:secret')}` },
      body,
    })
  );
};
