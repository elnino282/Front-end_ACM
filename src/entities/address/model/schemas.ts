import { z } from 'zod';

export const BuyerAddressSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  ward: z.string().min(1),
  district: z.string().min(1),
  province: z.string().min(1),
  isDefault: z.boolean(),
});

export const CreateAddressRequestSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  isDefault: z.boolean().optional(),
});
