// SidebarNavItem.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavigationItem } from "../../../types/types";

interface SidebarNavItemProps {
    item: NavigationItem;
    isActive: boolean;
}

// Inline style untuk rounded-xl
const roundedStyle = {
    borderRadius: "0.75rem"
};

export function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group",
                isActive
                    ? "bg-[#4FC3F7] text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
            )}
            style={roundedStyle} // <- Terapkan inline style rounded-xl
        >
            <Icon
                className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                )}
            />

            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        "text-sm font-medium truncate transition-colors",
                        isActive ? "text-white" : "text-gray-900 group-hover:text-blue-700"
                    )}
                >
                    {item.title}
                </p>

                {item.description && (
                    <p
                        className={cn(
                            "text-xs truncate mt-0.5 transition-colors",
                            isActive ? "text-blue-100" : "text-gray-500 group-hover:text-blue-500"
                        )}
                    >
                        {item.description}
                    </p>
                )}
            </div>
        </Link>
    );
}