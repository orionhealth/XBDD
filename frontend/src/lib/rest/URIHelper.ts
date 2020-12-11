import { ReportIdentifier } from 'redux/ReportReducer';

export const getEncodedURI = (...components: string[]): string => {
  let path = '';
  for (const component of components) {
    path += encodeURIComponent(component) + '/';
  }
  return path.slice(0, -1);
};

export const getDecodedIdentifier = (productParam: string, versionParam: string, buildParam: string): ReportIdentifier => {
  const product = decodeURIComponent(productParam);
  const version = decodeURIComponent(versionParam);
  const build = decodeURIComponent(buildParam);

  return { product, version, build };
};
