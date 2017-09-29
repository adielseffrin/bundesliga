// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

function Teams(){
	this.teamsList = new Array();

	this.addTeam = function(team){
		this.teamsList.push(team);
	}
};

function Team (name,id,logo){
	this.name = name;
	this.id = id;
	this.logo = logo;

	this.win = 0;
	this.draw = 0;
	this.lose = 0;
}





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data : {
  	teams: new Teams(),
  }
  
})


