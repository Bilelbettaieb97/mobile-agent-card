import { useState } from "react";
import { Check, Copy, Download, ExternalLink, MessageCircle, X } from "lucide-react";

type Props = {
  cardUrl: string;
  nom: string;
  onClose: () => void;
  onDashboard: () => void;
};

export function CelebrationModal({ cardUrl, nom, onClose, onDashboard }: Props) {
  const [copied, setCopied] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}&margin=10`;
  const qrDownloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(cardUrl)}&margin=20`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Voici ma carte de visite digitale 👇\n${cardUrl}`)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`;

  function copyLink() {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const prenom = nom.split(" ")[0] || "vous";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="rounded-3xl shadow-2xl w-full max-w-md p-8 relative text-center"
        style={{ background: "var(--color-card, #1a1c27)", border: "1px solid var(--color-border, rgba(255,255,255,0.08))" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: "var(--gradient-gold, linear-gradient(135deg,#c8a84b,#f0d080))" }}
        >
          <Check className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-1">
          Votre carte est en ligne ! 🎉
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Bonjour <strong className="text-foreground">{prenom}</strong> — partagez votre lien et recevez vos premiers scans.
        </p>

        {/* URL bar */}
        <div
          className="flex items-center gap-2 p-3 rounded-xl mb-5"
          style={{ background: "var(--color-surface, rgba(255,255,255,0.05))" }}
        >
          <span className="text-sm font-mono text-foreground/80 truncate flex-1 text-left">
            {cardUrl}
          </span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold shrink-0 hover:bg-muted transition"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        {/* QR Code */}
        <div className="inline-block p-3 bg-white rounded-2xl shadow mb-2">
          <img src={qrUrl} alt="QR Code de votre carte" className="w-40 h-40 rounded" />
        </div>
        <div className="mb-6">
          <a
            href={qrDownloadUrl}
            download="ma-carte-qr.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <Download className="w-3 h-3" /> Télécharger le QR Code HD
          </a>
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "#0A66C2" }}
          >
            LinkedIn
          </a>
          <a
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border border-border hover:bg-muted transition text-foreground"
          >
            <ExternalLink className="w-4 h-4" /> Voir ma carte
          </a>
        </div>

        {/* Dashboard CTA */}
        <button
          onClick={onDashboard}
          className="w-full py-3 rounded-full text-primary-foreground font-bold text-sm shadow-lg hover:opacity-90 transition"
          style={{ background: "var(--gradient-gold, linear-gradient(135deg,#c8a84b,#f0d080))" }}
        >
          Accéder à mon tableau de bord →
        </button>
      </div>
    </div>
  );
}
