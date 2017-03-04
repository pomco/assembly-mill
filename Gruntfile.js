"use strict";
module.exports = function(grunt){
	  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
    	all: ['index.js','Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
    	options:{
    		jshintrc:'.jshintrc',
    		reporterOutput:'reporter/report.log'
    	}
  	},
  	watch: {
  		jshint:{
  			files: ['lib/**/*.js', 'test/**/*.js'],
    		tasks: ['jshint']
  		}
	}
  });
  // 加载插件。
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
   // 默认被执行的任务列表。
  grunt.registerTask('default', ['jshint','watch']);

};
