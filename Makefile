sync:
	rsync -avl --delete --stats --progress --exclude-from=.rsyncignore . flarework.com:~/projects/flarework.com/

