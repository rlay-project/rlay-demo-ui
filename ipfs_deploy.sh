#! /bin/bash
set -euo pipefail

scrape_output=$(ipfscrape http://localhost:3000 2> /dev/null)
scrape_hash=$(echo "$scrape_output" | perl -ne 'print "$1" if /ipfs\.io\/ipfs\/(.*)/')

mkdir -p ipfs_deploy
# There are some strange characters at the end of scrape_hash
ipget -o ipfs_deploy "${scrape_hash:0:${#scrape_hash}-6}"
rm ipfs_deploy/ipfs_log

cp build/rlay_ontology_stdweb.wasm ipfs_deploy
final_hash=$(ipfs add -Q -r ipfs_deploy)

echo "https://ipfs.io/ipfs/${final_hash}"
