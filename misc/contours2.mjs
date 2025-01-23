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
      perlin2: perlin2
    };
  })();
  
  /* === Contour animation script with mouse interaction === */
  (function(){
  
    /* === Configuration === */
    const NUM_LINES = 80;            // Number of horizontal contour lines
    const LINE_SPACING = 50;          // Distance (in px) between lines
    const SPEED = 0.0125;             // How quickly the noise field shifts over time
    const NOISE_SCALE = 0.00125;        // Scale of the noise field
    const AMPLITUDE = 50;            // Maximum vertical offset of each line
    const LINE_WIDTH = 0.125;          // Thickness of contour lines
    const COLOR_CHANGE_SPEED = 0.00125; // Rate at which the line color hue cycles
    const BG_FADE = 0.0125;             // Transparency for the "ghosting" effect
    const MOUSE_RADIUS = 300;         // Radius around mouse that influences contours
    const MOUSE_STRENGTH = 100;        // Strength of the mouse “push/pull”
  
    let canvas, ctx;
    let width, height;
    let time = 0;       // Time offset for noise animation
    let hueOffset = 0;  // For cycling line color
  
    // Track mouse position; start off-screen or at center
    let mouseX = -9999;
    let mouseY = -9999;
  
    function init() {
      canvas = document.getElementById('contours');
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
  
      // Track mouse (pointer) movement
      window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
  
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
  
      for (let x = 0; x < width; x++) {
        // Basic Perlin noise offset
        const n = noise.perlin2(x * NOISE_SCALE, baseY * NOISE_SCALE + time);
        let y = baseY + n * AMPLITUDE;
  
        // Check distance from mouse
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distSq = dx*dx + dy*dy;
        const rSq = MOUSE_RADIUS*MOUSE_RADIUS;
  
        if (distSq < rSq) {
          // Within mouse influence: push contour away from or toward the mouse
          // (Subtract dist if you want an "attraction" effect or do the reverse.)
          const dist = Math.sqrt(distSq);
          // Closer to the mouse => bigger effect
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
  
          // Push away from the mouse
          // We'll push vertically only, for a simpler effect:
          // (You can also do a radial push using dx, dy if you prefer.)
          y -= force;
        }
  
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