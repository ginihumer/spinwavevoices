import React from 'react';
// @ts-ignore
import Plot from 'react-plotly.js';

export const SpinPlotReact = (props: { pedal1Pressed: boolean; }) => {
  const [plotly_z_data, set_plotly_z_data] = React.useState<any>();
  const [timestep, setTimestep] = React.useState(1);
  const plotly_ref = React.useRef(null);

  // React.useEffect(() => {
  //   d3.csv('data/sample_files.csv').then(function(rows){
  //     var z_data = []
  //     var nr_rows = 
  //     for(let i = 0; i < )
  //   })
  // }, [])
  // const frames = React.useMemo(() => {
  //   return [{
  //     name: "1",
  //     data:[{
  //       z: plotly_z_data,
  //       zmin: -0.02,
  //       zmax: 0.02,
  //       type: 'heatmap',
  //     }]
  //   }]
  // }, [])
  // React.useEffect(() => {
  //   console.log(timestep)
  //   load_z_data(timestep).then((z_data) => {
  //     set_plotly_z_data(z_data);
  //   })
  //   if(props.pedal1Pressed){
  //     setTimeout(() => {
  //       setTimestep((timestep+1)%MAX_TIMESTEPS)
  //     }, FRAME_RATE);
  //   }
  // }, [timestep, props.pedal1Pressed])
  // React.useEffect(() => {
  //   if(plotly_ref.current){
  //     // @ts-ignore
  //     // const plotly_div = plotly_ref.current.el
  //     if(pedal1Pressed){
  //       setTimeout(() => {
  //         setTimestep((timestep+1)%MAX_TIMESTEPS)
  //       }, 10);
  //     }
  //   }
  // }, [timestep, pedal1Pressed])
  // var myColor = d3.scaleSequential().domain([-0.1,0.1]).interpolator(d3.interpolatePuRd);
  const data = [{
    z: plotly_z_data,
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

  // return <div></div>
  return <Plot ref={plotly_ref}
  ></Plot>;
};
