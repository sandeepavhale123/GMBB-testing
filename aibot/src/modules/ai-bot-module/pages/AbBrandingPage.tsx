import React, { useState, useEffect } from 'react';
import { useAbUserBranding } from '../hooks/useAbUserBranding';
import { AbLogoUploader } from '../components/branding/AbLogoUploader';
import { AbColorPicker } from '../components/branding/AbColorPicker';
import { AbPoweredBySettings } from '../components/branding/AbPoweredBySettings';
import { AbDomainSettings } from '../components/branding/AbDomainSettings';
import { AbLoginPreview } from '../components/branding/AbLoginPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Palette, Globe, MessageSquare, LogIn, Building } from 'lucide-react';
import { AbBrandingFormData, DEFAULT_BRANDING } from '../types/branding';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const AbBrandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { branding, isLoading, upsertBranding, verifyDomain } = useAbUserBranding();

  // Check Supabase auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Form state
  const [formData, setFormData] = useState<AbBrandingFormData>({
    ...DEFAULT_BRANDING,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with branding data
  useEffect(() => {
    if (branding) {
      setFormData({
        logo_url: branding.logo_url,
        favicon_url: branding.favicon_url,
        company_name: branding.company_name,
        primary_color: branding.primary_color,
        secondary_color: branding.secondary_color,
        background_color: branding.background_color,
        custom_domain: branding.custom_domain,
        show_powered_by: branding.show_powered_by,
        powered_by_text: branding.powered_by_text,
        powered_by_url: branding.powered_by_url,
        login_title: branding.login_title,
        login_description: branding.login_description,
      });
    }
  }, [branding]);

  const updateField = <K extends keyof AbBrandingFormData>(
    key: K,
    value: AbBrandingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await upsertBranding.mutateAsync(formData);
    setHasChanges(false);
  };

  const handleVerifyDomain = () => {
    verifyDomain.mutate();
  };

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Please log in to manage branding</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">White Label & Branding</h1>
          <p className="text-muted-foreground">
            Customize your branding across all workspaces and bots
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={upsertBranding.isPending}>
            {upsertBranding.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Identity
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="widget" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Widget
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </TabsTrigger>
        </TabsList>

        {/* Identity Tab */}
        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Upload your logo and set your company name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AbLogoUploader
                label="Logo"
                value={formData.logo_url || null}
                onChange={(url) => updateField('logo_url', url)}
                workspaceId={user.id}
                type="logo"
                description="Recommended size: 200x50px, PNG or SVG"
              />

              <AbLogoUploader
                label="Favicon"
                value={formData.favicon_url || null}
                onChange={(url) => updateField('favicon_url', url)}
                workspaceId={user.id}
                type="favicon"
                description="32x32px, PNG or ICO"
              />

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the colors used throughout your branded experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AbColorPicker
                  label="Primary Color"
                  value={formData.primary_color || '#3B82F6'}
                  onChange={(value) => updateField('primary_color', value)}
                  description="Main brand color for buttons and accents"
                />

                <AbColorPicker
                  label="Secondary Color"
                  value={formData.secondary_color || '#1E40AF'}
                  onChange={(value) => updateField('secondary_color', value)}
                  description="Secondary accent color"
                />

                <AbColorPicker
                  label="Background Color"
                  value={formData.background_color || '#FFFFFF'}
                  onChange={(value) => updateField('background_color', value)}
                  description="Login page background"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain">
          <AbDomainSettings
            customDomain={formData.custom_domain || null}
            domainVerified={branding?.domain_verified || false}
            verificationToken={branding?.domain_verification_token || null}
            onDomainChange={(value) => updateField('custom_domain', value || null)}
            onVerifyDomain={handleVerifyDomain}
            isVerifying={verifyDomain.isPending}
          />
        </TabsContent>

        {/* Widget Tab */}
        <TabsContent value="widget">
          <AbPoweredBySettings
            showPoweredBy={formData.show_powered_by ?? true}
            poweredByText={formData.powered_by_text || 'Powered by GMBBriefcase'}
            poweredByUrl={formData.powered_by_url || 'https://gmbbriefcase.com'}
            onShowPoweredByChange={(value) => updateField('show_powered_by', value)}
            onPoweredByTextChange={(value) => updateField('powered_by_text', value)}
            onPoweredByUrlChange={(value) => updateField('powered_by_url', value)}
          />
        </TabsContent>

        {/* Login Tab */}
        <TabsContent value="login">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Page Content</CardTitle>
                <CardDescription>
                  Customize the text shown on your login page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-title">Title</Label>
                  <Input
                    id="login-title"
                    value={formData.login_title || ''}
                    onChange={(e) => updateField('login_title', e.target.value)}
                    placeholder="AI Bot"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-description">Description</Label>
                  <Input
                    id="login-description"
                    value={formData.login_description || ''}
                    onChange={(e) => updateField('login_description', e.target.value)}
                    placeholder="Sign in to manage your AI bots"
                  />
                </div>
              </CardContent>
            </Card>

            <AbLoginPreview
              logoUrl={formData.logo_url || null}
              companyName={formData.company_name || null}
              primaryColor={formData.primary_color || '#3B82F6'}
              backgroundColor={formData.background_color || '#FFFFFF'}
              loginTitle={formData.login_title || 'AI Bot'}
              loginDescription={formData.login_description || 'Sign in to manage your AI bots'}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AbBrandingPage;
