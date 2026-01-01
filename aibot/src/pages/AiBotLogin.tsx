import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setHasAttemptedRefresh,
} from "@/store/slices/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bot, ChevronDown, KeyRound, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAbBrandingByDomain } from "@/modules/ai-bot-module/hooks/useAbBrandingByDomain";

interface DomainBranding {
  logo_url: string | null;
  favicon_url: string | null;
  company_name: string | null;
  primary_color: string;
  background_color: string;
  login_title: string;
  login_description: string;
}

const AiBotLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch: AppDispatch = useDispatch();

  // Always redirect to dashboard after login
  const redirectPath = '/dashboard';

  // Domain-based branding
  const currentDomain = window.location.hostname;
  const { data: domainBranding } = useAbBrandingByDomain(currentDomain);

  // Supabase Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Developer token login state
  const [devTokensOpen, setDevTokensOpen] = useState(false);
  const [accessToken, setAccessTokenInput] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userId, setUserId] = useState("");

  // Check for existing Supabase session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate(redirectPath, { replace: true });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate(redirectPath, { replace: true });
      }
      setIsCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectPath]);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete your signup.",
        });
      } else {
        toast({
          title: "Account created",
          description: "Welcome to AI Bot!",
        });
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevTokenLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken || !userId) {
      toast({
        title: "Missing fields",
        description: "Access Token and User ID are required",
        variant: "destructive",
      });
      return;
    }

    // Store tokens in localStorage for legacy system
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    localStorage.setItem("userId", userId);
    localStorage.setItem("current_user_session", userId);

    // Update Redux state
    dispatch(setAccessToken(accessToken));
    dispatch(setUser({ userId, email: "developer@ai-bot.dev" }));
    dispatch(setHasAttemptedRefresh(true));

    toast({
      title: "Developer login successful",
      description: "Logged in with developer tokens",
    });

    navigate(redirectPath, { replace: true });
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Apply branding styles
  const brandingStyles = domainBranding ? {
    backgroundColor: domainBranding.background_color || undefined,
    '--primary-color': domainBranding.primary_color,
  } as React.CSSProperties : {};

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4"
      style={brandingStyles}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          {domainBranding?.logo_url ? (
            <img 
              src={domainBranding.logo_url} 
              alt={domainBranding.company_name || 'Logo'} 
              className="mx-auto h-12 w-auto object-contain"
            />
          ) : (
            <div 
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: domainBranding?.primary_color 
                  ? `${domainBranding.primary_color}20` 
                  : 'hsl(var(--primary) / 0.1)' 
              }}
            >
              <Bot 
                className="w-6 h-6" 
                style={{ color: domainBranding?.primary_color || 'hsl(var(--primary))' }} 
              />
            </div>
          )}
          <CardTitle className="text-2xl font-bold">
            {domainBranding?.login_title || 'AI Bot Module'}
          </CardTitle>
          <CardDescription>
            {domainBranding?.login_description || 'Sign in to manage your AI bots'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleSupabaseLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSupabaseSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Developer Token Login - Collapsible */}
          <Collapsible open={devTokensOpen} onOpenChange={setDevTokensOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-muted-foreground">
                <span className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Developer Token Login
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${devTokensOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <form onSubmit={handleDevTokenLogin} className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  For testing with existing API tokens
                </p>

                <div className="space-y-2">
                  <Label htmlFor="dev-access-token">Access Token *</Label>
                  <Input
                    id="dev-access-token"
                    type="password"
                    placeholder="eyJhbGc..."
                    value={accessToken}
                    onChange={(e) => setAccessTokenInput(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-refresh-token">Refresh Token</Label>
                  <Input
                    id="dev-refresh-token"
                    type="password"
                    placeholder="Optional"
                    value={refreshToken}
                    onChange={(e) => setRefreshToken(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dev-user-id">User ID *</Label>
                  <Input
                    id="dev-user-id"
                    type="text"
                    placeholder="user-uuid"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full">
                  Login with Tokens
                </Button>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiBotLogin;
