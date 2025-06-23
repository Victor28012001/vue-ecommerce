<template>
  <!-- Breadcrumb -->
  <Navbar :categories="product.categories" :current="product.title" />

  <div class="container page py-4">
    <div class="page_inner">

      <!-- Messages Alert -->
      <div id="messages">
        <div v-if="alertMessage" class="alert" :class="alertVariant" role="alert">
          {{ alertMessage }}
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div id="content_inner">
          <article class="product_page">
            <div class="row">
              <!-- Image Gallery -->
              <div class="col-sm-6">
                <div id="product_gallery" class="carousel slide">
                  <div class="carousel-inner">
                    <!-- If images exist, show them -->
                    <div
                      v-for="(img, idx) in product.images.length ? product.images : [{ original: 'https://dummyimage.com/1280x720/fff/aaa' }]"
                      :key="img.id || idx" :class="['carousel-item', idx === 0 ? 'active' : '']">
                      <img :src="img.original" :alt="product.title || 'Unnamed Product'" class="img-fluid rounded" />
                    </div>
                  </div>

                  <!-- Only show carousel controls if there's more than 1 image -->
                  <template v-if="product.images.length > 1">
                    <button class="carousel-control-prev" type="button" data-bs-target="#product_gallery"
                      data-bs-slide="prev">
                      <span class="carousel-control-prev-icon"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#product_gallery"
                      data-bs-slide="next">
                      <span class="carousel-control-next-icon"></span>
                    </button>
                  </template>
                </div>
              </div>

              <!-- Product Details -->
              <div class="col-sm-6 product_main">
                <h1>{{ product.title || 'Unnamed Product' }}</h1>
                <p class="price_color">{{ formatCurrency(price.incl_tax) }}</p>
                <p class="available availability">
                  <i :class="productAvailability.icon"></i>
                  {{ productAvailability.text }}
                </p>

                <hr />

                <form @submit.prevent="addToBasket" class="add-to-basket mb-0">
                  <input type="number" v-model.number="quantity" min="1" class="form-control mb-2" />
                  <button type="submit" class="btn btn-lg btn-primary w-100" :disabled="adding">
                    {{ adding ? "Adding..." : "Add to cart" }}
                  </button>
                </form>

                <button class="btn btn-outline-secondary w-100 mt-2" @click="addToWishlist" :disabled="addingWishlist">
                  {{ addingWishlist ? "Adding..." : "Add to wish list" }}
                </button>
              </div>
            </div>

            <!-- Product Information Table -->
            <div class="sub-header mt-5">
              <h2>Product Information</h2>
            </div>
            <table class="table table-striped">
              <tbody>
                <tr>
                  <th>Product Type</th>
                  <td>{{ product.product_class }}</td>
                </tr>
                <tr v-if="price.excl_tax">
                  <th>Price (excl. tax)</th>
                  <td>{{ formatCurrency(price.excl_tax) }}</td>
                </tr>
                <tr v-if="price.incl_tax">
                  <th>Price (incl. tax)</th>
                  <td>{{ formatCurrency(price.incl_tax) }}</td>
                </tr>
                <tr v-if="price.incl_tax && price.excl_tax">
                  <th>Tax</th>
                  <td>{{ formatCurrency(price.incl_tax - price.excl_tax) }}</td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>{{ productAvailability.text }}</td>
                </tr>
              </tbody>
            </table>

          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import Navbar from "../components/Navbar.vue";

const route = useRoute();

const product = ref({
  images: [],
  categories: [],
  product_class: "",
  // fallback defaults...
});
const price = ref({ incl_tax: 0, excl_tax: 0 });
const quantity = ref(1);
const adding = ref(false);
const addingWishlist = ref(false);
const alertMessage = ref("");
const alertVariant = ref("alert-success");

const productAvailability = computed(() => {
  // Assume availability API maybe returns something fetchable; fallback:
  return { text: "Available", icon: "fas fa-check-circle text-success" };
});

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(val);

async function loadProduct() {
  const { id } = route.params;
  const res = await axios.get(`https://api.defonix.com/api/products/${id}/`);
  product.value = res.data;
  // Fetch price, availability, reviews if separate...
  const priceRes = await axios.get(res.data.price);
  price.value = priceRes.data;
}

function showAlert(msg, variant = "alert-success") {
  alertMessage.value = msg;
  alertVariant.value = variant;
  setTimeout(() => (alertMessage.value = ""), 3000);
}

async function addToBasket() {
  adding.value = true;
  try {
    /* Implement basket add logic, perhaps axios.post(...) */
    showAlert("Added to cart!");
  } catch {
    showAlert("Failed to add to cart", "alert-danger");
  } finally {
    adding.value = false;
  }
}

async function addToWishlist() {
  addingWishlist.value = true;
  try {
    /* Implement wishlist logic */
    showAlert("Added to wish list!");
  } catch {
    showAlert("Failed to add to wish list", "alert-danger");
  } finally {
    addingWishlist.value = false;
  }
}

onMounted(loadProduct);
</script>

<style scoped>
.container.page {
  padding-bottom: 40px;
  max-width: 960px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Flexbox row: side-by-side desktop, stacked mobile */
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1rem;
}

/* Image column */
.col-sm-6:first-child {
  flex: 1 1 45%;
  min-width: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Product details column */
.col-sm-6.product_main {
  flex: 1 1 50%;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Responsive stacking */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .col-sm-6:first-child,
  .col-sm-6.product_main {
    flex: 1 1 100%;
  }
}

.product_main h1 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #222;
}

.price_color {
  font-size: 1.75rem;
  color: #1c3c78;
  font-weight: 700;
  margin-bottom: 1rem;
}

.availability {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.availability i {
  margin-right: 8px;
  color: #28a745;
  /* green icon */
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
}

/* Buttons */
.add-to-basket input[type='number'] {
  width: 100%;
  max-width: 120px;
  padding: 0.5rem;
  font-size: 1rem;
  /* margin-bottom: 1rem; */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-primary {
  background-color: #1c3c78;
  color: white;
  border: none;
  padding: 2px 6px;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1c3c78;
}

.btn-outline-secondary {
  color: #6c757d;
  border: 1px solid #6c757d;
  background: none;
  padding: 12px;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alerts */
.alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1rem;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Product info table */
table.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

table.table th,
table.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

table.table th {
  text-align: left;
  background-color: #f9f9f9;
  font-weight: 700;
  color: #444;
}

table.table-striped tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

form {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
}

/* Sub-header styling */
.sub-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #222;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
}

/* Carousel images */
.img-fluid {
  max-height: 350px;
  object-fit: contain;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgb(0 0 0 / 0.1);
}

/* Carousel control buttons */
.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
}
</style>
