'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    scripts: ['source/*.js'],
    styles:  ['source/*.styl'],
    jade:    ['source/*.jade']
};

var dest = {
    build:  'build'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

// Compile Our Stylus files
gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe($.stylus())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(dest.build))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.minifyCss())
        .pipe(gulp.dest(dest.build))
        .pipe($.connect.reload());
});

gulp.task('jade', function() {
    return gulp.src(paths.jade)
        .pipe($.jade({pretty: true}))
        .pipe(gulp.dest(dest.build))
        .pipe($.connect.reload());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(dest.build))
        .pipe($.rename('all.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(dest.build))
        .pipe($.connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['lint', 'scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.jade, ['jade']);
});

gulp.task('clean', function() {
    gulp.src(dest.build, {read:false})
        .pipe($.clean());
});

gulp.task('default', ['connect', 'lint', 'jade', 'styles', 'scripts', 'watch']);

gulp.task('connect', $.connect.server({
    root: ['build'],
    port: 4000,
    livereload: true,
    open: true
}));



