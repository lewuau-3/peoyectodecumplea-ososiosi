export class PhotoPaletteEngine {
  constructor(){ this.cache=new Map(); }
  async extract(img){
    if(this.cache.has(img.src)) return this.cache.get(img.src);
    try{
      const c=document.createElement("canvas"),x=c.getContext("2d",{willReadFrequently:true}); c.width=24;c.height=24;x.drawImage(img,0,0,24,24);
      const d=x.getImageData(0,0,24,24).data; let r=0,g=0,b=0,n=0;
      for(let i=0;i<d.length;i+=16){ if(d[i+3]<180)continue; const q=(d[i]+d[i+1]+d[i+2])/3;if(q<18||q>238)continue;r+=d[i];g+=d[i+1];b+=d[i+2];n++; }
      const color=n?[Math.round(r/n),Math.round(g/n),Math.round(b/n)]:[90,145,205]; this.cache.set(img.src,color); return color;
    }catch{return [90,145,205];}
  }
  apply([r,g,b]){ document.documentElement.style.setProperty("--photo-r",r);document.documentElement.style.setProperty("--photo-g",g);document.documentElement.style.setProperty("--photo-b",b); }
}
