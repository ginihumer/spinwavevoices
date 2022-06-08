import React from 'react';
import { useGamepads } from 'react-gamepads';
import './App.css';
import * as d3 from 'd3';
import Grid from '@mui/material/Grid';
// @ts-ignore
import { _3d } from 'd3-3d';
// @ts-ignore
import { SpinPlotReact } from './SpinPlotReact';
import { SpinPlot, Test } from './SpinPlot';
// import { SpinPlotGL } from './GL';
// install plotly: https://stackoverflow.com/questions/54200157/should-i-install-plotly-js-or-plotly-js-dist-via-npm
// https://www.npmjs.com/package/plotly.js

// var Plotly = require('plotly.js-dist')
// export const MAX_TIMESTEPS = 2800;
export const MAX_TIMESTEPS = 200;

// const FRAME_RATE = 1/56*1000;
// const FRAME_RATE = 5;
export const FRAME_RATE = 1000;
// export const FPS = 56;
export const FPS = 25;
// export const FPS = 1;

function number_zero_pad(num:number, size:number) {
  let str_num = num.toString();
  while (str_num.length < size) str_num = "0" + str_num;
  return str_num;
}

export function load_z_data(timestep:number, folder:string){
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




function App() {
  const [gamepads, setGamepads] = React.useState<{[key: number]: Gamepad}>();
  useGamepads((gamepads) => setGamepads(gamepads));
  const [pedal1Pressed, setPedal1Pressed] = React.useState(false);
  const [pedal2Pressed, setPedal2Pressed] = React.useState(false);

  React.useEffect(() => {
    const keydown = (ev: KeyboardEvent) => {
      if(ev.key === "1"){
        setPedal1Pressed(true)
      }
      if(ev.key === "2"){
        setPedal2Pressed(true)
      }
    }

    const keyup = (ev: KeyboardEvent) => {
      if(ev.key === "1"){
        setPedal1Pressed(false)
      }
      if(ev.key === "2"){
        setPedal2Pressed(false)
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

  return <Grid container>
      <Grid item xs={3}>
        {/* <Test></Test> */}
        <SpinPlot pedalPressed={pedal1Pressed} folder={"timeseries_vase"}></SpinPlot>
      </Grid>
      <Grid item xs={3}>
        <SpinPlot pedalPressed={pedal2Pressed} folder={"timeseries_rectangle"}></SpinPlot>
      </Grid>
    </Grid>
}

export default App;
