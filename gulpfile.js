const	{ src, dest, watch, task, series, parallel } = require('gulp'),
	{ execFile } = require('child_process'),
	hugoBin = require('hugo-bin'),
	postcss = require('gulp-postcss'),
	cssimport = require('postcss-import'),
	postcssEnv = require('postcss-preset-env'),
	cssnano = require('cssnano'),
	babel = require('gulp-babel'),
	del = require('del'),
	browserSync = require('browser-sync').create();

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

function hugo(cb) {
	execFile(hugoBin, ['-b', '/'], { cwd: 'exampleSite' }, (e, o) => {
		console.log(o);
		cb(e)
	});
}

function clean() {
	return del(['exampleSite/public', 'exampleSite/resources', 'assets/*']);
}

const	buildAssets = parallel(css, js),
	build = series(buildAssets, hugo);
const watcher = () => {
	browserSync.init({
		watch: true,
		server: 'exampleSite/public',
		notify: false,
		ghostMode: false
	});
	watch([ 'src' ], buildAssets)
	watch([ 'archetypes', 'assets', 'i18n', 'layouts', 'theme.toml', 'exampleSite/content', 'exampleSite/static', 'exampleSite/config.toml' ], hugo)
};

task('build', series(clean, build));
task('clean', clean);
task('default', series(build, watcher));
