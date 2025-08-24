import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Search,
  Plus,
  User,
  BookOpen,
  Activity,
  Sparkles,
  LogOut,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import { clientService, type Client } from "@/services/clientService";
import { readingService, type Reading } from "@/services/readingService";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type TabType = "clients" | "activity" | "read";

const tabButtonVariants = cva(
  "flex-1 flex flex-col items-center py-1.5 px-2 space-y-0.5 transition-colors duration-200",
  {
    variants: {
      isActive: {
        true: "text-primary",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

const ClientsTab = ({
  clients,
  loading,
}: {
  clients: Client[];
  loading: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const navigate = useNavigate();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (client.tags &&
        client.tags.some((tag) =>
          tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ))
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients or tags..."
            className="pl-10"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
            Seeking Connection
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
            Career Transition
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
            Spiritual Growth
          </Badge>
        </div>
      </div>

      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
        {loading ? (
          <div className="text-center py-8 md:col-span-2 lg:col-span-3">
            <p className="text-muted-foreground">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 md:col-span-2 lg:col-span-3">
            <p className="text-muted-foreground">
              {clients.length === 0
                ? "No clients found. Create your first client!"
                : "No clients match your search."}
            </p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/client/${client.id}`)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {client.avatar || client.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {client.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Last contact: {client.last_contact || "Never"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {client.tags?.length ? (
                    client.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No tags
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const ActivityTab = ({
  activities,
  loading,
}: {
  activities: Reading[];
  loading: boolean;
}) => (
  <div className="space-y-2">
    {loading ? (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    ) : activities.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activity.</p>
      </div>
    ) : (
      activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/20">
                {activity.reading_type === "reading" ? (
                  <BookOpen className="w-5 h-5 text-primary" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">
                  {activity.question || "Note added"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);

const ReadTab = ({ clients }: { clients: Client[] }) => {
  const navigate = useNavigate();
  const [copilotEnabled, setCopilotEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Checkbox
          id="copilot-toggle"
          checked={copilotEnabled}
          onCheckedChange={(checked) => setCopilotEnabled(checked === true)}
        />
        <Label htmlFor="copilot-toggle" className="text-sm">
          Enable Copilot
        </Label>
      </div>
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Start a New Reading
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Select a client to begin an interactive tarot reading session
          </p>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate("/reading/new", { state: { from: "/#read" } })}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            New Reading without Client
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Quick Select
        </h4>
        {clients.slice(0, 3).map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/reading/${client.id}`, { state: { from: "/#read" } })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {client.avatar || client.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {client.last_contact || "Never"}
                    </p>
                  </div>
                </div>
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pass copilotEnabled to ReadingWorkspace here if needed */}
      {/* <ReadingWorkspace copilotEnabled={copilotEnabled} /> */}
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  useEffect(() => {
    loadClients();
    loadReadings();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReadings = async () => {
    try {
      const readingsData = await readingService.getAllReadings();
      setReadings(readingsData);
    } catch (error) {
      toast.error("Failed to load readings");
      console.error("Error loading readings:", error);
    } finally {
      setLoadingReadings(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "read" || hash === "activity") {
      setActiveTab(hash);
    } else {
      setActiveTab("clients");
    }
  }, [location.hash]);

  const TabButton = React.forwardRef<
    HTMLButtonElement,
    {
      id: TabType;
      icon: LucideIcon;
      label: string;
      isActive?: boolean;
      onClick: (tab: TabType) => void;
      className?: string;
    } & VariantProps<typeof tabButtonVariants>
  >(({ id, icon: Icon, label, isActive = false, onClick, className, ...props }, ref) => (
    <button
      ref={ref}
      onClick={() => onClick(id)}
      className={cn(tabButtonVariants({ isActive }), className)}
      {...props}
    >
      <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  ));
  TabButton.displayName = "TabButton";

  return (
  <div className="min-h-screen bg-background p-2 sm:p-4 flex flex-col">
      {/* Header */}
  <Card className="mb-3">
    <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Tarot Copilot
            </h1>
            <p className="text-xs text-muted-foreground">
              Your reading companion
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button
                size="sm"
                onClick={() => navigate("/client/new")}
              >
                <Plus className="w-4 h-4" />
              </Button>
              {/* Dropdown temporarily disabled */}
              {/* <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg z-10 hidden group-hover:block">
                <button
                  className="flex items-center w-full px-4 py-2 hover:bg-accent text-popover-foreground"
                  onClick={() => navigate("/client/new")}
                >
                  <User className="w-4 h-4 mr-2" />
                  New Client
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 hover:bg-accent text-popover-foreground"
                  onClick={() =>
                    navigate("/reading/new", {
                      state: { from: `/#${activeTab}` },
                    })
                  }
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Reading
                </button>
              </div> */}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
    </CardContent>
  </Card>

      {/* Main Content */}
  <div className="flex-1 p-3 pb-16">
        {activeTab === "clients" && (
          <ClientsTab clients={clients} loading={loading} />
        )}
        {activeTab === "activity" && (
          <ActivityTab activities={readings} loading={loadingReadings} />
        )}
        {activeTab === "read" && <ReadTab clients={clients} />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pt-safe-bottom shadow-lg">
        <div className="flex">
          <TabButton
            id="clients"
            icon={Search}
            label="Clients"
            isActive={activeTab === "clients"}
            onClick={() => navigate("/#clients")}
          />
          <TabButton
            id="activity"
            icon={Activity}
            label="Activity"
            isActive={activeTab === "activity"}
            onClick={() => navigate("/#activity")}
          />
          <TabButton
            id="read"
            icon={Sparkles}
            label="Read"
            isActive={activeTab === "read"}
            onClick={() => navigate("/#read")}
          />
        </div>
      </div>
    </div>
  );
}