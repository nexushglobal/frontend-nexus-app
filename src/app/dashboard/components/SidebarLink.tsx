import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/menu.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Banknote,
  BarChart,
  BarChart2,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Crown,
  DollarSign,
  History,
  Home,
  Layers,
  Medal,
  PlaneTakeoff,
  Settings,
  Trophy,
  User,
  UserCog,
  Users,
  UsersRound,
  Wallet,
  ShoppingBag,
  Package,
  ShoppingCart,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ICON_MAPPING = {
  // Elementos principales
  dashboard: Home,
  profile: User,
  money: Wallet,
  wallet: CreditCard,

  // Membresía
  membership: Crown,
  "membership-plan": PlaneTakeoff,
  "my-plan": ClipboardCheck,
  reconsumos: Award,

  // Puntos
  points: Award,
  history: History,
  chart: BarChart,

  // Rangos
  ranks: Medal,
  "all-ranks": Layers,
  "my-ranks": Trophy,

  // Equipo
  team: Users,

  // Tienda
  store: ShoppingBag,
  products: Package,
  cart: ShoppingCart,
  orders: Receipt,

  // Admin
  users: UserCog,
  "membership-admin": Settings,
  "payments-admin": DollarSign,
  "withdrawals-admin": Banknote,
  "points-admin": Award,
  "ranks-admin": BarChart2,
  "team-admin": UsersRound,
};

type Props = {
  item: MenuItem;
  isCollapsed: boolean;
  isNested?: boolean;
};

const SidebarLink = ({ item, isCollapsed, isNested = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const Icon = ICON_MAPPING[item.icon as keyof typeof ICON_MAPPING] || Home;

  const isActive = item.url && pathname === item.url;
  const isChildActive = item.children?.some(
    (child) => child.url && pathname === child.url
  );

  const getActiveStyles = () => {
    if (isActive || isChildActive) {
      return {
        position: 'relative' as const,
        backgroundColor: 'var(--nav-item-selected)',
        color: 'var(--nav-item-selected-foreground)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          backgroundColor: 'var(--nav-item-active)',
          borderRadius: '0 4px 4px 0',
        }
      };
    }
    return {};
  };

  const LinkContent = () => (
    <motion.div
      className={cn(
        "flex items-center gap-3",
        isCollapsed && "justify-center w-full"
      )}
      initial={false}
      animate={{ x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Icon
        size={20}
        className="transition-colors duration-200"
        style={{
          color: isActive || isChildActive
            ? 'var(--nav-item-selected-foreground)'
            : 'var(--nav-item-foreground)'
        }}
      />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap overflow-hidden transition-colors duration-200"
            style={{
              color: isActive || isChildActive
                ? 'var(--nav-item-selected-foreground)'
                : 'var(--nav-item-foreground)'
            }}
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.children?.length > 0) {
    const TriggerContent = () => (
      <div
        className={cn(
          "flex items-center w-full",
          !isCollapsed && "justify-between",
          isCollapsed && "justify-center"
        )}
      >
        <LinkContent />
        {!isCollapsed && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: (isActive || isChildActive || isOpen)
                ? 'var(--nav-item-selected-foreground)'
                : 'var(--nav-item-foreground)'
            }}
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </div>
    );

    return (
      <Collapsible
        open={isOpen || isChildActive}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <div className="w-full">
                <CollapsibleTrigger asChild>
                  <motion.div
                    className="w-full p-2 rounded-r-md relative transition-all"
                    style={{
                      ...getActiveStyles(),
                    }}
                    whileHover={{
                      backgroundColor: 'var(--nav-item-hover)',
                    }}
                  >
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <TriggerContent />
                      </div>
                    </TooltipTrigger>
                  </motion.div>
                </CollapsibleTrigger>
                <TooltipContent
                  side="right"
                  className="bg-layout-sidebar border-sidebar-border"
                >
                  <p className="font-medium text-layout-sidebar-foreground">{item.name}</p>
                  <div
                    className="h-px w-full my-1"
                    style={{ backgroundColor: 'var(--sidebar-border)' }}
                  />
                  <div className="text-xs text-layout-sidebar-foreground opacity-70">
                    Submenú disponible
                  </div>
                </TooltipContent>
              </div>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <CollapsibleTrigger asChild>
            <motion.button
              className="flex w-full p-2 rounded-r-md relative transition-all"
              style={getActiveStyles()}
              whileHover={{
                backgroundColor: 'var(--nav-item-hover)',
              }}
            >
              <TriggerContent />
            </motion.button>
          </CollapsibleTrigger>
        )}
        <CollapsibleContent>
          <AnimatePresence>
            {(isOpen || isChildActive) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "w-full",
                  !isCollapsed && "pl-2",
                  isCollapsed && "border-l"
                )}
                style={isCollapsed ? { borderLeftColor: 'var(--sidebar-separator)' } : {}}
              >
                {item.children.map((child) => (
                  <SidebarLink
                    key={child.id}
                    item={child}
                    isCollapsed={isCollapsed}
                    isNested={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const linkClassName = cn(
    "flex w-full p-2 rounded-r-md relative transition-all",
    isCollapsed ? "justify-center" : "items-center gap-3",
    isNested && {
      "ml-2": !isCollapsed,
      "": isCollapsed,
    }
  );

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      whileHover={{ x: isCollapsed ? 0 : 2 }}
      transition={{ duration: 0.2 }}
      className="w-full overflow-hidden relative"
    >
      {children}
    </motion.div>
  );

  const MainContent = () => (
    <LinkWrapper>
      {item.url ? (
        <Link
          href={item.url}
          className={cn(
            linkClassName,
            "hover:bg-[var(--nav-item-hover)]"
          )}
          style={{
            ...getActiveStyles(),
          }}
        >
          <LinkContent />
        </Link>
      ) : (
        <motion.div
          className={linkClassName}
          style={getActiveStyles()}
          whileHover={{
            backgroundColor: 'var(--nav-item-hover)',
          }}
        >
          <LinkContent />
        </motion.div>
      )}
    </LinkWrapper>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <MainContent />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-layout-sidebar border-sidebar-border text-layout-sidebar-foreground"
        >
          <p>{item.name}</p>
          {isNested && (
            <p className="text-xs opacity-70">Elemento del submenú</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <MainContent />
  );
};

export default SidebarLink;