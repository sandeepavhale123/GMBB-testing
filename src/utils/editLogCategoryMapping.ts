import {
  Building,
  MapPin,
  Mail,
  Map,
  Globe,
  ExternalLink,
  Tag,
  FolderOpen,
  Phone,
  PhoneCall,
  Store,
  Tags,
  FileText,
  LucideIcon
} from 'lucide-react';

export interface CategoryMapping {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const categoryMappings: Record<string, CategoryMapping> = {
  locationName: {
    label: 'Business Name',
    icon: Building,
    color: 'hsl(var(--primary))'
  },
  address: {
    label: 'Address',
    icon: MapPin,
    color: 'hsl(var(--secondary))'
  },
  city: {
    label: 'Postal Code',
    icon: Mail,
    color: 'hsl(var(--accent))'
  },
  state: {
    label: 'State',
    icon: Map,
    color: 'hsl(var(--muted))'
  },
  country: {
    label: 'Country',
    icon: Globe,
    color: 'hsl(var(--primary))'
  },
  website: {
    label: 'Website',
    icon: ExternalLink,
    color: 'hsl(var(--secondary))'
  },
  category: {
    label: 'Primary Category',
    icon: Tag,
    color: 'hsl(var(--accent))'
  },
  adcategory: {
    label: 'Additional Categories',
    icon: FolderOpen,
    color: 'hsl(var(--muted))'
  },
  phone: {
    label: 'Primary Phone',
    icon: Phone,
    color: 'hsl(var(--primary))'
  },
  additionalPhones: {
    label: 'Additional Phones',
    icon: PhoneCall,
    color: 'hsl(var(--secondary))'
  },
  storeCode: {
    label: 'Store Code',
    icon: Store,
    color: 'hsl(var(--accent))'
  },
  labels: {
    label: 'Labels',
    icon: Tags,
    color: 'hsl(var(--muted))'
  },
  description: {
    label: 'Description',
    icon: FileText,
    color: 'hsl(var(--primary))'
  }
};

export const getCategoryMapping = (category: string): CategoryMapping => {
  return categoryMappings[category] || {
    label: category,
    icon: Tag,
    color: 'hsl(var(--muted))'
  };
};