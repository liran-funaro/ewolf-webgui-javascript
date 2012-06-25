#!/bin/sh
cat *.js > core.js.temp
java -jar ./join_javascript/yuicompressor-2.4.7.jar --type js core.js.temp -o core.mini.js.temp
rm core.js.temp
rm ../ewolf-webgui/server_resources/www/core.mini.js
mv core.mini.js.temp ../ewolf-webgui/server_resources/www/core.mini.js

