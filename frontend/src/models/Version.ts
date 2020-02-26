interface Version {
  id: string;
  major: string;
  minor: string;
  servicePack: string;
  buildList: string[];
  pinnedBuildList: string[];
}

export const createVersionFromFetchedData = (data: any): Version => {
  const buildList = data.builds.slice().reverse();
  return {
    id: data._id,
    major: data.coordinates.major,
    minor: data.coordinates.minor,
    servicePack: data.coordinates.servicePack,
    buildList,
    pinnedBuildList: data.pinned ? buildList.filter(build => data.pinned.includes(build)) : [],
  };
};

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
