// Logos that orbit the profile picture. `ring` picks the inner (0) or outer (1) orbit.
const logos = [
    { name: "HTML5", icon: "html5", color: "#E34F26", ring: 0 },
    { name: "CSS3", icon: "css3", color: "#1572B6", ring: 0 },
    { name: "JavaScript", icon: "javascript", color: "#F7DF1E", ring: 0 },
    { name: "React", icon: "react", color: "#61DAFB", ring: 0 },
    { name: "Node.js", icon: "nodedotjs", color: "#5FA04E", ring: 1 },
    { name: "Git", icon: "git", color: "#F05032", ring: 1 },
    { name: "GitHub", icon: "github", color: "#FFFFFF", ring: 1 },
    { name: "Figma", icon: "figma", color: "#F24E1E", ring: 1 },
];

// Radius as a fraction of the orbit container, and speed in radians per second.
// The outer ring turns the other way so the two rings move against each other.
const rings = [
    { radius: 0.33, speed: 0.35 },
    { radius: 0.48, speed: -0.22 },
];

const orbit = document.getElementById("orbit");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const items = logos.map((logo) => {
    const el = document.createElement("div");
    el.className = "logo";
    el.title = logo.name;
    el.setAttribute("aria-label", logo.name);
    el.style.setProperty("--color", logo.color);
    el.style.setProperty("--icon", `url("images/icons/${logo.icon}.svg")`);
    el.appendChild(document.createElement("span"));
    orbit.appendChild(el);
    return { el, ring: logo.ring };
});

// Spread the logos evenly around their ring.
rings.forEach((ring, r) => {
    const onRing = items.filter((item) => item.ring === r);
    onRing.forEach((item, i) => {
        item.offset = (i / onRing.length) * Math.PI * 2 + r * (Math.PI / onRing.length);
    });
});

let angle = 0;
let paused = false;
let last = performance.now();

orbit.addEventListener("mouseenter", () => (paused = true));
orbit.addEventListener("mouseleave", () => (paused = false));

function place() {
    const size = orbit.clientWidth;
    items.forEach((item) => {
        const ring = rings[item.ring];
        const a = item.offset + angle * ring.speed;
        const x = Math.cos(a) * ring.radius * size;
        const y = Math.sin(a) * ring.radius * size;
        item.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
}

function tick(now) {
    if (!paused) angle += (now - last) / 1000;
    last = now;
    place();
    requestAnimationFrame(tick);
}

place();
window.addEventListener("resize", place);
if (!reduceMotion) requestAnimationFrame(tick);
