#!/bin/bash

JSSRC="src/*.js src/server\-request/*.js src/lib/*.js src/plugins/*.js src/menu/*.js src/mail/*.js src/applications/*.js"
CSSSRC=CSS/*.css

JSTEMP=core.js.temp
CSSTEMP=CSS/core.css.temp

JSTRG=../ewolf-webgui/server_resources/www/core.mini.js
CSSTRG=../ewolf-webgui/server_resources/www/core.mini.css

cat $JSSRC > $JSTRG
cat $CSSSRC > $CSSTRG

#rm $JSTRG
#java -jar ./join_javascript/yuicompressor-2.4.7.jar --type js $JSTEMP -o $JSTRG
#rm $JSTEMP

#rm $CSSTRG
#java -jar ./join_javascript/yuicompressor-2.4.7.jar --type css $CSSTEMP -o $CSSTRG
#rm $CSSTEMP
