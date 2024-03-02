import { useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export const useConvertImageType = () => {
  const ffmpegRef = useRef(new FFmpeg());
 
  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", (val) => {
      console.log(val.type + ": " + val.message)
    });
    ffmpeg.on("progress", ({ progress, time }) => {
      console.log("Progress", progress, " time ", time)
    })

    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });

    console.log("Loaded ...")
  };

  const convertImage = async (file: File | null) => {
    if(!file) {
      console.error("Failed to convert image, null file provided.")
      return;
    }

    await load();

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.png", await fetchFile(file));
    const outputFileName = "output.jpg";
    await ffmpeg.exec(['-i', 'input.png', '-c:v', 'copy', outputFileName]);
    const fileData = await ffmpeg.readFile(outputFileName);
    const data = new Uint8Array(fileData as ArrayBuffer);

    console.log("Got this data: ", data);

    //const newImageBlob = new Blob([data.buffer], { type: 'image/jpg' })
    //const imageUrl = URL.createObjectURL(newImageBlob)
  };


  return {
   convertImage 
  }
}
