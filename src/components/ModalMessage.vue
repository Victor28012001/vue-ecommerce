<!-- components/ModalMessage.vue -->
<template>
    <transition name="fade">
        <div v-if="visible" class="modal-backdrop" @click.self="close">
            <div class="modal-content" :class="typeClass">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button class="close" @click="close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="close">Close</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    title: { type: String, default: 'Notification' },
    message: { type: String, required: true },
    type: { type: String, default: 'error' }, // success | warning | error | info
    show: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const visible = ref(props.show)

watch(() => props.show, val => {
    visible.value = val
})

const close = () => {
    visible.value = false
    emit('close')
}

const typeClass = computed(() => {
    return {
        'modal-error': props.type === 'error',
        'modal-success': props.type === 'success',
        'modal-warning': props.type === 'warning',
        'modal-info': props.type === 'info',
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
}

.modal-header,
.modal-footer {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 1rem;
}

.modal-error {
    border-left: 6px solid #dc3545;
}

.modal-success {
    border-left: 6px solid #28a745;
}

.modal-warning {
    border-left: 6px solid #ffc107;
}

.modal-info {
    border-left: 6px solid #17a2b8;
}

.close {
    background: transparent;
    border: none;
    font-size: 1.5rem;
}
</style>
