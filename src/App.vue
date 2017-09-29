<template>
  <div id="app">
    <div id="classification">
		
		  <div v-if="teams.count() > 0">oi</div>

    </div>
    <div id="fixtures"></div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
