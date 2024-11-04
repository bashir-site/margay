/*!
 * MatroNet JavaScript Library v1.0
 */
(function( window, undefined ) {
	var MatroNet = {};
	MatroNet.url = window.location.protocol + '//' + window.location.hostname + '/api/v1/';
	//MatroNet.url = 'https://api.matronet.com/v1/';
	MatroNet.validate = {};
	
	MatroNet.validate.isSet = function(property) {
		return !!property || false;
	}
	
	MatroNet.validate.isNum = function(property) {
		return !!Number(property) || Number(property) === 0 || false;
	}
	
	MatroNet.validate.isRange = function(property, start, end) {
		return (property >= start && property <= end) || false;
	}
	
	MatroNet.validate.isFormat = function(property) {
		return property === 'json' || property === 'html' || property === 'xml' || false;
	}

	MatroNet.validate.isArr = function(property) {
		return Array.isArray(property);
	}


	MatroNet.token = {
		'key': 'user-token'
	};

	MatroNet.token.set = function(token){
		var D = new Date();
		D.setMonth(D.getMonth() + 6);
		MN.Cookie.Set(MatroNet.token.key, token, D, '/');
	}

	MatroNet.token.get = function(){
		return MN.Cookie.FullGet(MatroNet.token.key) || null;
	}

	MatroNet.token.remove = function(){
		MN.Cookie.FullDelete(MatroNet.token.key);
	}

	MatroNet.methodRequest = function(method){
		var m = 'post';
        if(
        	method == 'invitation.data' ||
        	method == 'tasks.getWeek' ||
        	method == 'tasks.get' ||
        	method == 'projects.get' ||
        	method == 'projects.getTags' ||
        	method == 'projects.userProjects' ||
        	method == 'tape.get' ||
        	method == 'team.get' ||
        	method == 'specialists.get' ||
        	method == 'orders.get' ||
        	method == 'orders.order.get' ||
        	method == 'orders.responses.get' ||
        	method == 'data.geo.cities' ||
        	method == 'tasks.task.get' ||
        	method == 'tasks.views.get' ||
        	method == 'tasks.task.events.get' ||
        	method == 'projects.widgets.kanban.tasks.get' ||
        	method == 'projects.widgets.kanban.get' ||
        	method == 'projects.widgets.kanban.board.get' ||
        	method == 'projects.widgets.categories.get' ||
        	method == 'projects.widgets.categories.tree.get' ||
        	method == 'projects.widgets.categories.tree.node' ||
        	method == 'projects.widgets.files.get' ||
        	method == 'projects.widgets.files.data'
        ){
        	m = 'get';
        } 
		return m;
	}

	MatroNet.request = function(method, data = {}, callback){
		data.method = method;
		data.jwt = MatroNet.token.get();
		if(MatroNet.methodRequest(method) == 'post'){
		    $.post(MatroNet.url, data, function(response){
		        if(typeof callback == 'function'){
		            callback.call(this, response);
		        }
		    }, 'json');
		}else{
		    $.get(MatroNet.url, data, function(response){
		        if(typeof callback == 'function'){
		            callback.call(this, response);
		        }
		    }, 'json');
		}
	};
	
	window.$mn = MatroNet;

})(window);
