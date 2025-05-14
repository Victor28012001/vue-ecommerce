<template>
  <footer class="footer">
    <div class="footer_details">
      <div class="footer_logo">
        <h3>LOGO</h3>
        <p>Premium tech products with flexible payment options and exceptional service.</p>
        <div class="socials">
          <img :src="facebook" alt="Facebook" />
          <img :src="insta" alt="Instagram" />
          <img :src="linkedin" alt="LinkedIn" />
        </div>
      </div>
      <ul class="right">
        <li><a href="#">Laptops</a></li>
        <li><a href="#">Desktops</a></li>
        <li><a href="#">Printers</a></li>
        <li><a href="#">Monitors</a></li>
        <li><a href="#">Phones</a></li>
        <li><a href="#">Accessories</a></li>
      </ul>
    </div>
    <div class="footer_bottom">
      <div class="footer_line"></div>
      <p>&copy; {{ date }} All rights reserved.</p>
      <img :src="footer_img" alt="Footer Decoration" />
    </div>
  </footer>
</template>

<script setup>
const date = new Date().getFullYear();
import facebook from "../assets/images/facebook.png";
import insta from "../assets/images/insta.png";
import linkedin from "../assets/images/linkedin.png";
import footer_img from "../assets/images/footer_img.png";
</script>

<style scoped>
.footer {
  background-color: #111827;
  color: white;
  padding: 2rem 4rem;
  padding-bottom: 0;
  font-family: sans-serif;
}

.footer_details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer_logo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.footer_line {
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  width: 85%;
  margin: 0.5rem 0;
  z-index: 1;
  position: absolute;

}

.footer_logo h3 {
  margin: 0;
  font-size: 1.5rem;
}

.footer_logo p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.socials {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.socials img {
  width: 24px;
  height: 24px;
}

.right {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  /* flex-direction: column; */
}

.right li a {
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
}

.footer_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  width: 60%;
  z-index: 2;
}

.footer_bottom p {
  margin: 0;
  font-size: 0.8rem;
  position: relative;
  margin-top: 18px;
}


.footer_bottom img {
  position: relative;
  z-index: 4;
}


/* Responsive */
@media (min-width: 768px) {
  .footer_details {
    flex-direction: row;
    justify-content: space-between;
  }

  .right {
    /* flex-direction: column; */
    text-align: right;
  }
}


/* Responsive */
@media (max-width: 768px) {
  .footer_bottom img {
    width: 60%;
    position: absolute;
    right: 24px;
    bottom: 0;
  }

  .footer_bottom {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .footer_details {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }

  .right {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  .footer {
    height: 40vh;
    position: relative;
    padding: 2rem 2rem;
  }

}
</style>
