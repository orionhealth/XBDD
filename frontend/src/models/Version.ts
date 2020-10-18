interface Version {
  id: string;
  major: number;
  minor: number;
  servicePack: number;
  buildList: string[];
  pinnedBuildList: string[];
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

export const getUnpinnedBuildList = (version: Version): string[] => {
  return version.buildList.filter(build => !version.pinnedBuildList.includes(build));
};

export default Version;
