export default function(){
	this.teamsList = new Array();

	this.addTeam = function(team){
		this.teamsList.push(team);
	}
};