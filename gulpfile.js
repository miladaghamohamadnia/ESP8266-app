var gulp = require('gulp')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')
// requires browserify and vinyl-source-stream
var browserify = require('browserify')
var source = require('vinyl-source-stream')



// Connect task
gulp.task('connect', function () {
	connect.server({
		root: 'public',
		port: 4000
	})
})

// Task that grabs one or many files, manipulates them and Saves them somewhere
gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify('./app/app.js')
    	// bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
})

// Task that watches changes in app.js file
gulp.task('watch', function() {
	gulp.watch('app/**/*.js', ['browserify'])
})

// Task that initiates automation of above tasks
gulp.task('default', ['connect', 'watch'])