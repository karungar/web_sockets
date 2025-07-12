import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function MessageInput() {
  return (
    <div className="p-4 flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            <SmileIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <EmojiPicker />
        </PopoverContent>
      </Popover>
      <Input placeholder="Type a message..." />
      <Button>Send</Button>
    </div>
  )
}