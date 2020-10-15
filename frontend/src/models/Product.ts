import Version, { getString, updatePinnedBuildList } from './Version';

interface Product {
  name: string;
  versionList: Version[];
  favourite: boolean;
}

export const productComparator = (a: Product, b: Product): number => a.name.localeCompare(b.name);

export const getVersionFromString = (product: Product, versionString: string): Version | undefined => {
  return product.versionList.find(version => getString(version) === versionString);
};

export const updateProductPinnedBuildList = (product: Product, version: Version, build: string, isPinned: boolean): void => {
  const newVersion = product.versionList.find(item => item.id === version.id);
  if (newVersion) {
    updatePinnedBuildList(newVersion, build, isPinned);
  }
};

export default Product;
