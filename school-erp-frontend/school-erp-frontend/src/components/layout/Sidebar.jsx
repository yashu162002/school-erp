import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserRound,
  UsersRound,
  CalendarCheck,
  ClipboardList,
  Megaphone,
  Bell,
  PhoneCall,
  ChevronRight,
  Receipt,
  FileText,
  FolderOpen,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";

const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/parents", label: "Parents", icon: UsersRound },
  { to: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { to: "/admin/teachers", label: "Teachers", icon: UserRound },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/results", label: "Results", icon: ClipboardList },
  { to: "/admin/exams", label: "Exams", icon: FileText },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/voice-calls", label: "Voice Calls", icon: PhoneCall },
  { to: "/admin/fees", label: "Fees", icon: Receipt },
];

const STUDENT_NAV_ITEMS = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/profile", label: "My Profile", icon: UserRound },
  { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/student/timetable", label: "Exam Timetable", icon: ClipboardList },
  { to: "/student/hall-ticket", label: "Hall Ticket", icon: FileText },
  { to: "/student/results", label: "Results", icon: ClipboardList },
  { to: "/student/fees", label: "Fees", icon: Receipt },
  { to: "/student/documents", label: "Documents", icon: FolderOpen },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
];

export function Sidebar({ className, collapsed = false, onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user } = useAuth();
  
  const navItems = user?.role === "student" ? STUDENT_NAV_ITEMS : ADMIN_NAV_ITEMS;

  return (
    <nav 
      className={cn(
        "flex flex-col gap-1 p-4 bg-background/50 backdrop-blur-sm",
        className
      )}
    >
      {navItems.map(({ to, label, icon: Icon, badge }, index) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          title={collapsed ? label : undefined}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-300 ease-in-out",
              "hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent",
              "hover:scale-[1.02] hover:shadow-sm",
              isActive 
                ? "bg-gradient-to-r from-primary/15 to-transparent text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-0",
              // Active indicator glow
              isActive && "ring-1 ring-primary/20"
            )
          }
        >
          {({ isActive }) => (
            <>
              {/* Active indicator - animated bar */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300",
                  isActive 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-100"
                )}
              />
              
              {/* Icon with hover animation */}
              <span className="relative">
                <Icon 
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive && "text-primary",
                    !collapsed && "group-hover:scale-110 group-hover:rotate-[-5deg]"
                  )}
                />
                {isActive && (
                  <span className="absolute -inset-1 animate-ping rounded-full bg-primary/20 opacity-75" />
                )}
              </span>
              
              {!collapsed && (
                <>
                  <span className="flex-1 truncate transition-colors duration-200">
                    {label}
                  </span>
                  
                  {/* Badge with animation */}
                  {badge && (
                    <span className="animate-in fade-in slide-in-from-right-2 duration-300 rounded-full bg-gradient-to-r from-warning/20 to-warning/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning ring-1 ring-warning/20">
                      {badge}
                    </span>
                  )}
                  
                  {/* Arrow indicator on hover */}
                  <ChevronRight 
                    className={cn(
                      "h-3.5 w-3.5 transition-all duration-300 opacity-0",
                      "group-hover:opacity-100 group-hover:translate-x-0.5",
                      isActive && "opacity-100 text-primary"
                    )}
                  />
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
      
      {/* Decorative gradient line at bottom */}
      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-full" />
      </div>
    </nav>
  );
}