<script setup lang="ts">
defineProps<{ active: string }>()
</script>

<template>
  <van-tabbar safe-area-inset-bottom route>
    <van-tabbar-item name="home" replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item name="tools" replace to="/tools" icon="search">工具</van-tabbar-item>
    <van-tabbar-item icon="friends-o">消息</van-tabbar-item>
    <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
