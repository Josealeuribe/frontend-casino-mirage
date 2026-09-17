import video01 from "@/imports/videos/video-01-arauca.mp4";
import video02 from "@/imports/videos/video-02-arauca.mp4";
import video03 from "@/imports/videos/video-03-arauca.mp4";
import poster01 from "@/imports/videos/poster-01.jpg";
import poster02 from "@/imports/videos/poster-02.jpg";
import poster03 from "@/imports/videos/poster-03.jpg";

// video-03 va primero por pedido del cliente, asi que el orden de la lista no
// coincide con el numero de archivo. Las caratulas son el primer frame de cada
// pieza, extraido con ffmpeg; regenera la que toque si cambias un video.
const VIDEOS = [
  { src: video03, poster: poster03, archivo: "video-03-arauca" },
  { src: video01, poster: poster01, archivo: "video-01-arauca" },
  { src: video02, poster: poster02, archivo: "video-02-arauca" },
];

/** Solo la rejilla de videos: el encabezado lo pone la vista que lo usa, con
 *  TituloSeccion, para que pese igual que el de los demás apartados. */
export default function VideoShowcase() {
  return (
    <div className="w-full">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <div
            key={v.archivo}
            className="overflow-hidden rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(14,11,40,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,39,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            {/* preload="none" + poster: al cargar la pagina solo bajan las tres
                caratulas (~250 KB). El video (16 MB entre los tres) no se toca
                hasta que alguien le da al play.

                Las piezas son 720x1280, asi que el hueco se reserva en 9/16 y
                la tarjeta no da un salto de layout. Sin autoPlay: tres videos
                arrancando a la vez serian tres audios encima. */}
            <video
              src={v.src}
              poster={v.poster}
              controls
              playsInline
              preload="none"
              className="block aspect-[9/16] w-full bg-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
