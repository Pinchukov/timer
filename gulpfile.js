var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify-es').default,
	cleancss     = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	rsync        = require('gulp-rsync'),
	newer        = require('gulp-newer'),
	rename       = require('gulp-rename'),
	responsive   = require('gulp-responsive'),
	del          = require('del'),
	htmlmin      = require('gulp-htmlmin'),
	ftp          = require('vinyl-ftp'),
	rsync        = require('gulp-rsync');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
}); 
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass({
		outputStyle: 'expanded',
		includePaths: [__dirname + '/node_modules']
	}))
	.pipe(concat('styles.min.css'))
	//.pipe(autoprefixer({
		//grid: true,
		//overrideBrowserslist: ['last 10 versions']
	//}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});



// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([

		'app/js/_custom.js', // Custom scripts. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});
// Responsive Images
var quality = 95; // Responsive images quality



// Produce @1x images
gulp.task('img-responsive-1x', async function() {
	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('app/img/@1x'))
		.pipe(responsive({
			'**/*': { width: '50%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('app/img/@1x'))
});


// Produce @2x images
gulp.task('img-responsive-2x', async function() {
	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('app/img/@2x'))
		.pipe(responsive({
			'**/*': { width: '100%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('app/img/@2x'))
});


gulp.task('img', gulp.series('img-responsive-1x', 'img-responsive-2x', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});



// WATCH
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
	gulp.watch(['app/js/_custom.js', 'app/js/_libs.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('img', 'styles', 'scripts', 'browser-sync', 'watch'));
// WATCH END



// BUILD
function clean() {
	return del('./dist');
};
gulp.task('clean', clean);


function imgmin() {
	return gulp.src('./app/img/**/*')
	//.pipe(imagemin())
	.pipe(gulp.dest('./dist/img'))
};
gulp.task('imgmin', imgmin);

function buildHtml() {
	return gulp.src('./app/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./dist'))
};
gulp.task('buildHtml', buildHtml);

function buildCss(){
	return gulp.src('./app/css/styles.min.css')
	.pipe(gulp.dest('./dist/css'))
};
gulp.task('buildCss', buildCss);

function buildFiles() {
	return gulp.src([
	  './app/*.php',
	  './app/*.xml',
	  './app/**.txt',
	  './app/.htaccess',
	  ]).pipe(gulp.dest('./dist'))
};
gulp.task('buildFiles', buildFiles);

function buildJs() {
	return gulp.src('./app/js/scripts.min.js')
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'))
};
gulp.task('buildJs', buildJs);



gulp.task('build', gulp.series(clean,
	gulp.parallel(buildHtml, buildJs, buildFiles, buildCss, imgmin))
);
// BUILD END





// DEPLOY
gulp.task('deploy', () => {
	var conn = ftp.create({
		host:      'shaertt.ru',
		user:      'rtyrtewfwefwf',
		password:  '',
		parallel:  10,
		//log: gutil.log
	});
	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/www/shretete.ru/'));
});


gulp.task('rsync', () => {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'shambretret@sertert.ru',
		destination: 'www/sharetertert.ru/',
		include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
		exclude: ['**/Thumbs.db', '**/*.DS_Store', '**/.directory'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
	
});


// DEPLOY END
gulp.task('clearcache', () => { return cache.clearAll(); }); // Если нужно почистить кешь!