const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const gcmq = require("gulp-group-css-media-queries");
const rename = require("gulp-rename");

// Шляхи
const paths = {
  scss: "src/scss/**/*.scss",
  html: "src/*.html",
  dist: "dist",
};

// Компіліція SCSS
function compileSCSS() {
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(gcmq())
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.dist))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

// Копіювання HTML
function copyHTML() {
  return src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());
}

// Сервіс live-reload
function serve() {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
  });

  watch(paths.scss, compileSCSS);
  watch(paths.html, copyHTML);
}

// Експорти
exports.default = series(parallel(compileSCSS, copyHTML), serve);
