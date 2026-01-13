import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareText, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessingResult {
  success: boolean;
  message: string;
  smsText: string;
}

export default function SMSInput() {
  const { addTransactionFromSMS } = useBudget();
  const [smsText, setSmsText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);

  const sampleSMSs = [
    "FNB: You have received M500.00 from PARENT TRANSFER on 10 Jan 2025. Available balance: M3,500.00",
    "M-Pesa: Payment of M150.00 to SHOPRITE MASERU completed. Ref: TXN123456. Balance: M2,850.00",
    "EcoCash: Cash withdrawal of M200.00 at ATM completed. Balance: M2,650.00",
    "FNB: Debit of M80.00 for VODACOM AIRTIME on 09 Jan 2025. Available bal: M2,570.00",
    "M-Pesa: You paid M350.00 to STER-KINEKOR. Transaction successful. Balance: M2,220.00"
  ];

  const handleProcessSMS = async () => {
    if (!smsText.trim()) {
      toast.error('Please enter an SMS message');
      return;
    }

    setIsProcessing(true);

    // Split by newlines and process each SMS
    const messages = smsText.split('\n').filter(msg => msg.trim());
    const newResults: ProcessingResult[] = [];

    for (const msg of messages) {
      const result = addTransactionFromSMS(msg.trim());
      newResults.push({
        success: result.success,
        message: result.message,
        smsText: msg.trim(),
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    setResults(prev => [...newResults, ...prev]);
    setSmsText('');
    setIsProcessing(false);
  };

  const handleUseSample = (sample: string) => {
    setSmsText(prev => prev ? `${prev}\n${sample}` : sample);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-heading flex items-center gap-3">
            <MessageSquareText className="h-8 w-8 text-primary" />
            SMS Transaction Input
          </h1>
          <p className="text-muted-foreground mt-2">
            Paste your bank or mobile money SMS messages to automatically track transactions.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-info/10 border border-info/30 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">How it works:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Copy transaction SMS from your phone (M-Pesa, EcoCash, FNB, Standard Bank)</li>
                <li>Paste one or more messages below (one per line)</li>
                <li>SmartBudget will extract amount, date, merchant, and category automatically</li>
                <li>Cash withdrawals will prompt you to record how you spent the cash</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SMS Input */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Paste SMS Messages</h3>
          
          <Textarea
            placeholder="Paste your bank/mobile money SMS here... 

Example:
FNB: You have received M500.00 from PARENT TRANSFER on 10 Jan 2025. Available balance: M3,500.00"
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            className="min-h-[150px] resize-none"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <Button 
              onClick={handleProcessSMS} 
              disabled={isProcessing || !smsText.trim()}
              className="gap-2"
            >
              {isProcessing ? 'Processing...' : 'Process SMS'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSmsText('')}
              disabled={!smsText}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Sample SMS */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Try Sample SMS Messages</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click any sample to add it to the input above:
          </p>
          
          <div className="space-y-2">
            {sampleSMSs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleUseSample(sample)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="stat-card">
            <h3 className="font-semibold mb-4">Processing Results</h3>
            
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'bg-success/5 border-success/30' 
                      : 'bg-destructive/5 border-destructive/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      result.message.includes('withdrawal') ? (
                        <AlertCircle className="h-5 w-5 text-warning shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      )
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        result.success ? 'text-success' : 'text-destructive'
                      }`}>
                        {result.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {result.smsText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
