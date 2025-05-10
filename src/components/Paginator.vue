<template>
  <div class="container" v-if="totalPages > 0">
    <ul class="pagination">
      <template v-if="totalPages === 1">
        <li class="active">
          <a href="#" @click.prevent>{{ page }}</a>
        </li>
      </template>

      <template v-else>
        <li :class="{ disabled: page <= 1 }">
          <a class="move" href="#" @click.prevent="changePage(page - 1)">Prev</a>
        </li>

        <!-- ✅ Apply active class manually if current page is 1 -->
        <li v-if="pagesToShow[0] !== 1" :class="{ active: page === 1 }">
          <a href="#" @click.prevent="changePage(1)">1</a>
        </li>

        <li v-if="pagesToShow[0] > 2">
          <span class="dots">...</span>
        </li>

        <li v-for="n in pagesToShow" :key="n" :class="{ active: n === page }">
          <a href="#" @click.prevent="changePage(n)">{{ n }}</a>
        </li>

        <li v-if="pagesToShow.at(-1) < totalPages - 1">
          <span class="dots">...</span>
        </li>

        <!-- ✅ Apply active class manually if current page is the last page -->
        <li v-if="pagesToShow.at(-1) !== totalPages" :class="{ active: page === totalPages }">
          <a href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
        </li>

        <li :class="{ disabled: page >= totalPages }">
          <a class="move" href="#" @click.prevent="changePage(page + 1)">Next</a>
        </li>
      </template>

    </ul>
  </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: Number,
  totalPages: Number
})

const emit = defineEmits(['change'])

function changePage(newPage) {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('change', newPage)
  }
}

const pagesToShow = computed(() => {
  const total = props.totalPages
  const current = props.page
  const range = []

  let start = Math.max(2, current - 2)
  let end = Math.min(total - 1, current + 2)

  // Ensure we show 5 numbers if possible
  if (current <= 3) {
    start = 2
    end = Math.min(5, total - 1)
  } else if (current >= total - 2) {
    start = Math.max(2, total - 4)
    end = total - 1
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 12px;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.pagination li {
  margin: 0 4px;
}

.pagination li a {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.pagination li a.move {
  border: none;
  color: black;
}

.pagination li.active>a {
  color: #007bff;
  border-color: #007bff;
}



.pagination li.disabled a {
  color: #aaa;
  pointer-events: none;
  border-color: #dee2e6;
}

.dots {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #666;
}
</style>
