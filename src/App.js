import React from "react";
import "./App.css";
import * as Tone from "tone/Tone";

const closedHatSound = new Tone.Player("./ClosedHat1.mp3", () =>
  console.log("ClosedHat1 ready")
).toMaster();
const openHatSound = new Tone.Player("./OpenHat1.mp3", () =>
  console.log("OpenHat1 ready")
).toMaster();
const clapSound = new Tone.Player("./Clap.mp3", () =>
  console.log("Clap ready")
).toMaster();
const kickSound = new Tone.Player("./Kick03.mp3", () =>
  console.log("Kick ready")
).toMaster();

const sounds = {
  "Open Hat": openHatSound,
  "Closed Hat": closedHatSound,
  Clap: clapSound,
  Kick: kickSound
};

const SoundGridCell = ({ value, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        flexGrow: "1",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "red",
        backgroundColor: value ? "black" : "white"
      }}
    ></div>
  );
};

const SoundGridRow = ({ soundType, values, onCellClick }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      <div
        style={{
          flexGrow: "0",
          flexShrink: "0",
          flexBasis: "10rem",
          height: "2rem",
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "#ccc",
          borderColor: "red"
        }}
        onClick={() => {
          console.log("start");
          sounds[soundType].start();
        }}
      >
        {soundType}
      </div>
      {values.map((value, index) => (
        <SoundGridCell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
        ></SoundGridCell>
      ))}
    </div>
  );
};

const SoundGrid = ({ soundTypes, values, width, onCellClick }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: width,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "red"
      }}
    >
      {values.map((value, index) => (
        <SoundGridRow
          key={index}
          soundType={soundTypes[index]}
          values={value}
          onCellClick={col => onCellClick(index, col)}
        ></SoundGridRow>
      ))}
    </div>
  );
};

const DefaultBPM = 98;

const DefaultSoundGridState = {
  soundTypes: ["Open Hat", "Closed Hat", "Clap", "Kick"],
  values: [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1]
  ],
  undoStack: [],
  redoStack: [],
  cellSize: 2,
  sizeUM: "rem"
};

function App() {
  const textInputBPM = React.useRef(null);

  const [soundGridState, setSoundGridState] = React.useState(
    DefaultSoundGridState
  );

  const soundGridState_updateValues = React.useCallback(values => {
    setSoundGridState(currState => {
      if (Object.is(currState.values, values)) return currState;
      return {
        ...currState,
        values
      };
    });
  }, []);

  const toggleCellValue = React.useCallback((grid, row, col) => {
    const result = grid.map((currRowValues, currRow) =>
      currRowValues.map((currValue, currCol) =>
        currRow === row && currCol === col
          ? currValue === 0
            ? 1
            : 0
          : currValue
      )
    );
    return result;
  }, []);

  const soundGridCell_onClick = React.useCallback(
    (row, col) => {
      console.log("update grid");
      const newValues = toggleCellValue(soundGridState.values, row, col);
      console.log("update grid");
      soundGridState_updateValues(newValues);
    },
    [soundGridState.values, soundGridState_updateValues, toggleCellValue]
  );

  const onStart = React.useCallback(() => {
    const bpm = parseInt(textInputBPM.current.value);
    for (let j = 0; j < 16; j++) {
      Tone.Transport.scheduleRepeat(
        function(time) {
          for (let i = 0; i < soundGridState.values.length; i++) {
            const soundPlayer = sounds[soundGridState.soundTypes[i]];
            if (soundGridState.values[i][j] !== 0)
              soundPlayer.start(time + ((60 / bpm) * j) / 4);
          }
        },
        (60 / bpm) * 4,
        1
      );
    }
    Tone.Transport.start();
  }, [soundGridState, textInputBPM]);

  const onStop = React.useCallback(() => {
    Tone.Transport.cancel(0);
    Tone.Transport.stop(0);
  }, []);

  return (
    <div style={{ padding: "0.5rem" }}>
      <h1>Test Play Rythm</h1>
      <div style={{ marginBottom: "1rem" }}>
        <span>BPM:</span>
        <input type="text" ref={textInputBPM} defaultValue={DefaultBPM}></input>
      </div>
      <SoundGrid
        soundTypes={soundGridState.soundTypes}
        values={soundGridState.values}
        width="50rem"
        onCellClick={soundGridCell_onClick}
      ></SoundGrid>
      <p>
        <button title="" onClick={onStart} style={{ fontSize: "1.2rem" }}>
          Start
        </button>
        <span>&nbsp;</span>
        <button title="" onClick={onStop} style={{ fontSize: "1.2rem" }}>
          Stop
        </button>
      </p>
    </div>
  );
}

export default App;
