import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left">
        <RoomList />
        <Separator className="my-4" />
        <UserList />
      </SheetContent>
    </Sheet>
  )
}