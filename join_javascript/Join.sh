#!/bin/sh
cat *.js > core.js.temp
java -jar ./join_javascript/yuicompressor-2.4.7.jar --type js core.js.temp -o ../eWolf-Java/src/il/technion/ewolf/server/resources/core.mini.js
rm core.js.temp
