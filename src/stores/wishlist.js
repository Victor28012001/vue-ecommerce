// src/stores/wishlist.js
import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
  }),
  actions: {
    toggleItem(product) {
      const index = this.items.findIndex(i => i.id === product.id)
      if (index >= 0) {
        this.items.splice(index, 1)
      } else {
        this.items.push(product)
      }
    },
    isWishlisted(productId) {
      return this.items.some(item => item.id === productId)
    },
  },
})
