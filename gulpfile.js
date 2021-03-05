var gulp = require('gulp');

var plugins = {
    less: require('gulp-less'),
    cleancss: require('less-plugin-clean-css'),
    autoprefix: require('less-plugin-autoprefix'),
    rename: require('gulp-rename')
};

var paths = {
    origin: {
        less: {
            base: 'less/main.less',
            importPaths: [
                'less/*'
            ]
        }
    },

    destination: {
        less: 'css/'
    }
};

gulp.task('less', function() {
    return gulp.src(paths.origin.less.base)
        .pipe(plugins.less({
            paths: paths.origin.less.importPaths,
            plugins: [
                new plugins.autoprefix({browsers: ["last 10 versions"]}),
                new plugins.cleancss({advanced: true})
            ]
        }))
        .pipe(plugins.rename('main.css'))
        .pipe(gulp.dest(paths.destination.less));
});

gulp.task('watch', function() {
    gulp.watch(paths.origin.less.base, ['less']);
    gulp.watch(paths.origin.less.importPaths, ['less']);
});

gulp.task('default', [
    'less',
    'watch'
]);