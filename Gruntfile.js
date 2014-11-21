/* global module */
module.exports = function(grunt) {
  var sourceFolder = 'src';
  var developmentFolder = 'dev';
  var buildFolder = 'dist';

  // middleware for grunt.connect
  var middleware = function(connect, options, middlewares) {
    // inject a custom middleware into the array of default middlewares for proxy page
    var proxypage = require('proxypage');
    var proxyRe = /\/proxy\/proxy.ashx/i;

    var proxyMiddleware = function(req, res, next) {
      if (!proxyRe.test(req.url)) {
        return next();
      }
      proxypage.proxy(req, res);
    };

    middlewares.unshift(proxyMiddleware);
    middlewares.unshift(connect.json()); //body parser, see https://github.com/senchalabs/connect/wiki/Connect-3.0
    middlewares.unshift(connect.urlencoded()); //body parser
    return middlewares;
  };

  // Configure Tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tag: {
      banner: '/*\n' +
        ' * <%= pkg.name %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @repo: <%= pkg.repository %>\n' +
        ' * built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */'
    },

    autoprefixer: {
      build: {
        cwd: buildFolder,
        dest: buildFolder,
        expand: true,
        src: ['**/*.css', '!' + developmentFolder + '/js/libs/**']
      },
      dev: {
        cwd: developmentFolder,
        dest: developmentFolder,
        expand: true,
        src: ['**/*.css', '!' + developmentFolder + '/js/libs/**']
      }
    },

    clean: {
      build: {
        src: [buildFolder]
      },
      dev: {
        src: [
          developmentFolder + '/*.html',
          developmentFolder + '/css',
          developmentFolder + '/images',
          developmentFolder + '/js/*',
          '!' + developmentFolder + '/js/libs/**'
        ]
      }
    },

    copy: {
      build: {
        cwd: sourceFolder,
        dest: buildFolder,
        expand: true,
        src: ['**', '!**/*.styl', '!**/*.md']
      },
      dev: {
        cwd: sourceFolder,
        dest: developmentFolder,
        expand: true,
        src: ['**', '!**/*.styl', '!**/*.md']
      }
    },

    cssmin: {
      build: {
        cwd: buildFolder,
        dest: buildFolder,
        expand: true,
        src: ['**/*.css'],
        options: {
          banner: '<%= tag.banner %>'
        }
      }
    },

    htmlmin: {
      build: {
        files: [{
          cwd: sourceFolder,
          dest: buildFolder,
          expand: true,
          src: ['**/*.html']
        }],
        options: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      }
    },

    jshint: {
      build: {
        dest: buildFolder,
        src: [sourceFolder + '/**/*.js'],
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        }
      },
      dev: {
        dest: developmentFolder,
        expand: true,
        src: [sourceFolder + '/**/*.js'],
        options: {
          jshintrc: '.jshintrc',
          reporter: require('jshint-stylish')
        }
      }
    },

    stylus: {
      build: {
        files: [{
          cwd: sourceFolder,
          dest: buildFolder,
          expand: true,
          ext: '.css',
          src: ['**/*.styl', '!**/mixins.styl', '!**/variables.styl']
        }],
        options: {
          compress: false,
          linenos: false
        }
      },
      dev: {
        files: [{
          cwd: sourceFolder,
          dest: developmentFolder,
          expand: true,
          ext: '.css',
          src: ['**/*.styl', '!**/mixins.styl', '!**/variables.styl']
        }],
        options: {
          compress: false,
          linenos: false
        }
      }
    },

    uglify: {
      build: {
        files: [{
          cwd: sourceFolder,
          dest: buildFolder,
          expand: true,
          ext: '.js',
          src: ['**/*.js']
        }],
        options: {
          banner: '<%= tag.banner %>\n',
          compress: {
            drop_console: true
          },
          preserveComments: false
        }
      }
    },

    watch: {
      'dev-assets': {
        files: [sourceFolder + '/**', '!' + sourceFolder + '/**/*.styl'],
        tasks: ['dev-assets']
      },
      'dev-scripts': {
        files: [sourceFolder + '/**/*.js'],
        tasks: ['dev-scripts']
      },
      'dev-stylesheets': {
        files: [sourceFolder + '/**/*.styl'],
        tasks: ['dev-stylesheets']
      },
      stylusVarsChanged: {
        files: [sourceFolder + 'css/variables.style', sourceFolder + 'css/mixins.style'],
        tasks: ['stylus:dev']
      }
    },

    exec: {
      bower: {
        cwd: '.',
        command: 'bower install',
        stdout: true,
        stderr: true
      }
    },

    'bower-install-simple': {
      options: {
        color: true,
        directory: 'dev/js/libs'
      },
      prod: {
        options: {
          production: true
        }
      },
      dev: {
        options: {
          production: false
        }
      }
    },

    esri_slurp: {
      options: {
        version: '3.11'
      },
      dev: {
        options: {
          beautify: true
        },
        dest: 'dev/js/libs/esri'
      },
      travis: {
        dest: 'dev/js/libs/esri'
      }
    },

    connect: {
      dev: {
        options: {
          port: 3000,
          base: developmentFolder,
          hostname: '*',
          middleware: middleware
        }
      },
      build: {
        options: {
          port: 3001,
          base: buildFolder,
          hostname: '*',
          middleware: middleware
        }
      }
    },
    open: {
      dev_browser: {
        path: 'http://localhost:3000/index.html'
      },
      build_browser: {
        path: 'http://localhost:3001/index.html'
      }
    },
    compress: {
      build: {
        options: {
          archive: 'dist/viewer.zip'
        },
        files: [{
          expand: true,
          cwd: 'dist/viewer',
          src: ['**']
        }]
      }
    },
    intern: {
      dev: {
        options: {
          runType: 'runner', // defaults to 'client'
          config: 'tests/intern',
          reporters: ['console'],
          suites: ['tests/unit/example']
        }
      }
    },
    dojo: {
      prod: {
        options: {
          // You can also specify options to be used in all your tasks
          profiles: ['profiles/build.profile.js'] // Profile for build
        }
      },
      stage: {
        options: {
          // You can also specify options to be used in all your tasks
          profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js'] // Profile for build
        }
      },
      options: {
        // You can also specify options to be used in all your tasks
        dojo: 'dev/js/libs/dojo/dojo.js', // Path to dojo.js file in dojo source
        load: 'build', // Optional: Utility to bootstrap (Default: 'build')
        releaseDir: './dist',
        //require: 'dev/app/run.js', // Optional: Module to require for the build (Default: nothing)
        basePath: './dev/js/libs/'
      }
    }
  });

  // Load Tasks
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  //grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-esri-slurp');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('intern');
  grunt.loadNpmTasks('grunt-bower-install-simple');
  grunt.loadNpmTasks('grunt-dojo');

  // Development Tasks
  grunt.registerTask('dev-assets', 'Copies the assets', ['newer:copy:dev']);
  grunt.registerTask('dev-scripts', 'Lints the JavaScript files.', ['newer:jshint:dev']);
  grunt.registerTask('dev-stylesheets', 'Creates the stylesheets.', ['newer:stylus:dev', 'newer:autoprefixer:dev']);

  // Production Build Tasks
  grunt.registerTask('assets', 'Copies and compiles the assets.', ['copy:build', 'htmlmin']);
  grunt.registerTask('scripts', 'Lints, cleans and compiles the JavaScript files.', ['jshint:build', 'uglify:build']);
  grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['stylus:build', 'autoprefixer:build', 'cssmin:build']);

  // User-called Tasks
  grunt.registerTask('build', 'Validates, cleans, compiles, and copies assets to the build directory', ['clean:build', 'assets', 'stylesheets', 'scripts']);
  grunt.registerTask('dev', 'Validates and copies assets to the development build directory.', ['clean:dev', 'dev-assets', 'dev-stylesheets', 'dev-scripts']);
  grunt.registerTask('clean-dev', 'Cleans the development build directory', ['clean:dev']);
  grunt.registerTask('setup', 'Gets JS dependencies and slurps esri js.', ['bower-install-simple:dev', 'esri_slurp:dev']);
  grunt.registerTask('test', 'Run unit tests with intern', ['intern:dev']);
  grunt.registerTask('default', 'Watches the project for changes, and automatically performs a development build.', ['dev', 'connect:dev', 'open:dev_browser', 'watch']);
};