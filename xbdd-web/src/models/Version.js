class Version {
  constructor(data) {
    if (data) {
      this.id = data["_id"];
      this.major = data.coordinates.major;
      this.minor = data.coordinates.minor;
      this.servicePack = data.coordinates.servicePack;
      this.buildList = data.builds.slice().reverse();
      this.pinnedBuildList = data.pinned ? this.buildList.filter(build => data.pinned.includes(build)) : [];
    }
  }

  getString() {
    return `${this.major}.${this.minor}.${this.servicePack}`;
  }

  getUnpinnedBuildList() {
    return this.buildList.filter(build => !this.pinnedBuildList.includes(build));
  }

  updatePinnedBuildList(build, isPinned) {
    if (isPinned) {
      this.pinnedBuildList = this.pinnedBuildList.filter(item => item !== build);
    } else {
      if (this.pinnedBuildList.includes(build)) {
        return;
      }
      this.pinnedBuildList.push(build);
      this.pinnedBuildList = this.buildList.filter(build => this.pinnedBuildList.includes(build));
    }
  }
}

export default Version;
