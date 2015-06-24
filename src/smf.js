var ajax = require('ajax'),
	Promise = require('promise'),
	state = require('state'),
	api = function(path){
		path = path.filter(function(){return true;}).join('/');
		console.log('SMF CALL: '+path);
		return new Promise(function(resolve,reject){
			var url = 'https://api.ourl.ca/v1/'+path;
			ajax({
				url: url,
				type: 'json',
				method: 'post',
				data: {
					api_key: state.api_key
				}
			},function(data){
				if(data.error){
					reject(data);
				}else{
					resolve(data);
				}
			},function(data){
				if(data===null){
					data = {};
				}
				reject(data);
			});
		});
	};
module.exports = {
	info: {
		smf: function(prop){
			return api(['info','smf',prop]);
		},
		category: function(id,prop){
			return api(['info','category',id,prop]);
		},
		board: function(id,prop){
			return api(['info','board',id,prop]);
		},
		topic: function(id,prop){
			return api(['info','topic',id,prop]);
		},
		post: function(id,prop){
			return api(['info','post',id,prop]);
		},
		member: function(id,prop){
			return api(['info','member',id,prop]);
		},
		recent: function(amount,page){
			return api(['info','recent',amount,page]);
		},
		url: function(prop){
			return api(['info','url',prop]);
		}
	},
	search: {
		category: function(term,page){
			return api(['search','category',term,page]);	
		},
		board: function(term,page){
			return api(['search','board',term,page]);	
		},
		topic: function(term,page){
			return api(['search','topic',term,page]);	
		},
		post: function(term,page){
			return api(['search','post',term,page]);	
		},
		member: function(term,page){
			return api(['search','member',term,page]);	
		}
	}
};