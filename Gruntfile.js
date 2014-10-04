module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    distdir: ['dist'],
    pkg: grunt.file.readJSON('package.json'),
    src: {
      js: ['src']
    },

    browserify: {
    dev: {
      options: {
        browserifyOptions: {
          standalone: '<%= pkg.name %>'
        }
      },
      src: ['<%= src.js %>/main.js'],
      dest: '<%= distdir %>/<%= pkg.name %>.js'
    }
    },
    watch: {
      js: {
        files: ['<%= src.js %>/**/*.js'],
        tasks: ['browserify:dev']
      }
  }
  });
};
