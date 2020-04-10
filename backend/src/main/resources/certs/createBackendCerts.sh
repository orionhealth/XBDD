#!/bin/bash

openssl req -x509 -out xbdd-backend-dev.crt -keyout xbdd-backend-dev.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=xbdd-backend-dev' -extensions EXT -config <( \
   printf "[dn]\nCN=xbdd-backend-dev\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

openssl pkcs12 -export -in xbdd-backend-dev.crt -inkey xbdd-backend-dev.key -out xbdd-backend-dev.p12

keytool -import -importkeystore -srckeystore xbdd-backend-dev.p12 -destkeystore keystore.p12 -deststoretype pkcs12 -storepass password
