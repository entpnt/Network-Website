import { useEffect, useState } from "react";

// Define types for content structure
type ContentVariable =
  | string
  | number
  | boolean
  | null
  | ContentObject
  | ContentArray;
type ContentObject = { [key: string]: ContentVariable };
type ContentArray = ContentVariable[];

interface ContentConfig {
  company: {
    name: string;
    logo: string;
    logo_dark: string;
    tagline: string;
    mission: string;
    domain: string;
    contact: {
      email: string;
      phone: string;
      phone_hours: string;
      address: string;
    };
    social: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  navigation: {
    home: string;
    how_it_works: string;
    plans: string;
    business: string;
    support: string;
    contact: string;
    portal_login: string;
    sign_up: string;
  };
  ui_text: {
    loading: string;
    view_plans: string;
    sign_up: string;
    check_availability: string;
    subscribe: string;
    your_email: string;
    stay_connected: string;
    newsletter_description: string;
    quick_links: string;
    legal: string;
    all_rights_reserved: string;
    designed_with_care: string;
    how_it_works_title: string;
    video_section_title: string;
    video_section_description: string;
    video_placeholder: string;
    embed_video_here: string;
    plan_cards_title: string;
    plan_cards_subtitle: string;
    whats_included_title: string;
    faq_title: string;
    per_month: string;
  };
  how_it_works: {
    steps: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  additional_features: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      heading: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
  };
  hero: {
    headline: string;
    subheadline: string;
    image: string;
    cta_text: string;
    cta_link: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  plans: Array<{
    name: string;
    price: string;
    speed: string;
    features: string[];
    cta_text: string;
    popular?: boolean;
  }>;

  business_page: {
    hero_image: string;
    hero_alt_text: string;
    small_title: string;
    main_title: string;
    sub_context: string;
    why_choose_title: string;
    why_choose_description: string;
    cta_button_text: string;
    blazing_fast_title: string;
    blazing_fast_description: string;
    blazing_fast_image: string;
    blazing_fast_alt_text: string;
    future_ready_title: string;
    future_ready_description: string;
    future_ready_image: string;
    future_ready_alt_text: string;
    city_name: string;
  };
  streaming: {
    title: string;
    description: string;
    image: string;
    quotes: Array<{
      text: string;
      author?: string;
    }>;
  };
  cta_section: {
    title: string;
    text: string;
    button_text: string;
    button_link: string;
  };
  footer: {
    links: Array<{
      title: string;
      url: string;
    }>;
    copyright: string;
  };
  pages: {
    [key: string]: {
      title: string;
      description: string;
      content: any; // This would be page-specific content
    };
  };
  check_availability_page: {
    hero_image: string;
    hero_alt_text: string;
    title: string;
    description: string;
    city_name: string;
    map_center: {
      lat: number;
      lng: number;
    };
    service_zones: Array<{
      id: string;
      name: string;
      status: "available" | "coming-soon" | "future";
      coordinates: Array<[number, number]>;
      color: string;
    }>;
  };
  how_it_works_page: {
    hero_image: string;
    hero_alt_text: string;
    content_image: string;
    content_alt_text: string;
    city_name: string;
  };
  providers: Array<{
    id: string;
    name: string;
    logo: string;
    plans: Array<{
      id: string;
      name: string;
      speed: string;
      price: string;
      features: string[];
      cta_text: string;
      popular?: boolean;
    }>;
  }>;
  plans_page: {
    hero_image: string;
    hero_alt_text: string;
    city_name: string;
  };
  support_page: {
    hero_image: string;
    hero_alt_text: string;
    title: string;
    subheader: string;
    city_name: string;
    cta_sections: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      link: string;
      subpage: {
        hero_image: string;
        hero_alt_text: string;
        title: string;
        description: string;
        content: string;
        cta_buttons: Array<{
          text: string;
          link: string;
        }>;
      };
    }>;
  };
}

// Default content configuration
const defaultContent: ContentConfig = {
  company: {
    name: "Orangeburg Fiber",
    logo: "/orangeburg-fiber-logo.png",
    logo_dark: "/orangeburg-fiber-logo-dark.png",
    tagline: "High-speed internet for modern living",
    mission:
      "Providing reliable, high-speed internet access to communities everywhere.",
    domain: "orangeburgfiber.com",
    contact: {
      email: "help@orangeburgfiber.net",
      phone: "(803) 973-0430",
      phone_hours: "Mon-Fri 8AM-8PM",
      address: "1949 West Printers Row, Salt Lake City, Utah 84119",
    },
    social: {
      facebook: "https://facebook.com/fiberconnect",
      twitter: "https://twitter.com/fiberconnect",
      instagram: "https://instagram.com/fiberconnect",
      linkedin: "https://linkedin.com/company/fiberconnect",
    },
  },
  city_name: "Orangeburg",
  theme: {
    colors: {
      primary: "#3B82F6",
      secondary: "#10B981",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#111827",
    },
    fonts: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
    },
    spacing: {
      small: "1rem",
      medium: "2rem",
      large: "4rem",
    },
  },
  hero: {
    headline: "A Community Focused Fiber Network",
    subheadline:
      "The first open access broadband network in South Carolina. Offering internet choice to Orangeburg through a marketplace of Internet Service Providers.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
    cta_text: "Check Availability",
    cta_link: "/check-availability",
  },
  features: [
    {
      title: "Blazing Fast Speeds",
      description: "Download, stream, and game with speeds up to 1 Gbps.",
      icon: "zap",
    },
    {
      title: "Reliable Connection",
      description: "99.9% uptime guarantee with our fiber network.",
      icon: "shield",
    },
    {
      title: "24/7 Support",
      description: "Our customer support team is always available to help.",
      icon: "headphones",
    },
  ],
  plans: [
    {
      name: "100 Fast",
      price: "$59.99",
      speed: "100mb Download and Upload Speeds",
      features: ["Unlimited data", "No contracts", "Free installation"],
      cta_text: "View Plans",
    },
    {
      name: "1000 Super Fast",
      price: "$69.99",
      speed: "1000mb Download and Upload Speeds",
      features: [
        "Unlimited data",
        "No contracts",
        "Free installation",
        "Super fast speeds",
      ],
      cta_text: "View Plans",
      popular: true,
    },
    {
      name: "2500 Ultra Fast",
      price: "$99.99",
      speed: "2500mb Download and Upload Speeds",
      features: [
        "Unlimited data",
        "No contracts",
        "Free installation",
        "Ultrafast speeds",
        "Priority support",
      ],
      cta_text: "View Plans",
    },
  ],
  streaming: {
    title: "Stream Without Limits",
    description:
      "Enjoy your favorite streaming services without buffering or interruptions.",
    image:
      "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
    quotes: [
      {
        text: "Since switching to Orangeburg Fiber, we've never experienced buffering while streaming our favorite shows.",
        author: "Sarah J., Customer since 2021",
      },
      {
        text: "The speed is incredible. Multiple 4K streams at once with no issues!",
        author: "Michael T., Customer since 2022",
      },
    ],
  },
  cta_section: {
    title: "Ready to Experience Better Internet?",
    text: "Check if Orangeburg Fiber is available in your area and join thousands of satisfied customers.",
    button_text: "Check Availability Now",
    button_link: "/check-availability",
  },
  footer: {
    links: [
      { title: "Privacy Policy", url: "/privacy" },
      { title: "Terms of Service", url: "/terms" },
      { title: "Contact Us", url: "/contact" },
      { title: "About Us", url: "/about" },
    ],
    copyright: "© 2023 Orangeburg Fiber. All rights reserved.",
  },
  navigation: {
    home: "Home",
    how_it_works: "How It Works",
    plans: "Plans & Services",
    business: "Business Services",
    support: "Support",
    contact: "Contact",
    portal_login: "Portal Login",
    sign_up: "Sign Up",
  },
  ui_text: {
    loading: "Loading...",
    view_plans: "View Plans",
    sign_up: "Sign Up",
    check_availability: "Check Availability",
    subscribe: "Subscribe",
    your_email: "Your email",
    stay_connected: "Stay Connected",
    newsletter_description:
      "Subscribe to our newsletter for updates on services, promotions, and industry news.",
    quick_links: "Quick Links",
    legal: "Legal",
    all_rights_reserved: "All rights reserved.",
    designed_with_care: "Designed and developed with care for our customers.",
    how_it_works_title: "How It Works",
    video_section_title: "Discover the Orangeburg Marketplace",
    video_section_description:
      "Discover how our platform connects you with the best internet service providers in your area. Watch our quick overview to see how simple it is to get started.",
    video_placeholder: "Video Placeholder",
    embed_video_here: "Embed your video content here",
    plan_cards_title: "Choose Your Perfect Plan",
    plan_cards_subtitle:
      "Choose any plan from any provider—no contracts, no commitments.",
    whats_included_title: "What's Included With Every Plan",
    faq_title: "Frequently Asked Questions",
    per_month: "/month",
  },
  how_it_works: {
    steps: [
      {
        title: "Sign Up",
        description:
          "Sign up today and we'll schedule your fiber installation.",
        icon: "edit",
      },
      {
        title: "Install",
        description:
          "We'll install the fiber connection and access device in your home.",
        icon: "wrench",
      },
      {
        title: "Choose",
        description:
          "From our portal you select your internet provider and plan. (Switch anytime)",
        icon: "list",
      },
      {
        title: "Surf",
        description:
          "Access the web over your new blazing fast fiber connection.",
        icon: "wifi",
      },
    ],
  },
  additional_features: [
    "No data caps or throttling",
    "Free professional installation",
    "24/7 customer support",
    "30-day money-back guarantee",
    "No long-term contracts",
    "Free Wi-Fi router included",
  ],
  faq: [
    {
      question: "Is there a data limit?",
      answer:
        "No, all our plans include unlimited data with no throttling or caps.",
    },
    {
      question: "Do I need to sign a contract?",
      answer:
        "No contracts required. You can cancel anytime with 30 days notice.",
    },
    {
      question: "What equipment do I need?",
      answer:
        "We provide a free Wi-Fi router with every plan. Professional installation is also included.",
    },
    {
      question: "How long does installation take?",
      answer:
        "Most installations are completed within 2-4 hours by our certified technicians.",
    },
  ],
  pages: {
    home: {
      title: "Home - Orangeburg Fiber",
      description:
        "Orangeburg Fiber provides high-speed fiber internet for homes and businesses.",
      content: {},
    },
    "how-it-works": {
      title: "How It Works - Orangeburg Fiber",
      description: "Learn how Orangeburg Fiber's fiber internet service works.",
      content: {},
    },
    plans: {
      title: "Plans & Services - Orangeburg Fiber",
      description: "Explore our internet plans and services.",
      content: {},
    },
    business: {
      title: "Business Services - Orangeburg Fiber",
      description: "Internet solutions for businesses of all sizes.",
      content: {},
    },
    support: {
      title: "Support - Orangeburg Fiber",
      description: "Get help with your Orangeburg Fiber service.",
      content: {},
    },
    contact: {
      title: "Contact Us - Orangeburg Fiber",
      description: "Get in touch with our team.",
      content: {},
    },
    "check-availability": {
      title: "Check Availability - Orangeburg Fiber",
      description: "Check if fiber internet is available in your area.",
      content: {},
    },
    privacy: {
      title: "Privacy Policy - Orangeburg Fiber",
      description: "Learn how we protect and handle your personal information.",
      content: {},
    },
    terms: {
      title: "Terms & Conditions - Orangeburg Fiber",
      description:
        "Please read these terms and conditions carefully before using our services.",
      content: {},
    },
    accessibility: {
      title: "Accessibility - Orangeburg Fiber",
      description:
        "We are committed to ensuring our website and services are accessible to everyone.",
      content: {},
    },
  },
  check_availability_page: {
    hero_image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    hero_alt_text: "Network coverage map for fiber internet availability",
    title: "Check Service Availability",
    description:
      "We're bringing high-speed fiber internet to neighborhoods across Orangeburg. Use the form below to see if your home or business is in our current or upcoming service area.\n\nIf your address is outside our service zone, we'll keep you updated about expansion plans in your neighborhood.",
    city_name: "Orangeburg",
    map_center: {
      lat: 33.4918,
      lng: -80.8556,
    },
    service_zones: [
      {
        id: "available-zone-1",
        name: "Downtown Area",
        status: "available" as const,
        coordinates: [
          [33.5018, -80.8656],
          [33.5018, -80.8456],
          [33.4818, -80.8456],
          [33.4818, -80.8656],
        ],
        color: "#10B981",
      },
      {
        id: "coming-soon-zone-1",
        name: "North Residential",
        status: "coming-soon" as const,
        coordinates: [
          [33.5118, -80.8656],
          [33.5118, -80.8456],
          [33.5018, -80.8456],
          [33.5018, -80.8656],
        ],
        color: "#F59E0B",
      },
      {
        id: "available-zone-2",
        name: "South Commercial",
        status: "available" as const,
        coordinates: [
          [33.4818, -80.8656],
          [33.4818, -80.8456],
          [33.4618, -80.8456],
          [33.4618, -80.8656],
        ],
        color: "#10B981",
      },
    ],
  },
  how_it_works_page: {
    hero_image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80",
    hero_alt_text:
      "Modern fiber optic technology and network infrastructure in Orangeburg",
    content_image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    content_alt_text:
      "Diverse group of coworkers using fast fiber internet in Orangeburg",
    city_name: "Your City",
  },
  providers: [
    {
      id: "orangeburg-fiber",
      name: "Orangeburg Fiber",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=orangeburg&backgroundColor=de5a00",
      plans: [
        {
          id: "basic-fiber",
          name: "Basic Fiber",
          speed: "300 Mbps",
          price: "$49.99",
          features: ["Unlimited data", "No contracts", "Free installation"],
          cta_text: "Sign Up",
        },
        {
          id: "premium-fiber",
          name: "Premium Fiber",
          speed: "600 Mbps",
          price: "$69.99",
          features: [
            "Unlimited data",
            "No contracts",
            "Free installation",
            "WiFi router included",
          ],
          cta_text: "Sign Up",
          popular: true,
        },
      ],
    },
    {
      id: "speednet",
      name: "SpeedNet",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=speednet&backgroundColor=3b82f6",
      plans: [
        {
          id: "fast-connect",
          name: "Fast Connect",
          speed: "500 Mbps",
          price: "$59.99",
          features: ["Unlimited data", "24/7 support", "Free modem"],
          cta_text: "Sign Up",
        },
        {
          id: "ultra-speed",
          name: "Ultra Speed",
          speed: "1 Gbps",
          price: "$89.99",
          features: [
            "Unlimited data",
            "24/7 support",
            "Free modem",
            "Priority support",
          ],
          cta_text: "Sign Up",
        },
      ],
    },
    {
      id: "connectplus",
      name: "ConnectPlus",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=connectplus&backgroundColor=10b981",
      plans: [
        {
          id: "home-essential",
          name: "Home Essential",
          speed: "200 Mbps",
          price: "$39.99",
          features: ["Unlimited data", "Basic support"],
          cta_text: "Sign Up",
        },
        {
          id: "home-pro",
          name: "Home Pro",
          speed: "800 Mbps",
          price: "$79.99",
          features: ["Unlimited data", "Premium support", "Free equipment"],
          cta_text: "Sign Up",
        },
      ],
    },
  ],
  plans_page: {
    hero_image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    hero_alt_text: "Abstract fiber network graphic in Orangeburg brand colors",
    city_name: "Orangeburg",
  },
  business_page: {
    hero_image: "business_hero_Orangeburg.jpg",
    hero_alt_text:
      "Colleagues using high-speed internet for business in Orangeburg",
    small_title: "Business Fiber Solutions",
    main_title: "Reliable Connectivity for Your Business",
    sub_context:
      "Power your team with high-speed, flexible fiber internet designed for businesses in Orangeburg.",
    why_choose_title: "Why Choose Orangeburg Fiber for Your Business",
    why_choose_description:
      "Enjoy unparalleled choice, reliability, and future-proof speeds to help your business thrive.",
    cta_button_text: "Sign Up Today",
    blazing_fast_title: "Blazing Fast Business Internet and Data Solutions",
    blazing_fast_description:
      "Experience lightning-fast speeds and scalable solutions that grow with your business needs.",
    blazing_fast_image: "business_blazingfast_Orangeburg.jpg",
    blazing_fast_alt_text:
      "Colleagues collaborating using business fiber internet in Orangeburg",
    future_ready_title: "Future-Ready Connectivity",
    future_ready_description:
      "Stay ahead with cutting-edge technology that supports modern business demands and remote collaboration.",
    future_ready_image: "business_futureready_Orangeburg.jpg",
    future_ready_alt_text:
      "Business user with phone using social media / networking in Orangeburg",
    city_name: "Orangeburg",
  },
  support_page: {
    hero_image: "support_hero_Orangeburg.jpg",
    hero_alt_text: "Support and help center for fiber customers in Orangeburg",
    title: "Orangeburg Fiber Support Center",
    subheader:
      "Find answers, manage your account, and get help with your fiber service.",
    city_name: "Orangeburg",
    cta_sections: [
      {
        id: "construction",
        title: "Construction Progress",
        description: "Check construction status in your area",
        icon: "construction",
        link: "/support/construction",
        subpage: {
          hero_image: "support_construction_Orangeburg.jpg",
          hero_alt_text:
            "Construction progress for fiber network in Orangeburg",
          title: "Construction Progress",
          description: "We're working hard to bring fiber to your area!",
          content:
            "Our construction teams are currently installing high-speed fiber infrastructure in your neighborhood. We understand you're eager to get connected, and we're just as excited to bring you reliable, fast internet. Here's what you need to know about the fiber construction process.",
          cta_buttons: [
            { text: "Check Status", link: "#status" },
            { text: "Contact Us", link: "/contact" },
          ],
        },
      },
      {
        id: "managed-wifi",
        title: "Managed WiFi",
        description: "Learn about our managed WiFi options",
        icon: "wifi",
        link: "/support/managed-wifi",
        subpage: {
          hero_image: "support_wifi_Orangeburg.jpg",
          hero_alt_text: "Managed WiFi solutions for Orangeburg customers",
          title: "What is Managed WiFi?",
          description:
            "Managed WiFi is an optional add-on service that ensures you have optimal wireless coverage throughout your home.",
          content:
            "Once you've selected an internet service plan, you can choose to add Managed WiFi for enhanced network management and support.",
          cta_buttons: [
            { text: "Download for iOS", link: "#ios-app" },
            { text: "Download for Android", link: "#android-app" },
          ],
        },
      },
      {
        id: "account",
        title: "Account Management",
        description: "Update your info or billing",
        icon: "user",
        link: "/support/account",
        subpage: {
          hero_image: "support_account_Orangeburg.jpg",
          hero_alt_text:
            "Account management portal for Orangeburg Fiber customers",
          title: "Managing Your Account",
          description:
            "Once you've signed up for Orangeburg Fiber services, you can easily maintain and update your account through the Subscriber Portal. From the portal, you can access your Account Settings to change personal details or update your billing information.",
          content: "",
          cta_buttons: [
            { text: "Customer Portal", link: "#portal" },
            { text: "Update Info", link: "#update" },
          ],
        },
      },
      {
        id: "billing",
        title: "Billing and Payments",
        description: "Find out how to pay your bill",
        icon: "credit-card",
        link: "/support/billing",
        subpage: {
          hero_image: "support_billing_Orangeburg.jpg",
          hero_alt_text: "Billing and payment options for Orangeburg Fiber",
          title: "Billing & Payments",
          description: "",
          content:
            "Customers can manage their subscriptions, billing, and payments through the Orangeburg Fiber Subscriber Portal.",
          cta_buttons: [
            { text: "Pay Now", link: "#pay" },
            { text: "Setup Autopay", link: "#autopay" },
          ],
        },
      },
      {
        id: "troubleshooting",
        title: "D50 Troubleshooting",
        description: "Get help with your EntryPoint D50 device",
        icon: "wrench",
        link: "/support/troubleshooting",
        subpage: {
          hero_image: "support_troubleshooting_Orangeburg.jpg",
          hero_alt_text:
            "D50 troubleshooting guide for Orangeburg Fiber customers",
          title: "D50 Troubleshooting",
          description: "",
          content:
            "Follow these step-by-step troubleshooting instructions to resolve common issues with your EntryPoint D50 device.",
          cta_buttons: [
            { text: "Download Manual", link: "/D50_ManagedWifi.pdf" },
          ],
        },
      },
    ],
  },
};

/**
 * Loads content from configuration files or API
 * @param contentPath - Path to content file or API endpoint
 * @returns Content configuration object
 */
export const loadContent = async (
  contentPath?: string,
): Promise<ContentConfig> => {
  // In a real implementation, this would load from a file or API
  // For now, we'll return the default content

  try {
    if (contentPath) {
      // In a real implementation, we would fetch from the provided path
      // const response = await fetch(contentPath);
      // return await response.json();
    }

    // For demo purposes, return the default content
    return defaultContent;
  } catch (error) {
    console.error("Error loading content:", error);
    return defaultContent;
  }
};

/**
 * Replaces template variables in a string with values from the content object
 * @param template - String with template variables like {{variable_name}}
 * @param content - Content object with values to replace variables
 * @returns String with variables replaced
 */
export const replaceTemplateVariables = (
  template: string,
  content: ContentConfig,
): string => {
  // Replace all {{variable}} patterns with corresponding values from content
  return template.replace(/\{\{([\w\.]+)\}\}/g, (match, variablePath) => {
    // Split the path by dots to navigate nested objects
    const path = variablePath.split(".");

    // Navigate through the content object to find the value
    let value: any = content;
    for (const key of path) {
      if (value === undefined || value === null) return match; // Return original if path is invalid
      value = value[key];
    }

    // Return the value if found, otherwise return the original template variable
    return value !== undefined && value !== null ? String(value) : match;
  });
};

/**
 * React hook to use content in components
 * @param contentPath - Optional path to content file or API endpoint
 * @returns Content configuration object and loading state
 */
export const useContent = (contentPath?: string) => {
  const [content, setContent] = useState<ContentConfig>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (contentPath) {
          setLoading(true);
          const loadedContent = await loadContent(contentPath);
          setContent(loadedContent);
          setError(null);
        } else {
          // Use default content immediately - no loading state needed
          setContent(defaultContent);
          setError(null);
        }
      } catch (err) {
        console.error("Content loading error:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load content"),
        );
        // Fallback to default content on error
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentPath]);

  return { content, loading, error };
};

/**
 * Gets theme variables from content
 * @param content - Content configuration object
 * @returns Theme object with CSS variables
 */
export const getThemeVariables = (content: ContentConfig) => {
  const { theme } = content;

  // Convert theme object to CSS variables
  const cssVariables: Record<string, string> = {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-accent": theme.colors.accent,
    "--color-background": theme.colors.background,
    "--color-text": theme.colors.text,
    "--color-heading": theme.colors.heading,
    "--font-heading": theme.fonts.heading,
    "--font-body": theme.fonts.body,
    "--spacing-small": theme.spacing.small,
    "--spacing-medium": theme.spacing.medium,
    "--spacing-large": theme.spacing.large,
  };

  return cssVariables;
};

/**
 * Applies theme variables to the document
 * @param theme - Theme object with CSS variables
 */
export const applyTheme = (theme: Record<string, string>) => {
  // Apply theme variables to the document root
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

/**
 * Gets page metadata from content
 * @param content - Content configuration object
 * @param pageName - Name of the page
 * @returns Page metadata object
 */
export const getPageMetadata = (content: ContentConfig, pageName: string) => {
  const page = content.pages[pageName];
  if (!page)
    return {
      title: content.company.name,
      description: content.company.tagline,
    };

  return {
    title: page.title,
    description: page.description,
  };
};

export default {
  loadContent,
  replaceTemplateVariables,
  useContent,
  getThemeVariables,
  applyTheme,
  getPageMetadata,
};
