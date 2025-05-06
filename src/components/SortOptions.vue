<template>
    <div class="sort-options">
      <select @change="$emit('sort-changed', $event.target.value)">
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  </template>
  