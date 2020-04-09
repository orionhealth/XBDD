## Certs

This folder is where xbdd-frontend-dev.crt xbdd-frontend-dev.key must be placed after being generated.
There are environment variables that use these to allow xbdd to use https while on localhost.

### Generate the certs and keystore

1. Run `./createFrontendCerts.sh`

### Configure your computer to allow this certificate

1. Import xbdd-frontend-dev.crt into Keychain Access.
1. Open xbdd-frontend-dev certificate in Keychain Access, open trust and select always trust.
1. You need to restart your browser once this is done for both certificates.
