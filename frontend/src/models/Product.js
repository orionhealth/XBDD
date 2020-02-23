import Version from './Version';

class Product {
  constructor(data) {
    if (data) {
      this.name = data.coordinates.product;
      this.versionList = [];
      this.versionList.push(new Version(data));
      this.favourite = data.favourite;
    }
  }

  addVersion(data) {
    this.versionList.push(new Version(data));
    this.versionList.sort(this.compareVersions);
  }

  compareVersions(a, b) {
    if (a.major !== b.major) {
      return b.major - a.major;
    } else if (a.minor !== b.minor) {
      return b.minor - a.minor;
    } else {
      return b.servicePack - a.servicePack;
    }
  }

  getVersionFromString(versionString) {
    return this.versionList.find(version => version.getString() === versionString);
  }

  setFavouriteStatus(favourite) {
    this.favourite = favourite;
  }

  updatePinnedBuildList(version, build, isPinned) {
    const newVersion = this.versionList.find(item => item.id === version.id);
    newVersion.updatePinnedBuildList(build, isPinned);
  }
}

export default Product;
