<template>
  <div id="app">
   <h1>{{ msg }}</h1>
   <div v-for="team in teams"></div>
  </div>
</template>

<script>
import Teams from "./models/teams.model.js";
import Team from "./models/team.model.js";

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  teams : new Teams(),
    }
  }, 
  methods : {
  
  }
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
