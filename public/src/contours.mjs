/*!
 * Minimal inlined Perlin noise library
 * Based on https://github.com/josephg/noisejs
 */
(function(){
    // A simple gradient class
    function Grad(x, y, z) {
      this.x = x; this.y = y; this.z = z;
    }
    Grad.prototype.dot2 = function(x, y) {
      return this.x*x + this.y*y;
    };
  
    // Gradients for 3D noise (though we only need 2D here)
    var grad3 = [
      new Grad(1,1,0),   new Grad(-1,1,0),  new Grad(1,-1,0),  new Grad(-1,-1,0),
      new Grad(1,0,1),   new Grad(-1,0,1),  new Grad(1,0,-1),  new Grad(-1,0,-1),
      new Grad(0,1,1),   new Grad(0,-1,1),  new Grad(0,1,-1),  new Grad(0,-1,-1)
    ];
  
    // Original permutation list
    var p = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
      8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
      35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
      134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,
      41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
      89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,
      217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,
      16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,
      101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,
      104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,
      235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,
      45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,
      215,61,156,180
    ];
  
    // Arrays to hold extended permutations
    var perm = new Array(512);
    var gradP = new Array(512);
  
    // The seed function modifies perm[] and gradP[] based on a user seed
    function seed(seedValue) {
      if(seedValue > 0 && seedValue < 1) {
        // Scale the seed
        seedValue *= 65536;
      }
      seedValue = Math.floor(seedValue);
      if(seedValue < 256) {
        seedValue |= seedValue << 8;
      }
  
      for(var i = 0; i < 256; i++) {
        var v;
        if(i & 1) {
          v = p[i] ^ (seedValue & 255);
        } else {
          v = p[i] ^ ((seedValue >> 8) & 255);
        }
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
      }
    }
  
    // 2D Perlin noise
    function perlin2(x, y) {
      // Find unit grid cell containing point
      var X = Math.floor(x), Y = Math.floor(y);
      x = x - X; y = y - Y;
      X = X & 255; Y = Y & 255;
  
      // Calculate noise contributions from each of the four corners
      var n00 = gradP[X + perm[Y]].dot2(x, y);
      var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
      var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
      var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
  
      // Fade curves
      var u = fade(x);
      var v = fade(y);
  
      // Interpolate
      return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
        v
      );
    }
  
    // 2D Simplex noise (not strictly needed here, but included if you want to try simplex2)
    function simplex2(xin, yin) {
      var n0, n1, n2; 
      var F2 = 0.5*(Math.sqrt(3)-1);
      var G2 = (3 - Math.sqrt(3))/6;
      var s = (xin + yin)*F2; 
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j)*G2;
      var X0 = i - t;
      var Y0 = j - t;
      var x0 = xin - X0;
      var y0 = yin - Y0;
      var i1, j1;
      if(x0 > y0) { i1=1; j1=0; } else { i1=0; j1=1; }
      var x1 = x0 - i1 + G2;
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0*G2;
      var y2 = y0 - 1.0 + 2.0*G2;
      var ii = i & 255;
      var jj = j & 255;
      var gi0 = gradP[ii + perm[jj]];
      var gi1 = gradP[ii + i1 + perm[jj + j1]];
      var gi2 = gradP[ii + 1 + perm[jj + 1]];
      var t0 = 0.5 - x0*x0 - y0*y0;
      if(t0<0) n0 = 0; else { t0 *= t0; n0 = t0 * t0 * gi0.dot2(x0, y0); }
      var t1 = 0.5 - x1*x1 - y1*y1;
      if(t1<0) n1 = 0; else { t1 *= t1; n1 = t1 * t1 * gi1.dot2(x1, y1); }
      var t2 = 0.5 - x2*x2 - y2*y2;
      if(t2<0) n2 = 0; else { t2 *= t2; n2 = t2 * t2 * gi2.dot2(x2, y2); }
      return 70.0 * (n0 + n1 + n2);
    }
  
    // Fade function for Perlin
    function fade(t) {
      return t*t*t*(t*(t*6 - 15)+10);
    }
  
    // Linear interpolation
    function lerp(a, b, t) {
      return (1 - t)*a + t*b;
    }
  
    // Expose a global noise object
    window.noise = {
      seed: seed,
      perlin2: perlin2,
      simplex2: simplex2
    };
  })();
  
  /* === Contour animation script === */
  (function(){
    const NUM_LINES = 80;            // Number of horizontal contour lines
    const LINE_SPACING = 50;          // Distance (in px) between lines
    const SPEED = 0.0125;             // How quickly the noise field shifts over time
    const NOISE_SCALE = 0.00125;        // Scale of the noise field
    const AMPLITUDE = 50;            // Maximum vertical offset of each line
    const LINE_WIDTH = 0.125;          // Thickness of contour lines
    const COLOR_CHANGE_SPEED = 0.00125; // Rate at which the line color hue cycles
    const BG_FADE = 0.125;             // Transparency for the "ghosting" effect
  
    // const NUM_LINES = 32;            // Number of horizontal contour lines
    // const LINE_SPACING = 32;          // Distance (in px) between lines
    // const SPEED = 0.0125;             // How quickly the noise field shifts over time
    // const NOISE_SCALE = 0.0125;        // Scale of the noise field
    // const AMPLITUDE = 16;            // Maximum vertical offset of each line
    // const LINE_WIDTH = 0.125;          // Thickness of contour lines
    // const COLOR_CHANGE_SPEED = 0.00125; // Rate at which the line color hue cycles
    // const BG_FADE = 0.125;             // Transparency for the "ghosting" effect
  

    let canvas, ctx;
    let width, height;
    let time = 0;       // Time offset for noise animation
    let hueOffset = 0;  // For cycling line color
  
    function init() {
      canvas = document.getElementById('contours');
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
  
      // Seed the noise so perm arrays are properly initialized:
      noise.seed(Math.random());
  
      requestAnimationFrame(draw);
    }
  
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
  
    function draw() {
      // Slightly translucent fill for a trailing "ghosting" effect
      ctx.fillStyle = `rgba(17, 17, 17, ${BG_FADE})`;
      ctx.fillRect(0, 0, width, height);
  
      // Update offsets
      time += SPEED;
      hueOffset += COLOR_CHANGE_SPEED;
  
      // Draw multiple horizontal contour lines
      for (let i = 0; i < NUM_LINES; i++) {
        const baseY = i * LINE_SPACING + (height - NUM_LINES * LINE_SPACING) / 2;
        drawContourLine(baseY);
      }
  
      requestAnimationFrame(draw);
    }
  
    function drawContourLine(baseY) {
      ctx.beginPath();
      ctx.lineWidth = LINE_WIDTH;
  
      // Cycle hue over time
      const hue = (360 * (Math.sin(hueOffset) * 0.5 + 0.5)) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
  
      // Move horizontally, sampling Perlin noise
      for (let x = 0; x < width; x++) {
        // noise.perlin2() → [-1, 1]
        const n = noise.perlin2(x * NOISE_SCALE, baseY * NOISE_SCALE + time);
        const y = baseY + n * AMPLITUDE;
  
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  
    window.addEventListener('load', init);
  })();