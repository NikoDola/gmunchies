const pupil = document.getElementById("pupil");
const svg = document.getElementById("lineLayer");

svg.setAttribute("width", window.innerWidth);
svg.setAttribute("height", window.innerHeight);

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

path.setAttribute("stroke", "white");
path.setAttribute("stroke-width", "1");
path.setAttribute("fill", "none");

svg.appendChild(path);

document.addEventListener("mousemove", (e) => {
  const rect = pupil.getBoundingClientRect();

  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const endX = e.clientX;
  const endY = e.clientY;

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const MAX_DISTANCE = 800;

  const clampedDistance = Math.min(distance, MAX_DISTANCE);
  const intensity = 1 - clampedDistance / MAX_DISTANCE;

  // 🔥 Stroke thickness: 1 → 3
  const strokeWidth = 0.5 + 3 * intensity;
  path.setAttribute("stroke-width", strokeWidth);

  // Far = straight
  if (distance > MAX_DISTANCE) {
    path.setAttribute("d", `M ${startX} ${startY} L ${endX} ${endY}`);
    return;
  }

  // Close = wiggle
  const maxWiggle = 40 * intensity;
  const segments = 12;

  let d = `M ${startX} ${startY}`;

  for (let i = 1; i <= segments; i++) {
    const t = i / segments;

    const baseX = startX + dx * t;
    const baseY = startY + dy * t;

    const randomX = (Math.random() - 0.5) * maxWiggle;
    const randomY = (Math.random() - 0.5) * maxWiggle;

    d += ` L ${baseX + randomX} ${baseY + randomY}`;
  }

  path.setAttribute("d", d);
});