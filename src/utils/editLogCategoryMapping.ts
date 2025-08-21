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
  bgColor: string;
  iconColor: string;
  borderColor: string;
  textColor: string;
}

export const categoryMappings: Record<string, CategoryMapping> = {
  locationName: {
    label: 'Business Name',
    icon: Building,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  address: {
    label: 'Address',
    icon: MapPin,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  city: {
    label: 'Postal Code',
    icon: Mail,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  state: {
    label: 'State',
    icon: Map,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700'
  },
  country: {
    label: 'Country',
    icon: Globe,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700'
  },
  website: {
    label: 'Website',
    icon: ExternalLink,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700'
  },
  category: {
    label: 'Primary Category',
    icon: Tag,
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  adcategory: {
    label: 'Additional Categories',
    icon: FolderOpen,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700'
  },
  phone: {
    label: 'Primary Phone',
    icon: Phone,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700'
  },
  additionalPhones: {
    label: 'Additional Phones',
    icon: PhoneCall,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700'
  },
  storeCode: {
    label: 'Store Code',
    icon: Store,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  labels: {
    label: 'Labels',
    icon: Tags,
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700'
  },
  description: {
    label: 'Description',
    icon: FileText,
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700'
  }
};

export const getCategoryMapping = (category: string): CategoryMapping => {
  return categoryMappings[category] || {
    label: category,
    icon: Tag,
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700'
  };
};