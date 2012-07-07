#!/bin/sh

cat *.js > core.js.temp
cat CSS/*.css > CSS/home.css.temp

java -jar ./join_javascript/yuicompressor-2.4.7.jar --type js core.js.temp -o core.mini.js.temp
rm core.js.temp

java -jar ./join_javascript/yuicompressor-2.4.7.jar --type css CSS/home.css.temp -o CSS/home.mini.css.temp
rm CSS/home.css.temp

rm ../ewolf-webgui/server_resources/www/core.mini.js
mv core.mini.js.temp ../ewolf-webgui/server_resources/www/core.mini.js

rm ../ewolf-webgui/server_resources/www/home.css
mv CSS/home.mini.css.temp ../ewolf-webgui/server_resources/www/home.css
