import Product from 'models/Product';
import Version from 'models/Version';
import { doGetRequestWithCallback } from 'lib/rest/RestRequests';

interface ResponseDataElement {
  _id: string;
  favourite: boolean;
  builds: string[];
  pinned?: string[];
  coordinates: {
    product: string;
    major: string;
    minor: string;
    servicePack: string;
  };
}
type ResponseData = ResponseDataElement[];

const isExpectedResponse = (responseData: unknown): responseData is ResponseData => {
  if (!Array.isArray(responseData)) {
    return false;
  }
  if (responseData.some(element => element._id === undefined)) {
    return false;
  }
  if (responseData.some(element => element.favourite === undefined)) {
    return false;
  }
  if (responseData.some(element => !Array.isArray(element.builds) || element.builds.some(build => typeof build !== 'string'))) {
    return false;
  }
  if (
    responseData.some(
      element =>
        element.pinned !== undefined && (!Array.isArray(element.pinned) || element.pinned.some(pinned => typeof pinned !== 'string'))
    )
  ) {
    return false;
  }
  if (responseData.some(element => element.coordinates?.major === undefined)) {
    return false;
  }
  if (responseData.some(element => element.coordinates?.minor === undefined)) {
    return false;
  }
  if (responseData.some(element => element.coordinates?.servicePack === undefined)) {
    return false;
  }
  if (responseData.some(element => element.coordinates?.product === undefined)) {
    return false;
  }
  return true;
};

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

const fetchProducts = (): Promise<Product[] | void> => {
  return doGetRequestWithCallback('/report', 'rest.error.summaryOfReports', isExpectedResponse, (responseData: ResponseData) => {
    return createProducts(responseData);
  });
};

export default fetchProducts;
