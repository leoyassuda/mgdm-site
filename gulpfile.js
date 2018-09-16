const gulp = require('gulp');
const sass = require('gulp-sass');
// const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
// const pkg = require('./package.json');
const browserSync = require('browser-sync').create();

// Set the banner content
const banner = ['/*!\n',
	' * Start Template - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
	' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
	' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
	' */\n',
	''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bulma
  gulp.src([
      './node_modules/bulma/css/bulma.min.css',
      './node_modules/bulma/css/bulma.min.css'
    ])
    .pipe(gulp.dest('./vendor/bulma'));

  // Font Awesome
  gulp.src([
      './node_modules/@fortawesome/fontawesome-free/**/*',
      '!./node_modules/@fontawesome/fontawesome-free/{less,less/*}',
      '!./node_modules/@fontawesome/fontawesome-free/{scss,scss/*}',
      '!./node_modules/@fontawesome/fontawesome-free/.*',
      '!./node_modules/@fontawesome/fontawesome-free/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/font-awesome'));

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js',
      '!./node_modules/jquery/external/',
      '!./node_modules/jquery/src/',
      '!./node_modules/jquery/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
});

// Compile SCSS
gulp.task('css:compile', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      './css/*.css',
      '!./css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
  return gulp.src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['css', 'js', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
