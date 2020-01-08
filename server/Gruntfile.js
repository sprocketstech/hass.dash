var pkg = require('./package.json');
var fs = require("fs");
module.exports = function(grunt) {
	// load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    
    grunt.initConfig({
        settings: {
            dist: '../build/server'
        },
		copy: {
		  main: {
			files: [
				{src: ['apis/**'], dest: '<%= settings.dist %>/apis/',filter:'isFile', expand:true, flatten:true},
				{src: ['backend/**'], dest: '<%= settings.dist %>/backend/',filter:'isFile', expand:true, flatten:true},
				{src: ['devices/**'], dest: '<%= settings.dist %>/devices/',filter:'isFile', expand:true, flatten:true},
				{src: ['infr/**'], dest: '<%= settings.dist %>/infr/',filter:'isFile', expand:true, flatten:true},
				{src: ['widgets/**'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:false},
				{src: ['config.js'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:true},
				{src: ['index.js'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:true},
				{src: ['package.json'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:true},
				{src: ['webserver.js'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:true}
			]
		  }
		},
		clean: {
			beforeBuild:{
				src:['<%= settings.dist %>']
			}
        }
    });
    
	grunt.registerTask('build', ['clean:beforeBuild',  'copy:main']);
	grunt.registerTask('unit_test', [/*'grunt:test_server', */'grunt:test_ui']);

};