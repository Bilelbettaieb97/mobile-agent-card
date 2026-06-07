import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutGrid, CreditCard, Share2, Palette, BarChart3, User,
  ExternalLink, QrCode, Copy, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  publicUrl: string;
}

export function CommandPalette({ publicUrl }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => { setOpen(false); navigate({ to: path }); };
  const run = (fn: () => void) => { setOpen(false); fn(); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Naviguer ou exécuter une action…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/dashboard")}><LayoutGrid className="mr-2 h-4 w-4" /> Vue d'ensemble</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/card")}><CreditCard className="mr-2 h-4 w-4" /> Ma carte</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/share")}><BarChart3 className="mr-2 h-4 w-4" /> Statistiques</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/account")}><User className="mr-2 h-4 w-4" /> Plan & compte</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions rapides">
          <CommandItem onSelect={() => run(() => {
            navigator.clipboard.writeText(publicUrl);
            toast.success("Lien copié");
          })}><Copy className="mr-2 h-4 w-4" /> Copier mon lien public<CommandShortcut>⌘C</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => run(() => window.open(publicUrl, "_blank"))}>
            <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir ma carte
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/card#qr")}>
            <QrCode className="mr-2 h-4 w-4" /> Télécharger mon QR code
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/account")}>
            <Sparkles className="mr-2 h-4 w-4" /> Passer au plan Vitrine
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
