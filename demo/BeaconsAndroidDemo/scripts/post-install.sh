#1/use/bin/env bash

if [[ ! "$CI" = true ]]; then
  # Do not install iOS Pods on CI
  patch-package
fi
