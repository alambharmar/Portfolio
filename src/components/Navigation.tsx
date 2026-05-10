import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { User, Layers, Calendar, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function Navigation() {
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { path: "/", icon: User, label: "About" },
    { path: "/projects", icon: Layers, label: "Projects & Skills" },
    { path: "/booking", icon: Calendar, label: "Book" }
  ];

  if (user?.email === "admin@gmail.com") {
    navItems.push({ path: "/admin", icon: Settings, label: "Admin" });
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-1.5 rounded-full liquid-glass flex items-center gap-1 sm:gap-2"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className="relative px-5 sm:px-6 py-3 rounded-full flex items-center gap-2 outline-none group"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/15 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#86868b] group-hover:text-white/80'}`} />
            <span className={`text-sm font-medium relative z-10 transition-colors duration-300 hidden sm:block ${isActive ? 'text-white' : 'text-[#86868b] group-hover:text-white/80'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
}
