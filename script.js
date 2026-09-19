/* =========================================================
   POP//LAB
   GSAP + ScrollTrigger + Three.js
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   LOADER
========================================================= */

const loader = document.querySelector(".loader");
const loaderNumber = document.querySelector("#loaderNumber");
const loaderBar = document.querySelector(".loader-bar span");

let loadProgress = 0;

const loadingInterval = setInterval(() => {

  loadProgress += Math.floor(Math.random() * 8) + 3;

  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadingInterval);

    loaderNumber.textContent = "100";
    loaderBar.style.width = "100%";

    gsap.to(loader, {
      yPercent: -100,
      duration: 1,
      delay: 0.25,
      ease: "power4.inOut"
    });
  }

  loaderNumber.textContent = loadProgress;
  loaderBar.style.width = `${loadProgress}%`;

}, 45);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let followerX = mouseX;
let followerY = mouseY;

window.addEventListener("mousemove", (event) => {

  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.08,
      overwrite: true
    });
  }

});


gsap.ticker.add(() => {

  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  if (follower) {
    gsap.set(follower, {
      x: followerX,
      y: followerY
    });
  }

});


document
  .querySelectorAll("a, button, .magnetic")
  .forEach(element => {

    element.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-active");
    });

    element.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active");
    });

  });



/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

if (window.innerWidth > 900) {

  document
    .querySelectorAll(".magnetic")
    .forEach(button => {

      button.addEventListener("mousemove", event => {

        const rect = button.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        gsap.to(button, {
          x: x * 0.18,
          y: y * 0.18,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true
        });

      });


      button.addEventListener("mouseleave", () => {

        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)"
        });

      });

    });

}



/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

let menuOpen = false;

const menuTimeline = gsap.timeline({
  paused: true
});

menuTimeline
  .to(mobileMenu, {
    yPercent: 0,
    duration: 0.8,
    ease: "power4.inOut"
  })
  .from(".mobile-menu-links a", {
    y: 80,
    opacity: 0,
    stagger: 0.08,
    duration: 0.7,
    ease: "power4.out"
  }, "-=0.4");


if (menuButton) {

  menuButton.addEventListener("click", () => {

    menuOpen = !menuOpen;

    if (menuOpen) {

      menuTimeline.play();

      gsap.to(menuButton.querySelectorAll("span")[0], {
        y: 4,
        rotate: 45,
        duration: 0.3
      });

      gsap.to(menuButton.querySelectorAll("span")[1], {
        y: -4,
        rotate: -45,
        duration: 0.3
      });

    } else {

      menuTimeline.reverse();

      gsap.to(menuButton.querySelectorAll("span"), {
        y: 0,
        rotate: 0,
        duration: 0.3
      });

    }

  });

}


document
  .querySelectorAll(".mobile-menu-links a")
  .forEach(link => {

    link.addEventListener("click", () => {

      menuOpen = false;

      menuTimeline.reverse();

      if (menuButton) {
        gsap.to(menuButton.querySelectorAll("span"), {
          y: 0,
          rotate: 0,
          duration: 0.3
        });
      }

    });

  });



/* =========================================================
   THREE.JS SETUP
========================================================= */

const canvas = document.querySelector("#scene");

let scene;
let camera;
let renderer;
let canGroup;
let bubbles = [];
let threeAnimationStarted = false;


if (canvas && typeof THREE !== "undefined") {

  scene = new THREE.Scene();


  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 7);


  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });


  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );


  renderer.outputEncoding = THREE.sRGBEncoding;



  /* =======================================================
     LIGHTS
  ======================================================= */

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      2
    );

  scene.add(ambientLight);


  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      4
    );

  keyLight.position.set(4, 5, 6);

  scene.add(keyLight);


  const rimLight =
    new THREE.PointLight(
      0x7357ff,
      12,
      20
    );

  rimLight.position.set(-4, 1, 3);

  scene.add(rimLight);



  /* =======================================================
     CAN GROUP
  ======================================================= */

  canGroup = new THREE.Group();

  scene.add(canGroup);



  /* =======================================================
     CAN BODY
  ======================================================= */

  const canGeometry =
    new THREE.CylinderGeometry(
      1.15,
      1.15,
      3.5,
      64
    );


  const canMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xff5722,
      roughness: 0.22,
      metalness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.12
    });


  const can =
    new THREE.Mesh(
      canGeometry,
      canMaterial
    );

  canGroup.add(can);



  /* =======================================================
     TOP + BOTTOM
  ======================================================= */

  const topGeometry =
    new THREE.CylinderGeometry(
      1.13,
      1.13,
      0.08,
      64
    );


  const topMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xd9d4c8,
      metalness: 0.9,
      roughness: 0.22
    });


  const top =
    new THREE.Mesh(
      topGeometry,
      topMaterial
    );

  top.position.y = 1.78;

  canGroup.add(top);


  const bottom =
    new THREE.Mesh(
      topGeometry,
      topMaterial
    );

  bottom.position.y = -1.78;

  canGroup.add(bottom);



  /* =======================================================
     CAN RINGS
  ======================================================= */

  const ringGeometry =
    new THREE.TorusGeometry(
      1.155,
      0.025,
      8,
      64
    );


  const ringMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.25
    });


  const ringTop =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

  ringTop.rotation.x =
    Math.PI / 2;

  ringTop.position.y = 1.2;

  canGroup.add(ringTop);


  const ringBottom =
    ringTop.clone();

  ringBottom.position.y = -1.2;

  canGroup.add(ringBottom);



  /* =======================================================
     POP LOGO
  ======================================================= */

  const symbolGroup =
    new THREE.Group();

  canGroup.add(symbolGroup);


  const symbolMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xf5f0e7
    });


  const symbol1 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.09,
        1.1,
        0.08
      ),
      symbolMaterial
    );

  symbol1.rotation.z = -0.35;

  symbolGroup.add(symbol1);


  const symbol2 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.09,
        1.1,
        0.08
      ),
      symbolMaterial
    );

  symbol2.rotation.z = 0.35;

  symbolGroup.add(symbol2);


  symbolGroup.position.z = 1.12;



  /* =======================================================
     BUBBLES
  ======================================================= */

  const bubbleGeometry =
    new THREE.SphereGeometry(
      0.08,
      16,
      16
    );


  const bubbleMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      roughness: 0.05
    });


  bubbles = [];


  for (let i = 0; i < 22; i++) {

    const bubble =
      new THREE.Mesh(
        bubbleGeometry,
        bubbleMaterial
      );


    bubble.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3
    );


    const scale =
      0.3 + Math.random() * 0.8;

    bubble.scale.setScalar(scale);

    scene.add(bubble);


    bubbles.push({
      mesh: bubble,
      speed: 0.2 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      baseY: bubble.position.y
    });

  }



  /* =======================================================
     POINTER
  ======================================================= */

  let pointerX = 0;
  let pointerY = 0;


  window.addEventListener(
    "pointermove",
    event => {

      pointerX =
        event.clientX /
        window.innerWidth - 0.5;

      pointerY =
        event.clientY /
        window.innerHeight - 0.5;

    },
    { passive: true }
  );



  /* =======================================================
     THREE ANIMATION
  ======================================================= */

  const clock =
    new THREE.Clock();


  function animateThree() {

    requestAnimationFrame(
      animateThree
    );


    const time =
      clock.getElapsedTime();


    if (canGroup) {

      canGroup.rotation.y =
        time * 0.25 +
        pointerX * 0.3;

      canGroup.rotation.x =
        pointerY * 0.18;

      canGroup.position.y =
        Math.sin(time * 1.2) * 0.12;

    }


    bubbles.forEach(
      bubble => {

        const object =
          bubble.mesh;

        object.position.y =
          bubble.baseY +
          Math.sin(
            time * bubble.speed +
            bubble.offset
          ) * 0.15;

        object.rotation.x += 0.002;
        object.rotation.y += 0.003;

      }
    );


    if (camera) {

      camera.position.x +=
        (
          pointerX * 0.35 -
          camera.position.x
        ) * 0.03;


      camera.position.y +=
        (
          -pointerY * 0.25 -
          camera.position.y
        ) * 0.03;


      camera.lookAt(
        0,
        0,
        0
      );

    }


    renderer.render(
      scene,
      camera
    );

  }


  animateThree();

  threeAnimationStarted = true;

}



/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (!camera || !renderer) return;


    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );


    ScrollTrigger.refresh();

  },
  { passive: true }
);



/* =========================================================
   HERO SCROLL
========================================================= */

if (
  typeof ScrollTrigger !== "undefined" &&
  canGroup &&
  camera
) {

  gsap.timeline({

    scrollTrigger: {

      trigger: ".hero",

      start: "top top",

      end: "bottom top",

      scrub: 1.5

    }

  })

  .to(
    canGroup.rotation,
    {
      y: Math.PI * 2.2,
      x: 0.7,
      duration: 1
    },
    0
  )

  .to(
    canGroup.position,
    {
      x: 2.2,
      y: -0.5,
      duration: 1
    },
    0
  )

  .to(
    camera.position,
    {
      z: 5,
      duration: 1
    },
    0
  )

  .to(
    ".hero-copy",
    {
      x: -100,
      opacity: 0,
      duration: 0.7
    },
    0
  )

  .to(
    ".hero-background-text",
    {
      xPercent: -15,
      duration: 1
    },
    0
  );

}



/* =========================================================
   MANIFESTO
========================================================= */

gsap.from(".manifesto h2", {

  y: 120,

  opacity: 0,

  duration: 1.2,

  ease: "power4.out",

  scrollTrigger: {

    trigger: ".manifesto",

    start: "top 70%"

  }

});


gsap.from(".manifesto-bottom", {

  y: 60,

  opacity: 0,

  duration: 1,

  delay: 0.15,

  scrollTrigger: {

    trigger: ".manifesto",

    start: "top 65%"

  }

});


gsap.to(".stamp", {

  rotation: 360,

  ease: "none",

  scrollTrigger: {

    trigger: ".manifesto",

    start: "top bottom",

    end: "bottom top",

    scrub: 2

  }

});



/* =========================================================
   FLAVOUR HORIZONTAL SCROLL
========================================================= */

const flavourTrack =
  document.querySelector(
    ".flavour-track"
  );


if (
  flavourTrack &&
  window.innerWidth > 700
) {

  const getScrollAmount = () => {

    return -(
      flavourTrack.scrollWidth -
      window.innerWidth +
      100
    );

  };


  gsap.to(
    flavourTrack,
    {

      x: getScrollAmount,

      ease: "none",

      scrollTrigger: {

        trigger: ".flavours",

        start: "top top",

        end: () =>
          "+=" +
          flavourTrack.scrollWidth,

        pin: true,

        scrub: 1,

        invalidateOnRefresh: true

      }

    }
  );

}



/* =========================================================
   FLAVOUR CARD 3D TILT
========================================================= */

document
  .querySelectorAll(".flavour-card")
  .forEach(card => {

    card.addEventListener(
      "mousemove",
      event => {

        const rect =
          card.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;


        gsap.to(card, {

          rotationY: x * 7,

          rotationX: -y * 7,

          transformPerspective: 1000,

          duration: 0.5,

          ease: "power3.out",

          overwrite: true

        });

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        gsap.to(card, {

          rotationY: 0,

          rotationX: 0,

          duration: 0.8,

          ease: "elastic.out(1, 0.5)"

        });

      }
    );

  });



/* =========================================================
   MARQUEE
========================================================= */

gsap.to(
  ".marquee div",
  {

    xPercent: -30,

    ease: "none",

    scrollTrigger: {

      trigger: ".type-break",

      start: "top bottom",

      end: "bottom top",

      scrub: 1

    }

  }
);



/* =========================================================
   LAB
========================================================= */

gsap.from(
  ".lab-item",
  {

    y: 100,

    opacity: 0,

    stagger: 0.15,

    duration: 1,

    ease: "power4.out",

    scrollTrigger: {

      trigger: ".lab-grid",

      start: "top 75%"

    }

  }
);



/* =========================================================
   QUOTE
========================================================= */

gsap.to(
  ".quote-orb",
  {

    scale: 1.5,

    rotation: 180,

    ease: "none",

    scrollTrigger: {

      trigger: ".quote-section",

      start: "top bottom",

      end: "bottom top",

      scrub: 1.5

    }

  }
);


gsap.from(
  ".quote-text",
  {

    scale: 0.7,

    opacity: 0,

    duration: 1,

    scrollTrigger: {

      trigger: ".quote-section",

      start: "top 65%"

    }

  }
);



/* =========================================================
   SHOP
========================================================= */

gsap.from(
  ".shop-card",
  {

    y: 100,

    opacity: 0,

    stagger: 0.15,

    duration: 1,

    ease: "power4.out",

    scrollTrigger: {

      trigger: ".shop-grid",

      start: "top 75%"

    }

  }
);



/* =========================================================
   FINAL
========================================================= */

gsap.to(
  ".final-bg",
  {

    rotation: 15,

    scale: 1.15,

    scrollTrigger: {

      trigger: ".final",

      start: "top bottom",

      end: "bottom top",

      scrub: 1

    }

  }
);


gsap.from(
  ".final-content",
  {

    y: 100,

    opacity: 0,

    duration: 1.2,

    scrollTrigger: {

      trigger: ".final",

      start: "top 70%"

    }

  }
);



/* =========================================================
   SHOP BUTTONS
========================================================= */

document
  .querySelectorAll(".add-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const original =
          button.innerHTML;


        button.innerHTML =
          "ADDED TO LAB ✓";


        button.style.background =
          "#101010";

        button.style.color =
          "#f5f0e7";


        setTimeout(
          () => {

            button.innerHTML =
              original;

            button.style.background =
              "";

            button.style.color =
              "";

          },
          1800
        );

      }
    );

  });



/* =========================================================
   NATIVE SMOOTH ANCHOR SCROLL
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            href
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });



/* =========================================================
   REDUCED MOTION
========================================================= */

if (
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {

  gsap.globalTimeline.timeScale(4);

    }
