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
// import axios from 'axios'
// import { defineStore } from "pinia";

// export const useCartStore = defineStore("cart", {
//   state: () => ({
//     items: [],
//     shipping: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       city: '',
//       state: '',
//       zip: '',
//     },
//     payment: {
//       nameOnCard: '',
//       cardNumber: '',
//       expiry: '',
//       cvv: '',
//     },
//   }),

//   getters: {
//     total: (state) =>
//       state.items.reduce((sum, item) => sum + item.new_price * item.quantity, 0),
//   },

//   actions: {
//     async loadBasketItems() {
//       try {
//         const token = localStorage.getItem('token')
//         const basketRes = await axios.get('https://api.defonix.com/api/basket/', {
//           withCredentials: true,
//           headers: {
//             Authorization: `Token ${token}`,
//             Accept: 'application/json',
//           },
//         })

//         console.log('Basket response:', basketRes.data)

//         const linesUrl = basketRes.data.lines
//         const linesRes = await axios.get(linesUrl, {
//           withCredentials: true,
//           headers: {
//             Authorization: `Token ${token}`,
//             Accept: 'application/json',
//           },
//         })

//         const lineItems = linesRes.data

//         // Fetch product details for each line item
//         const detailedItems = await Promise.all(
//           lineItems.map(async (line) => {
//             try {
//               const productRes = await axios.get(line.product)
//               const product = productRes.data

//               return {
//                 id: product.id,
//                 title: product.title,
//                 quantity: line.quantity,
//                 new_price: parseFloat(line.price_incl_tax),
//                 image: product.images?.[0]?.original || 'https://dummyimage.com/1280x720/fff/aaa',
//                 productUrl: product.url,
//                 basketLineUrl: line.url,
//               }
//             } catch (err) {
//               console.warn(`Failed to load product at ${line.product}`, err)
//               return null
//             }
//           })
//         )

//         // Filter out any failed items
//         this.items = detailedItems.filter(Boolean)

//         console.log('Loaded cart items:', this.items)
//       } catch (err) {
//         console.error('Error loading basket:', err.response?.data || err.message)
//       }
//     },

//     addItem(product) {
//       const existing = this.items.find((i) => i.id === product.id)
//       if (existing) {
//         existing.quantity++
//       } else {
//         this.items.push({
//           ...product,
//           quantity: 1,
//           image: product.image ?? "https://dummyimage.com/1280x720/fff/aaa",
//         })
//       }
//     },

//     removeItem(id) {
//       this.items = this.items.filter((i) => i.id !== id)
//     },
//   },
// })
