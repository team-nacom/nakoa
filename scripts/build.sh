#!/bin/sh

# Usage: ./build.sh <version>

# exit on first error
set -e

cd nakoa

git fetch --all --tags

git checkout tags/$1 -B $1

yarn install-all

yarn build

echo "Fetched and built release $1 successfully!"
