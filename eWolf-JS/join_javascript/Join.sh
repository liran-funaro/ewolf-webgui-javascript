#!/bin/sh
cat $@ > ./output/core.js
java -jar ./Script/yuicompressor-2.4.7.jar --type js ./output/core.js -o ../../ewolf-server/E-Wolf-Server/src/il/technion/ewolf/server/core.mini.js

