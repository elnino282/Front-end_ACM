import { ChevronDown, User, Settings, Sun, Moon, Monitor, Globe, LogOut } from 'lucide-react';
import {
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/shared/ui';
import type { ProfileMenuProps, Theme, Language } from '../model/types';

/**
 * ProfileMenu Component
 * 
 * User profile dropdown menu with settings, preferences, and sign out.
 * Includes theme switcher and language selector.
 * 
 * Single Responsibility: User profile menu UI
 */
export function ProfileMenu({
    userName,
    userEmail,
    userAvatar,
    portalType,
    theme,
    language,
    onThemeChange,
    onLanguageChange,
    onViewChange,
    onLogout,
}: ProfileMenuProps) {
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 text-white hover:bg-white/10">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback className="bg-white/20 text-white backdrop-blur-sm">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-white">{userName}</div>
                        <div className="text-xs text-white/70">{portalType}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onViewChange('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Theme Switch */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        {theme === 'light' && <Sun className="w-4 h-4 mr-2" />}
                        {theme === 'dark' && <Moon className="w-4 h-4 mr-2" />}
                        {theme === 'system' && <Monitor className="w-4 h-4 mr-2" />}
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => onThemeChange(v as Theme)}>
                            <DropdownMenuRadioItem value="light">
                                <Sun className="w-4 h-4 mr-2" />
                                Light
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                                <Moon className="w-4 h-4 mr-2" />
                                Dark
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                                <Monitor className="w-4 h-4 mr-2" />
                                System
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Language Switch */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
                            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="vi">Vietnamese</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

