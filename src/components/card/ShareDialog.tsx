import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Share2, Contact } from "lucide-react";
import { downloadVCard } from "@/lib/vcard";
import type { CardData } from "@/lib/card-types";

interface Props {
  data: CardData;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ShareDialog({ data, open, onOpenChange }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin + "/" : "";

  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;
    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 480,
      color: { dark: "#0b0d12", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [open, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: data.name || "Carte de visite",
        text: `${data.name || ""}${data.title ? " — " + data.title : ""}`.trim(),
        url,
      });
    } catch {
      /* user cancelled */
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const slug = (data.name || "carte").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    a.download = `${slug || "carte"}-qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager la carte</DialogTitle>
          <DialogDescription>
            Scannez le QR code, partagez le lien, ou enregistrez le contact directement.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code vers la carte de ${data.name}`}
                className="h-56 w-56"
                width={224}
                height={224}
              />
            ) : (
              <div className="h-56 w-56 grid place-items-center text-xs text-muted-foreground">
                Génération…
              </div>
            )}
          </div>

          <div className="w-full flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground">{url}</span>
            <Button size="sm" variant="ghost" onClick={handleCopy} aria-label="Copier le lien">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handleNativeShare}>
              <Share2 className="h-4 w-4 mr-1.5" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadQr} disabled={!qrDataUrl}>
              <Download className="h-4 w-4 mr-1.5" />
              QR PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadVCard(data)}>
              <Contact className="h-4 w-4 mr-1.5" />
              vCard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
