#!/usr/bin/env bash
npm run build
gcloud functions deploy helloWorld \
  --region asia-northeast1 \
  --runtime nodejs8 \
  --trigger-http
