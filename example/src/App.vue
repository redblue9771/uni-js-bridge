<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <!-- <transition> -->
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
    <!-- </transition> -->
  </router-view>
</template>

<style></style>
