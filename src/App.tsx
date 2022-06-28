import React from 'react';
import { useGamepads } from 'react-gamepads';
import './App.css';
import * as d3 from 'd3';
import Grid from '@mui/material/Grid';
// @ts-ignore
import { SpinPlotReact } from './SpinPlotReact';
import { SpinPlot } from './SpinPlot';
// import { SpinPlotGL } from './GL';
// install plotly: https://stackoverflow.com/questions/54200157/should-i-install-plotly-js-or-plotly-js-dist-via-npm
// https://www.npmjs.com/package/plotly.js

import {WebMidi} from "webmidi";
import { SpinPlotFrames } from './SpinPlotFrames';

// var Plotly = require('plotly.js-dist')
// export const MAX_TIMESTEPS = 2800;
export const MAX_TIMESTEPS = 200;

// export const FPS = 56;
export const FPS = 25;
// export const FPS = 1;
// const FRAME_RATE = 1/56*1000;
// const FRAME_RATE = 5;
export const FRAME_RATE = 1/FPS*1000;

function number_zero_pad(num:number, size:number) {
  let str_num = num.toString();
  while (str_num.length < size) str_num = "0" + str_num;
  return str_num;
}

let cached_data = {} as any;


function init_cache(folder:string){
  console.log("init_cache")
  for(var timestep=0; timestep < MAX_TIMESTEPS; timestep++){
    const path = 'data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv';
    d3.csv(path).then(function(rows){
      function unpack(rows:any, key:any) {
        return rows.map(function(row:any) { return row[key]; });
      }
      var z_data=[ ]
      for(let i=0;i<Object.keys(rows[0]).length;i++)
      {
        z_data.push(unpack(rows,i));
      }
      console.log("cache:", path)
      cached_data[path] = z_data;
    });
  }
}

export async function load_z_data_async(timestep:number, folder:string): Promise<any[]>{
  const path = 'data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv';
    
  // load from cache
  if(path in cached_data){
    return cached_data['data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv'];
  }

  // load from source
  // surfaceplot: https://plotly.com/javascript/3d-surface-plots/
  return await d3.csv('data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv').then(function(rows){
    function unpack(rows:any, key:any) {
      return rows.map(function(row:any) { return row[key]; });
    }
    var z_data=[ ]
    for(let i=0;i<Object.keys(rows[0]).length;i++)
    {
      z_data.push(unpack(rows,i));
    }
    return z_data;
  });
}

export function load_z_data(timestep:number, folder:string): Promise<any[]>{

  const path = 'data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv';

  // load from cache
  if(path in cached_data){
    return new Promise(function(resolve, reject) {
      resolve(cached_data['data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv']);
    });
  }


  // load from source
  // surfaceplot: https://plotly.com/javascript/3d-surface-plots/
  return d3.csv('data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv').then(function(rows){
    function unpack(rows:any, key:any) {
      return rows.map(function(row:any) { return row[key]; });
    }
    var z_data=[ ]
    for(let i=0;i<Object.keys(rows[0]).length;i++)
    {
      z_data.push(unpack(rows,i));
    }
    return z_data;
  });
}


  
export async function load_z_data_all_frames(folder:string): Promise<any[]>{
  let frames = new Array<any>();
  for(var timestep=0; timestep < MAX_TIMESTEPS; timestep++){
    const path = 'data/'+folder+'/m' + number_zero_pad(timestep, 6) + '.csv';
    await d3.csv(path).then(function(rows){
      function unpack(rows:any, key:any) {
        return rows.map(function(row:any) { return row[key]; });
      }
      var z_data=[ ]
      for(let i=0;i<Object.keys(rows[0]).length;i++)
      {
        z_data.push(unpack(rows,i));
      }
      frames.push(z_data);
    });
  }
  return new Promise(function(resolve, reject) {
    resolve(frames);
  });
}


function App() {
  const [gamepads, setGamepads] = React.useState<{[key: number]: Gamepad}>();
  useGamepads((gamepads) => setGamepads(gamepads));
  const [pedal1Pressed, setPedal1Pressed] = React.useState(false);
  const [pedal2Pressed, setPedal2Pressed] = React.useState(false);
  const [pedal3Pressed, setPedal3Pressed] = React.useState(false);
  const [pedal4Pressed, setPedal4Pressed] = React.useState(false);
  const [pedal5Pressed, setPedal5Pressed] = React.useState(false);
  const [pedal6Pressed, setPedal6Pressed] = React.useState(false);

  React.useEffect(() => {

    init_cache("timeseries_vase")
    init_cache("timeseries_rectangle")
    init_cache("timeseries_test1")
    init_cache("timeseries_test2")
    init_cache("timeseries_test3")
    init_cache("timeseries_test4")


    WebMidi
        .enable()
        .then(() => {
            console.log("WebMidi enabled!")
            
            // const midiPort = "IAC Driver Bus 1" // TODO: rename this appropriately for Windows
            const midiPort = "loopMIDI Port"
            const myInput = WebMidi.getInputByName(midiPort)
            
            myInput.addListener("noteon", e => {
                // React to the pedal presses
                if (e.note.number == 60) {
                  setPedal1Pressed(true)
                } else if (e.note.number == 61) {
                  setPedal2Pressed(true)
                } else if (e.note.number == 62) {
                  setPedal3Pressed(true)
                } else if (e.note.number == 63) {
                  setPedal4Pressed(true)
                } else if (e.note.number == 64) {
                  setPedal5Pressed(true)
                } else if (e.note.number == 65) {
                  setPedal6Pressed(true)
                }
            })

            myInput.addListener("noteoff", e => {
                // React to the pedal releases
                if (e.note.number == 60) {
                  setPedal1Pressed(false)
                } else if (e.note.number == 61) {
                  setPedal2Pressed(false)
                } else if (e.note.number == 62) {
                  setPedal3Pressed(false)
                } else if (e.note.number == 63) {
                  setPedal4Pressed(false)
                } else if (e.note.number == 64) {
                  setPedal5Pressed(false)
                } else if (e.note.number == 65) {
                  setPedal6Pressed(false)
                }
            })
        })
        .catch(err => alert(err));

    
    const keydown = (ev: KeyboardEvent) => {
      if(ev.key === "1"){
        setPedal1Pressed(true)
      }
      if(ev.key === "2"){
        setPedal2Pressed(true)
      }
      if(ev.key === "3"){
        setPedal3Pressed(true)
      }
      if(ev.key === "4"){
        setPedal4Pressed(true)
      }
      if(ev.key === "5"){
        setPedal5Pressed(true)
      }
      if(ev.key === "6"){
        setPedal6Pressed(true)
      }
    }

    const keyup = (ev: KeyboardEvent) => {
      if(ev.key === "1"){
        setPedal1Pressed(false)
      }
      if(ev.key === "2"){
        setPedal2Pressed(false)
      }
      if(ev.key === "3"){
        setPedal3Pressed(false)
      }
      if(ev.key === "4"){
        setPedal4Pressed(false)
      }
      if(ev.key === "5"){
        setPedal5Pressed(false)
      }
      if(ev.key === "6"){
        setPedal6Pressed(false)
      }
    }

    // for testing, we just add keyboard keypress events
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    return () => {
      window.removeEventListener("keydown", keydown)
      window.removeEventListener("keydown", keyup)
    }


  }, [])
  
  React.useEffect(() => {
    // gamepads[0] is probably just the first device; if we connect several usb devices, they might have different indexes
    if(gamepads && gamepads[0] && gamepads[0].buttons[3].pressed !== pedal1Pressed){
      setPedal1Pressed(gamepads && gamepads[0] && gamepads[0].buttons[3].pressed)      
    }
  }, [gamepads])

  const height = window.innerHeight - 100;

  return <div style={{overflow:"hidden", textAlign:"center", paddingTop:50}}>
          <SpinPlot pedalPressed={pedal1Pressed} folder={"timeseries_rectangle"} width={height/4} height={height} plot3d={false}></SpinPlot>
          <SpinPlot pedalPressed={pedal2Pressed} folder={"timeseries_rectangle"} width={height/4} height={height} plot3d={false}></SpinPlot>
          <SpinPlot pedalPressed={pedal3Pressed} folder={"timeseries_test1"} width={height/4} height={height}></SpinPlot>
          <SpinPlot pedalPressed={pedal4Pressed} folder={"timeseries_test2"} width={height/4} height={height} plot3d={false}></SpinPlot>
          <SpinPlot pedalPressed={pedal5Pressed} folder={"timeseries_test3"} width={height/4} height={height}></SpinPlot>
          <SpinPlot pedalPressed={pedal6Pressed} folder={"timeseries_test4"} width={height/4} height={height}></SpinPlot>
    </div>
}

export default App;
