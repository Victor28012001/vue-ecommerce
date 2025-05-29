import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
    payment: {
      nameOnCard: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  }),
  getters: {
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.new_price * item.quantity, 0),
  },
  actions: {
    addItem(product) {
      const existing = this.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({
          ...product,
          quantity: 1,
          image: product.image ?? "https://via.placeholder.com/60",
        });
      }
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id);
    },
  },
});
