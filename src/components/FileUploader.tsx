import { useState } from "react"
import { FileRow } from "./FileRow"
import { ImageTypeSelect } from "./ImageTypeSelect"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import classNames from "classnames"
import { Label } from "@radix-ui/react-label"
import { ImageFormatType } from "@/lib/formats"
import { useConvertImageType } from "@/hooks/useConvertImageType.hook"

export const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFileType, setImageFileType] = useState<ImageFormatType>("PNG");
  const { convertImage } = useConvertImageType();

  const onFiles = (files: FileList | null) => {
    if (!files) {
      console.log("No files provided.")
      return;
    }

    const fileArr: File[] = [...files];
    setFiles((prev) => [...prev, ...fileArr]);
  }

  const preventDefaults = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
  }

  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    preventDefaults(ev);

    const files = ev.dataTransfer.files

    if(!files) {
      return;
    }

    const fileArr: File[] = [...files];
    setFiles((prev) => [...prev, ...fileArr])
    setDragOver(false)
  }

  const onConvertFiles = async () => {
    setIsLoading(true);

    console.log("File type", imageFileType)
    for (const file of files) {
      await convertImage(file, imageFileType)
    }

    setIsLoading(false);
  }

  const onClearFiles = () => {
    setFiles([]);
  }

  return (
    <div
      id="dropZone"
      onDragEnter={(ev) => { preventDefaults(ev); setDragOver(true)}}
      onDragOver={(ev) => { preventDefaults(ev); setDragOver(true)}}
      onDragLeave={(ev) => { preventDefaults(ev); setDragOver(false)}}
      onDragEnd={(ev) => { preventDefaults(ev); setDragOver(false)}}
      onDragExit={(ev) => { preventDefaults(ev); setDragOver(false)}}
      onDragEndCapture={(ev) => { preventDefaults(ev); setDragOver(false)}}
      onDrop={onDrop}
      className="container flex flex-col justify-center"
    >
      <Card
        className={classNames(
          "w-full md:w-1/2 mx-auto",
          {
            "border-cyan-500": dragOver
          }
        )}
      >
        <CardHeader>
          <CardTitle>
            Convert Files
          </CardTitle>
          <CardDescription>
            Drag and drop or select files to convert. 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input id="pictureUpload" type="file" onChange={(event) => onFiles(event.target.files)} value="" />
          {
            files.map(
              (file, index) => (
                <FileRow key={file.name + "-" + index} file={file} />
              )
            )
          }
          {
            !!files.length && (
              <div className="pt-2">
                <Button onClick={onClearFiles} variant="destructive">Clear all files</Button>
              </div>
            )
          }
        </CardContent>
        <CardFooter className="flex justify-between">
          <ImageTypeSelect onTypeSelected={setImageFileType} value={imageFileType} />
          <Button onClick={onConvertFiles}>{!isLoading ? "Convert" : "Just one moment ..."}</Button>
        </CardFooter>
      </Card>
      <Label className="w-full mt-6 mx-auto md:w-1/2 text-center text-gray-500">We don't store any files on our end! All file changes and conversions are run locally!</Label>
    </div>
  )
} 
