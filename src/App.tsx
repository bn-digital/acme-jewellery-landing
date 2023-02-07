import './App.scss'
import gsap from "gsap";

// get other plugins:
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)


import {
    AssetManagerBasicPopupPlugin,
    AssetManagerPlugin,
    BloomPlugin, CameraViewPlugin,
    CanvasSnipperPlugin,
    DiamondPlugin,
    GammaCorrectionPlugin,
    GBufferPlugin, GroundPlugin, ITexture, ProgressivePlugin,
    SSAOPlugin,
    SSRPlugin,
    TonemapPlugin,
    ViewerApp,
} from "webgi";
import Header from "./components/header/Header";
import Section01 from "./components/sections/Section01";
import Section02 from "./components/sections/Section02";
import Section03 from "./components/sections/Section03";
import {useState} from "react";
import Loader from "./components/loader/Loader";
import Footer from "./components/sections/Footer";


function App() {
    const [isLoading, setIsLoading] = useState(true);

    async function setupViewer(){
        // const viewer = new ViewerApp({
        //     canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        //     useRgbm: true,
        //     useGBufferDepth: true, // Uses depth prepass for faster rendering, has z-fighting in some cases.
        //     isAntialiased: false, // Uses multi-sample render target. (only for extreme cases)
        // })

        const viewer = new ViewerApp({
            canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
            // useGBufferDepth: true, // Uses depth prepass for faster rendering, has z-fighting in some cases.
            // isAntialiased: true,
        })

        // Adding plugins
        const manager = await viewer.addPlugin(AssetManagerPlugin)
        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(DiamondPlugin)
        await viewer.addPlugin(CameraViewPlugin)
        // await viewer.addPlugin(FrameFadePlugin)
        // await viewer.addPlugin(GLTFAnimationPlugin)
        await viewer.addPlugin(BloomPlugin)
        await viewer.addPlugin(AssetManagerBasicPopupPlugin)
        await viewer.addPlugin(CanvasSnipperPlugin)
        await viewer.addPlugin(GroundPlugin);
        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new TonemapPlugin(true))


        viewer.renderer.refreshPipeline()

        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})

        // HDR map setup

        // await manager.addFromPath("./assets/ring11.glb")

        await manager.addFromPath("./assets/model/ring14.glb")
        viewer.scene.setEnvironment(
            await manager.importer.importSinglePath("./assets/hdr/warehouse.hdr")
        )
        setIsLoading(false)

        // const envMap = await manager.importer!.importSinglePath<ITexture>("https://demo-assets.pixotronics.com/pixo/hdr/p360-01.hdr")
        // viewer.scene.setEnvironment(envMap);


        const camViewPlugin = viewer.getPlugin(CameraViewPlugin)
        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

        viewer.renderer.refreshPipeline()

        console.log(camViewPlugin?.camViews);
        let view = camViewPlugin?.getCurrentCameraView(viewer.scene.activeCamera)
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

        let needsUpdate = true;
        onUpdate()

        function setupScrollAnimation() {
            const timeLine = gsap.timeline()
            timeLine
                .to(position, {
                        x: camViewPlugin?.camViews[0].position.x,
                        y: camViewPlugin?.camViews[0].position.y,
                        z: camViewPlugin?.camViews[0].position.z,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.section-02', start: 'top bottom', end: 'top 50%', scrub: 2
                        },
                        immediateRender: false

                    }
                )
                .to(target, {
                        x: camViewPlugin?.camViews[0].target.x,
                        y: camViewPlugin?.camViews[0].target.y,
                        z: camViewPlugin?.camViews[0].target.z,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.section-02', start: 'top bottom', end: 'top top', scrub: 2
                        },
                        immediateRender: false
                    }
                )
                .to(position, {
                        x: camViewPlugin?.camViews[1].position.x,
                        y: camViewPlugin?.camViews[1].position.y,
                        z: camViewPlugin?.camViews[1].position.z,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.section-03', start: 'top 80%', end: 'top top', scrub: 3
                        },
                        immediateRender: false

                    }
                )
                .to(target, {
                        x: camViewPlugin?.camViews[1].target.x,
                        y: camViewPlugin?.camViews[1].target.y,
                        z: camViewPlugin?.camViews[1].target.z,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.section-03', start: 'top bottom', end: 'top top', scrub: 3
                        },
                        immediateRender: false
                    }
                )
                .to(position, {
                        x: camViewPlugin?.camViews[2].position.x,
                        y: camViewPlugin?.camViews[2].position.y,
                        z: camViewPlugin?.camViews[2].position.z,
                        duration: 3,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.footer', start: 'top bottom', end: 'top top', scrub: 3
                        },
                        immediateRender: false
                    }
                )
                .to(target, {
                        x: camViewPlugin?.camViews[2].target.x,
                        y: camViewPlugin?.camViews[2].target.y,
                        z: camViewPlugin?.camViews[2].target.z,
                        duration: 3,
                        onUpdate,
                        scrollTrigger: {
                            trigger: '.footer', start: 'top bottom', end: 'top top', scrub: 3
                        },
                        immediateRender: false
                    }
                )
                .to("#section-01-content", { xPercent:'-150' , opacity:0,
                    scrollTrigger: {
                        trigger: ".section-02",
                        start:"top bottom",
                        end: "top 50%", scrub: 1,
                        immediateRender: false
                    }})

                .to("#section-03-content", { xPercent:'150' , opacity:0,
                    scrollTrigger: {
                        trigger: ".footer",
                        start:"top bottom",
                        end: "top 80%", scrub: 1,
                        immediateRender: false
                    }})
        }
        setupScrollAnimation()


        //WEBGI update
        function onUpdate() {
            needsUpdate = true
            // viewer.renderer.resetShadows()
            viewer.setDirty()
        }


        viewer.addEventListener('preFrame', () => {

            if(needsUpdate){
                camera.positionTargetUpdated(true)
                needsUpdate = false
            }
        })
    }
   setupViewer()
  return (
    <div className="App">
        {isLoading && <Loader />}
        <Header />
        <Section01 />
        <Section02 />
        <Section03 />
        <Footer />


    </div>
  )
}

export default App
