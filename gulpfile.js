var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require("gulp-concat");

gulp.task('sass-prod', function () {
    return gulp
        .src('./sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./public/css'));
        
});

gulp.task('styles-prod', function () {
    return gulp
        .src('./public/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./public/css'));
});