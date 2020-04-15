#!/bin/bash

# Script to update application variables for continuous deployments
# Just replace you github details here and modify the paths as needed

githib_id=
github_secret=

sed -i.bak "s/REACT_APP_GITHUB_CLIENT_ID=/REACT_APP_GITHUB_CLIENT_ID=$githib_id/g" frontend/.env
sed -i.bak "s/<put your github app id here>/$githib_id/g" backend/src/main/resources/application.yml
sed -i.bak "s/<put your github app secret here>/$github_secret/g" backend/src/main/resources/application.yml