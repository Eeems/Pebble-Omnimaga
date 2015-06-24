var extend = require('extend'),
	Prop = extend.Prop,
	Settings = require('settings'),
	gs = function(){
		var s = Settings.data('state');
		return s===null?{}:s;
	},
	ss = function(s){
		Settings.data('state',s);
	},
	state = {};
extend(state,{
	api_key: new Prop({
		get: function(){
			var k = Settings.option('api_key');
			return k===undefined?'':k;
		},
		set: function(val){
			Settings.option('api_key',val);
		}
	}),
	id: new Prop({
		get: function(){
			var id = Settings.option('id');
			return id===undefined?'':id;
		},
		set: function(val){
			Settings.option('id',val);
		}
	}),
	hash: new Prop({
		get: function(){
			var i = Settings.option('hash');
			return i===undefined?'':i;
		},
		set: function(val){
			Settings.option('hash',val);
		}
	})
});
Settings.config({
	url: 'api.ourl.ca/login.php?id='+state.id+'&hash='+state.hash
},function(e){
	// TODO - handle close
});
module.exports = state;