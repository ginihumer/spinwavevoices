import React from 'react';
// @ts-ignore
import * as Plotly from 'plotly.js-dist';
import { load_z_data, FRAME_RATE, MAX_TIMESTEPS, FPS } from './App';


export const SpinPlot = (props: { pedalPressed: boolean; folder: string }) => {
    const previous_time_ref = React.useRef<number>();
    const totaltime_ref = React.useRef(0);
    const step_ref = React.useRef(0);
    const plotly_ref = React.useRef(null);
    const request_ref = React.useRef<any>();

    let data = [{
        z: new Array<any>(),
        zmin: -0.01,
        zmax: 0.01,
        cmin: -0.01,
        cmid: 0,
        cmax: 0.01,
        type: 'surface',
        showscale: false,
      }];
    const layout = {
      title: 'Spin Waves',
      hovermode: false,
      scene: {
        zaxis: {
            range: [-0.1, 0.1],
            autorange: false,
            visible: false,
            showgrid: false,
            zeroline: false,
        },
        yaxis:{
            visible: false,
            showgrid: false,
            zeroline: false,
        },
        xaxis:{
            visible: false,
            showgrid: false,
            zeroline: false,
        },
        aspectmode: "manual", 
        aspectratio: {
            x: 1,
            y: 1/4,
            z: 1,
        },
        camera: {
            eye: {
                "x": 1, 
                "y": 0.3, 
                "z": 1
            }, 
            // projection: "orthographic"
        }
    },
      width: 600,
      height: 600,
      margin: {
        l: 65,
        r: 50,
        b: 65,
        t: 90,
      }
    };

    const animate = (time:number) => { // time since app started
        // console.log(time)
        if (previous_time_ref.current !== undefined) {
            // ms since last update
            const deltaTime = time - previous_time_ref.current;
            
            // total ms since start
            totaltime_ref.current += deltaTime

            // current step of animation
            const total_seconds = totaltime_ref.current/1000
            const new_step = Math.floor(total_seconds*FPS)%MAX_TIMESTEPS
            if(step_ref.current !== new_step){
                step_ref.current = new_step
                console.log(step_ref.current)
                if (plotly_ref.current) {
                    load_z_data(step_ref.current, props.folder).then((z_data) => {
                        if (plotly_ref.current) {
                            // Plotly.animate(plotly_ref.current, {
                            //     data: [{
                            //     z: z_data,
                            //     }],
                            //     traces: [0],
                            //     layout: {}
                            //     }, {
                            //     transition: {
                            //     duration: 0,
                            //     //  easing: 'cubic-in-out',
                            //     redraw: false,
                            //     },
                            // });
                            data[0].z = z_data;
                            // update plot
                            Plotly.react(plotly_ref.current, 
                                data,
                                layout
                            )
                        }
                    });
                }
            }
        }
        
        previous_time_ref.current = time
        request_ref.current = requestAnimationFrame(animate);
    }

    
  
    React.useEffect(() => {
      if (plotly_ref.current) {
        load_z_data(step_ref.current, props.folder).then((z_data) => {
            console.log(step_ref.current)
          if (plotly_ref.current) {
            data[0].z = z_data
            Plotly.newPlot(plotly_ref.current, {
              "data": data,
              "layout": layout,
            });
          }
        });
      }
    }, []);

    React.useEffect(() => {
        if(props.pedalPressed){
            request_ref.current = requestAnimationFrame(animate);
        }else{
            cancelAnimationFrame(request_ref.current);
            previous_time_ref.current = undefined;
        }
        
    }, [props.pedalPressed]);
    
    return <div ref={plotly_ref}></div>;
  };
  

export const SpinPlotOld = (props: { pedal1Pressed: boolean; folder: string }) => {
  const [timestep, setTimestep] = React.useState(100);
  const plotly_ref = React.useRef(null);

  React.useEffect(() => {
    if (plotly_ref.current) {
      console.log(timestep);
      load_z_data(timestep, props.folder).then((z_data) => {
        if (plotly_ref.current) {
          const data = [{
            z: z_data,
            zmin: -0.02,
            zmax: 0.02,
            // marker: {
            //   cmin: -0.1,
            //   cmax: 0.1
            // },
            // type: 'surface',
            type: 'heatmap',
            // contours: {
            //   z: {
            //     show:true,
            //     usecolormap: true,
            //     // highlightcolor:"#42f462",
            //     project:{z: true},
            //   }
            // }
          }];
          const layout = {
            title: 'Spin Waves',
            zaxis: {
              range: [-0.1, 0.1],
              autorange: false
            },
            // scene: {
            //   camera: {eye: {x: 0, y: 0, z: 0}}
            // },
            // autosize: false,
            width: 3 * 100,
            height: 500,
            // margin: {
            //   l: 65,
            //   r: 50,
            //   b: 65,
            //   t: 90,
            // }
          };
          Plotly.newPlot(plotly_ref.current, {
            "data": data,
            "layout": layout
          });
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (plotly_ref.current) {
      console.log(timestep);
      load_z_data(timestep, props.folder).then((z_data) => {
        if (plotly_ref.current) {
          Plotly.animate(plotly_ref.current, {
            data: [{
              z: z_data,
            }],
            traces: [0],
            layout: {}
          }, {
            transition: {
              duration: FRAME_RATE,
              easing: 'cubic-in-out'
            },
          });
        }
      });
    }

    if (props.pedal1Pressed) {
      setTimeout(() => {
        setTimestep((timestep + 1) % MAX_TIMESTEPS);
      }, FRAME_RATE);
    }
  }, [timestep, props.pedal1Pressed]);


  return <div ref={plotly_ref}></div>;
};
