import { useState } from "react"
import { FileRow } from "./FileRow"
import { ImageTypeSelect } from "./ImageTypeSelect"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import classNames from "classnames"

export const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState<boolean>(false);

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
    console.log("File(s) dropped");
    preventDefaults(ev);

    const files = ev.dataTransfer.files

    if(!files) {
      return;
    }

    const fileArr: File[] = [...files];
    setFiles((prev) => [...prev, ...fileArr])
    setDragOver(false)
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
    >
      <Card
        className={classNames(
          "w-full md:w-1/2 mx-auto my-16",
          {
            "border-cyan-500": dragOver
          }
        )}
      >
        <CardHeader>
          <CardTitle>
            Upload Files
          </CardTitle>
          <CardDescription>
            Convert images to another file type.
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <ImageTypeSelect />
          <Button>Convert</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 
