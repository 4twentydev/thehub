"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { projects } from "@/lib/sample-data";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0">
        <Command>
          <CommandInput placeholder="Search projects or jump actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/projects/${project.slug}`);
                  }}
                >
                  {project.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Assembly">
              <CommandItem
                value="assembly dashboard metrics"
                onSelect={() => {
                  setOpen(false);
                  router.push("/admin/assembly");
                }}
              >
                Assembly Dashboard
              </CommandItem>
              <CommandItem
                value="assembly tv display shop floor"
                onSelect={() => {
                  setOpen(false);
                  router.push("/assembly/tv");
                }}
              >
                Assembly TV Display
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Owner actions">
              <CommandItem
                value="new project"
                onSelect={() => {
                  setOpen(false);
                  router.push("/admin/projects");
                }}
              >
                New project
              </CommandItem>
              <CommandItem
                value="admin dashboard"
                onSelect={() => {
                  setOpen(false);
                  router.push("/admin");
                }}
              >
                Open owner dashboard
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
