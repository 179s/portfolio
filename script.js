const cube = document.getElementById("cube");
const bgFilter = document.querySelector("#access .bg-filter");
const isMobile = window.innerWidth <= 768;

let angleX = 0;
let angleY = 0;

let velocityX = 0;
let velocityY = 0;

let friction = 0.9;

let isDragging = false;
let hasDragged = false;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("mousedown", (e) => {
  if (e.button === 2 && !cube.classList.contains("explose")) { // right click drag
    isDragging = true;
    hasDragged = false;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    cube.style.cursor = "grabbing";
  }
});

document.addEventListener("mouseup", () => {
  if (!cube.classList.contains("explose")) { // right click drag
    isDragging = false;
    hasDragged = false;
    cube.style.cursor = "grab";
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && !cube.classList.contains("explose")) {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;

    if (!hasDragged && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      hasDragged = true;
      bgFilter.classList.add("hide");
    }

    velocityX -= dx * 0.02;
    velocityY += dy * 0.02;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

// touch screen
let isTouchDragging = false;
let hasTouchDragged = false;
let lastTouchX = null;
let lastTouchY = null;

// ---------- TOUCH EVENTS (mobile) ----------
document.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    isTouchDragging = true;
    hasTouchDragged = false;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
});

document.addEventListener("touchmove", (e) => {
  if (
    isTouchDragging &&
    e.touches.length === 1 &&
    lastTouchX !== null &&
    lastTouchY !== null
  ) {
    const touch = e.touches[0];
    const dx = touch.clientX - lastTouchX;
    const dy = touch.clientY - lastTouchY;

    if (!hasTouchDragged && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      hasTouchDragged = true;
      bgFilter.classList.add("hide");
    }

    velocityX -= dx * 0.04;
    velocityY += dy * 0.04;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
  }
});

document.addEventListener("touchend", () => {
  isTouchDragging = false;
  hasTouchDragged = false;
  lastTouchX = null;
  lastTouchY = null;
});

// ---------- ANIMATION  ----------
let parallaxX = 0;
let parallaxY = 0;
const fixedRotationX = -5;

// Track mouse X for parallax (disabled for mobile)
if (!isMobile) {
  document.addEventListener("mousemove", (e) => {
    if (cube.classList.contains("explose")) {
      const middle = window.innerWidth / 2;
      const percent = (e.clientX - middle) / middle;
      parallaxX = percent * 5;
    }
  });
} else {
  parallaxX = 0;
}

// Track scroll Y for parallax (always on even on mobile)
cube.addEventListener("scroll", () => {
  const scrollMax = cube.scrollHeight - cube.clientHeight;
  const scrollPercent = cube.scrollTop / scrollMax;
  parallaxY = scrollPercent * 10;
});

function animate() {
  if (cube.classList.contains("explose")) {
    cube.style.transform = 
      `rotateX(${fixedRotationX + parallaxY}deg) rotateY(${parallaxX}deg)`;
  } else {
    velocityX *= friction;
    velocityY *= friction;

    angleX += velocityX;
    angleY += velocityY;

    angleY = Math.max(-90, Math.min(90, angleY));

    cube.style.transform = `rotateX(${angleY}deg) rotateY(${angleX}deg)`;
  }

  requestAnimationFrame(animate);
}

animate();

// explosion animation

function explose() {
    cube.classList.toggle("explose");
    document.querySelectorAll("#cube>div").forEach(face => {
        face.classList.toggle("explose");
    });

    const btnText = document.getElementById("explose");

    cube.style.cursor = cube.style.cursor == "auto" ? "grab" : "auto";

    btnText.innerHTML = btnText.innerHTML == "Dynamic Spin" ? "Calm Flow" : "Dynamic Spin";
}

