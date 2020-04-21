#!/bin/bash

# Script to update application variables for continuous deployments
# Just replace you github details here and modify the paths as needed

githib_id=
github_secret=

sed -i.bak "s/your-github-app-client-id/$githib_id/g" backend/src/main/resources/application.yml
sed -i.bak "s/your-github-app-client-secret/$github_secret/g" backend/src/main/resources/application.yml
