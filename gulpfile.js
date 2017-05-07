var gulp = require("gulp");
var install = require("gulp-install");
var debug = require('gulp-debug');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");
var util = require("gulp-util");

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
        .pipe(install())
        /*.pipe(debug({ title: 'Processing' }))*/
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
        .pipe(gulp.dest('distrib'));
});

function log(message) {
    if (typeof(msg) === 'object'){
        util.log(util.colors.blue(JSON.stringify(message)));
    } else {
        util.log(util.colors.blue(message))
    }
}