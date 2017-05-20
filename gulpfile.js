var gulp = require("gulp");
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");
var minify = require('gulp-minify');
var git = require('gulp-git');
var versionBump = require('gulp-bump')
var tagVersion = require('gulp-tag-version');

gulp.task("build", function() {
    return gulp.src([
            "src/common/**/*.ts",
            "src/common.browser/**/*.ts",
            "src/sdk/speech/**/*.ts",
            "src/sdk/speech.browser/**/*.ts",
            "Speech.Browser.Sdk.ts"])
        .pipe(tslint({
            formatter: "prose",
            configuration: "tslint.json"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            declaration: true,
            noImplicitAny: true,
            removeComments: true,
            module: "AMD",
            out: 'speech.browser.sdk.js'
        }))
        .pipe(sourcemaps.write("."))
        .pipe(minify())
        .pipe(gulp.dest('distrib'));
});

// We dont want to release anything without successful build. So build task is dependency for these tasks.
gulp.task('patchRelease', ['build'], function() { return BumpVersionTagAndCommit('patch'); })
gulp.task('featureRelease', ['build'], function() { return BumpVersionTagAndCommit('minor'); })
gulp.task('majorRelease', ['build'], function() { return BumpVersionTagAndCommit('major'); })
gulp.task('preRelease', ['build'], function() { return BumpVersionTagAndCommit('prerelease'); })

function BumpVersionTagAndCommit(versionType) {
    return gulp.src(['./package.json'])
        // bump the version numbr
        .pipe(versionBump({type:versionType}))
        // save it back to filesystem 
        .pipe(gulp.dest('./'))
        // commit the changed version number 
        .pipe(git.commit('Bumping package version'))
        // tag it in the repository
        .pipe(tagVersion());
}
 