'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Share2, Check, QrCode, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

type PollShareProps = {
  pollId: string;
  pollTitle: string;
};

export function PollShare({ pollId, pollTitle }: PollShareProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const pollUrl = `${window.location.origin}/polls/${pollId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pollUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNatively = async () => {
    if (navigator.share) {
      setSharing(true);
      try {
        await navigator.share({
          title: pollTitle,
          text: `Vote on this poll: ${pollTitle}`,
          url: pollUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Sharing cancelled or failed:', error);
      } finally {
        setSharing(false);
      }
    } else {
      // Fallback to copy URL if native sharing is not available
      copyToClipboard();
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `poll-${pollId}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share This Poll
        </CardTitle>
        <CardDescription>
          Share this poll with others so they can vote
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <code className="flex-1 text-sm break-all">{pollUrl}</code>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={shareNatively}
            disabled={sharing}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {sharing ? 'Sharing...' : 'Share Poll'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
        </div>
        
        {showQR && (
          <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg border">
            <div id="qr-code-canvas">
               <QRCodeCanvas
                 value={pollUrl}
                 size={200}
                 level="M"
                 includeMargin={true}
               />
             </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Scan to vote on this poll</p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadQRCode}
              >
                <Download className="h-4 w-4 mr-1" />
                Download QR Code
              </Button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Anyone with this link can view and vote on your poll
        </p>
      </CardContent>
    </Card>
  );
}