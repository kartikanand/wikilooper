module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
            	files: {
            		'app/static/styles.css': 'app/static/styles.scss'
            	}
            }
        },
        cssmin: {
        	css:{
        		src: 'app/static/styles.css',
        		dest: 'app/static/styles.min.css'
        	}
        },
        uglify: {
        	js: {
        		files: {
        			'app/static/looper.min.js': ['app/static/looper.js']
        		}
        	}
        },
        watch: {
        	files: ['app/static/looper.js', 'app/static/styles.scss'],
        	tasks: ['sass', 'cssmin', 'uglify']
        }
    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass', 'cssmin:css', 'uglify:js']);
};
