#!/bin/bash

function localtunnel {
  npx localtunnel --port 3333 --subdomain deggautcc -o --print-requests
}

until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done
