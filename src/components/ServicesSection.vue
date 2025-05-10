<template>
  <section class="services">
    <h2>Our Services</h2>
    <div class="services-list">
      <div class="service-item" v-for="(service, index) in services" :key="index">
        <img :src="service.image" :alt="service.title" />
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import deliveryImg from '../assets/images/delivery.png';
import secureImg from '../assets/images/secure.png';
import returnImg from '../assets/images/return.png';
import flexibleImg from '../assets/images/flexible.png';
import supportImg from '../assets/images/support.png';

const services = [
  {
    title: "Free Delivery",
    description: "Free shipping on all orders over ₦5,000,000",
    image: deliveryImg
  },
  {
    title: "Secure Payment",
    description: "100% secure payment systems",
    image: secureImg
  },
  {
    title: "30-Day Returns",
    description: "Easy returns within 30 days",
    image: returnImg
  },
  {
    title: "Flexible Payment",
    description: "Multiple payment options available",
    image: flexibleImg
  },
  {
    title: "24/7 Support",
    description: "Dedicated support anytime",
    image: supportImg
  }
];
</script>


<style scoped>
.services {
  padding: 2rem;
  text-align: center;
}

.services h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 250px;
  margin: 0 auto;
}

.service-item img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.service-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.service-item p {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

/* Responsive Layout */
@media (min-width: 768px) {
  .services-list {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
