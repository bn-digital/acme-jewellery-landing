import './App.scss'
import gsap from "gsap";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import {
    AssetManagerPlugin,
    BloomPlugin,
    CameraViewPlugin,
    CanvasSnipperPlugin,
    Color,
    DiamondPlugin,
    GammaCorrectionPlugin,
    GBufferPlugin,
    ITexture,
    MeshBasicMaterial2,
    ProgressivePlugin,
    SSAOPlugin,
    SSRPlugin,
    TonemapPlugin,
    ViewerApp,
} from "webgi";
import Header from "./components/header/Header";
import Section01 from "./components/sections/Section01";
import Section02 from "./components/sections/Section02";
import Section03 from "./components/sections/Section03";
import {useEffect, useRef, useState} from "react";
import Loader from "./components/loader/Loader";
import Footer from "./components/sections/Footer";
import Section04 from "./components/sections/Section04";
import Customizer from "./components/customizer/Customizer";

gsap.registerPlugin(ScrollTrigger)


function App() {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    console.log(canvasRef.current);

    async function setupViewer() {
        const viewer = new ViewerApp({
            canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
            useGBufferDepth: true
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
        await viewer.addPlugin(BloomPlugin)
        await viewer.addPlugin(CanvasSnipperPlugin)
        await viewer.addPlugin(new TonemapPlugin(true))


        viewer.renderer.refreshPipeline()
        await manager.addFromPath("./assets/model/ring14.glb")
        viewer.scene.visible = false
        await viewer.scene.setEnvironment(
            await manager.importer!.importSinglePath<ITexture<any>>("./assets/hdr/warehouse.hdr"),
        )
        viewer.scene.visible = true
        setIsLoading(false)

        const camViewPlugin = viewer.getPlugin(CameraViewPlugin)
        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target
        const goldMaterial = manager.materials!.findMaterialsByName('gold2')[0] as MeshBasicMaterial2

        viewer.renderer.refreshPipeline()
        const objPosition = viewer.scene.activeCamera.cameraObject.position
        camera.setCameraOptions({controlsEnabled: false})

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
                            trigger: '.section-04', start: 'top bottom', end: 'top 50%', scrub: 3
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
                            trigger: '.section-04', start: 'top bottom', end: 'top top', scrub: 3
                        },
                        immediateRender: false
                    }
                )
                .to("#section-01-content", {
                    xPercent: '-150', opacity: 0,
                    scrollTrigger: {
                        trigger: ".section-02",
                        start: "top bottom",
                        end: "top 50%", scrub: 1,
                        immediateRender: false
                    }
                })

                .to("#section-03-content", {
                    xPercent: '150', opacity: 0,
                    scrollTrigger: {
                        trigger: ".footer",
                        start: "top bottom",
                        end: "top 80%", scrub: 1,
                        immediateRender: false
                    }
                })
        }

        setupScrollAnimation()

        //WEBGI update
        function onUpdate() {
            needsUpdate = true
            viewer.renderer.updateDirty()
        }

        viewer.addEventListener('preFrame', () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true)
                needsUpdate = false
            }
        })

        // CUSTOMIZE
        const section04 = document.querySelector('.section-04') as HTMLElement
        const exitButton = document.querySelector('#exit') as HTMLElement
        const footer = document.querySelector('.footer') as HTMLElement
        const customizerInterface = document.querySelector('.customizer') as HTMLElement
        const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement
        document.querySelector('#customizeBtn')?.addEventListener('click', () => {
            section04.style.visibility = "hidden"
            footer.style.visibility = "hidden"
            mainContainer.style.pointerEvents = "all"
            document.body.style.cursor = "grab"

            gsap.to(position, {x: 5, y: 5, z: 4, duration: 2, ease: "power3.inOut", onUpdate})
            gsap.to(target, {
                x: 0,
                y: 0.3,
                z: -0.3,
                duration: 2,
                ease: "power3.inOut",
                onUpdate,
                onComplete: enableControlers
            })
            camera.autoLookAtTarget = true
        })

        function enableControlers() {
            camera.setCameraOptions({controlsEnabled: true})
            exitButton.style.visibility = "visible"
            customizerInterface.style.visibility = "visible"
        }

        function changeGoldColor(colorToBeChanged: Color) {
            goldMaterial.color = colorToBeChanged;
            viewer.scene.setDirty()
        }

        document.querySelector('#white')?.addEventListener('click', () => {
            changeGoldColor(new Color(0xc9c9c9).convertSRGBToLinear())
        })

        document.querySelector('#yellow')?.addEventListener('click', () => {
            changeGoldColor(new Color(0xfeac53).convertSRGBToLinear())
        })

        document.querySelector('#red')?.addEventListener('click', () => {
            changeGoldColor(new Color(0xfeafaf).convertSRGBToLinear())
        })

        // EXIT CUSTOMIZER
        exitButton.addEventListener('click', () => {
            gsap.to(position, {
                    x: camViewPlugin?.camViews[2].position.x,
                    y: camViewPlugin?.camViews[2].position.y,
                    z: camViewPlugin?.camViews[2].position.z,
                    duration: 1,
                    ease: "power3.inOut",
                    onUpdate
                }
            )
            gsap.to(target, {
                    x: camViewPlugin?.camViews[2].target.x,
                    y: camViewPlugin?.camViews[2].target.y,
                    z: camViewPlugin?.camViews[2].target.z,
                    duration: 1,
                    ease: "power3.inOut",
                    onUpdate
                }
            )
            section04.style.visibility = "visible"
            footer.style.visibility = "visible"
            mainContainer.style.pointerEvents = "none"
            document.body.style.cursor = "default"
            exitButton.style.visibility = "hidden"
            customizerInterface.style.visibility = "hidden"
        })

    }

    setupViewer().then()

    return (
        <div className="App">
            {isLoading && <Loader/>}
            <Header/>
            <Section01/>
            <Section02/>
            <Section03/>
            <Section04/>
            <Footer/>
            <Customizer/>
        </div>

    )
}

export default App
