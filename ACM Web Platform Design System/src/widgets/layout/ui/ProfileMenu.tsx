import { useI18n } from '@/hooks/useI18n';
import { changeLanguage, type SupportedLocale } from '@/i18n';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/shared/ui';
import { Check, ChevronDown, Globe, LogOut, Monitor, Moon, Settings, Sun, User } from 'lucide-react';
import type { Language, ProfileMenuProps, Theme } from '../model/types';

/**
 * ProfileMenu Component
 * 
 * User profile dropdown menu with settings, preferences, and sign out.
 * Includes theme switcher and language selector with i18n support.
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
    const { t, locale } = useI18n();
    
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('');

    // Handle language change with i18n integration
    const handleLanguageChange = async (value: string) => {
        const newLocale = value === 'vi' ? 'vi-VN' : 'en-US';
        await changeLanguage(newLocale as SupportedLocale);
        onLanguageChange(value as Language);
    };

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
                    {t('userMenu.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewChange('settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {t('userMenu.preferences')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Theme Switch */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        {theme === 'light' && <Sun className="w-4 h-4 mr-2" />}
                        {theme === 'dark' && <Moon className="w-4 h-4 mr-2" />}
                        {theme === 'system' && <Monitor className="w-4 h-4 mr-2" />}
                        {t('userMenu.theme')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => onThemeChange(v as Theme)}>
                            <DropdownMenuRadioItem value="light">
                                <Sun className="w-4 h-4 mr-2" />
                                {t('userMenu.themeLight')}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">
                                <Moon className="w-4 h-4 mr-2" />
                                {t('userMenu.themeDark')}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="system">
                                <Monitor className="w-4 h-4 mr-2" />
                                {t('userMenu.themeSystem')}
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Language Switch */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="w-4 h-4 mr-2" />
                        {t('userMenu.language')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                            <DropdownMenuRadioItem value="en">
                                {locale === 'en-US' && <Check className="w-4 h-4 mr-2" />}
                                {t('userMenu.languageEnglish')}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="vi">
                                {locale === 'vi-VN' && <Check className="w-4 h-4 mr-2" />}
                                {t('userMenu.languageVietnamese')}
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('userMenu.signOut')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

