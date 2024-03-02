import { Label } from "@radix-ui/react-label"
import { Card } from "./ui/card"

type Props = {
  file: File;
}

export const FileRow = ({ file }: Props) => {

  return (
    <Card className="p-4">
        <Label>{file.name}</Label>
    </Card>
  )
}
