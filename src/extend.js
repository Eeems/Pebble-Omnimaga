var Prop = function(config){
		for(var i in config){
			this[i] = config[i];
		}
		return this;
	},
	extend = function(obj,nobj){
		for(var i in nobj){
			if(nobj[i] instanceof Prop){
				Object.defineProperty(obj,i,nobj[i]);
			}else{
				obj[i] = nobj[i];
			}
		}
	};
extend.Prop = Prop;
module.exports = extend;