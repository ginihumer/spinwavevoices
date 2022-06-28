import React from 'react';
// @ts-ignore
import * as Plotly from 'plotly.js-dist';
import { load_z_data, load_z_data_async, FRAME_RATE, MAX_TIMESTEPS, FPS, load_z_data_all_frames } from './App';

export const SpinPlotFrames = (props: { pedalPressed: boolean, folder: string, plot3d?: boolean, width?: number, height?: number }) => {

    const plotly_ref = React.useRef(null);

    let width = props.width ?? 300;
    let height = props.height ?? 600;

    let axis_template = {
        visible: false,
        showgrid: false,
        zeroline: false,
      };

    // let eye = rotate({
    //   "x": 0, //1, 
    //   "y": 0, //0.3, 
    //   "z": 1, //0.5
    // }, Math.PI/90)

    // https://plotly.com/python/3d-camera-controls/
    
    const [data, setData] = React.useState([{
      z: new Array<any>(),
      zmin: -0.01,
      zmax: 0.01,
      cmin: -0.01,
      cmid: 0,
      cmax: 0.01,
      // type: 'surface',
      // type: 'heatmap',
      type: props.plot3d ? "surface" : "heatmap",
      // colorscale: "Viridis",
      // colorscale: "sequential",
      // colorscale: [[0.0,"rgba(0,255,0,1)"],[0.49,"rgba(255,255,255,1)"],[0.499,"rgba(255,255,255,0)"],[0.501,"rgba(255,255,255,1)"],[1.0,"rgba(255,0,0,1)"]],
      colorscale: [[0.0,"rgba(114,172,204,1)"],[0.5,"rgba(34,34,34,1)"],[1.0,"rgba(204,151,82,1)"]],//[[0.0,"rgba(0,255,0,1)"],[0.5,"rgba(255,255,255,0)"],[1.0,"rgba(255,0,0,1)"]],
      showscale: false,
    }])
    const [layout, setLayout] = React.useState({
      title: '',
      hovermode: false,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      yaxis: axis_template,
      xaxis: axis_template,
      scene: {
        zaxis: {
            range: [-0.1, 0.1],
            autorange: false,
            visible: false,
            showgrid: false,
            zeroline: false,
        },
        yaxis: axis_template,
        xaxis: axis_template,
        aspectmode: "manual", 
        aspectratio: {
            x: width/height,
            y: 1,
            z: 1,
        },
        camera: {
          eye: {
            "x": 0, //1, 
            "y": 0, //0.3, 
            "z": 1, //0.5
          },
          up: {
            "x": 1,
            "y": 0,
            "z": 1
          },
          center: {
            "x": 0,
            "y": 0,
            "z": 0
          },
          projection: "orthographic"
        }
    },
      autosize: true,
      // width: width,
      // height: height,
      margin: {
        l: 10,//65,
        r: 10,//50,
        b: 10,//65,
        t: 10,//90,
      }
    })

    const [frameNames, setFrameNames] = React.useState<string[]>();

    React.useEffect(() => {
      if (plotly_ref.current) {
        load_z_data_all_frames(props.folder).then((frames) => {
          // console.log(frames)
          if (plotly_ref.current) {
            data[0].z = frames[0]
            Plotly.newPlot(plotly_ref.current, {
              "data": data,//{...data, z: frames[20]},
              "layout": layout,
            }).then(() => {
              Plotly.addFrames(plotly_ref.current, frames.map((frame, i) => {
                return {data: [{z: frame}], name: "frame_"+i};
              }));
              setFrameNames(frames.map((frame, i) => "frame_"+i))
            });
          }
        });
      }
    }, []);

    React.useEffect(() => {
      // @ts-ignore
      if(plotly_ref.current.classList.contains('js-plotly-plot')){
        if(props.pedalPressed){
          console.log("pedal pressed")
          console.log(plotly_ref)
          
          Plotly.animate(plotly_ref.current, frameNames, {
            // data: [{z: frames[100]}],
            // traces: [0],
            // layout: layout,
            // transition: {
            //   duration: FRAME_RATE,
            //   easing: 'linear'
            // },
            frame: {
              duration: FRAME_RATE,
              redraw: true,
            },
            mode: 'next'
          })
        }else{
          Plotly.animate(plotly_ref.current, [], {mode: 'next'});
        }
      }
        
    }, [props.pedalPressed]);
    
    return <div ref={plotly_ref} style={{display:"inline-block", width:width, height:height}}></div>;
  };
  

