import type { BuyerAddress } from '../model/types';

// 🔶 Mock addresses — remove when backend API is ready
export const mockAddresses: BuyerAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường Lê Lợi',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    province: 'TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Nguyễn Văn A',
    phone: '0909876543',
    address: '456 Nguyễn Văn Linh',
    ward: 'Phường Tân Phong',
    district: 'Quận 7',
    province: 'TP. Hồ Chí Minh',
    isDefault: false,
  },
];
