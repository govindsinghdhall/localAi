'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  businessName: string;
}

export function QrCodeModal({ open, onClose, url, businessName }: QrCodeModalProps) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#171717', light: '#ffffff' },
    }).then(setDataUrl);
  }, [open, url]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-900"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-1 text-lg font-semibold text-neutral-900">Share Review Page</h3>
            <p className="mb-4 text-sm text-neutral-500">Scan QR for {businessName}</p>
            {dataUrl ? (
              <div className="mx-auto mb-4 flex justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt="QR code" className="rounded-lg" />
              </div>
            ) : (
              <div className="mb-4 h-[280px] animate-pulse rounded-lg bg-neutral-100" />
            )}
            <p className="mb-4 break-all text-center text-xs text-neutral-400">{url}</p>
            <Button variant="secondary" className="w-full" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy shareable link
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
