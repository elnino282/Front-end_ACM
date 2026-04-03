// Buyer Address Entity - Type definitions

export interface BuyerAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  isDefault?: boolean;
}

export interface AddressListParams {
  page?: number;
  size?: number;
}
