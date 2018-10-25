#!/usr/bin/env bash
gcloud functions deploy resizeImages --trigger-bucket=$STORAGE_BUCKET
