document.addEventListener("DOMContentLoaded", function(event) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const globalGain = audioCtx.createGain();
  const attackTime = 0.5;
  const decayTime = 3;
  const sustainLevel = 0.3;
  const releaseTime = 0.5;
  globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  globalGain.connect(audioCtx.destination);

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
  };
  let oscType = 'sawtooth';
  let activeOscillators = {};

  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);

  function setWaveform(waveform) {
    oscType = waveform;
    console.log(oscType + " waveform selected");
  }

  function createADSRNodes() {
    const attackGain = audioCtx.createGain();
    const decayGain = audioCtx.createGain();
    const sustainGain = audioCtx.createGain();
    const releaseGain = audioCtx.createGain();

    attackGain.connect(decayGain);
    decayGain.connect(sustainGain);
    sustainGain.connect(releaseGain);

    return { attackGain, decayGain, sustainGain, releaseGain };
  }

  function playNoteWithADSR(key) {
    const { attackGain, decayGain, sustainGain, releaseGain } = createADSRNodes();
    audioCtx.resume();
    attackGain.gain.setValueAtTime(0, audioCtx.currentTime);
    attackGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attackTime);

    decayGain.gain.setValueAtTime(1, audioCtx.currentTime + attackTime);
    decayGain.gain.setTargetAtTime(0.1, audioCtx.currentTime + attackTime, decayTime);

    sustainGain.gain.setValueAtTime(sustainLevel, audioCtx.currentTime + attackTime + decayTime);

    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime);
    osc.type = oscType || 'sine';

    const releaseStartTime = audioCtx.currentTime + attackTime + decayTime;

    //Rest of ADSR chain is connected in createADSRNodes(), so this attaches it to the global gain and oscillator.
    osc.connect(attackGain);
    releaseGain.connect(globalGain);
    osc.start();

    activeOscillators[key] = { osc, releaseGain, releaseStartTime };
  }

  function releaseNote(key) {
    const { releaseGain, releaseStartTime } = activeOscillators[key];
    releaseGain.gain.setValueAtTime(releaseGain.gain.value, audioCtx.currentTime);
    releaseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + releaseTime);
    activeOscillators[key].osc.stop(releaseStartTime + releaseTime);
    delete activeOscillators[key];
  }

  function keyDown(event) {
    console.log("key down")
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
      playNoteWithADSR(key);
    }
  }

  function keyUp(event) {
    console.log("key up")
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
      releaseNote(key);
    }
  }

  document.getElementById("sine").addEventListener("click", function() {
    setWaveform('sine');
  });

  document.getElementById("sawtooth").addEventListener("click", function() {
    setWaveform('sawtooth');
  });

  setInterval(function() {
    var x = globalGain.gain.value;
    document.getElementById('gain').innerHTML = x;
  }, 1);
});
