import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useProducts, useCategories } from '@/entities/product-catalog';
import { Card, CardContent, Input, Badge } from '@/shared/ui';
import type { ProductListParams } from '@/entities/product-catalog';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function ProductListView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [traceableOnly, setTraceableOnly] = useState(false);

  const params: ProductListParams = {
    category: category !== 'all' ? category : undefined,
    search: searchTerm || undefined,
    traceableOnly: traceableOnly || undefined,
  };

  const { data: productData, isLoading } = useProducts(params);
  const { data: categories } = useCategories();

  const products = productData?.items ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter size={20} /> Bộ lọc
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Danh mục</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === 'all'}
                        onChange={() => setCategory('all')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm">Tất cả</span>
                    </label>
                    {categories?.map(c => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={category === c.name}
                          onChange={() => setCategory(c.name)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm">{c.name} ({c.productCount})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Truy xuất nguồn gốc</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={traceableOnly}
                      onChange={(e) => setTraceableOnly(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">Chỉ sản phẩm có truy xuất</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sản phẩm nông sản</h1>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="h-80 animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Link key={product.id} to={`/shop/products/${product.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group">
                    <div className="aspect-square overflow-hidden relative bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {product.traceable && (
                        <Badge className="absolute top-2 left-2 bg-emerald-600 text-white">
                          Có truy xuất
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-10">{product.name}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-emerald-600">
                          {formatCurrency(product.price)}<span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          ⭐ {product.rating}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
