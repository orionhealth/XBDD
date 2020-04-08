import { getValidToken } from './TokenService';
import Product from 'models/Product';
import Version from 'models/Version';
import { doRequest, Method } from 'lib/rest/RestRequests';
import FetchProductsTypes from './generated/FetchProductsTypes';

interface ResponseDataElement {
  _id: string;
  favourite: boolean;
  builds: string[];
  pinned?: string[];
  coordinates: {
    product: string;
    major: number;
    minor: number;
    servicePack: number;
  };
}
type ResponseData = ResponseDataElement[];

const versionComparator = (a: Version, b: Version): number => {
  if (a.major !== b.major) {
    return Number(b.major) - Number(a.major);
  } else if (a.minor !== b.minor) {
    return Number(b.minor) - Number(a.minor);
  } else {
    return Number(b.servicePack) - Number(a.servicePack);
  }
};

const createVersion = (data: ResponseDataElement): Version => {
  const buildList = data.builds.slice().reverse();
  return {
    id: data._id,
    major: data.coordinates.major,
    minor: data.coordinates.minor,
    servicePack: data.coordinates.servicePack,
    buildList,
    pinnedBuildList: buildList.filter(build => data.pinned && data.pinned.includes(build)),
  };
};

const createProduct = (data: ResponseDataElement): Product => {
  return {
    name: data.coordinates.product,
    favourite: data.favourite,
    versionList: [],
  };
};

const createProducts = (responseData: ResponseData): Product[] => {
  const products: Record<string, Product> = {};
  responseData.forEach(element => {
    const productName = element.coordinates.product;
    if (!products[productName]) {
      products[productName] = createProduct(element);
    }
    products[productName].versionList.push(createVersion(element));
    products[productName].versionList.sort(versionComparator);
  });
  const productList = Object.values(products);
  productList.sort((a: Product, b: Product): number => a.name.localeCompare(b.name));
  return productList;
};

const fetchProducts = async (): Promise<Product[] | void> => {
  const token = await getValidToken();
  if (token) {
    return doRequest(Method.GET, '/rest/reports/summary', 'rest.error.summaryOfReports', null, token, FetchProductsTypes, createProducts);
  }
};

export default fetchProducts;
