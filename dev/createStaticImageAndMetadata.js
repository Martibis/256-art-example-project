async function createStaticImageAndMetadata(
  hash,
  tokenId,
  membershipId,
  contractAddress,
  rinkeby,
  fileExtension
) {
  //YOU SHOULD ALWAYS START WITH THE FOLLOWING, DON'T CHANGE THE BASE URL
  let baseUrl =
    "https://256art.s3.eu-central-1.amazonaws.com/" +
    (rinkeby ? "rinkeby" : "mainnet") +
    "/" +
    contractAddress +
    "/";

  //MAKE SURE TO SET ASPECT RATIO
  let aspectRatio = 1.35;

  let metaData = {
    name: "Minimal line #" + tokenId,
    artist: "Tibout Shaik",
    description: "This is just a minimal line",

    //IF YOUR ARTWORK IS ANIMATED, UNCOMMENT BELOW
    //animation_url: baseUrl + "html_files/" + tokenId.toString() + ".html",

    //don't change below
    image: baseUrl + "max/" + tokenId.toString() + ".png",
    live_url: baseUrl + "html_files/" + tokenId.toString() + ".html",
    aspect_ratio: aspectRatio,
    external_url: "https://256art.com/" + contractAddress + "/" + tokenId,
    attributes: [],
  };

  //BELOW SHOULD BE THE CODE THAT ADDS ATTRIBUTES TO YOUR METADATA, WE RECOMMEND JUST COPYING YOUR ARTSCRIPT AND ADDING ATTRIBUTES AT CERTAIN STEPS

  let canvas = document.createElement("canvas");
  let width = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = width;
  canvas.height = width * aspectRatio;

  let ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);
  class Random {
    constructor() {
      this.useA = false;
      let sfc32 = function (uint128Hex) {
        let a = parseInt(uint128Hex.substr(0, 8), 16);
        let b = parseInt(uint128Hex.substr(8, 8), 16);
        let c = parseInt(uint128Hex.substr(16, 8), 16);
        let d = parseInt(uint128Hex.substr(24, 8), 16);
        return function () {
          a |= 0;
          b |= 0;
          c |= 0;
          d |= 0;
          let t = (((a + b) | 0) + d) | 0;
          d = (d + 1) | 0;
          a = b ^ (b >>> 9);
          b = (c + (c << 3)) | 0;
          c = (c << 21) | (c >>> 11);
          c = (c + t) | 0;
          return (t >>> 0) / 4294967296;
        };
      };
      this.prngA = new sfc32(hash.substr(2, 32));
      this.prngB = new sfc32(hash.substr(34, 32));
      for (let i = 0; i < 1e6; i += 2) {
        this.prngA();
        this.prngB();
      }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec() {
      this.useA = !this.useA;
      return this.useA ? this.prngA() : this.prngB();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num(a, b) {
      return a + (b - a) * this.random_dec();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int(a, b) {
      return Math.floor(this.random_num(a, b + 1));
    }
    // random boolean with p as percent liklihood of true
    random_bool(p) {
      return this.random_dec() < p;
    }
    // random value in an array of items
    random_choice(list) {
      return list[this.random_int(0, list.length - 1)];
    }
  }

  let R = new Random();
  let color =
    TwoFiveSix.getBlockColorsForId(membershipId)[
      Math.round(
        R.random_dec() * TwoFiveSix.getBlockColorsForId(membershipId).length
      )
    ];

  let startX = canvas.width * R.random_dec();
  let startY = canvas.height * R.random_dec();
  let endX = canvas.width * R.random_dec();
  let endY = canvas.height * R.random_dec();

  let lineWidth = canvas.width * 0.05;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  //EXAMPLE OF HOW TO ADD AN ATTRIBUTE
  metaData.attributes.push({
    trait_type: "Line color",
    value: color,
  });

  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  //WE RECOMMEND USING THE BELOW CODE TO GENERATE THE FINAL STATIC IMAGE AND JSON METADATA FILES
  let filesToDownload = [];
  filesToDownload.push({
    filename:
      tokenId.toString() +
      "." +
      (fileExtension === "jpeg" || fileExtension === "jpg"
        ? "jpg"
        : fileExtension),
    download: canvas.toDataURL(
      "image/" +
        (fileExtension === "jpeg" || fileExtension === "jpg"
          ? "jpeg"
          : fileExtension)
    ),
  });

  let jsonString = JSON.stringify(metaData);
  let blob = new Blob([jsonString], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  filesToDownload.push({
    filename: tokenId.toString() + ".json",
    download: url,
  });

  //download_files(filesToDownload);
}

function download_files(files) {
  function download_next(i) {
    if (i >= files.length) {
      return;
    }
    var a = document.createElement("a");
    a.href = files[i].download;
    a.target = "_parent";
    if ("download" in a) {
      a.download = files[i].filename;
    }
    (document.body || document.documentElement).appendChild(a);
    if (a.click) {
      a.click();
    } else {
      $(a).click();
    }
    a.parentNode.removeChild(a);
    setTimeout(function () {
      download_next(i + 1);
    }, 500);
  }
  download_next(0);
}

createStaticImageAndMetadata(
  inputData.hash,
  inputData.tokenId,
  inputData.membershipId,
  inputData.smartContract,
  inputData.rinkeby,
  inputData.fileExtension
);
