#!/usr/bin/env bash
set -eux
gcloud functions deploy helloGCSGeneric --trigger-resource $STORAGE_BUCKET --trigger-event google.storage.object.finalize
