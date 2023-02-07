import './App.scss'
import gsap from "gsap";

// get other plugins:
import ScrollTrigger from "gsap/ScrollTrigger";
import {
    addBasePlugins,
    AssetManagerPlugin,
    CameraViewPlugin, DiamondPlugin,
    EasingFunctions,
    GLTFAnimationPlugin, GroundPlugin, PickingPlugin,
    timeout, TonemapPlugin,
    ViewerApp
} from "webgi";
import * as THREE from 'three';
import Header from "./components/header/Header";
import Section01 from "./components/sections/Section01";
import Section02 from "./components/sections/Section02";


function App() {
    async function setupViewer(){

        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: document.getElementById('mcanvas') as HTMLCanvasElement,
            useRgbm: true,
        })

        // Add some plugins
        const manager = await viewer.addPlugin(AssetManagerPlugin)

        await addBasePlugins(viewer)
        const camViews = viewer.getPlugin(CameraViewPlugin)

        viewer.renderer.refreshPipeline()

        await manager.addFromPath("./assets/model/ring06.glb")

        let view = camViews.getCurrentCameraView(viewer.scene.activeCamera)
        camViews.camViews.push(view)

        view = camViews.getCurrentCameraView(viewer.scene.activeCamera)
        view.position.set(6,4,5)
        camViews.camViews.push(view)

        view = camViews.getCurrentCameraView(viewer.scene.activeCamera)
        view.position.set(-2,4,5)
        view.target.set(0,1,0)
        camViews.camViews.push(view)
        camViews.animateOnScroll = true


        camViews.animDuration = 2000 // ms
        // Allowed values: anticipate, backIn, backInOut, backOut, bounceIn, bounceInOut, bounceOut, circIn, circInOut, circOut, easeIn, easeInOut, easeOut, easeInOutSine
        camViews.animEase = 'easeInOutSine' // default is easeInOutSine

        await camViews.animateToView(camViews.camViews[2])
        await timeout(1500)
        await camViews.animateToView(camViews.camViews[1], 2000, EasingFunctions.easeIn) // Override duration and easing
        await timeout(1500)
        await camViews.animateToView(camViews.camViews[0])

        // await camViews.animateAllViews() // Loop all views


        // Animate to a views without saving it
        // view = camViews.getCurrentCameraView(viewer.scene.activeCamera)
        // view.position.set(-2,4,5)
        // view.target.set(0,1,0)
        // await camViews.animateToView(view, 3000, EasingFunctions.easeInOutSine)
        // view.position.set(2,4,5)
        // await camViews.animateToView(view, 3000, EasingFunctions.easeInOutSine)
        /// Chain further animations.


    }
   setupViewer()
  return (
    <div className="App">
        <Header />
        <Section01 />
        <Section02 />
        <div className="section">
            <h1>{'Section 02'}</h1>
        </div>
        <div className="section">
            <h1>{'Section 03'}</h1>
        </div>
        <div className="section">
            <h1>{'Section 04'}</h1>
        </div>

    </div>
  )
}

export default App
