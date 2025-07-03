import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContent } from "../lib/contentLoader";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  User,
  LogOut,
  Settings,
  CreditCard,
  HelpCircle,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { isDarkMode } from "../lib/brandConfig";

interface LayoutProps {
  children: React.ReactNode;
}

// User states for testing different UI versions
type UserState = "visitor" | "registered-no-device" | "registered-with-device";

const USER_STATE_LABELS = {
  visitor: "First-Time Visitor",
  "registered-no-device": "Registered User (No Device)",
  "registered-with-device": "Registered User (Device Connected)",
};

// Create a context for user state management
const UserStateContext = createContext<{
  userState: UserState;
  setUserState: (state: UserState) => void;
}>({
  userState: "visitor",
  setUserState: () => { },
});

export const useUserState = () => useContext(UserStateContext);

const Layout = ({ children }: LayoutProps) => {
  // In a real implementation, this would load from your content configuration
  const { content } = useContent();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Clerk authentication
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // User state toggle for testing different UI versions
  const [userState, setUserState] = useState<UserState>(() => {
    // Check if user has signed up but not connected device
    const signupData = localStorage.getItem("userSignupData");
    if (signupData) {
      return "registered-no-device";
    }
    return "visitor";
  });
  const [showStateToggle, setShowStateToggle] = useState(true);

  useEffect(() => {
    // Initialize dark mode state
    setDarkMode(isDarkMode());

    // Listen for dark mode changes
    const observer = new MutationObserver(() => {
      setDarkMode(isDarkMode());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for user signup events
    const handleUserSignup = (event: CustomEvent) => {
      setUserState("registered-no-device");
    };

    window.addEventListener("userSignedUp", handleUserSignup as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener(
        "userSignedUp",
        handleUserSignup as EventListener,
      );
    };
  }, []);

  const getContent = (key: string, fallback: string) => {
    // Simple helper to get nested content values
    const keys = key.split(".");
    let value: any = content;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback;
  };

  const cityName = getContent("city_name", "Orangeburg");
  const companyName = `${cityName} Fiber`;
  const companyLogo = content?.company?.logo || "/orangeburg-fiber-logo.png";
  const companyLogoDark =
    content?.company?.logo_dark || "/orangeburg-fiber-logo-dark.png";
  const contactEmail =
    content?.company?.contact?.email || "help@orangeburgfiber.net";
  const contactPhone = content?.company?.contact?.phone || "(803) 973-0430";
  const contactAddress =
    content?.company?.contact?.address || "123 Main Street, Anytown, USA";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Plans & Services", path: "/plans" },
    { name: "Business Services", path: "/business" },
    { name: "Support", path: "/support" },
    { name: "Contact", path: "/contact" },
  ];

  const footerLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Accessibility", path: "/accessibility" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} />, url: "#" },
    { name: "Twitter", icon: <Twitter size={20} />, url: "#" },
    { name: "Instagram", icon: <Instagram size={20} />, url: "#" },
    { name: "LinkedIn", icon: <Linkedin size={20} />, url: "#" },
  ];

  const handleLogin = () => {
    navigate("/signup-flow");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserState("visitor");
      // Clear signup data on logout
      localStorage.removeItem("userSignupData");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignUp = () => {
    navigate("/check-availability");
  };

  // Get user data from Clerk or fallback to stored data
  const getUserData = () => {
    if (isSignedIn && user) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || user.primaryEmailAddress?.emailAddress || "User";
      const email = user.primaryEmailAddress?.emailAddress || "";
      const initials = firstName && lastName
        ? `${firstName[0]}${lastName[0]}`.toUpperCase()
        : fullName.substring(0, 2).toUpperCase();

      return {
        name: fullName,
        email: email,
        initials: initials,
      };
    }

    // Fallback to stored signup data
    const signupData = localStorage.getItem("userSignupData");
    if (signupData) {
      try {
        const parsed = JSON.parse(signupData);
        const nameParts = parsed.name.split(" ");
        const initials =
          nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : parsed.name.substring(0, 2).toUpperCase();
        return {
          name: parsed.name,
          email: parsed.email,
          initials: initials,
        };
      } catch (error) {
        console.error("Error parsing signup data:", error);
      }
    }

    return {
      name: "Guest User",
      email: "guest@example.com",
      initials: "GU",
    };
  };

  const userData = getUserData();

  // Determine UI state based on Clerk authentication
  const isLoggedIn = isSignedIn;
  const hasDeviceConnected = userState === "registered-with-device";
  const showMarketplace = hasDeviceConnected;

  // Cycle through user states for testing
  const cycleUserState = () => {
    const states: UserState[] = [
      "visitor",
      "registered-no-device",
      "registered-with-device",
    ];
    const currentIndex = states.indexOf(userState);
    const nextIndex = (currentIndex + 1) % states.length;
    setUserState(states[nextIndex]);
  };

  return (
    <UserStateContext.Provider value={{ userState, setUserState }}>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Development State Toggle */}
        {showStateToggle && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
            <div className="container flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  🧪 Development Mode:
                </span>
                <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  {USER_STATE_LABELS[userState]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleUserState}
                  className="bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
                >
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Switch State
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStateToggle(false)}
                  className="text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100"
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <img
                  src={darkMode ? companyLogoDark : companyLogo}
                  alt="Company logo"
                  className="h-10 w-auto max-w-[150px] object-contain rounded-sm"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={`nav-${item.path}-${index}`}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Navigation Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <DarkModeToggle />
              <Button variant="outline" size="sm" className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              <DarkModeToggle />
              {!isSignedIn ? (
                /* Not Signed In State */
                <>
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="bg-black text-white hover:bg-gray-800 border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleSignUp}
                    className="bg-brand-primary text-brand-primary-foreground hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                /* Signed In State */
                <>
                  {/* User Name Display */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-foreground">
                      {userData.name}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="text-sm"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {/* Welcome Message for Signed In Users */}
          {isSignedIn && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <div className="container py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Welcome back, {userData.name}!
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        You're signed in and ready to explore our services.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate("/my-account")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    My Account
                  </Button>
                </div>
              </div>
            </div>
          )}
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/40 dark:bg-dark-bg-secondary dark:border-dark-border">
          <div className="container py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Company Info */}
              <div className="space-y-4">
                <Link to="/" className="flex items-center">
                  <img
                    src={darkMode ? companyLogoDark : companyLogo}
                    alt={`${companyName} logo`}
                    className="h-8 w-auto max-w-[120px] object-contain"
                  />
                </Link>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{contactAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="flex-shrink-0" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Quick Links</h3>
                <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="hover:underline"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Legal</h3>
                <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  {footerLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="hover:underline"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Newsletter */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Stay Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe to our newsletter for updates on services,
                  promotions, and industry news.
                </p>
                <form className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </form>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      aria-label={social.name}
                      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
              <p>
                © {new Date().getFullYear()} {companyName}. All rights
                reserved.
              </p>
              <p>Designed and developed with care for our customers.</p>
            </div>
          </div>
        </footer>
      </div>
    </UserStateContext.Provider>
  );
};

export default Layout;
