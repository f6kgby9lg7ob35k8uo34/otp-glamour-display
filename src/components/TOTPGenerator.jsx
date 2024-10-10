import React, { useState, useEffect } from 'react';
import { TOTP } from 'otpauth';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardCopy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="w-full max-w-md bg-black border-none shadow-xl">
      <CardContent className="space-y-8 p-6">
        <div className="relative">
          <Input
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={handleSecretChange}
            placeholder="Enter TOTP Secret"
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
          />
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
          >
            {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {otp && (
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute w-40 h-40 rounded-full border-4 border-gray-800">
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-500 transition-all duration-1000 ease-linear"
                style={{
                  clipPath: `inset(0 ${100 - ((timeLeft / 30) * 100)}% 0 0)`,
                }}
              ></div>
            </div>
            <div className="text-4xl font-mono font-bold text-white z-10 my-12">{otp}</div>
            <div className="text-gray-500 mt-2">
              Refreshes in: {timeLeft} seconds
            </div>
          </div>
        )}
        <CopyToClipboard text={otp} onCopy={handleCopy}>
          <Button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border-none"
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