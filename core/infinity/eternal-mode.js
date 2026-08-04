export class EternalMode {
  constructor({universe,particles}){this.universe=universe;this.particles=particles;this.active=false;}
  start(){if(this.active)return;this.active=true;document.body.classList.add("eternal-mode");const loop=()=>{if(!this.active)return;setTimeout(()=>{const r=Math.random();if(r<.55)this.universe.meteor(false);else if(r<.8)this.particles.burst(innerWidth*(.2+Math.random()*.6),innerHeight*(.2+Math.random()*.55),5,"✦");else{document.body.classList.add("eternal-aurora-pulse");setTimeout(()=>document.body.classList.remove("eternal-aurora-pulse"),4200);}loop();},7000+Math.random()*13000);};loop();}
}
