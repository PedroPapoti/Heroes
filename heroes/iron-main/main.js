
import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async(() => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: '../../targets/hero1.mind',
        });

        const {renderer, scene, camera} = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const ironMan = await loadGLTF('../../models/hero/iron-man/scene.gltf');
        ironMan.scene.scale.set(0.2, 0.2, 0.2);
        ironMan.scene.position.set(0, -0.4, 0);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(ironMan.scene);

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene,camera);
        });
    });
    start();
});




