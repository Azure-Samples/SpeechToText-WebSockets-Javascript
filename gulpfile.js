var gulp = require("gulp");
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");

gulp.task("build", function () {
    return gulp.src([
        "src/common/**/*.ts",
        "src/common.browser/**/*.ts",
        "src/sdk/speech/**/*.ts",
        "src/sdk/speech.browser/**/*.ts",
        "Speech.Browser.Sdk.ts"])
        .pipe(tslint({
            formatter: "prose",
            configuration: "tslint.json"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }))
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            declaration: true,
            noImplicitAny: true,
            removeComments: false,
            module: "AMD",
            out: 'speech.browser.sdk.js'
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('distrib'));
});