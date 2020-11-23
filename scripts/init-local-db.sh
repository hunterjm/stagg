## WIP
#!/bin/bash
set -e

SERVER="stagg_local";
PW="secretstaggpassword";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
SLEEP 3;

# create the db 
echo "CREATE DATABASE stagg ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "CREATE DATABASE callofduty ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "CREATE DATABASE discord ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres