<template>
    <div :class="['cta-container', $attrs.class]"
        :style="`background-image: radial-gradient(circle at left center, rgba(3, 11, 59, 0.7), transparent 70%), url('${imageSrc}')`">
        <div class="cta-text">
            <p v-if="tag" class="cta-tag">{{ tag }}</p>
            <h2 class="cta-title">{{ title }}</h2>
            <p class="cta-paragraph">{{ paragraph }}</p>
            <button class="cta-button">{{ buttonText || 'Shop Now' }}</button>
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
    background-repeat: no-repeat;
    background-position: right;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(3, 3, 22, 0.1);
}


.cta-text {
    padding: 2rem;
    flex: 1;
    z-index: 2;
    position: relative;
    background: radial-gradient(circle at left center, rgb(1, 7, 41), rgba(1, 7, 41, 0.8) 60%, transparent 100%);
    color: white;
    height: 100%;
}



.cta-tag {
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.cta-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #fff;
}

.cta-paragraph {
    font-size: 0.8rem;
    color: #fff;
    margin-bottom: 1.5rem;
}

.cta-button {
    background-color: #072a64;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cta-button:hover {
    background-color: #072a64;
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