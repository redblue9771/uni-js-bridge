import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppInfo = defineStore('app-info', () => {
  const client = ref<'H5' | 'UniApp'>('H5')

  const switchClient = (envName: 'H5' | 'UniApp') => {
    client.value = envName

  }

  return {
    client,
    switchClient
  }
})