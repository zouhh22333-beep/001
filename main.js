import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { GLTFLoader } from "https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";

let lenis;
console.log("Lenis 导入结果:", Lenis);
console.log("gsap:", gsap);
console.log("ScrollTrigger:", ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

console.log("注册后 ScrollTrigger:", ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    lenis = new Lenis({
    duration: 1.2, // 滚动时间（越大越丝滑）
    easing: (t) => 1 - Math.pow(1 - t, 4), // ⭐关键：缓动曲线
    smooth: true,
    smoothTouch: false
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const footerContainer = document.querySelector(".footer-container");

    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const container = document.getElementById("footer-canvas");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 0.75);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const directionallight = new THREE.DirectionalLight(0xffffff,5);
    directionallight.position.set(1, 1, 0);
    scene.add(directionallight);

    const loader = new GLTFLoader();
    let model;
    let modelBaseRotationX = 0.5;
    let modelBaseZ = -1;

    loader.load("./models/just_a_girl.glb", (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        model.position.y = -2;
        model.position.z = -2;
        model.rotation.x = 5;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.setScalar(scale);

        scene.add(model);

    });

    ScrollTrigger.create({
        trigger: "footer", 
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const yValue = -35 * (1 - progress);
            gsap.set(footerContainer, { y: `${yValue}%` });

            modelBaseZ = -1 * (1 - progress);
            modelBaseRotationX = 0.5 * (1 - progress);
        },
    });

    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            const targetRotationY = mouse.x * 0.3;
            const targetRotationX = -mouse.y * 0.2 + modelBaseRotationX;

            model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
            model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
            model.position.z += (modelBaseZ - model.position.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    //  hover 滑动效果
    //  点击平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        lenis.scrollTo(target, {
            duration: 1.5,
            easing: (t) => 1 - Math.pow(1 - t, 4)
        });
    });

    });
    const navItems = document.querySelectorAll(".nav");
    const hoverBg = document.querySelector(".hover-bg");

    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const rect = item.getBoundingClientRect();
            const parentRect = item.parentElement.getBoundingClientRect();

            const left = rect.left - parentRect.left;
            const width = rect.width;

            hoverBg.style.left = left + "px";
            hoverBg.style.width = width + "px";
        });
    });

});