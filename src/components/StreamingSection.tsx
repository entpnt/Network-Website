import React from "react";
import { Card, CardContent } from "./ui/card";
import { Quote, DollarSign, RotateCcw, Smile } from "lucide-react";

interface StreamingSectionProps {
  title?: string;
  description?: string;
  image?: string;
  dynamicContent?: React.ReactNode;
}

const StreamingSection: React.FC<StreamingSectionProps> = ({
  title = "Stream Without Limits",
  description = "Think you need cable to access your favorite TV and Movie Channels? Think again. With streaming TV, you only pay for channels you actually care about.",
  image = "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
  dynamicContent,
}) => {
  return (
    <section className="py-16 bg-brand-secondary dark:bg-dark-bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-dark-text-primary">
                {title}
              </h2>
              <p className="text-xl text-muted-foreground dark:text-dark-text-secondary">
                {description}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={image}
                alt="Streaming entertainment"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Streaming Services Icons */}
          </div>
        </div>

        {/* Streaming Benefits Cards - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card dark:bg-dark-bg-card border-border dark:border-dark-border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600 dark:text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Affordable
                  </h3>
                  <p className="text-gray-600 dark:text-white leading-relaxed">
                    69% of cord cutters say the cost of cable or satellite
                    service is too expensive. With streaming TV, you can select
                    a service with a comfortable price for you. Gone are the
                    days of paying for channels you don't care about. Plus,
                    you're not locked into any contracts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-dark-bg-card border-border dark:border-dark-border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-orange-600 dark:text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Flexible
                  </h3>
                  <p className="text-gray-600 dark:text-white leading-relaxed">
                    Streaming TV is available when and where you want. Access
                    your streaming services through any connected device like
                    tablet when you're on the go or your SmartTV, Apple TV,
                    Amazon Firestick, Roku or similar device when you're in the
                    comfort of your home.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-dark-bg-card border-border dark:border-dark-border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <Smile className="h-6 w-6 text-orange-600 dark:text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Amazing
                  </h3>
                  <p className="text-gray-600 dark:text-white leading-relaxed">
                    71% of cord cutters say that they can access the content
                    they want to watch online. Whether you love sports, news,
                    live events, or police procedurals, there's a plan for you.
                    If you can dream it, you can stream it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StreamingSection;
