import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../utils/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  MessageSquare,
  Mail,
  Send,
  Check,
  ArrowRight,
  Users,
  Building2,
  Sparkles,
  ChevronRight,
  Bot,
  Zap,
  GitBranch,
  Filter,
  Target,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { FeedDetailsModal, type FeedDetails } from "../FeedDetailsModal";
import { ContactEditModal } from "../ContactEditModal";
import { mockFeedDetails } from "../../utils/mockData";
import { OnboardingIntegrationStep } from "../OnboardingIntegrationStep";
import { type ChannelType, type Integration, saveSelectedChannels } from "../../utils/integrations";

type OnboardingStep =
  | "welcome"
  | "channels"
  | "integration"
  | "processing"
  | "results"
  | "team"
  | "complete";

type ProcessingStage = {
  id: string;
  title: string;
  description: string;
  progress: number;
  details: string[];
  icon: React.ElementType;
};

const channelOptions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageSquare,
    color: "bg-green-500",
    messages: 1247,
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    color: "bg-red-500",
    messages: 892,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    color: "bg-blue-500",
    messages: 534,
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    color: "bg-purple-500",
    messages: 423,
  },
  {
    id: "discord",
    name: "Discord",
    icon: MessageSquare,
    color: "bg-indigo-500",
    messages: 318,
  },
  {
    id: "sms",
    name: "SMS",
    icon: MessageSquare,
    color: "bg-orange-500",
    messages: 156,
  },
];

const processingStages: ProcessingStage[] = [
  {
    id: "connecting",
    title: "Connecting to channels...",
    description:
      "Establishing secure connections and importing messages",
    progress: 15,
    details: [],
    icon: Zap,
  },
  {
    id: "enriching",
    title: "Enriching messages...",
    description:
      "Normalizing formats and enhancing with metadata",
    progress: 35,
    details: [
      "Indexing media attachments",
      "Extracting message metadata",
      "Analyzing message context",
    ],
    icon: GitBranch,
  },
  {
    id: "identifying",
    title: "Identifying contacts across platforms...",
    description:
      "Finding the same person across different channels",
    progress: 55,
    details: [
      "Matching email addresses and phone numbers",
      "Analyzing contact patterns",
      "Merging duplicate identities",
    ],
    icon: Users,
  },
  {
    id: "analyzing",
    title: "Wanda AI is analyzing...",
    description:
      "Understanding intent, urgency, and extracting insights",
    progress: 75,
    details: [
      "Detecting urgent messages and complaints",
      "Extracting tasks and follow-ups",
      "Identifying deadlines and payment issues",
      "Understanding customer intent",
    ],
    icon: Bot,
  },
  {
    id: "filters",
    title: "Sorting threads into Feeds...",
    description:
      "Organizing conversations by meaning, not channel",
    progress: 100,
    details: [
      "Building meaning-based Feeds",
      "Categorizing threads by intent",
      "Setting up automated workflows",
    ],
    icon: Filter,
  },
];

const sampleUnifiedThreads = [
  {
    name: "Sarah Chen",
    channels: ["whatsapp", "email", "telegram"],
    lastMessage: "2 hours ago",
    tags: ["VIP", "Urgent"],
  },
  {
    name: "John Doe",
    channels: ["email", "slack"],
    lastMessage: "5 hours ago",
    tags: ["Follow-Up"],
  },
  {
    name: "Acme Corp",
    channels: ["email", "whatsapp"],
    lastMessage: "1 day ago",
    tags: ["Payment Issue"],
  },
];

const sampleTasks = [
  "Send invoice to Acme Corp (from Email)",
  "Schedule demo with John Smith (from WhatsApp)",
  "Follow up on refund request (from Telegram)",
  "Review contract terms (from Email)",
  "Send shipping confirmation (from WhatsApp)",
];

const sampleUrgentIssues = [
  {
    title: "Payment dispute from VIP customer",
    source: "Sarah Chen • WhatsApp",
    time: "2 hours ago",
  },
  {
    title: "Shipping complaint - deadline tomorrow",
    source: "Mike Johnson • Email",
    time: "4 hours ago",
  },
  {
    title: "Refund request awaiting 3 days",
    source: "Lisa Park • Telegram",
    time: "1 day ago",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, userEmail } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedChannels, setSelectedChannels] = useState<
    string[]
  >([]);
  const [orgName, setOrgName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Feed modal state
  const [selectedFeed, setSelectedFeed] = useState<FeedDetails | null>(null);
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  
  // Contact edit modal state
  const [isContactEditModalOpen, setIsContactEditModalOpen] = useState(false);
  
  // Review page checkboxes
  const [feedsConfirmed, setFeedsConfirmed] = useState(false);
  const [contactsConfirmed, setContactsConfirmed] = useState(false);

  // Processing state
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [stageComplete, setStageComplete] = useState(false);
  const [channelStats, setChannelStats] = useState<
    { channel: string; messages: number; done: boolean }[]
  >([]);
  const [processingStats, setProcessingStats] = useState({
    totalMessages: 0,
    contactsMerged: 0,
    uniquePeople: 0,
    threadsCreated: 0,
    followUps: 0,
    paymentIssues: 0,
    vipCustomers: 0,
    tasks: 0,
    complaints: 0,
    deadlines: 0,
    filtersCreated: 8,
  });

  const steps: OnboardingStep[] = [
    "welcome",
    "channels",
    "integration",
    "processing",
    "results",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(step);
  const progress =
    ((currentStepIndex + 1) / steps.length) * 100;

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId],
    );
  };

  // Processing animation logic
  useEffect(() => {
    if (step !== "processing") return;

    // Initialize channel stats - use ALL channels if in demo mode
    const channelsToProcess = isDemoMode ? channelOptions.map(c => c.id) : selectedChannels;
    
    const stats = channelsToProcess.map((channelId) => {
      const channel = channelOptions.find(
        (c) => c.id === channelId,
      );
      return {
        channel: channel?.name || "",
        messages: channel?.messages || 0,
        done: false,
      };
    });
    setChannelStats(stats);

    const totalMessages = stats.reduce(
      (sum, s) => sum + s.messages,
      0,
    );
    setProcessingStats((prev) => ({ ...prev, totalMessages }));

    // Stage 1: Connecting (show channels connecting one by one)
    let channelIndex = 0;
    const channelInterval = setInterval(() => {
      if (channelIndex < stats.length) {
        setChannelStats((prev) =>
          prev.map((s, i) =>
            i === channelIndex ? { ...s, done: true } : s,
          ),
        );
        channelIndex++;
      } else {
        clearInterval(channelInterval);
        // Set stage complete instead of auto-advancing
        setStageComplete(true);
      }
    }, 800);

    return () => clearInterval(channelInterval);
  }, [step, isDemoMode]);

  // Auto-progress through stages
  useEffect(() => {
    if (step !== "processing" || currentStageIndex === 0)
      return;

    // Reset stage complete when starting a new stage
    setStageComplete(false);

    const stageDuration = 3000; // 3 seconds per stage
    const progressInterval = 50; // Update every 50ms
    const progressIncrement =
      (100 / stageDuration) * progressInterval;

    let progress = 0;
    const interval = setInterval(() => {
      progress += progressIncrement;
      setStageProgress(progress);

      // Animate stats during different stages
      if (currentStageIndex === 2) {
        // Identifying contacts
        setProcessingStats((prev) => ({
          ...prev,
          contactsMerged: Math.min(
            234,
            Math.floor((progress / 100) * 234),
          ),
          uniquePeople: Math.min(
            87,
            Math.floor((progress / 100) * 87),
          ),
        }));
      } else if (currentStageIndex === 3) {
        // Analyzing
        setProcessingStats((prev) => ({
          ...prev,
          followUps: Math.min(
            12,
            Math.floor((progress / 100) * 12),
          ),
          paymentIssues: Math.min(
            3,
            Math.floor((progress / 100) * 3),
          ),
          vipCustomers: Math.min(
            5,
            Math.floor((progress / 100) * 5),
          ),
          tasks: Math.min(
            18,
            Math.floor((progress / 100) * 18),
          ),
          complaints: Math.min(
            2,
            Math.floor((progress / 100) * 2),
          ),
          deadlines: Math.min(
            7,
            Math.floor((progress / 100) * 7),
          ),
        }));
      }

      if (progress >= 100) {
        clearInterval(interval);
        setStageProgress(100);
        setStageComplete(true);
      }
    }, progressInterval);

    return () => clearInterval(interval);
  }, [step, currentStageIndex]);

  const handleNextStage = () => {
    if (currentStageIndex < processingStages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      setStageProgress(0);
      setStageComplete(false);
    } else {
      // Processing complete, move to results
      setStep("results");
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  const currentStage = processingStages[currentStageIndex];
  const StageIcon = currentStage?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {step !== "welcome" &&
          step !== "complete" &&
          step !== "processing" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <span className="text-sm text-slate-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

        {/* Welcome Step */}
        {step === "welcome" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">
                  Welcome to Wondai!
                </CardTitle>
                <CardDescription className="text-base">
                  Let's set up your meaning-first messaging system
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      Messages Organized by Meaning
                    </div>
                    <p className="text-sm text-slate-600">
                      Not by channel-Wondai groups by intent,
                      urgency, and actionability
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      Wanda AI Extracts Everything
                    </div>
                    <p className="text-sm text-slate-600">
                      Tasks, deadlines, intent, sentiment,
                      complaints-automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      Conversation Threads Across Channels
                    </div>
                    <p className="text-sm text-slate-600">
                      Same person on WhatsApp, Email, Telegram?
                      One conversation thread
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-600 text-center mb-4">
                  Signed in as{" "}
                  <span className="font-medium">
                    {userEmail}
                  </span>
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStep("channels")}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channels Step */}
        {step === "channels" && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                Connect Your Channels
              </CardTitle>
              <CardDescription>
                Select the messaging platforms you want to unify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {channelOptions.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedChannels.includes(
                    channel.id,
                  );
                  return (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">
                          {channel.name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-purple-900 mb-1">
                      What happens next?
                    </div>
                    <p className="text-purple-800">
                      Wondai will import your messages, identify
                      contacts across channels, create
                      conversation threads, and sort them into
                      Feeds by meaning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("welcome")}
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDemoMode(true);
                    saveSelectedChannels(selectedChannels as ChannelType[]);
                    setStep("processing");
                  }}
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Continue with Demo Data
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    saveSelectedChannels(selectedChannels as ChannelType[]);
                    setStep("integration");
                  }}
                  disabled={selectedChannels.length === 0}
                >
                  Connect Channels
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Step */}
        {step === "integration" && (
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <OnboardingIntegrationStep
                selectedChannels={selectedChannels as ChannelType[]}
                onContinue={(integrations: Integration[]) => {
                  // Save selected channels for later
                  saveSelectedChannels(selectedChannels as ChannelType[]);
                  setStep("processing");
                }}
                onBack={() => setStep("channels")}
              />
            </CardContent>
          </Card>
        )}

        {/* Processing Step (The Magic Loading Screen) */}
        {step === "processing" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">
                  {currentStage?.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {currentStage?.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">
                    Stage {currentStageIndex + 1} of{" "}
                    {processingStages.length}
                  </span>
                  <span className="text-sm text-slate-600">
                    {Math.round(currentStage?.progress || 0)}%
                  </span>
                </div>
                <Progress
                  value={currentStage?.progress || 0}
                  className="h-3"
                />
              </div>

              {/* Stage Details */}
              <div className="bg-slate-50 rounded-lg p-6 min-h-[300px]">
                {/* Stage 1: Connecting Channels */}
                {currentStageIndex === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-4">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      Establishing connections...
                    </div>
                    {channelStats.map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {stat.done ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium">
                              {stat.channel}{" "}
                              {stat.done && "connected"}
                            </div>
                            <div className="text-sm text-slate-600">
                              {stat.messages.toLocaleString()}{" "}
                              messages imported
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {channelStats.every((s) => s.done) && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                          <CheckCircle2 className="w-4 h-4" />
                          Total:{" "}
                          {processingStats.totalMessages.toLocaleString()}{" "}
                          messages from{" "}
                          {channelStats.length} channels
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stage 2: Normalizing */}
                {currentStageIndex === 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-100"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-400" />
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <GitBranch className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentStage.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                          {detail}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Progress
                        value={stageProgress}
                        className="h-2"
                      />
                    </div>
                  </div>
                )}

                {/* Stage 3: Identifying Contacts */}
                {currentStageIndex === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-sm font-medium mb-3 text-slate-700">
                        Example Match:
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-red-500" />
                          <span className="text-slate-600">
                            sarah@acme.com (Email)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-500" />
                          <span className="text-slate-600">
                            +1-555-0123 (WhatsApp)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600">
                            @sarahchen (Telegram)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <ChevronRight className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-900">
                            Merged as: Sarah Chen
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-2xl font-semibold text-blue-900">
                          {processingStats.contactsMerged}
                        </div>
                        <div className="text-sm text-blue-700">
                          Contacts merged
                        </div>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="text-2xl font-semibold text-purple-900">
                          {processingStats.uniquePeople}
                        </div>
                        <div className="text-sm text-purple-700">
                          Unique people
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={stageProgress}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Stage 4: Wanda Analyzing */}
                {currentStageIndex === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-700 mb-4">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Discovering Feeds...
                    </div>
                    <div className="bg-white rounded-lg border p-4 space-y-2 max-h-[240px] overflow-hidden">
                      <div className="animate-scroll space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>Urgent</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-sm">
                          <Target className="w-3 h-3 text-purple-600" />
                          <span>VIP</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-sm">
                          <AlertCircle className="w-3 h-3 text-orange-600" />
                          <span>Complaints</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span>Payment Issues</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-sm">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Follow-ups Needed</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-sm">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span>After Sales</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded text-sm">
                          <TrendingUp className="w-3 h-3 text-indigo-600" />
                          <span>Recurring Issues</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-pink-50 rounded text-sm">
                          <CheckCircle2 className="w-3 h-3 text-pink-600" />
                          <span>Resolved</span>
                        </div>
                        {/* Duplicate for continuous scroll effect */}
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>Urgent</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded text-sm">
                          <Target className="w-3 h-3 text-purple-600" />
                          <span>VIP</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded text-sm">
                          <AlertCircle className="w-3 h-3 text-orange-600" />
                          <span>Complaints</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span>Payment Issues</span>
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={stageProgress}
                      className="h-2"
                    />
                  </div>
                )}

                {/* Stage 5: Creating Filters */}
                {currentStageIndex === 4 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-4">
                      <Filter className="w-4 h-4 text-purple-600" />
                      Building your Feeds...
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">
                            Urgent
                          </span>
                        </div>
                        <Badge variant="destructive">8</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium">
                            Follow-Up Needed
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-700 border-amber-300"
                        >
                          12
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">
                            VIP Customers
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-700 border-purple-300"
                        >
                          5
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            Payment Issues
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700 border-blue-300"
                        >
                          3
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <CheckCircle2 className="w-4 h-4" />
                        {processingStats.filtersCreated} Smart
                        Filters created
                      </div>
                    </div>
                    <Progress
                      value={stageProgress}
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              {/* Stage Progress Indicators */}
              <div className="flex justify-center gap-2">
                {processingStages.map((stage, i) => (
                  <div
                    key={stage.id}
                    className={`h-2 rounded-full transition-all ${
                      i < currentStageIndex
                        ? "w-8 bg-green-600"
                        : i === currentStageIndex
                          ? "w-12 bg-purple-600"
                          : "w-8 bg-slate-300"
                    }`}
                  ></div>
                ))}
              </div>

              {/* Next Stage Button */}
              {stageComplete && (
                <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Button size="lg" onClick={handleNextStage}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Step (What We Created) */}
        {step === "results" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">
                  Here's What We Created
                </CardTitle>
                <CardDescription className="text-base">
                  Your conversations are now organized by
                  meaning, not channel
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card 1: Feeds Created */}
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-3xl font-semibold text-purple-900 mb-1">
                      {processingStats.filtersCreated} Feeds
                      Curated
                    </div>
                    <p className="text-sm text-purple-700">
                      Smart organizational views based on
                      meaning, not channel
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-8 h-8 text-purple-600" />
                    <button className="p-1 hover:bg-purple-200 rounded transition-colors">
                      <ChevronRight className="w-5 h-5 text-purple-700" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-sm transition-all"
                    onClick={() => {
                      setSelectedFeed(mockFeedDetails['urgent']);
                      setIsFeedModalOpen(true);
                    }}
                  >
                    <div className="font-medium text-sm">
                      Urgent Feed
                    </div>
                    <div className="text-xs text-slate-600">
                      8 threads
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="font-medium text-sm">
                      Follow-Up Feed
                    </div>
                    <div className="text-xs text-slate-600">
                      12 threads
                    </div>
                  </div>
                  <div 
                    className="p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-sm transition-all"
                    onClick={() => {
                      setSelectedFeed(mockFeedDetails['vip']);
                      setIsFeedModalOpen(true);
                    }}
                  >
                    <div className="font-medium text-sm">
                      VIP Feed
                    </div>
                    <div className="text-xs text-slate-600">
                      5 threads
                    </div>
                  </div>
                  <div 
                    className="p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-sm transition-all"
                    onClick={() => {
                      setSelectedFeed(mockFeedDetails['payment']);
                      setIsFeedModalOpen(true);
                    }}
                  >
                    <div className="font-medium text-sm">
                      Payment Issues
                    </div>
                    <div className="text-xs text-slate-600">
                      3 threads
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-purple-100 rounded text-xs text-purple-800">
                  Each Feed contains conversation threads
                  organized by intent
                </div>
              </div>

              {/* Card 2: Contacts Merged */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div 
                      className="text-3xl font-semibold text-blue-900 mb-1 cursor-pointer hover:text-blue-700 transition-colors"
                      onClick={() => setIsContactEditModalOpen(true)}
                    >
                      {processingStats.contactsMerged}{" "}
                      Contacts Merged
                    </div>
                    <p className="text-sm text-blue-700">
                      Same people unified across all channels
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <button className="p-1 hover:bg-blue-200 rounded transition-colors">
                      <ChevronRight className="w-5 h-5 text-blue-700" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {sampleUnifiedThreads.map((thread, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                      onClick={() => setIsContactEditModalOpen(true)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">
                            {thread.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {thread.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            {thread.channels.map((ch, j) => {
                              const channel =
                                channelOptions.find(
                                  (c) => c.id === ch,
                                );
                              const Icon = channel?.icon;
                              return Icon ? (
                                <Icon
                                  key={j}
                                  className="w-3 h-3"
                                />
                              ) : null;
                            })}
                            <span className="ml-1">
                              • {thread.lastMessage}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {thread.tags.map((tag, j) => (
                          <Badge
                            key={j}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
                  Click to review merged contacts
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={() => setStep("complete")}
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">
                  You're All Set!
                </CardTitle>
                <CardDescription className="text-base">
                  Welcome to your meaning-first messaging system
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">
                    {processingStats.filtersCreated} Feeds
                    Curated
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">
                    {processingStats.contactsMerged} Contacts
                    Unified
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm">
                    Wanda AI Insights Ready
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="font-medium mb-2">
                  What's Next?
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Go through your Up Next
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Ask your Feeds questions
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Check up on your Contacts
                  </li>
                </ul>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleComplete}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Feed Details Modal */}
      <FeedDetailsModal
        feed={selectedFeed}
        isOpen={isFeedModalOpen}
        onClose={() => {
          setIsFeedModalOpen(false);
          setSelectedFeed(null);
        }}
      />
      
      {/* Contact Edit Modal */}
      <ContactEditModal
        isOpen={isContactEditModalOpen}
        onClose={() => setIsContactEditModalOpen(false)}
      />
    </div>
  );
}