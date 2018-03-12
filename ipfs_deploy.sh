#! /bin/bash
scrape_output=$(ipfscrape http://localhost:3000 2> /dev/null)
scrape_hash=$(echo $scrape_output | perl -ne 'print "$1" if /ipfs\.io\/ipfs\/(.*)/')

mkdir -p ipfs_deploy
ipget -o ipfs_deploy QmXrXYVKS2SdtrEQYp9UxF2eZEmzmuaKfHLN2zpFmeczue
rm ipfs_deploy/ipfs_log

wget -q -O ipfs_deploy/bay_web.wasm http://localhost:3000/bay_web.wasm

final_hash=$(ipfs add -Q -r ipfs_deploy)

echo "https://ipfs.io/ipfs/${final_hash}"
