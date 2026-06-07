import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, Mail, MessageSquare, Linkedin, Copy, Check,
  Share2, Download, Link2, QrCode as QrIcon, Twitter, Facebook,
} from "lucide-react";
import { toast } from "sonner";
import type { CardData } from "@/lib/card-types";

interface Props {
  data: CardData;
  url: string;
  compact?: boolean;
}

export function ShareGrid({ data, url, compact = false }: Props) {
  const [copied, setCopied] = useState(false);
  const shareText = `${data.name || "Ma carte"}${data.title ? " — " + data.title : ""}`;
  const enc = (s: string) => encodeURIComponent(s);

  const channels = [
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle,  color: "#25D366",
      href: `https://wa.me/?text=${enc(shareText + " " + url)}` },
    { id: "sms",      label: "SMS",      icon: MessageSquare,  color: "#5856D6",
      href: `sms:?&body=${enc(shareText + " " + url)}` },
    { id: "email",    label: "Email",    icon: Mail,           color: "#EA4335",
      href: `mailto:?subject=${enc(shareText)}&body=${enc(shareText + "%0A%0A" + url)}` },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin,       color: "#0A66C2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { id: "twitter",  label: "X",        icon: Twitter,        color: "#000000",
      href: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(url)}` },
    { id: "facebook", label: "Facebook", icon: Facebook,       color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  const visible = compact ? channels.slice(0, 4) : channels;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié dans le presse-papiers");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handleNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: data.name || "Ma carte", text: shareText, url }); }
      catch {}
    } else handleCopy();
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {visible.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 px-2 py-3 transition-all hover:-translate-y-0.5"
          >
            <span
              className="h-9 w-9 grid place-items-center rounded-lg text-white transition-transform group-hover:scale-110"
              style={{ background: c.color }}
            >
              <c.icon className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-medium text-foreground/80">{c.label}</span>
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 px-2 py-3 transition-all hover:-translate-y-0.5"
        >
          <span className="h-9 w-9 grid place-items-center rounded-lg bg-foreground/10 text-foreground transition-transform group-hover:scale-110">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </span>
          <span className="text-[11px] font-medium text-foreground/80">{copied ? "Copié" : "Copier"}</span>
        </button>
        <button
          onClick={handleNative}
          className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 px-2 py-3 transition-all hover:-translate-y-0.5"
        >
          <span className="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground transition-transform group-hover:scale-110">
            <Share2 className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-medium text-foreground/80">Autre…</span>
        </button>
      </div>
    </div>
  );
}

export function QrCard({ url, name }: { url: string; name?: string }) {
  const [qr, setQr] = useState<string>("");
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 640,
      color: { dark: "#0b0d12", light: "#ffffff" },
    }).then((d) => { if (!cancelled) setQr(d); }).catch(() => {});
    return () => { cancelled = true; };
  }, [url]);

  const download = (kind: "png" | "svg") => {
    if (kind === "png") {
      if (!qr) return;
      const a = document.createElement("a");
      a.href = qr;
      a.download = `${(name || "carte").toLowerCase().replace(/\s+/g, "-")}-qr.png`;
      a.click();
      return;
    }
    // SVG export
    QRCode.toString(url, { type: "svg", errorCorrectionLevel: "H", margin: 1, color: { dark: "#0b0d12", light: "#ffffff" } })
      .then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = `${(name || "carte").toLowerCase().replace(/\s+/g, "-")}-qr.svg`;
        a.click();
        URL.revokeObjectURL(href);
      });
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 grid place-items-center rounded-md bg-primary/15 text-primary">
            <QrIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium">QR code</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => download("png")} disabled={!qr} className="h-7 px-2 text-[11px]">
            <Download className="h-3 w-3 mr-1" /> PNG
          </Button>
          <Button size="sm" variant="ghost" onClick={() => download("svg")} className="h-7 px-2 text-[11px]">
            <Download className="h-3 w-3 mr-1" /> SVG
          </Button>
        </div>
      </div>
      <div className="relative mx-auto w-fit">
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-primary/30 to-transparent blur-xl opacity-50" aria-hidden />
        <div className="relative rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/10">
          {qr ? (
            <img src={qr} alt="QR code" className="h-44 w-44 sm:h-48 sm:w-48" />
          ) : (
            <div className="h-44 w-44 sm:h-48 sm:w-48 grid place-items-center text-xs text-neutral-400">Génération…</div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        Imprimez-le sur vos supports — chaque scan ouvre votre carte.
      </p>
    </div>
  );
}

export function PublicLinkBar({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); toast.success("Lien copié"); setTimeout(() => setCopied(false), 1500); }
    catch {}
  };
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
      <Link2 className="h-4 w-4 text-primary shrink-0" />
      <span className="text-sm font-mono truncate flex-1">{url.replace(/^https?:\/\//, "")}</span>
      <button onClick={copy} className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary px-2 py-1 rounded-md transition">
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : "Copier"}
      </button>
    </div>
  );
}
