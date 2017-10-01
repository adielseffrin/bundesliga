<template>
  <div id="app">
   <h1>{{ msg }}</h1>
  <div class="table">
   <table>
	<thead>
		<tr>
			<th>Team</th>
			<th>M</th>
			<th>W</th>
			<th>D</th>
			<th>L</th>
			<th>Points</th>
		</tr>	
	</thead>
	<tbody>
		<tr v-for="team in teams">
			<td> {{team.name}} </td>
			<td> {{team.games}} </td>
			<td> {{team.wins}} </td>
			<td> {{team.draws}} </td>
			<td> {{team.losses}} </td>
			<td> {{team.points}} </td>
		</tr>
	</tbody>
   </table>
   </div>
   <div class="schedule">
   	<table>
	<thead>
		<tr>
			<th> <span v-on:click="prevRound" style="cursor: pointer;"> < </span>
			 {{actualRound}} 
			 <span v-on:click="nextRound" style="cursor: pointer;"> > </span></th>
			
		</tr>	
	</thead>
	<tbody>
		<tr v-for="s in schedule" v-if="s.round == activeRound">
			<td> 
				<img v-bind:src="s.team1.TeamIconUrl">{{s.team1.ShortName}} {{s.score1}} x {{s.score2}} <img v-bind:src="s.team2.TeamIconUrl"> {{s.team2.ShortName}} 
			</td>
		</tr>
	</tbody>
   </table>
   </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      msg: 'Bundesliga 2017/2018 table',
	  teams : [],
	  matches : [],
	  schedule : [],
	  groups : [],
	  lastUpdate : '',
	  activeRound : 28947
    }
  }, 
  methods : {
  	addTeam: function(id,name){
  		var self = this;
  		var obj = {
  			id : id, 
  			name : name,
  			wins: 0,
  			draws: 0,
  			losses: 0,
  			points: 0,
  			games: 0};
  		self.teams.push(obj);
  	},
  	addWin: function(teamId){
  		this.getTeam(this.teams,teamId)[0].wins++;
  		this.getTeam(this.teams,teamId)[0].points += 3;
  	},
  	addDraw: function(teamId){
  		this.getTeam(this.teams,teamId)[0].draws++;
  		this.getTeam(this.teams,teamId)[0].points ++;
  	},
  	addLoss: function(teamId){
  		this.getTeam(this.teams,teamId)[0].losses++;
  	},
  	addGame: function(teamId1, teamId2){
  		this.getTeam(this.teams,teamId1)[0].games++;
  		this.getTeam(this.teams,teamId2)[0].games++;
  	},
  	getTeam: function(teams, teamId){
  		return teams.filter(function(el){return el.id == teamId;});
  	},
  	nextRound: function(){this.activeRound++;},
  	prevRound: function(){if(this.activeRound > 28947) this.activeRound--;},
  },
  computed: {
  	actualRound: function(){
  		/*switch(this.activeRound){
  			case 28947:
  				return '1. Spieltag';
  				break;
  			default:
  				return 'Bundesliga';
  				break;
  		}*/
  		return this.activeRound - 28946+'. Spieltag';
  	}
  },
  mounted: function(){
  	/*get all teams*/
  	this.axios.get('https://www.openligadb.de/api/getavailableteams/bl1/2017').then((teams) => {
  		for(var i = 0; i < teams.data.length; ++i){
			var team = teams.data[i];
  			this.addTeam(team.TeamId,team.TeamName);
  		}
  		console.log(teams.data[0]);
  		
  	});

	this.axios.get('https://www.openligadb.de/api/getmatchdata/bl1/2017').then((matches) => {
  		this.matches = matches.data;
  		var m = '';
  		var r = '';
  		for(var i = 0; i < this.matches.length; ++i){
  			m = this.matches[i];

  			this.schedule.push({
	  			round : m.Group.GroupID,
	  			team1 : m.Team1,
	  			team2 : m.Team2,
	  			score1 : (m.MatchResults[1] ? m.MatchResults[1].PointsTeam1 : '-'),
	  			score2 : (m.MatchResults[1] ? m.MatchResults[1].PointsTeam2 : '-'),
  			});

  			if(m.MatchIsFinished){
	  			r = m.MatchResults[1];
	  			if(r.PointsTeam1 > r.PointsTeam2){
	  				this.addWin(m.Team1.TeamId);
	  				this.addLoss(m.Team2.TeamId);
	  			}else if(r.PointsTeam1 < r.PointsTeam2){
	  				this.addWin(m.Team2.TeamId);
	  				this.addLoss(m.Team1.TeamId);
	  			}else{
	  				this.addDraw(m.Team1.TeamId);
	  				this.addDraw(m.Team2.TeamId);
	  			}
	  			this.addGame(m.Team1.TeamId,m.Team2.TeamId);
	  		}
	  	}
	  	this.teams.sort(function(a,b){return b.points - a.points});	
  	});

  	/*this.axios.get('https://www.openligadb.de/api/getmatchdata/bl1').then((matches) => {
  		
  		console.log(matches);
  	});

  	this.axios.get('https://www.openligadb.de/api/getlastchangedate/bl1/2017/15').then((matches) => {
  		
  		console.log(matches);
  	});*/




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

.table {
	position: relative;
	float: left;
}

.schedule {
	position: relative;
	float: right;
}
</style>
