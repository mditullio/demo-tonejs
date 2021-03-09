import React from "react";
import "./App.css";
import * as Tone from "tone/Tone";

var synth = new Tone.Synth().toMaster();

var bpm = 110;

var player2 = new Tone.Player("./ClosedHat1.mp3", function() {
  //the player is now ready

  //play a note every eighth note starting from the first measure
  Tone.Transport.scheduleRepeat(
    function(time) {
      player2.start(time + (60 / bpm) * 1);
      player2.start(time + (60 / bpm) * 2);
      player2.start(time + (60 / bpm) * 2.5);
      player2.start(time + (60 / bpm) * 3);
    },
    (60 / bpm) * 4,
    1
  );
}).toMaster();

var player = new Tone.Player("./OpenHat1.mp3", function() {
  //the player is now ready

  //play a note every eighth note starting from the first measure
  Tone.Transport.scheduleRepeat(
    function(time) {
      player.start(time);
    },
    (60 / bpm) * 4,
    1
  );
}).toMaster();

function App() {
  return (
    <div>
      <h1>Test Play Loop</h1>
      <p>
        <button title="" onClick={() => Tone.Transport.start()}>
          Start
        </button>
        <span>&nbsp;</span>
        <button title="" onClick={() => Tone.Transport.stop()}>
          Stop
        </button>
      </p>
    </div>
  );
}

export default App;
