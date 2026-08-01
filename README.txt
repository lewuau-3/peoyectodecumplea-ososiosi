REGALO WEB DE CUMPLEAÑOS

ESTRUCTURA
- index.html
- styles.css
- script.js
- img/
- audio/

FOTOGRAFÍAS
1. Convierte tus fotos a WebP o AVIF.
2. Ponlas en la carpeta img.
3. Nómbralas:
   foto-01.webp
   foto-02.webp
   ...
   foto-10.webp
4. También puedes cambiar las rutas y frases dentro de CONFIG, al inicio de script.js.

AUDIO
1. Coloca el archivo que tengas derecho a utilizar dentro de audio.
2. Nómbralo dark-beach.mp3.
3. La ruta configurada es audio/dark-beach.mp3.

PROBAR EN ANDROID
Opción simple:
- Sube el proyecto a GitHub Pages y ábrelo desde Chrome.
- También puedes usar una app de servidor local para Android.
- Abrir directamente index.html puede funcionar, pero algunos navegadores limitan el audio local.

PUBLICAR EN GITHUB PAGES
1. Crea un repositorio nuevo.
2. Sube index.html, styles.css, script.js y las carpetas img y audio.
3. En GitHub ve a Settings > Pages.
4. En Source selecciona Deploy from a branch.
5. Elige main y la carpeta /root.
6. Guarda y espera a que GitHub muestre la dirección pública.

IMPORTANTE
Los navegadores móviles suelen bloquear el audio automático.
El proyecto intentará iniciarlo solo y, si no se puede, comenzará con el primer toque.
