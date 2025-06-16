import React, { useEffect, useState } from 'react';
import { Menu, Bell, Settings, Moon, Sun, Filter, Search, ChevronDown, MapPin, Check, User, LogOut, Plus, Store, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { toggleTheme } from '../store/slices/themeSlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";


interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  showFilters?: boolean;
  onShowFilters?: () => void;
}

const businessListings = [
  {
    id: "1",
    name: "Downtown Coffee Shop",
    address: "123 Main St, NYC",
    type: "Restaurant",
    status: "Active",
  },
  {
    id: "2",
    name: "Uptown Bakery",
    address: "456 Park Ave, NYC",
    type: "Bakery",
    status: "Active",
  },
  {
    id: "3",
    name: "Westside Restaurant",
    address: "789 West St, NYC",
    type: "Restaurant",
    status: "Pending",
  },
  {
    id: "4",
    name: "East End Boutique",
    address: "321 East Ave, NYC",
    type: "Retail",
    status: "Active",
  },
  {
    id: "5",
    name: "Central Gym & Fitness",
    address: "555 Central Blvd, NYC",
    type: "Fitness",
    status: "Active",
  },
];

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title,
  showFilters,
  onShowFilters,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useAppSelector((state) => state.theme);
  const [greeting, setGreeting] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(businessListings[0]);
  const [open, setOpen] = useState(false);
  const { logout } = useAuthRedux();
  const [mobileListingOpen, setMobileListingOpen] = useState(false);
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddNewListing = () => {
    navigate('/settings');
  };

  const handleAccountSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left section */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-gray-100 p-2 shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">{greeting}, John!</span>
                  <span className="sm:hidden">John</span>
                </h1>
                <span className="text-base sm:text-lg shrink-0">👋</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                Manage your business listings with ease
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Mobile Business Listing Selector */}
          <div className="md:hidden">
            <Popover open={mobileListingOpen} onOpenChange={setMobileListingOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 p-2 border-gray-200 hover:bg-gray-50"
                >
                  <Store className="w-4 h-4 text-gray-500" />
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search listings..." />
                  <CommandEmpty>No listing found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {businessListings.map((business) => (
                        <CommandItem
                          key={business.id}
                          value={business.name}
                          onSelect={() => {
                            setSelectedBusiness(business);
                            setMobileListingOpen(false);
                          }}
                          className="flex items-center gap-3 p-3"
                        >
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
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Business Listings Selector - Desktop */}
          <div className="hidden md:block">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-60 lg:w-80 justify-between border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 flex-1 text-left min-w-0">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 truncate block">
                        {selectedBusiness.name}
                      </span>
                      <span className="text-xs text-gray-500 truncate block">
                        {selectedBusiness.address}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                      {selectedBusiness.type}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 lg:w-80 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search listings..." />
                  <CommandEmpty>No listing found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {businessListings.map((business) => (
                        <CommandItem
                          key={business.id}
                          value={business.name}
                          onSelect={() => {
                            setSelectedBusiness(business);
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 p-3"
                        >
                          <Check
                            className={`w-4 h-4 ${
                              selectedBusiness.id === business.id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
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
                            <div
                              className={`w-2 h-2 rounded-full ${
                                business.status === "Active"
                                  ? "bg-green-400"
                                  : "bg-yellow-400"
                              }`}
                            />
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Add New Listing Button */}
          <Button 
            variant="default"
            size="sm"
            onClick={handleAddNewListing}
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-3 py-2"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {/* Notification and Settings */}

          {/* <Button variant="ghost" size="sm" className="hover:bg-gray-100 p-2 relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 p-2 hidden sm:flex"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </Button> */}

          {/* User Avatar with Profile Dropdown */}
          <div className="flex items-center gap-2 ml-1 sm:ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 rounded-full hover:bg-gray-100"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-white font-semibold text-xs">JD</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white shadow-lg border"
              >
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleAccountSettings} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
