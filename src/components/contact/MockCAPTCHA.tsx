import { useState } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MockCAPTCHAProps {
  onChange: (token: string | null) => void;
}

export const MockCAPTCHA = ({ onChange }: MockCAPTCHAProps) => {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    const token = `mock-captcha-token-${Date.now()}`;
    setIsVerified(true);
    onChange(token);
    toast.success("Security verification completed");
  };

  const handleReset = () => {
    setIsVerified(false);
    onChange(null);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-900">Security Verification</span>
        </div>
        <span className="text-xs text-gray-500">Privacy - Terms</span>
      </div>
      <div className="border-t pt-3">
        {!isVerified ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm"></div>
              <span className="text-sm text-gray-700">Confirm you are not a robot</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-orange-600 rounded"></div>
              <div className="w-5 h-5 bg-red-600 rounded"></div>
              <div className="w-5 h-5 bg-yellow-500 rounded"></div>
              <div className="w-5 h-5 bg-green-600 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-900">Verified</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-600">
              Reset
            </Button>
          </div>
        )}
        {!isVerified && (
          <Button
            variant="outline"
            className="w-full mt-3 border-gray-300 hover:border-orange-400 hover:text-orange-600"
            onClick={handleVerify}
          >
            Verify Security Check
          </Button>
        )}
      </div>
    </div>
  );
};
