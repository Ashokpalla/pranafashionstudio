import { Injectable, signal, computed, effect } from '@angular/core';
import { Cart, CartItem, Product } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadCart());
  private _open  = signal(false);

  readonly items    = this._items.asReadonly();
  readonly isOpen   = this._open.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly discount = computed(() =>
    this._items().reduce((sum, i) => {
      const orig = i.product.originalPrice ?? i.product.price;
      return sum + (orig - i.product.price) * i.quantity;
    }, 0)
  );

  readonly total = computed(() => this.subtotal() - this.discount());

  readonly cart = computed<Cart>(() => ({
    items: this._items(),
    totalItems: this.totalItems(),
    subtotal: this.subtotal(),
    discount: this.discount(),
    total: this.total()
  }));

  constructor() {
    // Persist cart to localStorage
    effect(() => {
      localStorage.setItem('prana_cart', JSON.stringify(this._items()));
    });
  }

  addItem(product: Product, quantity = 1, size?: string, color?: string) {
    const existing = this._items().find(
      i => i.productId === product.id && i.size === size && i.color === color
    );
    if (existing) {
      this.updateQuantity(product.id, existing.quantity + quantity, size, color);
    } else {
      this._items.update(items => [...items, { productId: product.id, product, quantity, size, color }]);
    }
    this._open.set(true);
  }

  updateQuantity(productId: number, quantity: number, size?: string, color?: string) {
    if (quantity <= 0) {
      this.removeItem(productId, size, color);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      )
    );
  }

  removeItem(productId: number, size?: string, color?: string) {
    this._items.update(items =>
      items.filter(i => !(i.productId === productId && i.size === size && i.color === color))
    );
  }

  clearCart() {
    this._items.set([]);
  }

  openCart()  { this._open.set(true);  }
  closeCart() { this._open.set(false); }
  toggleCart(){ this._open.update(v => !v); }

  private loadCart(): CartItem[] {
    try {
      const raw = localStorage.getItem('prana_cart');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
}
