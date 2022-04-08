//IF YOUR ARTWORK DOESN'T USE A GENESIS PIECE AS PART OF ITS INPUT, YOU CAN REMOVE THE membershipId VARIABLE
async function art(hash, membershipId) {
  //MAKE SURE TO PROVIDE THE ASPECT RATIO
  let aspectRatio = 1.35;

  let canvas = document.createElement("canvas");
  let width = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = width;
  canvas.height = width * aspectRatio;

  let ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);

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

  //EVERYTHING BELOW HERE SHOULD BE THE CODE FOR YOUR ARTWORK

  //EXAMPLE GETTING DATA FROM GENESIS PIECE (ONLY IF YOU USE GENESIS PIECE AS INPUT)
  let color =
    TwoFiveSix.getBlockColorsForId(membershipId)[
      R.random_dec() * TwoFiveSix.getBlockColorsForId(membershipId).length
    ];

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
}

art(inputData.hash, inputData.membershipId);
