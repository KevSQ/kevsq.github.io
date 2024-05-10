document.addEventListener("DOMContentLoaded", function (event) {
  var modFreq = 200
  var modIndex = 150;
  var LFOFreq = 3;
  const keyboardFrequencyMap = {
    '90': 261.625565300598634,  //Z - C
    '83': 277.182630976872096, //S - C#
    '88': 293.664767917407560,  //X - D
    '68': 311.126983722080910, //D - D#
    '67': 329.627556912869929,  //C - E
    '86': 349.228231433003884,  //V - F
    '71': 369.994422711634398, //G - F#
    '66': 391.995435981749294,  //B - G
    '72': 415.304697579945138, //H - G#
    '78': 440.000000000000000,  //N - A
    '74': 466.163761518089916, //J - A#
    '77': 493.883301256124111,  //M - B
    '81': 523.251130601197269,  //Q - C
    '50': 554.365261953744192, //2 - C#
    '87': 587.329535834815120,  //W - D
    '51': 622.253967444161821, //3 - D#
    '69': 659.255113825739859,  //E - E
    '82': 698.456462866007768,  //R - F
    '53': 739.988845423268797, //5 - F#
    '84': 783.990871963498588,  //T - G
    '54': 830.609395159890277, //6 - G#
    '89': 880.000000000000000,  //Y - A
    '55': 932.327523036179832, //7 - A#
    '85': 987.766602512248223,  //U - B
  }
  var activeOscillators = {}
  var activeGainNodes = {}

  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);

  const elements = {
    synthMode: document.getElementById("synth").synth,
    partials: document.getElementById("partialsContainer"),
    partialSelect: document.getElementById("partials"),
    modFreq: document.getElementById("modfreqContainer"),
    modIndex: document.getElementById("indexContainer"),
    lfo: document.getElementById("lfoContainer"),
    wave: document.getElementById('envelope-select')
  };

  elements.partials.style.display = "block";
  elements.modFreq.style.display = "none";
  elements.modIndex.style.display = "none";
  elements.lfo.style.display = "block";

  elements.synthMode.forEach(mode => {
    mode.onclick = function() {
      const synthType = this.value;
      elements.partials.style.display = synthType === 'additive' ? "block" : "none";
      elements.modFreq.style.display = synthType === 'fm' ? "block" : "none";
      elements.modIndex.style.display = synthType === 'fm' ? "block" : "none";
    };
  });


  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let limiter = audioCtx.createDynamicsCompressor()
  limiter.threshold.setValueAtTime(-10, audioCtx.currentTime);
  function keyDown(e) {
    const key = (e.detail || e.which).toString();
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
      playNote(key);
    }
  }

  function keyUp(e) {
    const key = (e.detail || e.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
      activeGainNodes[key].forEach((e) => {
        e.gain.setValueAtTime(e.gain.value, audioCtx.currentTime);
        e.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      });
      activeGainNodes[key].forEach((e) => {
        e.gain.setValueAtTime(0, audioCtx.currentTime);
      });
      activeOscillators[key].forEach((e) => {
        e.stop();
      });
      delete activeGainNodes[key];
      delete activeOscillators[key];
    }
  }

  function playNote(key) {
    console.log(modIndex, modFreq, LFOFreq)
    if (elements.synthMode.value === 'additive') {
      const globalGain = audioCtx.createGain();
      globalGain.gain.value = 0.0001;
      globalGain.connect(audioCtx.destination);
      globalGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.05);
      var oscArr = []
      var leadOsc = audioCtx.createOscillator();
      leadOsc.frequency.value = keyboardFrequencyMap[key]
      leadOsc.start();
      leadOsc.connect(globalGain)
      leadOsc.type = elements.wave.value
      console.log(elements.wave.value)
      oscArr.push(leadOsc)

      for (var i = 0; i < elements.partialSelect.value; i++) {
        var osc = audioCtx.createOscillator();
        osc.frequency.value = (i + 2) * keyboardFrequencyMap[key] + (-1) ** i * Math.random() * 15;
        osc.connect(globalGain);
        osc.type = elements.wave.value
        osc.start();
        oscArr.push(osc);
      }

      activeOscillators[key] = oscArr
      activeGainNodes[key] = [globalGain]

      var lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(LFOFreq, audioCtx.currentTime)
      lfo.connect(globalGain).connect(leadOsc.frequency);
      lfo.start();
      activeOscillators[key].push(lfo)

      Object.keys(activeGainNodes).forEach((key) => {
        for (var i = 0; i < activeGainNodes[key].length; i++) {
          activeGainNodes[key][i].gain.setTargetAtTime(0.7 / (Object.keys(activeGainNodes).length + (oscArr.length * Object.keys(activeGainNodes).length)), audioCtx.currentTime, 0.2)
        }
      })

    } else if (elements.synthMode.value === 'am') {
      var carrier = audioCtx.createOscillator();
      var modulatorFreq = audioCtx.createOscillator();
      modulatorFreq.frequency.setValueAtTime(modFreq, audioCtx.currentTime);
      carrier.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
      carrier.type = elements.wave.value;
      modulatorFreq.type = elements.wave.value;

      console.log(modulatorFreq)
      let modulated = audioCtx.createGain();
      let depth = audioCtx.createGain();
      depth.gain.value = 0.5 //scale modulator output to [-0.5, 0.5]
      modulated.gain.value = 1.0 - depth.gain.value; //a fixed value of 0.5
      modulatorFreq.connect(depth).connect(modulated.gain); //.connect is additive, so with [-0.5,0.5] and 0.5, the modulated signal now has output gain at [0,1]
      carrier.connect(modulated);
      modulated.connect(limiter).connect(audioCtx.destination);
      modulated.gain.setValueAtTime(0, audioCtx.currentTime)
      carrier.start()
      modulatorFreq.start()
      activeOscillators[key] = [carrier, modulatorFreq]
      activeGainNodes[key] = [modulated, depth]

      const LFO = audioCtx.createOscillator();
      LFO.frequency.setValueAtTime(LFOFreq, audioCtx.currentTime)
      LFO.connect(modulated).connect(modulatorFreq.frequency);
      LFO.type = elements.wave.value;
      LFO.start();
      activeOscillators[key].push(LFO)

    } else if (elements.synthMode.value === 'fm') {
      var fm_carrier = audioCtx.createOscillator();
      var fm_modulatorFreq = audioCtx.createOscillator();
      fm_carrier.type = elements.wave.value;
      fm_modulatorFreq.type = elements.wave.value;

      fm_carrier.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)

      var fm_modulationIndex = audioCtx.createGain();
      var gainNode = audioCtx.createGain();

      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime, 0.5);

      // fm_modulationIndex.gain.value = modIndex;
      fm_modulationIndex.gain.linearRampToValueAtTime(modIndex, audioCtx.currentTime, 0.5);
      fm_modulatorFreq.frequency.value = modFreq;

      fm_modulatorFreq.connect(fm_modulationIndex);
      fm_modulationIndex.connect(fm_carrier.frequency)

      fm_carrier.connect(gainNode).connect(limiter).connect(audioCtx.destination);

      fm_carrier.start();
      fm_modulatorFreq.start();

      const LFO = audioCtx.createOscillator();
      LFO.frequency.value = LFOFreq;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 8;
      LFO.connect(lfoGain).connect(fm_modulatorFreq.frequency);
      LFO.type = elements.wave.value;
      LFO.start();

      activeOscillators[key] = [fm_carrier, fm_modulatorFreq, LFO]
      activeGainNodes[key] = [fm_modulationIndex, gainNode, lfoGain]

    }
  }

  document.getElementById("updateParamsBtn").addEventListener("click", function() {
    const modfreqValue = document.getElementById("modfreqValue").value;
    const indexValue = document.getElementById("indexValue").value;
    const lfoValue = document.getElementById("lfoValue").value;
    const partialValue = document.getElementById("partials").value;
    modFreq = parseInt(modfreqValue);
    modIndex = parseInt(indexValue);
    LFOFreq = parseFloat(lfoValue);

    console.log("Updated values: Mod Frequency:", modFreq, "Mod Index:", modIndex, "LFO Frequency:", LFOFreq);
  });

});
