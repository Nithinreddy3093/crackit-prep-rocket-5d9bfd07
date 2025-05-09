import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Add this PasswordStrengthMeter component
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const calculateStrength = (pwd: string): { score: number, feedback: string } => {
    if (!pwd) return { score: 0, feedback: 'Password is required' };
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    // Common patterns check (negative)
    if (/123|abc|qwerty|password|admin/i.test(pwd)) score -= 1;
    
    // Cap the score between 0-4
    score = Math.max(0, Math.min(4, score));
    
    const feedbacks = [
      'Very weak',
      'Weak',
      'Moderate',
      'Strong',
      'Very strong'
    ];
    
    return {
      score,
      feedback: feedbacks[score]
    };
  };
  
  const { score, feedback } = calculateStrength(password);
  
  const getColorClass = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-emerald-500';
      default: return 'bg-gray-300';
    }
  };
  
  const getWidthClass = () => {
    return `${(score + 1) * 20}%`;
  };
  
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span>Password strength:</span>
        <span className={`
          font-medium
          ${score <= 1 ? 'text-red-400' : 
            score === 2 ? 'text-yellow-400' : 
            'text-green-400'}
        `}>{feedback}</span>
      </div>
      <div className="w-full h-1 bg-darkBlue-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass()} transition-all duration-300`}
          style={{ width: getWidthClass() }}
        ></div>
      </div>
    </div>
  );
};

// Add this PasswordRequirements component
const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { 
      text: "At least 8 characters long", 
      met: password.length >= 8,
    },
    { 
      text: "Contains uppercase letter (A-Z)", 
      met: /[A-Z]/.test(password),
    },
    { 
      text: "Contains lowercase letter (a-z)", 
      met: /[a-z]/.test(password),
    },
    { 
      text: "Contains a number (0-9)", 
      met: /[0-9]/.test(password),
    },
    { 
      text: "Contains a special character (!@#$%^&*)", 
      met: /[^A-Za-z0-9]/.test(password),
    }
  ];
  
  return (
    <div className="mt-2 mb-3 bg-darkBlue-800/50 p-3 rounded-md border border-darkBlue-700">
      <div className="flex items-center mb-2">
        <Info className="h-4 w-4 text-primary mr-2" />
        <span className="text-sm font-medium">Password Requirements:</span>
      </div>
      <ul className="space-y-1 text-xs">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            {req.met ? (
              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
            )}
            <span className={req.met ? 'text-green-400' : 'text-gray-400'}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SignUp = () => {
  // ... keep existing state variables and hooks
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAgreed) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Register with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
        variant: "default",
      });
      
      // Redirect to login or dashboard based on your app flow
      navigate('/login');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue-900 via-darkBlue-800 to-darkBlue-700 p-4">
      <Card className="w-full max-w-md bg-darkBlue-800/50 backdrop-blur-md border-darkBlue-700">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-blue-300">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input 
                id="name"
                placeholder="Enter your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-darkBlue-700 border-darkBlue-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input 
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-darkBlue-700 border-darkBlue-600"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-white">Password</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-5 px-1 text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Password requirements</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Strong passwords protect your account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input 
                  id="password"
                  placeholder="Create a secure password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-darkBlue-700 border-darkBlue-600 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              
              {/* New password features */}
              <PasswordStrengthMeter password={password} />
              <PasswordRequirements password={password} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={termsAgreed}
                onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                className="data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="terms"
                className="text-sm text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-blue-200 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
