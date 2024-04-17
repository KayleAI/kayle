"use client";

import * as React from "react"

import { useMediaQuery } from "@repo/ui/lib/use-media-query"
import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer"

/**
 * Displays a dialog or drawer with a title, description, and form depending on the screen size.
 * 
 * @param title - The title of the dialog/drawer
 * @param description - The description of the dialog/drawer
 * @param form - The form to be displayed in the dialog/drawer
 * @param children - The trigger button for the dialog/drawer
 * 
 */
export default function DrawerDialog({
  title = "",
  description = "",
  form = <></>,
  children = <Button variant="outline">My Button</Button>,
}: {
  title?: string;
  description?: string;
  form?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {title}
          </DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {form}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}