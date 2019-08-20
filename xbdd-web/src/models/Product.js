class Product {
  constructor(data) {
    if (data) {
      this.name = data.coordinates.product;
      this.versionList = [
        {
          id: data["_id"],
          major: data.coordinates.major,
          minor: data.coordinates.minor,
          servicePack: data.coordinates.servicePack,
          pinnedBuildList: data.pinned ? data.pinned : [],
          buildList: data.builds.reverse(),
        },
      ];
      this.favourite = data.favourite;
      this.expanded = false;
      this.selectedVersion = this.versionList[0];
    }
  }

  addVersion(data) {
    this.versionList.push({
      id: data["_id"],
      major: data.coordinates.major,
      minor: data.coordinates.minor,
      servicePack: data.coordinates.servicePack,
      pinnedBuildList: data.pinned ? data.pinned : [],
      buildList: data.builds,
    });
    this.versionList.sort((a, b) => {
      if (a.major !== b.major) {
        return b.major - a.major;
      } else if (a.minor !== b.minor) {
        return b.minor - a.minor;
      } else {
        return b.servicePack - a.servicePack;
      }
    });
    this.selectedVersion = this.versionList[0];
  }

  updateBuildPinStatus(build, selectedVersion, isPinned) {
    var version = this.versionList.find(item => item === selectedVersion);
    var newPinnedBuildList = version.pinnedBuildList;
    if (isPinned) {
      version.pinnedBuildList = newPinnedBuildList.filter(item => item !== build);
    } else {
      newPinnedBuildList.push(build);
      version.pinnedBuildList = newPinnedBuildList.sort().reverse();
    }
  }

  clone() {
    const rtn = new Product();
    rtn.name = this.name;
    rtn.versionList = this.versionList;
    rtn.favourite = this.favourite;
    rtn.expanded = this.expanded;
    rtn.selectedVersion = this.selectedVersion;

    return rtn;
  }
}

export default Product;
