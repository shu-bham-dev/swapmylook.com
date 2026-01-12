import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Mail,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { apiService } from '../../services/api';
import { toast } from '../../utils/toast';

interface OTPVerificationPageProps {
  email: string;
  purpose: 'signup' | 'login' | 'password_reset';
  name?: string;
  password?: string; // Password passed from signup page
  onVerificationComplete: (result: { token?: string; user?: any; message?: string }) => void;
  onBack: () => void;
}

export function OTPVerificationPage({
  email,
  purpose,
  name,
  password: propPassword, // Password from props (for signup)
  onVerificationComplete,
  onBack
}: OTPVerificationPageProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Start initial countdown
  useEffect(() => {
    setCountdown(60); // 60 seconds countdown
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // For signup, validate that we have password from props
    if (purpose === 'signup' && !propPassword) {
      setError('Password is required for signup. Please go back and enter your password.');
      toast.error('Password missing', {
        description: 'Password is required for signup.',
      });
      return;
    }

    setIsLoading(true);
    setError('');
    toast.dismiss();

    try {
      const result = await apiService.verifyOTP(
        email,
        otp,
        purpose,
        purpose === 'signup' ? name : undefined,
        purpose === 'signup' ? propPassword : undefined
      );

      toast.success('Verification successful!', {
        description: purpose === 'signup'
          ? 'Your account has been created successfully.'
          : purpose === 'login'
          ? 'You have been logged in successfully.'
          : 'OTP verified. You can now reset your password.',
      });

      onVerificationComplete(result);
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    toast.dismiss();

    try {
      await apiService.resendOTP(email, purpose);
      
      toast.success('OTP resent!', {
        description: 'A new OTP has been sent to your email.',
      });

      setCountdown(60); // Reset countdown
      setOtp(''); // Clear previous OTP
      setError('');
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to resend OTP', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const getPurposeTitle = () => {
    switch (purpose) {
      case 'signup': return 'Verify Your Email';
      case 'login': return 'Login with OTP';
      case 'password_reset': return 'Reset Password';
      default: return 'Verify OTP';
    }
  };

  const getPurposeDescription = () => {
    switch (purpose) {
      case 'signup': return 'Enter the 6-digit code sent to your email to complete your registration';
      case 'login': return 'Enter the 6-digit code sent to your email to log in';
      case 'password_reset': return 'Enter the 6-digit code sent to your email to reset your password';
      default: return 'Enter the 6-digit verification code';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {getPurposeTitle()}
            </h1>
            <p className="text-muted-foreground">
              {getPurposeDescription()}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-6 space-y-6">
          {/* Email Info */}
          <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium">{email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-pink-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change
            </Button>
          </div>

          {/* OTP Input */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value: string) => {
                    setOtp(value);
                    setError('');
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && (
                <Alert variant="destructive" className="py-2">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password note for signup */}
            {purpose === 'signup' && (
              <div className="space-y-3">
                <Separator />
              </div>
            )}

            {/* Countdown and Resend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {countdown > 0 
                    ? `Resend available in ${countdown}s` 
                    : 'Ready to resend'}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className="text-pink-600"
              >
                {isResending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-pink-600/30 border-t-pink-600 rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Resend OTP
                  </>
                )}
              </Button>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          {/* Security Note */}
          <Alert className="bg-blue-50 border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700">
              For security reasons, this OTP will expire in 10 minutes. Do not share this code with anyone.
            </AlertDescription>
          </Alert>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or{' '}
            <Button
              variant="link"
              className="text-pink-600 h-auto p-0 text-sm"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isResending}
            >
              click here to resend
            </Button>
          </p>
          <p className="text-xs text-muted-foreground">
            By verifying your email, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}