const gulp = require('gulp');
const babel = require('gulp-babel');

// Gulp dependencies go here
gulp.task('default', function() {
// browser source
gulp.src("public/es6/**/*.js")
.pipe(babel())
.pipe(gulp.dest("public/dist"));
});