<template>
  <div class="sort-options">
    <div class="sort-by">
      <span>Sort by:</span>
      <select class="dropdown" @change="$emit('sort-changed', $event.target.value)">
        <option value="">None</option>
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>

    <div class="usage-filters" v-if="isDesktop && usageTypes.length">
      <!-- Show first 4 buttons -->
      <button v-for="(use, index) in visibleUsages" :key="use" @click="handleUsageClick(use)"
        :class="{ active: use === selectedUsage }">
        {{ use }}
      </button>

      <!-- Ellipsis button if more than 4 -->
      <div v-if="hiddenUsages.length" class="dropdown-container">
        <button class="ellipsis-button" @click="toggleDropdown">…</button>
        <div v-if="dropdownOpen" class="dropdown-menu">
          <button v-for="use in hiddenUsages" :key="use" @click="handleUsageClick(use)"
            :class="{ active: use === selectedUsage }">
            {{ use }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { usageTypes } = defineProps({
  usageTypes: {
    type: Array,
    default: () => [],
  },
  isDesktop: Boolean,
})

const emit = defineEmits(['usage-changed'])

const selectedUsage = ref(null)
const dropdownOpen = ref(false)

function handleUsageClick(use) {
  selectedUsage.value = use
  emit('usage-changed', use)
  dropdownOpen.value = false // close dropdown after selection
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

const visibleUsages = computed(() => usageTypes.slice(0, 4))
const hiddenUsages = computed(() => usageTypes.slice(4))
</script>


<style scoped>
.sort-options {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 20px 0;
  margin: 12px 0;
  width: 100%;
}

.dropdown {
  padding: 6px;
  border: 2px #f0f0f0 solid;
  border-radius: 6px;
}

.sort-by {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.usage-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.usage-filters button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  vertical-align: middle;
}

.usage-filters button.active {
  color: #04112b;
  border-color: #060d2c;
}

.usage-filters .ellipsis-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background: white;
  font-weight: bold;
  cursor: pointer;
  line-height: 0;
  padding: 0;
}

.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 36px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  z-index: 10;
}

.dropdown-menu button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}
</style>
