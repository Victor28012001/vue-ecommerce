<template>
    <section class="hero" :style="{ backgroundImage: `url(${background})` }">
        <div class="hero-content">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
        </div>
    </section>
</template>

<script setup>
defineProps({
    background: String,
    title: String,
    description: String,
});
</script>

<style scoped>
.hero {
    width: 100%;
    height: 40vh;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: start;
    color: white;
    text-align: left;
    position: relative;
}

.hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    /* dark overlay */
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    padding: 1rem;
}

.hero-content h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
}

</style>