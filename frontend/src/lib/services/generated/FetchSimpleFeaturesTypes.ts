/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from 'ts-interface-checker';
// tslint:disable:object-literal-key-quotes

export const SimpleFeatureResponseData = t.iface([], {
  id: 'string',
  _id: 'string',
  name: 'string',
  tags: t.array(
    t.iface([], {
      name: 'string',
    })
  ),
  calculatedStatus: 'string',
});

export const ResponseData = t.array('SimpleFeatureResponseData');

const exportedTypeSuite: t.ITypeSuite = {
  SimpleFeatureResponseData,
  ResponseData,
};
export default exportedTypeSuite;