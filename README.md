## Intro

This is a 256ART example project. Which can be used when starting development on an art series for the 256ART platform. There are two folders **artwork** and **asset-generation** which will be explained below. Each created artwork should retrieve determnistic randomness from a hash send as input to your art script. Each artwork should be dimension agnostic.

## Artwork folder

- artwork.js: this is the algorithm from which your art is created.
- artwork.min.js: before uploading your algorithm, make sure to minify it. This is the algorithm that will go on-chain.
- index.html: for testing purposes, we generate a random hash (or you can set a hash yourself using URL parameters), a random tokenId and a random membershipId each time you refresh the page.
- Working with p5js? Make sure to remove or update the code where “**P5JS**” is mentioned in a comment (the comment will clarify whether to remove or change the code and how both in index.html and artwork.js).

## Asset-generation folder

- asset-generation.js: this is the algorithm that will create a static image and a JSON file with the attributes for a piece.
- asset-generation.min.js: before uploading your algorithm, make sure to minify it
- index.html: for testing purposes, we generate a random hash (or you can set a hash yourself using URL parameters), a random tokenId and a random membershipId each time you refresh the page.
- On each refresh the script should output a static image and a JSON file holding with the attributes of that piece.
- Working with p5js? Make sure to remove or update the code where “**P5JS**” is mentioned in a comment (the comment will clarify whether to remove or change the code and how both in index.html and artwork.js).

## How does the rendering work?

When a user mints, we derive the tokenId, membershipId and hash from the Ethereum blockchain and in our back-end script we create two HTML files with a script tag with the right inputData. One with your artwork algorithm and one with your asset-generation algorithm. We than run the asset-generation script and store all the files (live html, images, JSON with metadata) on our server for easy access to collectors.

## Is the art also on chain?

Yes, we store the artwork script (and other relevant data, e.g.: what library was used, what license, etc.) on chain.

## How can a collector get the art from chain?

We created a getArtFromChain function which builds an HTML page with your artscript and the relevant inputData (hash, tokenId, membershipId), on-chain. This HTML page is than base64 encoded and send back as a response. As browsers can interpret base64 HTML you can just copy paste the result in your address bar and voila, no need for any form of external hosting to get your art from chain. Some more info can be found here: https://256art.notion.site/Access-on-chain-art-048e8f8aa1664f9a814cd31930e50381
