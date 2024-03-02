import { useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import "../app/globals.css"
import { ThemeProvider } from "./components/ThemeProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploader } from "./components/FileUploader";

function App() {
  const ffmpegRef = useRef(new FFmpeg());
  const [imageSrc, setImageSrc] = useState("");

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

  const transcode = async (files: FileList | null) => {
    if (!files) {
      return;
    }

    await load();

    const file = files.item(0);
    if (!file) {
      return;
    }

    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.png", await fetchFile(file));
    const outputFileName = "output.jpg";
    await ffmpeg.exec(['-i', 'input.png', '-c:v', 'copy', outputFileName]);
    const fileData = await ffmpeg.readFile(outputFileName);
    const data = new Uint8Array(fileData as ArrayBuffer);

    console.log("Got this data: ", data);

    const newImageBlob = new Blob([data.buffer], { type: 'image/jpg' })
    const imageUrl = URL.createObjectURL(newImageBlob)
    setImageSrc(imageUrl)

  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <img src={imageSrc} /> */}
      {/* <Label htmlFor="pictureUpload">Upload an image.</Label> */}
      {/* <Input id="pictureUpload" type="file" onChange={(event) => transcode(event.target.files)} /> */}
      <div className="container mx-auto">
        <FileUploader />
      </div>
    </ThemeProvider>
  )
}

export default App;
