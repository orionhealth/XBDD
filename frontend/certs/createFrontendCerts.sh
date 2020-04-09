#!/bin/bash

openssl req -x509 -out xbdd-frontend-dev.crt -keyout xbdd-frontend-dev.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=xbdd-frontend-dev' -extensions EXT -config <( \
   printf "[dn]\nCN=xbdd-frontend-dev\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
