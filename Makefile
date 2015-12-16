NODE_BIN_DIR = ./node_modules/.bin
ESLINT = $(NODE_BIN_DIR)/eslint
MOCHA = $(NODE_BIN_DIR)/mocha
MOCHAFLAGS = -t 15000
CRX = $(NODE_BIN_DIR)/crx

src_dir = src
src_all_files = $(shell find $(src_dir) -type f)
src_all_js = $(filter %.js,$(src_all_files))

test_dir = test
test_all_js = $(shell find $(test_dir) -name "*.js")

all_js = $(src_all_js) $(test_all_js)

lint_js = $(addprefix tmp/lint/,$(all_js:.js=.lint))

export PATH := $(PATH):$(NODE_BIN_DIR)

all: $(lint_js) NoLogo.crx tmp/test

clean:
	-rm -rfv tmp/
	-rm NoLogo.crx
	-rm NoLogo.pem

$(lint_js): tmp/lint/%.lint: %.js .eslintrc.json
	mkdir -p $(dir $@)
	$(ESLINT) $<
	touch $@

NoLogo.crx: $(src_all_files)
	$(CRX) pack $(src_dir) -p NoLogo.pem

tmp/test: NoLogo.crx $(test_all_js)
	mkdir -p $(dir $@)
	$(MOCHA) $(MOCHAFLAGS) test/test.js
	touch $@

.PHONY: all clean
