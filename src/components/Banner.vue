<template>
  <section class="hero">
    <div class="new-arrivals">
      <a :href="'https://wa.me/' + whatsappNumber" target="_blank" style="text-decoration: none; color: inherit;">
        <span style="display: flex; align-items: center; gap: 0.2rem;">
          <!-- <button class="new-tag"> -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6" style="width: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
          </svg>
          {{ displayNumber }}
        </span>
      </a>

      <!-- Email Link -->
      <a :href="'mailto:' + email + '?subject=Hello&body=I saw your website and wanted to reach out.'" style="text-decoration: none; color: inherit;">
        <span class="sale-text" style="display: flex; align-items: center; gap: 0.2rem;"><svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-6" style="width: 24px;">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          {{ email }}
        </span>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      whatsappNumber: '23481234567', // for wa.me link (no + or spaces)
      displayNumber: '+234 812 345 67', // formatted for user display
      email: 'Ifeanyivictor615@gmail.com'
    };
  }
};
</script>

<style scoped>
.hero {
  background-color: #224893;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

.new-arrivals {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* little gap between items */
  color: white;
}

.new-tag {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  /* capsule shape */
  font-size: 0.875rem;
  font-weight: 600;
  cursor: default;
}

.sale-text {
  font-size: 0.875rem;
  font-weight: 400;
}
</style>