#The Tale Extended 
Исходный код для расширения браузерной игры "[Сказка](http://the-tale.org)"

Установить как расширение из [Chrome Store](https://chrome.google.com/webstore/detail/the-tale-extended/hafakbhcckdligdjpghlofaplaajpaje?gl=001)
Установить как userscript из [Greasy Fork](https://greasyfork.org/ru/scripts/4016-the-tale-extended)  


##Разработчикам

###Подготовка
Вам потребуется [Node.js](http://nodejs.org/) и [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)  
Установите все зависимости: `npm install`


###Сборка
Для сборки расширения во время разработки используйте `gulp dev`. При каждом изменении проект будет пересобираться автоматически.  
Так же есть команды
```
gulp watch-chrome # тоже что gulp dev
gulp watch-userscript
```

###Выкладка и пулл-реквесты
Для финальной сборки используйте
`gulp`  
Перед коммитом убедитесь что во время сборки не было ошибок и предупреждений 


###Запуск расширения для хрома в режиме разработки
1. перейдите на страницу расширений chrome://extensions/ (или "Дополнительные инструменты" > "Расширения")
* поставьте галочку "Режим разработчика"
* "Загрузить распакованное расширение"
* выберите папку `dist/chrome`
* не забудьте отключить версию из chrome store, если она у вас установлена

###Запуск юзерскрипта для FireFox в режиме разработки 
1. установите GreaseMonkey
* перетащите скрипт из папки `dist/userscript` в браузер
* при изменениях в коде, повторить второй пункт


##License
MIT License
