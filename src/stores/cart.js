import axios from "axios";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    basketUrl: null, // <-- NEW: store the basket URL
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    basketTotals: {
      total_excl_tax: "0.00",
      total_incl_tax: "0.00",
      total_tax: "0.00",
      currency: "NGN",
    },
    payment: {
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  }),

  getters: {
    total: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.new_price * item.quantity,
        0
      ),
  },

  actions: {
    async checkout() {
      try {
        const token = localStorage.getItem("token");
        const csrfToken = getCookie("csrftoken");

        if (!this.basketUrl) {
          console.warn("No basket URL found, cannot proceed to checkout");
          return;
        }

        const payload = {
          basket: this.basketUrl,
          guest_email: this.shipping.email,
          total: this.total.toFixed(2),
          shipping_method_code: "no-shipping-required",
          shipping_charge: {
            currency: this.basketTotals.currency,
            excl_tax: this.basketTotals.total_excl_tax,
            incl_tax: this.basketTotals.total_incl_tax,
            tax: this.basketTotals.total_tax,
          },
          shipping_address: {
            title: "Mr",
            first_name: this.shipping.firstName,
            last_name: this.shipping.lastName,
            line1: this.shipping.address,
            line2: "",
            line3: "",
            line4: this.shipping.city,
            state: this.shipping.state,
            postcode: this.shipping.zip,
            phone_number: this.shipping.phone,
            notes: "",
            country: "https://api.defonix.com/api/countries/NG/",
          },
          billing_address: {
            title: "Mr",
            first_name: this.shipping.firstName,
            last_name: this.shipping.lastName,
            line1: this.shipping.address,
            line2: "",
            line3: "",
            line4: this.shipping.city,
            state: this.shipping.state,
            postcode: this.shipping.zip,
            country: "https://api.defonix.com/api/countries/NG/",
          },
        };

        const response = await axios.post(
          "https://api.defonix.com/api/checkout/",
          payload,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
              "X-CSRFTOKEN": csrfToken,
              Accept: "application/json",
            },
          }
        );

        console.log("Checkout successful:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Checkout failed:",
          error.response?.data || error.message
        );
        throw error;
      }
    },

    async loadBasketItems() {
      try {
        const token = localStorage.getItem("token");
        const basketRes = await axios.get(
          "https://api.defonix.com/api/basket/",
          {
            withCredentials: true,
            headers: {
              Authorization: `Token ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("Basket response:", basketRes.data);

        this.basketUrl = basketRes.data.url; // <-- UPDATED: save basket url here
        this.basketTotals = {
          total_excl_tax: basketRes.data.total_excl_tax,
          total_incl_tax: basketRes.data.total_incl_tax,
          total_tax: basketRes.data.total_tax,
          currency: basketRes.data.currency,
        };
        console.log("Basket totals:", this.basketTotals);
        // this.items = []  // <-- Reset items before loading new ones
        const linesUrl = basketRes.data.lines;
        const linesRes = await axios.get(linesUrl, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        });

        const lineItems = linesRes.data;

        // Fetch product details for each line item
        const detailedItems = await Promise.all(
          lineItems.map(async (line) => {
            try {
              const productRes = await axios.get(line.product);
              const product = productRes.data;

              return {
                id: product.id,
                title: product.title,
                quantity: line.quantity,
                new_price: parseFloat(line.price_incl_tax),
                image:
                  product.images?.[0]?.original ||
                  "https://dummyimage.com/1280x720/fff/aaa",
                productUrl: product.url,
                category: product.product_class,
                basketLineUrl: line.url,
              };
            } catch (err) {
              console.warn(`Failed to load product at ${line.product}`, err);
              return null;
            }
          })
        );

        // Filter out any failed items
        this.items = detailedItems.filter(Boolean);

        console.log("Loaded cart items:", this.items);
      } catch (err) {
        console.error(
          "Error loading basket:",
          err.response?.data || err.message
        );
      }
    },

    async addItem(payload) {
      if (!this.basketUrl) {
        console.warn("Basket URL is not loaded yet.");
        return;
      }

      const finalPayload = {
        basket: this.basketUrl,
        ...payload,
      };

      const PostPayload = {
        url: finalPayload.product,
        quantity: finalPayload.quantity,
      };

      const token = localStorage.getItem("token");
      const csrfToken = getCookie("csrftoken");

      // Check if the item already exists in the basket
      const existingLine = this.items.find(
        (line) => line.line_reference === finalPayload.line_reference
      );

      if (existingLine) {
        // Update the quantity of the existing item
        const updatedQuantity = existingLine.quantity + finalPayload.quantity;
        try {
          const response = await axios.patch(
            existingLine.url,
            { quantity: updatedQuantity },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
                "X-CSRFTOKEN": csrfToken,
                Accept: "application/json",
              },
            }
          );

          console.log("Updated item quantity:", response.data);
          await this.loadBasketItems(); // Refresh basket
        } catch (error) {
          console.error(
            "Failed to update quantity:",
            error.response?.data || error.message
          );
        }
      } else {
        // Add new item to the basket
        try {
          const response = await axios.post(
            // `${this.basketUrl}lines/`,
            "https://api.defonix.com/api/basket/add-product/",
            // finalPayload,
            PostPayload,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
                "X-CSRFTOKEN": csrfToken,
                Accept: "application/json",
              },
            }
          );

          console.log("Added new item to basket:", response.data);
          await this.loadBasketItems(); // Refresh basket
        } catch (error) {
          console.error(
            "Failed to add item to basket:",
            error.response?.data || error.message
          );
        }
      }
    },

    async removeItem(id) {
      try {
        const item = this.items.find((i) => i.id === id);
        if (!item) {
          console.warn(`Item with id ${id} not found in cart`);
          return;
        }
        const lineUrl = item.basketLineUrl;
        if (!lineUrl) {
          console.warn("No basketLineUrl found for item", item);
          return;
        }

        const token = localStorage.getItem("token");
        const csrfToken = getCookie("csrftoken");

        // Extract basketPk and lineId from lineUrl
        const match = lineUrl.match(/\/baskets\/(\d+)\/lines\/(\d+)\//);
        if (!match) {
          console.error("Invalid line URL:", lineUrl);
          return;
        }
        const basketPk = match[1];
        const lineId = match[2];

        const deleteUrl = `https://api.defonix.com/api/baskets/${basketPk}/lines/${lineId}/`;

        await axios.delete(deleteUrl, {
          withCredentials: true,
          headers: {
            "X-CSRFTOKEN": csrfToken,
            Authorization: `Token ${token}`,
            Accept: "*/*",
          },
        });

        // Remove item locally
        this.items = this.items.filter((i) => i.id !== id);

        console.log(`Removed item with id ${id} successfully`);
      } catch (error) {
        console.error(
          "Failed to remove item:",
          error.response?.data || error.message
        );
      }
    },
    // <-- NEW ACTION: clearCart deletes the basket on the server and clears local state
    async clearCart() {
      try {
        if (!this.basketUrl) {
          console.warn("No basket URL found, cannot clear cart");
          return;
        }
        const csrfToken = getCookie("csrftoken");
        const token = localStorage.getItem("token");

        await axios.delete(this.basketUrl, {
          withCredentials: true,
          headers: {
            "X-CSRFTOKEN": csrfToken,
            Authorization: `Token ${token}`,
            Accept: "*/*",
          },
        });

        this.items = [];
        this.basketUrl = null;
        console.log("Cart cleared successfully");
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    },
  },
});

// Helper function to get cookie (use as you had it previously)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
