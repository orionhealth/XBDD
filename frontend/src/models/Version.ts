interface Version {
  id: string;
  major: number;
  minor: number;
  servicePack: number;
  buildList: string[];
  pinnedBuildList: string[];
}

export const getString = (version: Version): string => {
  return `${version.major}.${version.minor}.${version.servicePack}`;
};

export const getUnpinnedBuildList = (version: Version): string[] => {
  return version.buildList.filter(build => !version.pinnedBuildList.includes(build));
};

export const updatePinnedBuildList = (version: Version, build: string, isPinned: boolean): void => {
  if (isPinned) {
    version.pinnedBuildList = version.pinnedBuildList.filter(item => item !== build);
  } else {
    if (version.pinnedBuildList.includes(build)) {
      return;
    }
    version.pinnedBuildList.push(build);
    version.pinnedBuildList = version.buildList.filter(build => version.pinnedBuildList.includes(build));
  }
};

export default Version;
