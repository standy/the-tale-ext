#The Tale Extended 
Исходный код для расширения браузерной игры "[Сказка](http://the-tale.org)"

[Расширение для хрома](https://chrome.google.com/webstore/detail/the-tale-extended/hafakbhcckdligdjpghlofaplaajpaje?gl=001)  
[Userscript для firefox](http://userscripts.org:8080/scripts/show/487553)


##Требования
* [Node.js](http://nodejs.org/)
* [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
* установите все зависимости — это делается автоматически, запуском `npm install` в корне проекта


##Сборка
Для сборки работает команда:
```
gulp
```
еквивалентно `gulp default`/`gulp dist`/`gulp deploy`  

Для автоматической сборки при изменении в файлах:
```
gulp watch
```


##Запуск вашего расширения для разработки
Для хрома (расширение)
* перейдите на страницу расширений chrome://extensions/ (или "Дополнительные инструменты" > "Расширения")
* поставьте галочку "Режим разработчика"
* "Загрузить распакованное расширение"
* выберите папку ./the-tale-ext/build/chrome/
* не забудьте отключить версию из chrome strore, если она у вас установлена
 
Для фф (userscript)
* установите Greasemonkey
* установите скрипт из папки ./the-tale-ext/build/userscript/


##License
MIT License
