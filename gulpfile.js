// Определяем переменную "preprocessor"
var preprocessor = 'scss';

// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass');
// const scss = require('gulp-scss');
const less = require('gulp-less');

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');

// Подключаем модуль gulp-newer
const newer = require('gulp-newer');

// Подключаем модуль del
const del = require('del');

// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
        proxy: "localhost:8001/wp-admin/admin.php?page=mrkv_ua_marketplaces",
		// server: { baseDir: "./" }, // Указываем папку сервера
		notify: true, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function scripts() {
	return src([ // Берём файлы из источников
		//'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
		'src/js/dashboardtab.js',
		'src/js/rozetkalinks.js',
		'src/js/rozetkasettings.js',
		'src/js/rozetkacollation.js' // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
		])
	.pipe(concat('mrkvmpscript.min.js')) // Конкатенируем в один файл
	.pipe(uglify({
        mangle: false,
       ecma: 6
    })) // Сжимаем JavaScript
	.pipe(dest('assets/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
	return src('src/' + 'scss' + '/mrkvmpstyle.' + 'scss' + '') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
	.pipe(eval('sass')()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(concat('mrkvmpstyle.min.css')) // Конкатенируем в файл app.min.js
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
	.pipe(dest('assets/')) // Выгрузим результат в папку "app/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

// function images() {
// 	return src('app/images/src/**/*') // Берём все изображения из папки источника
// 	.pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
// 	.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
// 	.pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
// }

// function cleanimg() {
// 	return del('app/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "app/images/dest/"
// }

// function buildcopy() {
// 	return src([ // Выбираем нужные файлы
// 		'app/css/**/*.min.css',
// 		'app/js/**/*.min.js',
// 		'app/images/dest/**/*',
// 		'app/**/*.html',
// 		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
// 	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
// }

// function cleandist() {
// 	return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
// }

function startwatch() {

	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	// watch(['/src/js/**/*.js', '!src/js/**/*.min.js'], scripts);
	watch(['src/js/**/*.js', '!src/js/**/*.min.js'], scripts);

	// Мониторим файлы препроцессора на изменения
	// watch('src/**/' + preprocessor + '/**/*', styles);
	watch('src/' + preprocessor + '/**/*', styles);

	// Мониторим файлы HTML на изменения
	watch(['inc/**/*.php', 'templates/**/*.php', '!node_modules/**/*', '!vendor/**/*']).on('change', browserSync.reload);

	// Мониторим папку-источник изображений и выполняем images(), если есть изменения
	// watch('app/images/src/**/*', images);

}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
// exports.images = images;

// Экспортируем функцию cleanimg() как таск cleanimg
// exports.cleanimg = cleanimg;

// Создаём новый таск "build", который последовательно выполняет нужные операции
// exports.build = series(cleandist, styles, scripts, images, buildcopy);
exports.build = series(styles, scripts);

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);
