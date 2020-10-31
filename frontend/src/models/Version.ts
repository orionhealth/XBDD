import Build from './Build';

interface Version {
  id: string;
  major: number;
  minor: number;
  servicePack: number;
  buildList: Build[];
}

export const versionComparator = (a: Version, b: Version): number => {
  if (a.major !== b.major) {
    return Number(b.major) - Number(a.major);
  } else if (a.minor !== b.minor) {
    return Number(b.minor) - Number(a.minor);
  } else {
    return Number(b.servicePack) - Number(a.servicePack);
  }
};

export const getString = (version: Version): string => {
  return `${version.major}.${version.minor}.${version.servicePack}`;
};

export default Version;
