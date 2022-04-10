//WE STRONGLY RECOMMEND THE USAGE OF THE FOLLOWING CLASS FOR RANDOMNESS (remove functionality you don't need)
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
    this.prngA = new sfc32(inputData.hash.substr(2, 32));
    this.prngB = new sfc32(inputData.hash.substr(34, 32));
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

function setup() {
  //MAKE SURE TO PROVIDE THE ASPECT RATIO
  let aspectRatio = 1.35;
  let width = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = width;
  canvas.height = width * aspectRatio;

  document.body.appendChild(canvas);
}

function draw() {
  //YOU SHOULD ALWAYS START WITH THE FOLLOWING
  let contractAddress = inputData.smartContract;
  let rinkeby = inputData.rinkeby;
  let fileExtension = inputData.fileExtension;
  let tokenId = inputData.tokenId;

  //MAKE SURE TO SET ASPECT RATIO
  let aspectRatio = 1.35;

  //DON'T CHANGE THE BASE URL
  let baseUrl =
    "https://256art.s3.eu-central-1.amazonaws.com/" +
    (rinkeby ? "rinkeby" : "mainnet") +
    "/" +
    contractAddress +
    "/";

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

  //IF YOUR ARTWORK DOESN'T USE A GENESIS PIECE AS PART OF ITS INPUT, YOU CAN REMOVE THE membershipId VARIABLE
  //let membershipId = inputData.membershipId;

  //IF USING P5JS THIS ISN'T NEEDED
  let ctx = canvas.getContext("2d");

  //INITIATE THE RANDOM CLASS
  let R = new Random();

  //EVERYTHING BELOW HERE SHOULD BE THE CODE FOR YOUR ARTWORK

  //EXAMPLE GETTING DATA FROM GENESIS PIECE (ONLY IF YOU USE GENESIS PIECE AS INPUT)
  //let colors = TwoFiveSix.getBlockColorsForId(membershipId);
  //let color = colors[Math.floor(colors.length * R.random_dec())];
  let color =
    "#" +
    Math.floor(R.random_dec() * 16777215)
      .toString(16)
      .toString();

  //EXAMPLES USING THE RANDOM CLASS
  let startX = canvas.width * R.random_dec();
  let startY = canvas.height * R.random_dec();
  let endX = canvas.width * R.random_dec();
  let endY = canvas.height * R.random_dec();

  //MAKE SURE ALL VARIABLES ARE DIMENSION AGNOSTIC, E.G.: LINEWIDTH BASED OF CANVAS WIDTH
  let lineWidth = canvas.width * 0.05;

  //DRAW ARTWORK
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  //EXAMPLE OF HOW TO ADD AN ATTRIBUTE
  metaData.attributes.push({
    trait_type: "Line color",
    value: color,
  });

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

  download_files(filesToDownload);
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

//IF YOU USE P5JS YOU CAN REMOVE THE FOLLOWING
let canvas = document.createElement("canvas");
setup();
draw();
