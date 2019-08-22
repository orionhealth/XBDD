class Version {
  constructor(data) {
    if (data) {
      this.id = data["_id"];
      this.major = data.coordinates.major;
      this.minor = data.coordinates.minor;
      this.servicePack = data.coordinates.servicePack;
      this.pinnedBuildList = data.pinned ? data.pinned : [];
      this.buildList = data.builds.reverse();
    }
  }

  getString() {
    return `${this.major}.${this.minor}.${this.servicePack}`;
  }

  getUnpinnedBuildList() {
    return this.buildList.filter(build => !this.pinnedBuildList.some(pinnedBuild => pinnedBuild === build));
  }

  updatePinnedBuildList(build, isPinned) {
    if (isPinned) {
      this.pinnedBuildList = this.pinnedBuildList.filter(item => item !== build);
    } else {
      if (this.pinnedBuildList.some(item => item === build)) {
        return;
      }
      this.pinnedBuildList.push(build);
      this.pinnedBuildList = this.pinnedBuildList.sort().reverse();
    }
  }
}

export default Version;
