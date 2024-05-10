document.addEventListener("DOMContentLoaded", function () {
  const playBrook = document.getElementById('brook');
  let audioCtx;

  playBrook.addEventListener('click', function () {
    if (!audioCtx) {
      playBabblingBrook();
    }
  });

  //PART 1
  function playBabblingBrook() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var bufferSize = 10 * audioCtx.sampleRate;
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var brown = Math.random() * 2 - 1;

      output[i] = (lastOut + (0.02 * brown)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const globalGain= audioCtx.createGain();
    globalGain.gain.value = 0.2;

    const lowpass1= audioCtx.createBiquadFilter();
    lowpass1.type = 'lowpass';
    lowpass1.frequency.value = 400;

    const lowpass2= audioCtx.createBiquadFilter();
    lowpass2.type = 'lowpass';
    lowpass2.frequency.value = 14;

    const lpf2Gain= audioCtx.createGain();
    lpf2Gain.gain.value = 1200;

    const variableFreq= audioCtx.createConstantSource();
    variableFreq.offset.value = 150
    variableFreq.start();

    const rhpf= audioCtx.createBiquadFilter();
    rhpf.type = 'highpass';
    rhpf.Q.value = 1 / 0.03;
    rhpf.gain.value = 0.1;

    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    brownNoise.connect(lowpass1).connect(rhpf);
    brownNoise.connect(lowpass2).connect(lpf2Gain).connect(rhpf.frequency);
    variableFreq.connect(rhpf.frequency);
    rhpf.connect(globalGain).connect(audioCtx.destination);
  }

  //PART 2
  var DMTFFreqMap = {
    "1": {f1: 697, f2: 1209},
    "2": {f1: 697, f2: 1336},
    "3": {f1: 697, f2: 1477},
    "4": {f1: 770, f2: 1209},
    "5": {f1: 770, f2: 1336},
    "6": {f1: 770, f2: 1477},
    "7": {f1: 852, f2: 1209},
    "8": {f1: 852, f2: 1336},
    "9": {f1: 852, f2: 1477},
    "*": {f1: 941, f2: 1209},
    "0": {f1: 941, f2: 1336},
    "#": {f1: 941, f2: 1477}
  }

  function Tone(context, freq1, freq2) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.status = 0;
    this.freq1 = freq1;
    this.freq2 = freq2;
  }

  Tone.prototype.setup = function() {
    this.osc1 = this.context.createOscillator();
    this.osc2 = this.context.createOscillator();
    this.osc1.frequency.value = this.freq1;
    this.osc2.frequency.value = this.freq2;

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.25;

    this.filter = this.context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 8000;

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.filter);
    this.filter.connect(this.context.destination);
  }

  Tone.prototype.start = function() {
    this.setup();
    this.osc1.start(0);
    this.osc2.start(0);
    this.status = 1;
  }

  Tone.prototype.stop = function() {
    this.osc1.stop(0);
    this.osc2.stop(0);
    this.status = 0;
  }

  var dtmf = new Tone(audioCtx, 350, 440);

  document.querySelectorAll('.dtmf li').forEach(function(item) {
    item.addEventListener('mousedown', handlePress);
    item.addEventListener('touchstart', handlePress);
  });
  window.addEventListener('mouseup', handleRelease);
  window.addEventListener('touchend', handleRelease);
  function handlePress(e) {
    e.preventDefault();
    dtmf.context.resume();
    var keyPressed = this.innerHTML;
    var frequencyPair = DMTFFreqMap[keyPressed];
    dtmf.freq1 = frequencyPair.f1;
    dtmf.freq2 = frequencyPair.f2;
    if (dtmf.status === 0) {
      dtmf.start();
    }
  }

  function handleRelease() {
    if (typeof dtmf !== "undefined" && dtmf.status) {
      dtmf.stop();
    }
  }

});
