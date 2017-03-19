#The Tale Extended 
Исходный код для расширения браузерной игры "[Сказка](http://the-tale.org)"

###Ссылки:
Расширение: [The Tale Extended в Chrome Store](https://chrome.google.com/webstore/detail/the-tale-extended/hafakbhcckdligdjpghlofaplaajpaje?gl=001)  
Userscript: [The Tale Extended в Greasy Fork](https://greasyfork.org/ru/scripts/4016-the-tale-extended)  



#Разработчикам


###Сборка
Перед работой установите все зависимости: `npm install`  
Запуск сборки:
```
npm run watch
```
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
