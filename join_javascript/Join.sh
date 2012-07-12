#!/bin/sh

JSTEMP=core.js.temp
CSSTEMP=CSS/core.css.temp

JSTRG=../ewolf-webgui/server_resources/www/core.mini.js
CSSTRG=../ewolf-webgui/server_resources/www/core.mini.css

cat *.js > $JSTRG
cat CSS/*.css > $CSSTRG

#rm $JSTRG
#java -jar ./join_javascript/yuicompressor-2.4.7.jar --type js $JSTEMP -o $JSTRG
#rm $JSTEMP

#rm $CSSTRG
#java -jar ./join_javascript/yuicompressor-2.4.7.jar --type css $CSSTEMP -o $CSSTRG
#rm $CSSTEMP
