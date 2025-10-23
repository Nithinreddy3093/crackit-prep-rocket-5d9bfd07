import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyGuideId: string;
  studyGuideTitle: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  studyGuideId,
  studyGuideTitle,
  amount,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const UPI_ID = '7093569420@ybl';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter transaction ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setVerifying(true);

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user?.id,
            amount: amount,
            upi_id: UPI_ID,
            study_guide_id: studyGuideId,
            status: 'pending',
            transaction_id: transactionId,
          },
        ]);

      if (paymentError) throw paymentError;

      // Grant access (in production, this should be verified by admin)
      const { error: accessError } = await supabase
        .from('study_guide_access')
        .insert([
          {
            user_id: user?.id,
            guide_id: studyGuideId,
            payment_status: 'pending',
            access_granted: false, // Admin will verify and grant access
            upi_transaction_id: transactionId,
          },
        ]);

      if (accessError) throw accessError;

      toast({
        title: 'Payment Submitted!',
        description: 'Your payment is being verified. Access will be granted within 24 hours.',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6 text-primary" />
            Access Premium Study Guide
          </DialogTitle>
          <DialogDescription>
            Unlock full access to "{studyGuideTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-primary">₹{amount}</p>
          </div>

          {/* UPI Details */}
          <div className="space-y-2">
            <Label>UPI ID</Label>
            <div className="flex items-center gap-2">
              <Input
                value={UPI_ID}
                readOnly
                className="font-mono text-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Send payment to this UPI ID from any payment app
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-900">
              Payment Instructions:
            </h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Send ₹{amount} to {UPI_ID}</li>
              <li>Copy the transaction ID from your payment app</li>
              <li>Paste it below and click "Verify Payment"</li>
            </ol>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label htmlFor="transactionId">
              Transaction ID / Reference Number
            </Label>
            <Input
              id="transactionId"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              You'll find this in your payment app after completing the payment
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyPayment}
            disabled={verifying}
            className="w-full"
            size="lg"
          >
            {verifying ? 'Verifying...' : "I've Paid - Verify"}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Access will be granted within 24 hours after verification
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
