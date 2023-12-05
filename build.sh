#!/usr/bin/env sh

set -e

IMAGE="vue-components-build"

if [ -z "$1" ]; then
  echo "Usage: $0 [dist|storybook]"
  exit 1
fi

podman build --tag "$IMAGE" --target "$1" --force-rm --layers --ulimit nofile=65535:65535 .
container_id=$(podman create $IMAGE /)
trap 'podman rm -f $container_id' EXIT
trap 'podman image rm -f $IMAGE' EXIT
# if param is dist, create dist folder and extract files
if [ "$1" = "dist" ]; then
  mkdir -p dist
  podman export "$container_id" | tar --extract --overwrite --directory dist
elif [ "$1" = "storybook" ]; then
  mkdir -p storybook-static
  podman export "$container_id" | tar --extract --overwrite --directory storybook-static
fi
