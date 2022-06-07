export default null;
// import React, { useEffect, useState } from "react";
// import { FRAME_RATE, load_z_data, MAX_TIMESTEPS } from "./App";
// // @ts-ignore
// import * as THREE from 'three';


// var SCREEN_WIDTH=500, SCREEN_HEIGHT=500;
// var VIEW_ANGLE=45, ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT, NEAR=0.1, FAR=2000;

// export const SpinPlotGL = (props:{pedal1Pressed:boolean}) => {
//     const [timestep, setTimestep] = React.useState(100);
//     const ref = React.useRef<any>()
  
//     const [renderer] = useState(() => new THREE.WebGLRenderer({
//         antialias: true,
//         // alpha: true
//     }))
//     const [scene] = useState(() => new THREE.Scene())
//     const [rerender, setRerender] = useState(0)

//     useEffect(() =>  {
//         ref.current.appendChild(renderer.domElement);
//         // eslint-disable-next-line
//     }, [])


    
//     React.useEffect(() => {
//         scene.clear(); // clears the scene //.remove(...scene.children)//

//         var BIGIN=-10, END=10, WIDTH=END-BIGIN;
//         var plane_geometry = new THREE.PlaneGeometry(WIDTH,WIDTH);
//         var plane_material = new THREE.MeshLambertMaterial({color:0xf0f0f0, shading: THREE.FlatShading, overdraw: 0.5, side: THREE.DoubleSide});
//         var plane = new THREE.Mesh(plane_geometry, plane_material);
//         scene.add(plane);
    
//         var geometry = new THREE.Geometry();
        
//         for(var i=BIGIN;i<=END;i+=2){
//             geometry.vertices.push(new THREE.Vector3(BIGIN,i,0));
//             geometry.vertices.push(new THREE.Vector3(END,i,0));
//             geometry.vertices.push(new THREE.Vector3(i,BIGIN,0));
//             geometry.vertices.push(new THREE.Vector3(i,END,0));
//         }
    
//         var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
    
//         var line = new THREE.Line(geometry, material);
//         line.type = THREE.LinePieces;
//         scene.add(line)

//         setRerender(rerender+1)

//         // if(props.pedal1Pressed){
//         //   setTimeout(() => {
//         //     setTimestep((timestep+1)%MAX_TIMESTEPS)
//         //   }, FRAME_RATE);
//         // }
//       }, [timestep, props.pedal1Pressed])


//     useEffect(() => {
//         // if (viewTransform) {

//             renderer.setPixelRatio(window.devicePixelRatio);
//             renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
//             renderer.setClearColor( 0x000000, 0 );

//             // Create orthographic camera
//             // var camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, 1, 1000);
//             var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

//             // camera.position.z = 1;
//             // camera.lookAt(new THREE.Vector3(0, 0, 0));

//             // camera.position.x = viewTransform.centerX
//             // camera.position.y = viewTransform.centerY
//             // camera.zoom = viewTransform.zoom

//             // camera.updateProjectionMatrix();
//             camera.position.set(0, 150, 400);
//             camera.lookAt(scene.position);

//             var positions = [[1,1,1],[-1,-1,1],[-1,1,1],[1,-1,1]];
//             for(var i=0;i<4;i++){
//                 var light=new THREE.DirectionalLight(0xdddddd);
//                 light.position.set(positions[i][0],positions[i][1],0.4*positions[i][2]);
//                 scene.add(light);
//             }

//             try {
//                 renderer.render(scene, camera);
//             } catch (e) {
//                 console.log(e)
//             }
//         // }
//     // eslint-disable-next-line
//     }, [scene, scene.children, rerender])

//     return <div style={{  }} ref={ref} />
//   }