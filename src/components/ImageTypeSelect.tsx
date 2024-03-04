import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageFormatType, imageFormats } from "@/lib/formats";


type Props = {
  value?: ImageFormatType;
  onTypeSelected?: (imageFileType: ImageFormatType) => void;
}

export const ImageTypeSelect = ({ value, onTypeSelected }: Props) => {
  const imageTypeKeys = Object.keys(imageFormats)

  return (
    <Select value={value} onValueChange={(value) => onTypeSelected?.(value as ImageFormatType)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Image type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Image Type</SelectLabel>
          {
            imageTypeKeys.map(key => (
              <SelectItem key={key} value={key}>{key}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
