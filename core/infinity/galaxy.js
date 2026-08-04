export class GalaxyEngine {
  constructor(canvas, quality = "medium") {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.quality = quality;
    this.stars = [];
    this.rotation = 0;
    this.running = true;
    this.resize(); this.create(); this.bind(); this.draw();
  }
  bind() {
    addEventListener("resize", () => { this.resize(); this.create(); }, { passive: true });
    document.addEventListener("visibilitychange", () => { this.running = !document.hidden; if (this.running) this.draw(); });
  }
  resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = innerWidth * ratio; this.canvas.height = innerHeight * ratio;
    this.canvas.style.width = `${innerWidth}px`; this.canvas.style.height = `${innerHeight}px`;
    this.ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  create() {
    const amount = this.quality === "high" ? 820 : this.quality === "medium" ? 480 : 230;
    this.stars = [];
    for (let i=0;i<amount;i++) {
      const radius = Math.pow(Math.random(), .72), arm = i % 3;
      const angle = arm * Math.PI * 2 / 3 + radius * Math.PI * 3.8 + (Math.random()-.5)*.56;
      this.stars.push({ radius, angle, size:.25+Math.random()*1.15, alpha:.14+Math.random()*.62, hue:198+Math.random()*32, phase:Math.random()*Math.PI*2 });
    }
  }
  draw = () => {
    if (!this.running) return;
    const ctx=this.ctx,w=innerWidth,h=innerHeight,cx=w/2,cy=h*.46,scale=Math.min(w,h)*.62,time=performance.now();
    this.rotation += this.quality === "high" ? .00008 : .00005;
    ctx.clearRect(0,0,w,h); ctx.save(); ctx.globalCompositeOperation="lighter";
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,scale*.36);
    glow.addColorStop(0,"rgba(220,238,255,.14)"); glow.addColorStop(.38,"rgba(85,145,205,.06)"); glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(cx,cy,scale*.42,0,Math.PI*2); ctx.fill();
    for (const s of this.stars) {
      const a=s.angle+this.rotation,x=cx+Math.cos(a)*s.radius*scale,y=cy+Math.sin(a)*s.radius*scale*.42;
      const alpha=Math.max(.03,s.alpha+Math.sin(time*.0012+s.phase)*.1);
      ctx.fillStyle=`hsla(${s.hue},75%,88%,${alpha})`; ctx.shadowBlur=s.size*4; ctx.shadowColor="rgba(150,205,255,.4)";
      ctx.beginPath(); ctx.arc(x,y,s.size,0,Math.PI*2); ctx.fill();
    }
    ctx.restore(); requestAnimationFrame(this.draw);
  }
}
