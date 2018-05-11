const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');


gulp.task('default', ['styles'], () => {
    gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('scripts', () => {
    gulp.watch('js/**/*/.js', ['scripts']);
});

gulp.task('dist', [
    'styles',
    'scripts'
]);

gulp.task('styles', () => {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('scripts', () => {
    gulp.src('js/**/*.js')
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(minify())
        .pipe(gulp.dest('dist/js'));
});