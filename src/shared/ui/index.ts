// Shared UI Components - Public API
// Design system primitives with no domain knowledge

// Button
export { Button, buttonVariants } from "./button";

// BackButton (standardized navigation)
export { BackButton, type BackButtonProps } from "./back-button";

// Input
export { Input } from "./input";

// Label
export { Label } from "./label";

// Badge
export { Badge, badgeVariants } from "./badge";

// Card
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

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
} from "./dialog";

// DropdownMenu
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// Tooltip
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Separator
export { Separator } from "./separator";

// Sheet
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

// ScrollArea
export { ScrollArea, ScrollBar } from "./scroll-area";

// Avatar
export { Avatar, AvatarFallback, AvatarImage } from "./avatar";

// Breadcrumb
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

// Checkbox
export { Checkbox } from "./checkbox";

// Switch
export { Switch } from "./switch";

// Progress
export { Progress } from "./progress";

// Skeleton
export { Skeleton } from "./skeleton";

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
} from "./select";

// Tabs
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

// Table
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// Accordion
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

// Alert
export { Alert, AlertDescription, AlertTitle } from "./alert";

// Alert Dialog
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

// Aspect Ratio
export { AspectRatio } from "./aspect-ratio";

// Calendar
export { Calendar } from "./calendar";

// Carousel
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./carousel";

// Chart
export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";

// Collapsible
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

// Command
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

// Context Menu
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

// Drawer
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

// Form
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";

// Hover Card
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

// Input OTP
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

// Menubar
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar";

// Navigation Menu
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

// Pagination
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

// Popover
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

// Radio Group
export { RadioGroup, RadioGroupItem } from "./radio-group";

// Resizable
export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

// Slider
export { Slider } from "./slider";

// Sonner
export { Toaster } from "./sonner";

// Textarea
export { Textarea } from "./textarea";

// Toggle
export { Toggle, toggleVariants } from "./toggle";

// Toggle Group
export { ToggleGroup, ToggleGroupItem } from "./toggle-group";

// Error Boundary (for hybrid error handling)
export { ErrorBoundary, QueryError } from "./error-boundary";

// Address Selector (Vietnamese address cascade)
export {
  AddressDisplay,
  AddressSelector,
  useAddressDisplay,
  useVietnameseAddress,
} from "./address-selector";
export type {
  AddressDisplayProps,
  AddressSelectorProps,
  AddressValue,
} from "./address-selector";

// Page Header
export { PageHeader } from "./page-header";
export type { PageHeaderProps } from "./page-header";

// Page Container
export { PageContainer } from "./page-container";
export type { PageContainerProps } from "./page-container";

// Async State (Loading/Empty/Error)
export { AsyncState } from "./async-state";
export type { AsyncStateProps } from "./async-state";

// Confirm Dialog
export { ConfirmDialog } from "./confirm-dialog";
export type { ConfirmDialogProps } from "./confirm-dialog";

// Data Table Pagination
export { DataTablePagination } from "./data-table-pagination";
export type { DataTablePaginationProps } from "./data-table-pagination";

// Typography
export {
  Caption,
  H1,
  H2,
  H3,
  H4,
  Small,
  Text,
  Typography,
  typographyVariants,
} from "./typography";
export type { TypographyProps } from "./typography";
