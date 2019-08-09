all: clean

clean: down
	docker-compose rm -f

down:
	docker-compose down

dev: down
	docker-compose up --build -d

shell:
# Use exec so we are connecting to the exact container running
# Useful for checking things like the contents of /tmp
	docker-compose exec node-server bash

run_test: down
	docker-compose run --service-ports node-server yarn test
