## Intro

This is a 256ART example project. Which can be used when starting development on an artseries for the 256ART platform. There are two folders **dev** and **release** which will be explained below. Each created artwork should retrieve determnistic randomness from a hash send as input to your art script. Each artwork should be dimension agnostic.

## Dev folder

During your development phase, you should only work in the dev folder.

- createArt.js: this should be the starting point and where you create the script for your artwork.
- createStaticImageAndMetadata.js: once your artwork is finished, you can start working in this file which should output a static image file of your artwork and a json file with the metadata for your artwork.
- index.html: here you can set and experiment with different inputdata (e.g.: if you want to use a different hash to randomize your artwork), it's also where you should add your libraries (one max, two if using the 256ART library).

## Release folder

Once you're ready to launch your series (or test it on a testnet), you should create two files:

- artwork.html: a single html page, with the script from the createArt.js folder in the dev folder minified and added inside a script tag.
- staticimageandmetadata.html: a single html page, with the script from the createStaticImageAndMetadata.js folder in the dev folder minified and added inside a script tag.

When a user mints, we derive the tokenId, membershipId and hash from the Ethereum blockchain and in our back-end script we add a script tag with the right inputData to your release files. When run artwork.html shows the artwork and staticimageandmetadata.html returns the files we need for marketplaces (static image and json metadata). The artwork, static image(s) and json are than stored and easily retrievable.

We store the art script (and other relevant data, e.g.: libraries used) on chain, meaning collectors can always recreate their art from the generated hash which is linked (on chain) to the ERC721 token in their wallet.
