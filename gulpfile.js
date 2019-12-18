const	{ src, dest, watch, task, series, parallel } = require('gulp'),
	postcss = require('gulp-postcss'),
	cssimport = require('postcss-import'),
	postcssEnv = require('postcss-preset-env'),
	cssnano = require('cssnano'),
	babel = require('gulp-babel'),
	del = require('del');

function css() {
	return src('src/**/*.css')
		.pipe(postcss([ cssimport(), postcssEnv({ browsers: 'last 4 versions' }), cssnano({ preset: 'default' }) ]))
		.pipe(dest('assets'));
}

function js() {
	return src('src/**/*.js')
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(dest('assets'));
}

function clean() {
	return del(['public', 'resources']);
}

const build = parallel(css, js);
const watcher = () => {
	return watch([ 'src' ], build);
};

task('build', series(clean, build));
task('clean', clean);
task('default', series(build, watcher));
