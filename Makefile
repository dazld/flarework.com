sync:
	rsync -avl --delete --stats --progress --exclude-from=.rsyncignore . flarework.com:~/projects/flarework.com/

build:
	@find . -name "index.js" -not -path "*/node_modules/*" | xargs -I @@ bash -c '{ browserify @@ -o `dirname "@@"`/bundle.js && echo "`date` - built @@"; }'

watch:
	ag -l | entr make build

