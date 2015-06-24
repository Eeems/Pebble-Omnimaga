module.exports = function(fn){
	console.log('Creating Promise');
	var self = this,
		resolved = false,
		errored = false,
		fns = [],
		efns = [],
		data = self,
		resolve = function(){
			var fn,args = [].slice.call(arguments);
			while(fns.length){
				fn = fns.shift();
				data = fn.apply(fn,args.concat(data));
			}
			resolved = true;
			console.log('Resolved Promise');
		},
		reject = function(){
			var efn;
			while(efns.length){
				efn = efns.shift();
				efn.apply(efn,arguments);
			}
			errored = true;
			console.log('Rejected Promise');
		};
	self.then = function(fn){
		fns.push(fn);
		if(resolved){
			resolve(data);
		}
		return self;
	};
	self.catch = function(fn){
		efns.push(fn);
		if(errored){
			reject();
		}
		return self;
	};
	fn.call(fn,resolve,reject);
	return self;
};