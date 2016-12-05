var gulp = require('gulp');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

var paths = {
    templates: './src/*.jade',
    scripts: ['./src/js/app.js']
}

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
 
  gulp.src(paths.templates)
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('js', function(){
    return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch-templates', ['templates'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch-js', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['templates', 'js'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch(paths.templates, ['watch-templates']);
    gulp.watch(paths.scripts, ['watch-js']);
});