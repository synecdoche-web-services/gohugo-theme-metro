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

function runHugo(...hugoArgs) {
	return new Promise((resolve, reject) => {
		const proc = execFile(hugoBin, hugoArgs, { cwd: 'exampleSite' }, (err, stdout, stderr) => {
			if(err) return reject(stderr);
			resolve(stdout)
		});
		proc.stdout.pipe(process.stdout)
	})
}

function clean() {
	return del(['exampleSite/public', 'exampleSite/resources', 'assets/*']);
}

const	buildAssets = parallel(css, js),
	buildHugo = () => runHugo()
	build = series(buildAssets, buildHugo);
const watcher = () => {
	runHugo('server', '--disableFastRender').then(console.log).catch(console.error)
	watch([ 'src' ], buildAssets)
};

task('build', series(clean, build));
task('clean', clean);
task('default', series(build, watcher));
