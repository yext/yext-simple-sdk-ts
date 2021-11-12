# Update THIRD-PARTY-NOTICES.txt.
#
# This script is not intended to be run directly. Instead, use
# `npm run notices` to ensure the right execution environment.

set -e

readonly NOTICES='THIRD-PARTY-NOTICES.txt'

new_notices="$(mktemp)" || exit $?
readonly new_notices
trap 'rm -f "${new_notices}"' EXIT

generate-license-file --input package.json --output "${new_notices}"

if [ "$1" = '--dry-run' ]; then
  if ! diff -u "${NOTICES}" "${new_notices}"; then
    echo "${NOTICES} needs to be updated with the above changes."
    echo 'Run `npm run notices` to update.'
    exit 1
  fi
  exit
fi

cp "${new_notices}" "${NOTICES}"
