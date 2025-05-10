<template>
    <div :class="['cta-container', $attrs.class]">
        <!-- Left Content -->
        <div class="cta-text">
            <p v-if="tag" class="cta-tag">{{ tag }}</p>
            <h2 class="cta-title">{{ title }}</h2>
            <p class="cta-paragraph">{{ paragraph }}</p>
            <button class="cta-button">Shop Now</button>
        </div>

        <!-- Right Image -->
        <div class="cta-image-wrapper">
            <img :src="imageSrc" alt="CTA Image" class="cta-image" />
            <div class="cta-overlay"></div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    tag: { type: String, default: null },
    paragraph: String,
    buttonText: String,
    imageSrc: String,
});
</script>

<style scoped>
/* Default styles */
.cta-container {
    display: flex;
    flex-direction: row;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(3, 3, 22, 0.1);
}

@media (min-width: 768px) {
    .cta-container {
        flex-direction: row;
    }
}

.cta-text {
    padding: 2rem;
    flex: 1;
    z-index: 2;
    position: relative;
    background: radial-gradient(circle at left center, rgba(3, 11, 59, 0.7), transparent 100%);
    color: white;
}



.cta-tag {
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.cta-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #fff;
}

.cta-paragraph {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 1.5rem;
}

.cta-button {
    background-color: #030235;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cta-button:hover {
    background-color: #0d0f2c;
}

.cta-image-wrapper {
    position: relative;
    flex: 1;
    max-height: 320px;
}

@media (min-width: 768px) {
    .cta-image-wrapper {
        height: auto;
    }

    .cta-container {
        display: flex;
        flex-direction: column;
    }
}

.cta-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.cta-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

/* Modifier for small CTA */
.cta-container.cta-small .cta-text {
    padding: 1rem;
}

.cta-container.cta-small .cta-tag {
    font-size: 0.65rem;
    margin-bottom: 0.25rem;
}

.cta-container.cta-small .cta-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.cta-container.cta-small .cta-paragraph {
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.cta-container.cta-small .cta-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}
</style>