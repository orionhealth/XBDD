import { ReportIdentifier } from 'redux/ReportReducer';

export const getEncodedURI = (...componenets: string[]): string => {
  let path = '';
  for (const componenet of componenets) {
    path += encodeURIComponent(componenet) + '/';
  }
  return path.slice(0, -1);
};

export const getDecodedIdentifier = (productParam: string, versionParam: string, buildParam: string): ReportIdentifier => {
  const product = decodeURIComponent(productParam);
  const version = decodeURIComponent(versionParam);
  const build = decodeURIComponent(buildParam);

  return { product, version, build };
};
