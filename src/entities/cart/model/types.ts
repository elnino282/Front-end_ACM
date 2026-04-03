// Cart Entity - Type definitions

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}
