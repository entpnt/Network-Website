import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Plans from "./pages/Plans";
import Business from "./pages/Business";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import CheckAvailability from "./pages/CheckAvailability";
import SignUp from "./pages/SignUp";
import MyAccount from "./pages/MyAccount";
import Marketplace from "./pages/Marketplace";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import FiberConstructionProgress from "./pages/support/FiberConstructionProgress";
import ManagedWifi from "./pages/support/ManagedWifi";
import AccountManagement from "./pages/support/AccountManagement";
import BillingPayments from "./pages/support/BillingPayments";
import Troubleshooting from "./pages/support/Troubleshooting";
import MyServices from "./pages/MyServices";
import routes from "tempo-routes";

function App() {
  // You'll need to add your Clerk publishable key to your environment variables
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <>
          <Routes>
            {/* All routes with Layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/check-availability"
                      element={<CheckAvailability />}
                    />
                    <Route path="/signup-flow" element={<SignUp />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/my-services" element={<MyServices />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route
                      path="/support-center/fiber-construction-progress"
                      element={<FiberConstructionProgress />}
                    />
                    <Route
                      path="/support-center/managed-wifi"
                      element={<ManagedWifi />}
                    />
                    <Route
                      path="/support-center/account-management"
                      element={<AccountManagement />}
                    />
                    <Route
                      path="/support-center/billing-payments"
                      element={<BillingPayments />}
                    />
                    <Route
                      path="/support-center/troubleshooting"
                      element={<Troubleshooting />}
                    />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </ClerkProvider>
  );
}

export default App;
