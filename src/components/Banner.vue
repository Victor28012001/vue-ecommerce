<template>
    <section class="hero">
      <div class="new-arrivals">
        <button class="new-tag">+23481234567</button>
        <!-- <button class="new-tag">New</button> -->
        <span class="sale-text">Macanthony615@gmail.com</span>
        <!-- <span class="sale-text">Sale ₦1200 Off Your First Order</span> -->
      </div>
    </section>
  </template>
  
  <style scoped>
  .hero {
    background-color: #224893;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .new-arrivals {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* little gap between items */
    color: white;
  }
  
  .new-tag {
    background: transparent;
    border: 1px solid white;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 9999px; /* capsule shape */
    font-size: 0.875rem;
    font-weight: 600;
    cursor: default;
  }
  
  .sale-text {
    font-size: 0.875rem;
    font-weight: 400;
  }
  </style>
  