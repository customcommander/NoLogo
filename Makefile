export PATH:=node_modules/.bin:$(PATH)

NODE_BIN_DIR=./node_modules/.bin

clean:
	rm -rf NoLogo.crx
	rm -rf NoLogo.pem

package: clean
	$(NODE_BIN_DIR)/crx pack src -p NoLogo.pem

test: package
	$(NODE_BIN_DIR)/mocha -t 15000 test/test.js

.PHONY: clean package test

# echo commands off
.SILENT: