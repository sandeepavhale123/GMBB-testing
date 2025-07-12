import { PaintBrushIcon, GlobeIcon, PencilIcon, TelescopeIcon, LightbulbIcon } from './icons';

export interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  extra?: string;
}

export const toolsList: Tool[] = [
  {
    id: 'createImage',
    name: 'Create an image',
    shortName: 'Image',
    icon: PaintBrushIcon
  },
  {
    id: 'searchWeb',
    name: 'Search the web',
    shortName: 'Search',
    icon: GlobeIcon
  },
  {
    id: 'writeCode',
    name: 'Write or code',
    shortName: 'Write',
    icon: PencilIcon
  },
  {
    id: 'deepResearch',
    name: 'Run deep research',
    shortName: 'Deep Search',
    icon: TelescopeIcon,
    extra: '5 left'
  },
  {
    id: 'thinkLonger',
    name: 'Think for longer',
    shortName: 'Think',
    icon: LightbulbIcon
  }
];