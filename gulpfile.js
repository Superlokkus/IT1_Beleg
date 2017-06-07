const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

// Gulp dependencies go here
gulp.task('default', function () {
// Node source
    gulp.src("es6/**/*.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel())
        .pipe(gulp.dest("dist"));
// browser source
    gulp.src("public/es6/**/*.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel())
        .pipe(gulp.dest("public/dist"));
});