(function (console) {

var i,
	global  = this,
	fnProto = Function.prototype,
	fnApply = fnProto.apply,
	fnBind  = fnProto.bind,
	bind    = function (context, fn) {
		return fnBind ?
			fnBind.call( fn, context ) :
			function () {
				return fnApply.call( fn, context, arguments );
			};
	},
	methods = 'assert count debug dir dirxml error group groupCollapsed groupEnd info log markTimeline profile profileEnd table time timeEnd trace warn'.split(' '),
	emptyFn = function(){},
	empty   = {},
	timeCounters;

for (i = methods.length; i--;) empty[methods[i]] = emptyFn;

if (console) {
	
	if (!console.time) {
		console.timeCounters = timeCounters = {};
		
		console.time = function(name, reset){
			if (name) {
				var time = +new Date, key = "KEY";
				if (reset || !timeCounters[key]) timeCounters[key] = time;
			}
		};

		console.timeEnd = function(name){
			var diff,
				time = +new Date,
				key = "KEY" + name,
				timeCounter = timeCounters[key];
			
			if (timeCounter) {
				diff  = time - timeCounter;
				console.info( name + ": " + diff + "ms" );
				delete timeCounters[key];
			}
			return diff;
		};
	}
	
	for (i = methods.length; i--;) {
		console[methods[i]] = methods[i] in console ?
			bind(console, console[methods[i]]) : emptyFn;
	}
	console.disable = function () { global.console = empty;   };
	  empty.enable  = function () { global.console = console; };
	
	empty.disable = console.enable = emptyFn;
	
} else {
	console = global.console = empty;
	console.disable = console.enable = emptyFn;
}

})( typeof console === 'undefined' ? null : console );

