var pkg = require('./package.json');
var fs = require("fs");
module.exports = function(grunt) {
	// load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    
    grunt.initConfig({
        settings: {
            dist: './build/hassio',
			ui: './ui',
            server: './server',
            hassio: './hass.io'
        },
		grunt: {
			build_ui: {
				gruntfile: '<%= settings.ui %>/Gruntfile.js',
				task: 'build'
			},
			build_server: {
				gruntfile: '<%= settings.server %>/Gruntfile.js',
				task: 'build'
			}
        },
        copy: {
            hass: {
              files: [
                  {cwd: 'hass.io/', src: ['./**'], dest: '<%= settings.dist %>/',filter:'isFile', expand:true, flatten:false}
              ]
            }
          },
		clean: {
			beforeBuild:{
				src:['<%= settings.dist %>']
			}
        }
    });
    
    grunt.registerTask('writeConfigFile', function(file) {
        var config = {
            dashboards: '/data/dashboards.yaml',
            hass_url: 'http://hassio/homeassistant/api',
            hass_llat: '$HASSIO_TOKEN'
        };
        fs.writeFileSync('build/hassio/app/server/config.json', JSON.stringify(config, null, 2));
    });


	grunt.registerTask('build', ['clean:beforeBuild', 'grunt:build_ui', 'grunt:build_server', 'copy:hass', 'writeConfigFile']);
	grunt.registerTask('unit_test', [/*'grunt:test_server', */'grunt:test_ui']);

};