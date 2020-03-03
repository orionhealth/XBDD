import Version, { createVersionFromFetchedData, getString, updatePinnedBuildList } from './Version';

interface Product {
  name: string;
  versionList: Version[];
  favourite: boolean;
}

export const createProductFromFetchedData = (data: any): Product => {
  return {
    name: data.coordinates.product,
    versionList: [createVersionFromFetchedData(data)],
    favourite: data.favourite,
  };
};

const compareVersions = (a: Version, b: Version): number => {
  if (a.major !== b.major) {
    return Number(b.major) - Number(a.major);
  } else if (a.minor !== b.minor) {
    return Number(b.minor) - Number(a.minor);
  } else {
    return Number(b.servicePack) - Number(a.servicePack);
  }
};

export const addVersionFromFetchedData = (product: Product, versionData: any): void => {
  product.versionList.push(createVersionFromFetchedData(versionData));
  product.versionList.sort(compareVersions);
};

export const getVersionFromString = (product: Product, versionString: string): Version => {
  const version = product.versionList.find(version => getString(version) === versionString);
  if (!version) {
    throw 'error'; //TODO
  }
  return version;
};

export const updateProductPinnedBuildList = (product: Product, version: Version, build: string, isPinned: boolean): void => {
  const newVersion = product.versionList.find(item => item.id === version.id);
  if (!newVersion) {
    throw 'error'; // TODO
  }
  updatePinnedBuildList(newVersion, build, isPinned);
};

export default Product;
