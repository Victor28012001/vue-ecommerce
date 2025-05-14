<template>
  <section class="hero">
    <div class="hero-content">
      <div class="new-arrivals">
        New Arrivals
        <span><img src="../assets/images/newArrivals.svg" alt="" /></span>
      </div>
      <h2>Smart <b>Gadgets,</b> <br /> <b>Smarter</b> Living</h2>
      <p>
        Experience the latest in tech with unbeatable quality and performance.
        Exclusive deals available for a limited time.
      </p>
      <div class="hero-buttons">
        <button class="btn primary">Shop Now</button>
        <button class="btn secondary">View All Products</button>
      </div>
    </div>

    <div class="hero-image">
      <img src="../assets/images/hero-lappy.png" alt="Laptop" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f7f7;
  /* very light gray */
  padding: 40px 4rem;
}

.hero-content {
  width: 50%;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-arrivals {
  position: relative;
  background-color: #e4edff;
  padding: 12px 20px;
  border-radius: 24px;
  font-weight: bold;
  font-size: 10px;
  display: inline-block;
  width: fit-content;
  color: #053379;
}

.new-arrivals span {
  position: absolute;
  top: -15px;
  right: -15px;
}

h2 {
  font-size: 46px;
  font-weight: 300;
  margin: 0;
}

p {
  font-size: 12px;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 10px;
}

.primary {
  background-color: #053379;
  color: #fff;
}

.secondary {
  background-color: #fcfbfb;
  color: #053379;
  border: 1px #c0bfbf solid;
}

.hero-image img {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.hero-image {
  width: 50%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 1.5rem 2rem;
    height: 80vh;
  }

  .hero-image {
    width: 100%;
    display: flex;
    justify-content: center;
  }


  .hero-content {
    width: 100%;
    max-width: 1500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>