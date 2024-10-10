import React, { useState, useEffect } from 'react';
import { TOTP } from 'otpauth';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardCopy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TOTPGenerator = () => {
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (secret) {
        const totp = new TOTP({ secret });
        setOtp(totp.generate());
        setTimeLeft(30 - Math.floor(Date.now() / 1000) % 30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleSecretChange = (e) => {
    setSecret(e.target.value);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-none shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">TOTP Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={handleSecretChange}
            placeholder="Enter TOTP Secret"
            className="bg-white/20 border-none text-white placeholder-white/50"
          />
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {otp && (
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-white mb-2">{otp}</div>
            <div className="text-white/70">
              Refreshes in: {timeLeft} seconds
            </div>
            <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-green-400 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        <CopyToClipboard text={otp} onCopy={handleCopy}>
          <Button
            className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
            disabled={!otp}
          >
            <ClipboardCopy className="mr-2" size={16} />
            {copied ? 'Copied!' : 'Copy OTP'}
          </Button>
        </CopyToClipboard>
      </CardContent>
    </Card>
  );
};

export default TOTPGenerator;