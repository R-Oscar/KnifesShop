var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task("css", function() {
	return gulp.src("app/sass/main.scss")
				.pipe(plugins.plumber())
				.pipe(plugins.compass({
					config_file: 'config.rb',
					css: "dist/css/",
					sass: "app/sass/"
				}))
				.pipe(gulp.dest("dist/css/"));
});

gulp.task("fonts", function() {
	return gulp.src("app/fonts/**/*")
				.pipe(gulp.dest("dist/fonts/"));
});

gulp.task("images", function() {
	return gulp.src("app/images/**/*")
				.pipe(plugins.imagemin({
					progressive: true,
					interlaced: true
				}))
				.pipe(gulp.dest("dist/images/"));
});

gulp.task("js", function() {
	return gulp.src(bowerFiles("**/*.js").concat(["app/js/**/*.js"]))
				.pipe(plugins.concat('app.js'))
				// .pipe(plugins.uglify())
				.pipe(gulp.dest("dist/js/"));
});

gulp.task("html", function() {
	return gulp.src(['app/**/*.jade', '!app/**/_*.jade'])
				.pipe(plugins.jade({
					locals: {},
					pretty: '\t'
				}))
				.pipe(gulp.dest("dist/"))	
});

gulp.task("server", function() {
	browserSync({
		port: 9000,
		server: {
		  baseDir: "dist/"
		}
	});
	gulp.watch("app/js/**/*.js", ["js"]);
	gulp.watch("app/sass/**/*.scss", ["css"]);
	gulp.watch('app/**/*.jade', ["html"]);
	gulp.watch([
		"dist/js/**/*.js",
		"dist/css/**/*.css",
		'dist/**/*.html'
	]).on('change', browserSync.reload);
});

gulp.task("clean", function() {
	return del("dist/");
});

gulp.task("default", function() {
	return runSequence(
		'clean',
		['fonts', 'images'],
		['js', 'css'],
		'html',
		'server'
	);
});