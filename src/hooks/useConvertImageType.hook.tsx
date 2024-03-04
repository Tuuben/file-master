import { useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import { ImageFormatType, imageFormats } from "@/lib/formats";

export const useConvertImageType = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const loadedRef = useRef(false);
 
  const load = async () => {
    if(loadedRef.current) {
      return;
    }

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

    loadedRef.current = true;
  };

  const convertImage = async (file: File | null, toFileType: ImageFormatType) => {
    if(!file) {
      console.error("Failed to convert image, null file provided.")
      return;
    }

    const fileType = imageFormats[toFileType];

    await load();

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.png", await fetchFile(file));
    const outputFileName = "output." + fileType;
    await ffmpeg.exec(['-i', 'input.png', '-c:v', 'copy', outputFileName]);
    const fileData = await ffmpeg.readFile(outputFileName);
    const data = new Uint8Array(fileData as ArrayBuffer);

    console.log("Got this data: ", data);

    const newImageBlob = new Blob([data.buffer], { type: 'image/' + fileType })
    const imageUrl = URL.createObjectURL(newImageBlob)

    const downloadLink = document.createElement("a");
    downloadLink.download = `${Date.now()}`
    downloadLink.href = imageUrl

    document.body.appendChild(downloadLink)

    downloadLink.click()

    document.body.removeChild(downloadLink)

    URL.revokeObjectURL(imageUrl)
  };


  return {
   convertImage 
  }
}
