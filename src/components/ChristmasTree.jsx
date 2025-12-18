import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ChristmasTree() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || sceneRef.current) return;
    sceneRef.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 15, 35);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x8899bb, 0.5);
    moonLight.position.set(10, 20, 10);
    moonLight.castShadow = true;
    scene.add(moonLight);

    const warmLight = new THREE.PointLight(0xffaa44, 1, 20);
    warmLight.position.set(0, 2, 5);
    scene.add(warmLight);

    // Warm glow at the base of the tree
    const baseGlow = new THREE.PointLight(0xffcc66, 2, 12);
    baseGlow.position.set(0, 0.5, 0);
    scene.add(baseGlow);

    // Additional warm lights around the base
    const baseGlow2 = new THREE.PointLight(0xffaa44, 1.5, 8);
    baseGlow2.position.set(2, 0.3, 2);
    scene.add(baseGlow2);

    const baseGlow3 = new THREE.PointLight(0xffaa44, 1.5, 8);
    baseGlow3.position.set(-2, 0.3, 2);
    scene.add(baseGlow3);

    // Tree group
    const treeGroup = new THREE.Group();

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 12);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.9,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    // Tree layers (cones)
    const treeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a5c32,
      roughness: 0.8,
      flatShading: true,
    });

    const layers = [
      { radius: 2.5, height: 2.5, y: 2.5 },
      { radius: 2, height: 2.5, y: 4.2 },
      { radius: 1.5, height: 2.5, y: 5.8 },
      { radius: 1, height: 2, y: 7.2 },
    ];

    layers.forEach((layer) => {
      const coneGeometry = new THREE.ConeGeometry(
        layer.radius,
        layer.height,
        16
      );
      const cone = new THREE.Mesh(coneGeometry, treeMaterial);
      cone.position.y = layer.y;
      cone.castShadow = true;
      cone.receiveShadow = true;
      treeGroup.add(cone);
    });

    // Star on top
    const starShape = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(0, 8.5, 0);
    star.rotation.y = Math.PI / 2;
    treeGroup.add(star);

    // Star glow light
    const starLight = new THREE.PointLight(0xffd700, 1.5, 8);
    starLight.position.set(0, 8.5, 0);
    treeGroup.add(starLight);

    // Ornaments
    const ornamentColors = [
      0xff0044, 0x0066ff, 0xffd700, 0xff6600, 0x00ff88, 0xff00ff,
    ];
    const ornaments = [];

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const layerIndex = Math.floor(Math.random() * 4);
      const layer = layers[layerIndex];
      const heightOffset = (Math.random() - 0.5) * layer.height * 0.6;
      const radiusAtHeight =
        layer.radius *
        (1 - (heightOffset + layer.height / 2) / layer.height) *
        0.85;

      const ornamentGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const ornamentMaterial = new THREE.MeshStandardMaterial({
        color:
          ornamentColors[Math.floor(Math.random() * ornamentColors.length)],
        metalness: 0.9,
        roughness: 0.1,
        emissive:
          ornamentColors[Math.floor(Math.random() * ornamentColors.length)],
        emissiveIntensity: 0.3,
      });
      const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
      ornament.position.set(
        Math.cos(angle) * radiusAtHeight,
        layer.y + heightOffset,
        Math.sin(angle) * radiusAtHeight
      );
      ornament.castShadow = true;
      ornaments.push({ mesh: ornament, phase: Math.random() * Math.PI * 2 });
      treeGroup.add(ornament);
    }

    // Christmas lights (small glowing spheres)
    const lights = [];
    const lightColors = [
      0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
    ];

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 12;
      const y = 1.5 + (i / 60) * 6.5;
      const radiusAtY = 2.5 * (1 - (y - 1.5) / 7) * 1.1;

      const lightGeometry = new THREE.SphereGeometry(0.06, 8, 8);
      const color = lightColors[i % lightColors.length];
      const lightMaterial = new THREE.MeshBasicMaterial({
        color: color,
      });
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.set(
        Math.cos(angle) * radiusAtY,
        y,
        Math.sin(angle) * radiusAtY
      );

      const pointLight = new THREE.PointLight(color, 0.3, 2);
      pointLight.position.copy(lightMesh.position);
      treeGroup.add(pointLight);

      lights.push({
        mesh: lightMesh,
        light: pointLight,
        phase: i * 0.2,
        color,
      });
      treeGroup.add(lightMesh);
    }

    scene.add(treeGroup);

    // Ground
    const groundGeometry = new THREE.CircleGeometry(15, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Snowflakes
    const snowflakes = [];
    const snowGeometry = new THREE.SphereGeometry(0.04, 6, 6);
    const snowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 500; i++) {
      const snowflake = new THREE.Mesh(snowGeometry, snowMaterial);
      snowflake.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 20,
        (Math.random() - 0.5) * 30
      );
      snowflakes.push({
        mesh: snowflake,
        speed: 0.02 + Math.random() * 0.03,
        wobble: Math.random() * Math.PI * 2,
      });
      scene.add(snowflake);
    }

    // Presents under tree
    const presentColors = [
      { box: 0xff0044, ribbon: 0xffd700 },
      { box: 0x0066ff, ribbon: 0xffffff },
      { box: 0x00aa44, ribbon: 0xff0044 },
      { box: 0x9900ff, ribbon: 0x00ffff },
    ];

    const presents = [
      { x: 2, z: 1.5, scale: 0.6, rotation: 0.3 },
      { x: -1.8, z: 2, scale: 0.5, rotation: -0.4 },
      { x: 0.5, z: 2.5, scale: 0.7, rotation: 0.1 },
      { x: -2.5, z: 0.8, scale: 0.55, rotation: 0.6 },
    ];

    presents.forEach((p, i) => {
      const colors = presentColors[i % presentColors.length];
      const presentGroup = new THREE.Group();

      const boxGeometry = new THREE.BoxGeometry(1, 0.8, 1);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: colors.box,
        roughness: 0.3,
        metalness: 0.1,
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.castShadow = true;
      presentGroup.add(box);

      const ribbonMaterial = new THREE.MeshStandardMaterial({
        color: colors.ribbon,
        roughness: 0.4,
        metalness: 0.3,
      });

      const ribbon1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.82, 1.02),
        ribbonMaterial
      );
      const ribbon2 = new THREE.Mesh(
        new THREE.BoxGeometry(1.02, 0.82, 0.1),
        ribbonMaterial
      );
      presentGroup.add(ribbon1);
      presentGroup.add(ribbon2);

      // Bow
      const bowGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
      const bow1 = new THREE.Mesh(bowGeometry, ribbonMaterial);
      bow1.position.set(-0.12, 0.4, 0);
      bow1.rotation.y = Math.PI / 2;
      const bow2 = new THREE.Mesh(bowGeometry, ribbonMaterial);
      bow2.position.set(0.12, 0.4, 0);
      bow2.rotation.y = Math.PI / 2;
      presentGroup.add(bow1);
      presentGroup.add(bow2);

      presentGroup.scale.setScalar(p.scale);
      presentGroup.position.set(p.x, p.scale * 0.4, p.z);
      presentGroup.rotation.y = p.rotation;
      scene.add(presentGroup);
    });

    // Animation
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      // Rotate tree slowly
      treeGroup.rotation.y += 0.003;

      // Camera movement based on mouse
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (5 - mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 3, 0);

      // Animate ornaments (subtle pulsing)
      ornaments.forEach((o) => {
        const scale = 1 + Math.sin(time * 2 + o.phase) * 0.1;
        o.mesh.scale.setScalar(scale);
      });

      // Animate lights (twinkling)
      lights.forEach((l) => {
        const intensity = 0.3 + Math.sin(time * 4 + l.phase) * 0.2;
        l.light.intensity = intensity;
        const brightness = 0.5 + Math.sin(time * 4 + l.phase) * 0.5;
        l.mesh.material.opacity = brightness;
      });

      // Star pulsing
      star.material.emissiveIntensity = 0.6 + Math.sin(time * 3) * 0.4;
      starLight.intensity = 1 + Math.sin(time * 3) * 0.5;

      // Animate snowflakes
      snowflakes.forEach((s) => {
        s.mesh.position.y -= s.speed;
        s.mesh.position.x += Math.sin(time + s.wobble) * 0.01;
        if (s.mesh.position.y < 0) {
          s.mesh.position.y = 20;
          s.mesh.position.x = (Math.random() - 0.5) * 30;
          s.mesh.position.z = (Math.random() - 0.5) * 30;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sceneRef.current = false;
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <div ref={containerRef} className="w-full h-full" />

      {/* Overlay text */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <h1
          className="text-5xl font-bold tracking-wider"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#ffd700",
            textShadow:
              "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)",
            letterSpacing: "0.15em",
          }}
        >
          Joyeux Noël
        </h1>
        <p
          className="mt-2 text-lg tracking-widest opacity-70"
          style={{
            fontFamily: "'Georgia', serif",
            color: "#aaccff",
            letterSpacing: "0.3em",
          }}
        >
          ✦ Bougez la souris pour explorer ✦
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />
    </div>
  );
}
