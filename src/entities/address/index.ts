// Address Entity - Public API

export type {
  BuyerAddress,
  CreateAddressRequest,
  AddressListParams,
} from './model/types';

export {
  BuyerAddressSchema,
  CreateAddressRequestSchema,
} from './model/schemas';

export { addressKeys } from './model/keys';
export { addressApi } from './api/client';

export {
  useBuyerAddresses,
  useDefaultAddress,
  useCreateAddress,
} from './api/hooks';
