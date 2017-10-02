<template>
  <div id="app">
   <div class="header">
   <img width="200" class="logo-lg" src="//s.bundesliga.com/2016/img/logo2017.svg" lt="bundesliga.com">
   </div>
  <div class="ranking">
   <table>
	<thead>
		<tr>
			<th>Pos.</th>
			<th>Team</th>
			<th>Punkt</th>
			<th>Spiele</th>
			<th>g.</th>
			<th>u.</th>
			<th>v.</th>
			<th>Tore</th>
			<th>Diff.</th>
			<th>%</th>
		</tr>	
	</thead>
	<tbody>
		<tr v-for="(team,k,i) in teams">
			<td>{{ k+1 }}</td>
			<td> <img class="ranking-team-logo" v-bind:src="team.data.TeamIconUrl"> {{team.name}} </td>
			<td class="ranking-data gray"> {{team.points}} </td>
			<td class="ranking-data"> {{team.games}} </td>
			<td class="ranking-data gray"> {{team.wins}} </td>
			<td class="ranking-data"> {{team.draws}} </td>
			<td class="ranking-data gray"> {{team.losses}} </td>
			<td class="ranking-data "> {{team.goalsPro}}:{{team.goalsCon}} </td>
			<td class="ranking-data gray"> {{team.goalsPro - team.goalsCon}} </td>
			<td class="ranking-data " v-if="team.games > 1"> {{(team.points/(team.games*3)*100).toFixed(2)}} </td>
						
		</tr>
	</tbody>
   </table>
   </div>
   <div class="schedule" v-if="schedule.length > 0">
   	<table>
	<thead>
		<tr>
			<th> 
			<span v-on:click="prevRound" class="round prev"> <i class="fa fa-arrow-left" aria-hidden="true"></i> </span>
			 {{actualRound}} 
			 <span v-on:click="nextRound" class="round next"> <i class="fa fa-arrow-right" aria-hidden="true"></i> </span>
			 </th>
			
		</tr>	
	</thead>
	<tbody>
		<tr v-for="s in schedule" v-if="s.round == activeRound">
			<td> 
				<div class="match-result">
					<div class="match-team1">
						<div class="descript">
							<img v-bind:src="s.team1.TeamIconUrl"><br/>
							{{s.team1.ShortName}}
						</div>
						<div class="score"> {{s.score1}} </div>
					</div>
						<div class="versus"> x </div>
					<div class="match-team2">
						<div class="descript">
							<img v-bind:src="s.team2.TeamIconUrl"><br/>
							{{s.team2.ShortName}}
						</div>
						<div class="score"> {{s.score2}} </div>
					</div>
				</div>
				<div class="match-date">{{s.date}} - {{s.place}}</div>
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
  	addTeam: function(team){
  		var self = this;
  		var obj = {
  			id : team.TeamId, 
  			name : team.TeamName,
  			wins: 0,
  			draws: 0,
  			losses: 0,
  			points: 0,
  			goalsPro : 0,
  			goalsCon : 0,
  			games: 0,
  			data : team
  			};
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
  	addResult : function(teamId1, points1, teamId2, points2){
  		this.addGoalsPro(teamId1,points1);
  		this.addGoalsPro(teamId2,points2);

  		this.addGoalsCon(teamId1,points2);
  		this.addGoalsCon(teamId2,points1);
  	},
  	addGoalsPro : function(teamId,goals){
  		this.getTeam(this.teams,teamId)[0].goalsPro += goals;
  	},
  	addGoalsCon : function(teamId,goals){
  		this.getTeam(this.teams,teamId)[0].goalsCon += goals;
  	},
  	getTeam: function(teams, teamId){
  		return teams.filter(function(el){return el.id == teamId;});
  	},
  	nextRound: function(){this.activeRound++;},
  	prevRound: function(){if(this.activeRound > 28947) this.activeRound--;},
  	setRound: function(round){
  		this.activeRound = round;
  	},
  	formatDate : function(date){
		var d = new Date(date);
  		return d.getDate()+'.'+d.getMonth()+' '+d.getHours()+':'+(d.getMinutes() < 10 ? '0' : '')+d.getMinutes();
  	},
  },
  computed: {
  	actualRound: function(){
  		return this.activeRound - 28946+'. Spieltag';
  	}
  },
  mounted: function(){
  	/*get all teams*/
  	this.axios.get('https://www.openligadb.de/api/getavailableteams/bl1/2017').then((teams) => {
  		for(var i = 0; i < teams.data.length; ++i){
			var team = teams.data[i];
  			this.addTeam(team);
  		}
  	});

	this.axios.get('https://www.openligadb.de/api/getmatchdata/bl1/2017').then((matches) => {
  		this.matches = matches.data;
  		var m = '';
  		var r = '';
  		
  		for(var i = 0; i < this.matches.length; ++i){
  			m = this.matches[i];

  			if(!m.Team1.ShortName) m.Team1.ShortName = this.getTeam(this.teams,m.Team1.TeamId)[0].name;
  			if(!m.Team2.ShortName) m.Team2.ShortName = this.getTeam(this.teams,m.Team2.TeamId)[0].name;

  			this.schedule.push({
	  			round : m.Group.GroupID,
	  			team1 : m.Team1,
	  			team2 : m.Team2,
	  			score1 : (m.MatchResults[1] ? m.MatchResults[1].PointsTeam1 : '-'),
	  			score2 : (m.MatchResults[1] ? m.MatchResults[1].PointsTeam2 : '-'),
	  			date: this.formatDate(m.MatchDateTime),
	  			place: (m.Location ? m.Location.LocationStadium + ' - ' + m.Location.LocationCity : ''),
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
	  			this.addResult(m.Team1.TeamId,r.PointsTeam1,m.Team2.TeamId,r.PointsTeam2);
	  		}
	  	}
	  	this.teams.sort(function(a,b){return (b.points + (b.goalsPro - b.goalsCon)/1000) - (a.points + (a.goalsPro - a.goalsCon)/1000)});	
	  	this.axios.get('https://www.openligadb.de/api/getmatchdata/bl1').then((matches) => {
			this.setRound(matches.data[0].Group.GroupID);
		});
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
  width: 100%;
}

.header{
	position: relative;
	float: left;
	width: 100%;
	border-bottom: 1px solid red;
	margin-bottom: 2%;
}

.table {
	position: relative;
	float: left;
}

.schedule {
	position: relative;
	float: left;
}

.match-result{
	position: relative;
	height: 45px;
}

.match-team1 {
	position: relative;
	float: left;
	width: 160px;
	
}

.match-team1 > .descript {
	position: relative;
	float:left;
	width: 80%;
	
}

.match-team1 > .score {
	position: relative;
	float:left;
	width: 20%;
	margin-top: 5%;
	font-size: x-large;

}

.match-team2 {
	position: relative;
	float: left;
	width: 160px;

}

.match-team2 > .descript {
	position: relative;
	float:right;
	width: 80%;
}

.match-team2 > .score {
	position: relative;
	float:left;
	width: 20%;
	margin-top: 5%;
	font-size: x-large;

}

.versus{
	position: relative;
	float: left;
	margin: 5% 10px 0 10px;
}



.match-date{
	position: relative;
}

.ranking {
	position: relative;
	float: left;
	width: 40%;
	min-width: 540px;
	left: 20%;

}

.ranking-data {
	width: 55px;
}

.gray{
	background: rgba(245,245,245,1);
}

.ranking > table > tbody > tr{
	position: relative;
    height: 35px;
}

.ranking > table > tbody > tr > td{
	position: relative;
    height: 35px;
    border-bottom: 1px solid gray;
}

.schedule{
	position: relative;
	float: left;
	left: 20%;
}

.schedule > table > tbody > tr:nth-child(2n+1){
	background: rgba(245,245,245,1);
}
.schedule > table > tbody > tr:nth-child(2n){
	background: rgba(255,255,255,1);	
}

.schedule > table > thead > tr {
	 border-bottom: 1px solid red;
}

.round{
	cursor: pointer;
}

.round.prev{
	float: left;
}

.round.next{
	float: right;
}

.ranking-team-logo{
	position: relative;
	float: left;
	margin-right: 10px;
}

</style>
