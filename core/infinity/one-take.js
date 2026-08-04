export class OneTakeDirector {
  constructor(experience,camera,world){this.experience=experience;this.camera=camera;this.world=world;this.bind();}
  bind(){this.experience.addEventListener("scroll",()=>this.update(),{passive:true});}
  update(){const max=this.experience.scrollHeight-this.experience.clientHeight,p=max>0?this.experience.scrollTop/max:0;this.world.setIntensity(p);this.world.updateMoon(.18+p*.82);this.camera.x=Math.sin(p*Math.PI*5)*7;this.camera.y=-p*18+Math.cos(p*Math.PI*4)*4;this.camera.scale=1+p*.16;}
}
