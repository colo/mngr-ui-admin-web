<template>
  <div id="q-app">
    <router-view :key="$route.path +'.'+ $route.query.toString()"/>
  </div>
</template>

<script >
export default {
  name: 'App'
}
</script>
