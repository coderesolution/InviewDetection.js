const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');

function lint() {
	return gulp
		.src(['src/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function compile() {
	return (
		gulp
			.src('src/InviewDetection.js')
			.pipe(
				babel({
					presets: ['@babel/preset-env'],
				})
			)
			// Save the compiled file as a non-minified version
			.pipe(rename('InviewDetection.compiled.js'))
			.pipe(gulp.dest('dist'))
			// Minify the compiled file
			.pipe(uglify())
			// Rename the minified file
			.pipe(rename('InviewDetection.min.js'))
			// Save the minified file
			.pipe(gulp.dest('dist'))
	);
}

exports.default = gulp.series(lint, compile);
