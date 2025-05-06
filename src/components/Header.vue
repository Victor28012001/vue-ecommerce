<template>
    <header>
        <div class="start">
            <router-link to="/" class="router-link links">
                <h1>LOGO</h1>
            </router-link>
            <div class="search-bar">
                <input placeholder="Search for products, brands.." class="input" name="search" type="text" />
                <button class="button">Search</button>
            </div>
        </div>

        <div class="end">
            <router-link to="/wishlist" class="router-link links">
                <HeartIcon class="icon" />
                <span>Wishlist</span>
            </router-link>
            <router-link to="/cart" class="router-link links">
                <ShoppingCartIcon class="icon" />
                <span>Cart</span>
            </router-link>
        </div>
    </header>
</template>

<script setup>
import { ShoppingCartIcon, HeartIcon } from '@heroicons/vue/outline'
</script>

<style scoped>
.icon {
    width: 16px;
    height: 16px;
}

.start {
    display: flex;
    width: 70%;
    gap: 24px;
}

.search-bar {
    display: flex;
    align-items: center;
    width: 70%;
}

.input {
    height: 34px;
    font-size: 14px;
    color: #242222;
    padding: 0 12px;
    border: 1px solid #bebebe;
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    outline: none;
    box-sizing: border-box;
    width: 80%;
}

.button {
    height: 34px;
    font-size: 14px;
    padding: 0 16px;
    background-color: #053379;
    color: #fff;
    border: none;
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    cursor: pointer;
    box-sizing: border-box;
}


header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 12px;
    border-bottom: 1px #dddddd solid;
}

.links {
    display: flex;
    align-items: center;
    font-family: "Roboto", sans-serif;
    font-size: 12px;
}

.end {
    display: flex;
    align-items: center;
    gap: 12px;
}

h1 {
    font-family: "Roboto", sans-serif;
}
</style>
