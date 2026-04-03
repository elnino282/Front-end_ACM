import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Minus, Plus, ShoppingCart, ShieldCheck, Calendar } from 'lucide-react';
import { useProductDetail, productCatalogApi } from '@/entities/product-catalog';
import { useCartStore } from '@/entities/cart';
import { Button, Card, CardContent, Badge } from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function ProductDetailView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProductDetail(slug);

  const { data: farm } = useQuery({
    queryKey: ['farm-info', product?.farmId],
    queryFn: () => productCatalogApi.getFarmInfo(product!.farmId),
    enabled: !!product?.farmId,
  });

  const { data: lot } = useQuery({
    queryKey: ['lot-info', product?.lotId],
    queryFn: () => productCatalogApi.getLotInfo(product!.lotId),
    enabled: !!product?.lotId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto py-20 text-center text-gray-500">Sản phẩm không tồn tại.</div>;
  }

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    addItem(product.id, quantity);
    navigate('/shop/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
            {product.traceable && <Badge className="bg-emerald-600 text-white">Có truy xuất</Badge>}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current" size={20} />
              <span className="ml-1 font-medium text-gray-900">{product.rating}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.reviewCount} đánh giá</span>
          </div>

          <div className="text-3xl font-bold text-emerald-600 mb-6">
            {formatCurrency(product.price)} <span className="text-lg font-normal text-gray-500">/ {product.unit}</span>
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">{product.shortDescription}</p>

          <div className="mb-8">
            <div className="text-sm font-medium text-gray-900 mb-3">Số lượng</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-md">
                <button className="p-2 hover:bg-gray-50 text-gray-600" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button className="p-2 hover:bg-gray-50 text-gray-600" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus size={20} />
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} sản phẩm có sẵn</span>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2" size={20} /> Thêm vào giỏ
            </Button>
            <Button size="lg" className="flex-1" onClick={handleBuyNow}>
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Traceability Section */}
      {product.traceable && farm && lot && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" /> Thông tin truy xuất nguồn gốc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-emerald-800">Thông tin Nông trại</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Tên nông trại:</span>
                    <span className="font-medium">{farm.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Khu vực:</span>
                    <span className="font-medium flex items-center gap-1"><MapPin size={14} /> {farm.region}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Địa chỉ:</span>
                    <span className="font-medium text-right max-w-[200px]">{farm.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-emerald-800">Thông tin Lô hàng</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Mã lô:</span>
                    <span className="font-medium font-mono bg-gray-100 px-2 py-0.5 rounded">{lot.code}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Mùa vụ:</span>
                    <span className="font-medium">{lot.seasonName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Ngày thu hoạch:</span>
                    <span className="font-medium flex items-center gap-1"><Calendar size={14} /> {formatDate(lot.harvestDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
        <div className="prose max-w-none text-gray-700">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
