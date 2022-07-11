import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async() => { 
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: '../../targets/hero1.mind',
        });

        const {renderer, scene, camera} = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const ironMan = await loadGLTF('../../models/hero/iron-man/scene.gltf');
        ironMan.scene.scale.set(0.1, 0.1, 0.1);
        ironMan.scene.position.set(0, -0.4, 0);
        ironMan.scene.userData.clickable = true;

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(ironMan.scene);

        const mixer = new THREE.AnimationMixer(ironMan.scene);
        const action = mixer.clipAction(ironMan.animations[0]);
       
        document.addEventListener('click', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2  -1;
            const mouseY = -1 * (e.clientY / window.innerHeight) * 2 -1;
            const mouse = new THREE.Vector2(mouseX,mouseY);
      
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
      
            if(intersects.light > 0) {
              let o = intersects[0].object;
              while(o.parent && !o.userData.clickable){
                o = o.parent;
              }
              if(o.userData.clickable){
                if(o === ironMan.scene){
                    action.play();
                }
              }
            }    
          });

        const clock = new THREE.Clock();
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          const delta = clock.getDelta();
          mixer.update(delta);
          renderer.render(scene,camera);
        });
    } 
     start();
});



