<template>
  <div id="app">
   <h1>{{ msg }}</h1>
   <div v-for="team in teams">
   	<br/> {{team.id}} - {{team.name}} 
   </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  teams : [],
    }
  }, 
  methods : {
  	addTeam: function(id,name){
  		var self = this;
  		var obj = {id : id, name : name};
  		self.teams.push(obj);
  	}
  },
  mounted: function(){
  	this.axios.get('https://www.openligadb.de/api/getavailableteams/bl1/2017').then((teams) => {
  		console.log(teams.data.length);
  		for(var i = 0; i < teams.data.length; ++i){
			var team = teams.data[i];
  			this.addTeam(team.TeamId,team.TeamName);
  		}
  	});
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
