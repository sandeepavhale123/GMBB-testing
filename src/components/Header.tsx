import React, { useEffect, useState } from 'react';
import { Menu, Bell, Settings, Moon, Sun, Filter, Search, ChevronDown, MapPin, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleTheme } from '../store/slices/themeSlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  showFilters?: boolean;
  onShowFilters?: () => void;
}
const businessListings = [{
  id: '1',
  name: 'Downtown Coffee Shop',
  address: '123 Main St, NYC',
  type: 'Restaurant',
  status: 'Active'
}, {
  id: '2',
  name: 'Uptown Bakery',
  address: '456 Park Ave, NYC',
  type: 'Bakery',
  status: 'Active'
}, {
  id: '3',
  name: 'Westside Restaurant',
  address: '789 West St, NYC',
  type: 'Restaurant',
  status: 'Pending'
}, {
  id: '4',
  name: 'East End Boutique',
  address: '321 East Ave, NYC',
  type: 'Retail',
  status: 'Active'
}, {
  id: '5',
  name: 'Central Gym & Fitness',
  address: '555 Central Blvd, NYC',
  type: 'Fitness',
  status: 'Active'
}];
export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
  showFilters,
  onShowFilters
}) => {
  const dispatch = useAppDispatch();
  const {
    isDark
  } = useAppSelector(state => state.theme);
  const [greeting, setGreeting] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(businessListings[0]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);
  return <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="hover:bg-gray-100 p-2">
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">{greeting}, John!</h1>
                <span className="text-lg">👋</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your business listings with ease
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Business Listings Selector with Search */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-80 justify-between border-gray-200 hover:bg-gray-50">
                <div className="flex items-center gap-2 flex-1 text-left">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700 truncate block">
                      {selectedBusiness.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate block">
                      {selectedBusiness.address}
                    </span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {selectedBusiness.type}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput placeholder="Search listings..." />
                <CommandEmpty>No listing found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {businessListings.map(business => <CommandItem key={business.id} value={business.name} onSelect={() => {
                    setSelectedBusiness(business);
                    setOpen(false);
                  }} className="flex items-center gap-3 p-3">
                        <Check className={`w-4 h-4 ${selectedBusiness.id === business.id ? 'opacity-100' : 'opacity-0'}`} />
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {business.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {business.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {business.type}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${business.status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        </div>
                      </CommandItem>)}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2">
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>

          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>;
};