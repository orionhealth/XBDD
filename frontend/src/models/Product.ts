import Version, { getString } from './Version';

interface Product {
  name: string;
  versionList: Version[];
  favourite: boolean;
}

export const productComparator = (a: Product, b: Product): number => a.name.localeCompare(b.name);

export const getVersionFromString = (product: Product, versionString: string): Version | undefined => {
  return product.versionList.find(version => getString(version) === versionString);
};

export default Product;
