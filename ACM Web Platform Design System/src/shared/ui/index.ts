// Shared UI Components - Public API
// Design system primitives with no domain knowledge

// Button
export { Button, buttonVariants } from './button';

// Input
export { Input } from './input';

// Label
export { Label } from './label';

// Badge
export { Badge, badgeVariants } from './badge';

// Card
export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
} from './card';

// Dialog
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from './dialog';

// DropdownMenu
export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from './dropdown-menu';

// Tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';

// Separator
export { Separator } from './separator';

// Sheet
export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from './sheet';

// ScrollArea
export { ScrollArea, ScrollBar } from './scroll-area';

// Avatar
export { Avatar, AvatarImage, AvatarFallback } from './avatar';

// Breadcrumb
export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from './breadcrumb';

// Checkbox
export { Checkbox } from './checkbox';

// Switch
export { Switch } from './switch';

// Progress
export { Progress } from './progress';

// Skeleton
export { Skeleton } from './skeleton';

// Select
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './select';

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

// Table
export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from './table';

// Accordion
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

// Alert
export { Alert, AlertTitle, AlertDescription } from './alert';

// Alert Dialog
export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from './alert-dialog';

// Aspect Ratio
export { AspectRatio } from './aspect-ratio';

// Calendar
export { Calendar } from './calendar';

// Carousel
export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from './carousel';

// Chart
export {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
} from './chart';

// Collapsible
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

// Command
export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
} from './command';

// Context Menu
export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuRadioGroup,
} from './context-menu';

// Drawer
export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
} from './drawer';

// Form
export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from './form';

// Hover Card
export { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';

// Input OTP
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './input-otp';

// Menubar
export {
    Menubar,
    MenubarPortal,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarGroup,
    MenubarSeparator,
    MenubarLabel,
    MenubarItem,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
} from './menubar';

// Navigation Menu
export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from './navigation-menu';

// Pagination
export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from './pagination';

// Popover
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './popover';

// Radio Group
export { RadioGroup, RadioGroupItem } from './radio-group';

// Resizable
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';

// Slider
export { Slider } from './slider';

// Sonner
export { Toaster } from './sonner';

// Textarea
export { Textarea } from './textarea';

// Toggle
export { Toggle, toggleVariants } from './toggle';

// Toggle Group
export { ToggleGroup, ToggleGroupItem } from './toggle-group';

// Error Boundary (for hybrid error handling)
export { ErrorBoundary, QueryError } from './error-boundary';

// Address Selector (Vietnamese address cascade)
export { AddressSelector, AddressDisplay, useVietnameseAddress, useAddressDisplay } from './address-selector';
export type { AddressSelectorProps, AddressDisplayProps, AddressValue } from './address-selector';

// Page Header
export { PageHeader } from './page-header';
export type { PageHeaderProps } from './page-header';

// Page Container
export { PageContainer } from './page-container';
export type { PageContainerProps } from './page-container';

// Async State (Loading/Empty/Error)
export { AsyncState } from './async-state';
export type { AsyncStateProps } from './async-state';

// Confirm Dialog
export { ConfirmDialog } from './confirm-dialog';
export type { ConfirmDialogProps } from './confirm-dialog';

// Data Table Pagination
export { DataTablePagination } from './data-table-pagination';
export type { DataTablePaginationProps } from './data-table-pagination';

// Typography
export { Typography, typographyVariants, H1, H2, H3, H4, Text, Small, Caption } from './typography';
export type { TypographyProps } from './typography';
