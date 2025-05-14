<template>
  <div class="sale-card">
    <div class="img-class">
      <img class="sale-card-image" :src="product_img" :alt="props.product.name" />
      <button @click="$emit('toggle-wishlist', props.product)" class="wishlist-btn">
        {{ props.product.inWishlist ? '♥' : '♡' }}
      </button>
      <span class="tag">{{ discountPercentage }}% Off</span>
      <span class="gallery"><img :src="gallery_img" alt="">1/8</span>
    </div>
    <div class="sale-card-content">
      <p>{{ props.product.category }}</p>
      <h5 class="sale-card-title">{{ props.product.name }}</h5>
      <div class="sale-card-rating">
        <div class="stars">
          <!-- Repeat stars based on props.product.rating -->
          <svg v-for="star in 5" :key="star" :class="star <= props.product.rating ? 'filled' : ''" class="star"
            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
            </path>
          </svg>
        </div>
        <span class="">(125)</span>
      </div>
      <div class="sale-card-price">
        <div class="prices">
          <span class="price-new">${{ props.product.new_price }}</span>
          <span class="price-old">${{ props.product.old_price }}</span>
        </div>
        <button @click="$emit('add-to-cart', props.product)" class="add-to-cart-btn">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import product_img from '/src/assets/images/product_img.png'
import gallery_img from '/src/assets/images/gallery.png'

// Destructure product prop
const props = defineProps({
  product: Object,
});

// Calculating discount percentage
const discountPercentage = computed(() => {
  if (!props.product || !props.product.old_price || !props.product.new_price) return 0;
  return ((props.product.old_price - props.product.new_price) / props.product.old_price * 100).toFixed(0);
});
</script>

<style scoped>
.sale-card {
  position: relative;
  width: 100%;
  /* max-width: 23%; */
  overflow: hidden;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sale-card-image {
  width: 100%;
  height: 15rem;
  object-fit: cover;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}


.sale-card-content {
  margin-top: 1rem;
  padding: 0 1.25rem 1.25rem;
}

.sale-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
}

.img-class {
  position: relative;
  overflow: hidden;
}

.sale-card-rating {
  display: flex;
  align-items: center;
  margin-top: 0.625rem;
  margin-bottom: 1.25rem;
}

.prices {
  display: flex;
  gap: 8px;
  align-items: center;
}


.stars {
  display: flex;
}

.star {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
  color: #fbbf24;
}

.sale-card-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-new {
  font-size: 1rem;
  font-weight: bold;
  color: #1e293b;
}

.price-old {
  font-size: 1rem;
  color: #4b5563;
  text-decoration: line-through;
}

.add-to-cart-btn {
  text-align: center;
  background-color: #224893;
  color: white;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.wishlist-btn {
  background-color: transparent;
  position: absolute;
  top: 4px;
  right: 4px;
  color: white;
  border: none;
  font-size: x-large;
}

.tag {
  text-align: center;
  background-color: #224893;
  color: white;
  font-size: smaller;
  border-bottom-right-radius: 16px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px;
}

.gallery {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: smaller;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px;
  display: flex;
  align-items: center;
}

.add-to-cart-btn:hover {
  background-color: #051e47;
}
</style>
