import { createVersionFromFetchedData, getString, updatePinnedBuildList } from './Version';

class Product {
  constructor(data) {
    if (data) {
      this.name = data.coordinates.product;
      this.versionList = [];
      this.versionList.push(createVersionFromFetchedData(data));
      this.favourite = data.favourite;
    }
  }

  addVersion(data) {
    this.versionList.push(createVersionFromFetchedData(data));
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
    return this.versionList.find(version => getString(version) === versionString);
  }

  setFavouriteStatus(favourite) {
    this.favourite = favourite;
  }

  updateProductPinnedBuildList(version, build, isPinned) {
    const newVersion = this.versionList.find(item => item.id === version.id);
    updatePinnedBuildList(newVersion, build, isPinned);
  }
}

export default Product;
