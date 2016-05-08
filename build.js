"use strict";

var dir = {
		src: './src/',
		dev: './dev/',
		build: './build/'
	};

var fs       = require('fs');


function css(){
	console.log('Building CSS');

	var	less     = require('less'),
		CleanCSS = require('clean-css');

	var file    = fs.readFileSync(dir.src + 'assets/css/main.less', {encoding: 'utf-8'}),
		options = {
			sourceMap: {}
		};

	less
		.render(file, options)
		.then(function(output){
			var minOptions  = {
					sourceMapInlineSources: true,
					sourceMap :output.map
				},
				mapLocation = 'main.css.map',
				mapString   = '/*# sourceMappingURL=' + mapLocation + ' */',
				minified    = new CleanCSS(minOptions).minify(output.css);

			fs.writeFileSync(dir.build + 'assets/css/main.css', minified.styles + mapString);
			fs.writeFileSync(dir.build + 'assets/css/main.css.map', minified.sourceMap.toString());
			
		}, function err(err){
			console.log('!! ERROR !!');
			console.log(err);
		});
};

function js(){
	console.log('Building JS');

	var uglify   = require("uglify-js");

	var minified = uglify.minify(dir.src + 'assets/js/main.js', {outSourceMap: 'main.js.map'});

	console.log(minified.code);
	console.log(minified.map);

	fs.writeFileSync(dir.build + 'assets/js/main.min.js', minified.code);
	fs.writeFileSync(dir.build + 'assets/js/main.js.map', minified.map);


};

function buildAll(){
	console.log('Building All');
	css();
	js();
};

(function(){
	var args = process.argv.slice(2);

	if(!args.length || args.indexOf('all') >= 0)
		return buildAll();

	if(args.indexOf('css') >= 0)
		css();

	if(args.indexOf('js') >= 0)
		js();

})();