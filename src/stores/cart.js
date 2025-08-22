import axios from "axios";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    basketUrl: null,
    basketId: null,
    shipping: {
      /* ... */
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: '',
      zip: '',
      city: '',
      state: '',
    },
    basketTotals: {
      /* ... */
    },
    payment: {
      /* ... */
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
    async getRequestConfig() {
      const token = localStorage.getItem("token");
      const csrfToken = getCookie("csrftoken");

      return {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Token ${token}` }),
          ...(csrfToken && { "X-CSRFToken": csrfToken }),
        },
        withCredentials: true,
      };
    },

    async loadBasketItems() {
      try {
        const config = await this.getRequestConfig();

        // Try to load existing basket from cookie first
        const basketCookie = getCookie("oscar_open_basket");
        if (basketCookie) {
          try {
            const basketId = basketCookie.split(":")[0];
            const basketRes = await axios.get(
              `https://api.defonix.com/api/baskets/${basketId}/`,
              config
            );
            await this.processBasket(basketRes.data, config);
            console.log(basketRes.data);
            return;
          } catch (error) {
            console.log("Existing basket not found, creating new one");
          }
        }

        // Create new basket if no existing one found
        const basketRes = await axios.get(
          "https://api.defonix.com/api/basket/",
          config
        );
        await this.processBasket(basketRes.data, config);
      } catch (err) {
        console.error(
          "Error loading basket:",
          err.response?.data || err.message
        );
      }
    },

    async processBasket(basket, config) {
      this.basketUrl = basket.url;
      this.basketId = basket.id;
      this.basketTotals = {
        total_excl_tax: basket.total_excl_tax,
        total_incl_tax: basket.total_incl_tax,
        total_tax: basket.total_tax,
        currency: basket.currency,
      };

      if (basket.lines) {
        try {
          const linesRes = await axios.get(basket.lines, config);
          await this.processBasketLines(linesRes.data, config);
        } catch (error) {
          console.error("Error loading basket lines:", error);
          // Handle case where lines endpoint requires authentication
          if (error.response?.status === 403) {
            this.items = []; // Clear items since we can't access them
          }
        }
      }
    },

    async processBasketLines(lineItems, config) {
      const detailedItems = await Promise.all(
        lineItems.map(async (line) => {
          try {
            const productRes = await axios.get(line.product, config);
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

      this.items = detailedItems.filter(Boolean);
    },

    async updateItemQuantity({ lineUrl, quantity }) {
      try {
        const config = await this.getRequestConfig();

        // Ensure we're sending JSON content-type
        config.headers["Content-Type"] = "application/json";

        const response = await axios.patch(lineUrl, { quantity }, config);

        // Reload basket to get updated totals
        await this.loadBasketItems();
        return response.data;
      } catch (error) {
        console.error("Error updating quantity:", {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
        throw error;
      }
    },

    async addItem(payload) {
      if (!payload?.product || !payload?.quantity) {
        console.warn("Invalid payload: missing product URL or quantity");
        return;
      }

      try {
        const config = await this.getRequestConfig();
        const existingLine = this.items.find(
          (line) => line.productUrl === payload.product
        );

        if (existingLine) {
          // const updatedQuantity = existingLine.quantity + payload.quantity;
          // await axios.patch(
          //   existingLine.basketLineUrl,
          //   { quantity: updatedQuantity },
          //   config
          // );
          this.removeItem(existingLine.id);
        } else {
          let ok = await axios.post(
            "https://api.defonix.com/api/basket/add-product/",
            {
              url: payload.product,
              quantity: payload.quantity,
            },
            config
          );
          alert(`addToCart called: ${JSON.stringify(ok?.data || ok)}`);
        }

        await this.loadBasketItems();
      } catch (error) {
        console.error(
          "Error adding/updating item:",
          error.response?.data || error.message
        );
      }
    },

    async removeItem(id) {
      try {
        const item = this.items.find((i) => i.id === id);
        if (!item || !item.basketLineUrl) return;

        const config = await this.getRequestConfig();
        await axios.delete(item.basketLineUrl, config);

        this.items = this.items.filter((i) => i.id !== id);
        await this.loadBasketItems();
      } catch (error) {
        console.error(
          "Failed to remove item:",
          error.response?.data || error.message
        );
      }
    },

    async clearCart() {
      try {
        if (!this.basketUrl) return;

        const config = await this.getRequestConfig();
        await axios.delete(this.basketUrl, config);

        this.items = [];
        this.basketUrl = null;
        this.basketId = null;
        await this.loadBasketItems();
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    },

    async checkout() {
      try {
        const token = localStorage.getItem("token");
        const csrfToken = getCookie("csrftoken");

        if (!this.basketUrl) {
          console.warn("No basket URL found, cannot proceed to checkout");
          return;
        }

        // Prepare country payload
        const countryPayload = {
          url: "https://api.defonix.com/api/countries/NG/",
          iso_3166_1_a3: "NGA",
          iso_3166_1_numeric: "566",
          printable_name: "Nigeria",
          name: "Federal Republic of Nigeria",
          is_shipping_country: true,
        };

        // For 'no-shipping-required', shipping charge must be 0.00
        const shippingCharge = {
          currency: "NGN",
          excl_tax: "0.00",
          incl_tax: "0.00",
          tax: "0.00",
        };

        const payload = {
          basket: this.basketUrl,
          guest_email: this.shipping.email,
          total: this.basketTotals.total_incl_tax,
          shipping_method_code: "no-shipping-required",
          shipping_charge: shippingCharge, // Using the zero values
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
            country: countryPayload.url,
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
            country: countryPayload.url,
          },
        };

        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken }),
          ...(token && { Authorization: `Token ${token}` }),
        };
        console.log(payload);

        const response = await axios.post(
          "https://api.defonix.com/api/checkout/",
          payload,
          {
            withCredentials: true,
            headers: headers,
          }
        );

        console.log("Checkout successful:", response.data);
        return response.data;
      } catch (error) {
        console.error("Detailed checkout error:", {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });
        throw error;
      }
    },
  },
});

// Enhanced cookie getter
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return decodeURIComponent(cookieValue);
  }
  return null;
}
