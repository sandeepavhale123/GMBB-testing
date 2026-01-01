import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyInfo } from '../../types';

interface CompanyInfoFormProps {
  companyInfo: CompanyInfo;
  onChange: (field: keyof CompanyInfo, value: string) => void;
}

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({
  companyInfo,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Company Information</CardTitle>
        <CardDescription>Add structured information about your company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Row 1: Company Name, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              placeholder="Acme Corporation"
              value={companyInfo.company_name}
              onChange={(e) => onChange('company_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@company.com"
              value={companyInfo.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Phone Number, Contact Person */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              placeholder="+1 (555) 123-4567"
              value={companyInfo.phone_number}
              onChange={(e) => onChange('phone_number', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              placeholder="John Doe"
              value={companyInfo.contact_person}
              onChange={(e) => onChange('contact_person', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Company Address, Logo URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_address">Company Address</Label>
            <Input
              id="company_address"
              placeholder="123 Main St, City, Country"
              value={companyInfo.company_address}
              onChange={(e) => onChange('company_address', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              placeholder="https://company.com/logo.png"
              value={companyInfo.logo_url}
              onChange={(e) => onChange('logo_url', e.target.value)}
            />
          </div>
        </div>

        {/* Row 4: Established Date, Industry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="established_date">Established Date</Label>
            <Input
              id="established_date"
              placeholder="2010"
              value={companyInfo.established_date}
              onChange={(e) => onChange('established_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="Technology"
              value={companyInfo.industry}
              onChange={(e) => onChange('industry', e.target.value)}
            />
          </div>
        </div>

        {/* Row 5: Website, Business Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://company.com"
              value={companyInfo.website}
              onChange={(e) => onChange('website', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_hours">Business Hours</Label>
            <Input
              id="business_hours"
              placeholder="Mon-Fri 9AM-5PM"
              value={companyInfo.business_hours}
              onChange={(e) => onChange('business_hours', e.target.value)}
            />
          </div>
        </div>

        {/* Row 6: Social Media Links */}
        <div className="space-y-2">
          <Label htmlFor="social_media_links">Social Media Links</Label>
          <Input
            id="social_media_links"
            placeholder="Twitter: @company, LinkedIn: company"
            value={companyInfo.social_media_links}
            onChange={(e) => onChange('social_media_links', e.target.value)}
          />
        </div>

        {/* Full width textareas */}
        <div className="space-y-2">
          <Label htmlFor="company_profile">Company Profile</Label>
          <Textarea
            id="company_profile"
            placeholder="Brief description of your company..."
            value={companyInfo.company_profile}
            onChange={(e) => onChange('company_profile', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_description">Product Description</Label>
          <Textarea
            id="product_description"
            placeholder="Describe your products..."
            value={companyInfo.product_description}
            onChange={(e) => onChange('product_description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_description">Service Description</Label>
          <Textarea
            id="service_description"
            placeholder="Describe your services..."
            value={companyInfo.service_description}
            onChange={(e) => onChange('service_description', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
