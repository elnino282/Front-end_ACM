import { Search } from 'lucide-react';
import { Input } from '@/shared/ui';
import type { SearchBarProps } from '../model/types';

/**
 * SearchBar Component
 * 
 * Global search input field for cross-entity search.
 * Displays a search icon and handles user input.
 * 
 * Single Responsibility: Search input UI only
 */
export function SearchBar({ value, onChange, placeholder = 'Search plots, seasons, tasks, docs...' }: SearchBarProps) {
    return (
        <div className="relative hidden md:block w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
            />
        </div>
    );
}
