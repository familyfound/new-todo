
build: components index.js new-todo.css template.js
	@component build --dev

template.js: template.html
	@component convert $<

template.html: template.jade
	@jade -P $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

# open browser correctly in mac or linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
		open := google-chrome
endif
ifeq ($(UNAME_S),Darwin)
		open := open
endif

example:
	@${open} test/example.html

docme: build
	mv build _build
	mv test _test
	git checkout gh-pages
	mv _build build
	mv _test test

.PHONY: clean example docme