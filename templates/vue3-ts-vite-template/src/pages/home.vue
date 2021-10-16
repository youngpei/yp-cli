<script setup lang="ts">
import { ref } from 'vue'
import TabBar from 'comps/TabBar.vue'

let message:any = ref('hello world!')
</script>

<template>
  <div class="home">
    <div class="content">{{message}}</div>
    <TabBar active="home" />
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
.home {
  padding-bottom: 100px;
}
</style>
