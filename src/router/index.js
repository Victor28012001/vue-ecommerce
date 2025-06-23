import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Cart from "../pages/Cart.vue";
import Wishlist from "../pages/Wishlist.vue";
import CategoryView from "../pages/CategoryView.vue";
import CheckoutPage from "../pages/CheckoutPage.vue";
import ProductPage from "../pages/ProductPage.vue";
import LoginRegister from "../pages/LoginRegister.vue";
import Dashboard from "../pages/Dashboard.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/cart", name: "Cart", component: Cart },
  { path: "/wishlist", name: "Wishlist", component: Wishlist },
  { path: "/checkout", name: "Checkout", component: CheckoutPage },
  { path: "/allProducts", name: "All Products", component: ProductPage },
  {
    path: "/loginRegister",
    name: "Login || Register",
    component: LoginRegister,
  },
  { path: "/category/:name", name: "Category", component: CategoryView },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/products/:id",
    name: "ProductPage",
    component: () => import("../pages/Product.vue"), // Adjust path
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
