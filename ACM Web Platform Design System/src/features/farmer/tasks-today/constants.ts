import {
    Droplets,
    Sprout,
    ShowerHead,
    Search as SearchIcon,
    Eye,
    Package,
} from 'lucide-react';
import { TaskType, TaskTypeConfig } from './types';

export const TASK_TYPES: Record<TaskType, TaskTypeConfig> = {
    irrigate: { label: 'Irrigate', icon: Droplets, color: 'var(--secondary)' },
    fertilize: { label: 'Fertilize', icon: Sprout, color: 'var(--primary)' },
    spray: { label: 'Spray', icon: ShowerHead, color: 'var(--accent)' },
    weed: { label: 'Weed', icon: SearchIcon, color: 'var(--muted-foreground)' },
    scout: { label: 'Scout', icon: Eye, color: 'var(--secondary)' },
    harvest: { label: 'Harvest', icon: Package, color: 'var(--destructive)' },
};



