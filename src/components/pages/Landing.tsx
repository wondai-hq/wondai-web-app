import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../utils/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  Users, 
  Mail, 
  Lock, 
  Bot, 
  Sparkles,
  AlertCircle,
  TrendingUp,
  Target,
  Filter,
  Clock,
  CheckCircle2,
  Search,
  GitBranch
} from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const { login, completeOnboarding } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      completeOnboarding(); // Mark onboarding as complete for existing users
      navigate('/dashboard');
    }
  };

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl tracking-tight">Wondai</span>
          </div>
          <div className="flex items-center gap-4">
            {!showLogin && (
              <>
                <Button variant="ghost" onClick={() => { setIsSignUp(false); setShowLogin(true); }}>
                  Sign In
                </Button>
                <Button onClick={() => { setIsSignUp(true); setShowLogin(true); }}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            
            <div className="space-y-4">
              <h1 className="text-5xl tracking-tight leading-tight">
                Messages Organized by
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meaning, Not Channel
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-xl">
                Wondai unifies WhatsApp, Email, Telegram, Slack, Discord, SMS, and voice notes-then structures them by intent, urgency, and actionability with Wanda AI.
              </p>
            </div>

            {/* Problem Statement */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">The Problem:</span>
              </div>
              <ul className="text-sm text-red-800 space-y-1 ml-7">
                <li>• Messages scattered across 7+ channels</li>
                <li>• Lost revenue from missed follow-ups</li>
                <li>• Zero visibility, poor accountability</li>
                <li>• No customer history across channels</li>
              </ul>
            </div>

            {/* Core Value Props */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Never miss messages or follow-ups</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Understand customer intent instantly</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Reduce switching fatigue across tools</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Improve SLAs and team visibility</span>
              </div>
            </div>

            {!showLogin && (
              <div className="flex items-center gap-4 pt-4">
                <Button size="lg" className="px-8" onClick={() => { setIsSignUp(true); setShowLogin(true); }}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
            )}
          </div>

          {/* Right Side - Login Card or Visual */}
          <div className="flex justify-center">
            {showLogin ? (
              <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Welcome to Wondai</CardTitle>
                  <CardDescription>
                    Access your meaning-first inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          if (email && password) {
                            handleLogin(e);
                          }
                        }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        size="lg"
                        onClick={(e) => {
                          e.preventDefault();
                          if (email && password) {
                            handleSignUp(e);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Register
                      </Button>
                    </div>

                    <div className="text-center text-sm text-slate-600">
                      Try our demo{' '}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setEmail('demo@wondai.com');
                          setPassword('demo');
                        }}
                      >
                        demo@wondai.com
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-3xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm font-medium text-slate-700">Feeds</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">AI-Organized</Badge>
                  </div>
                  
                  {/* Smart Filter Examples */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium text-sm">Urgent</div>
                          <div className="text-xs text-slate-600">Payment issues, complaints</div>
                        </div>
                      </div>
                      <Badge variant="destructive">8</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="font-medium text-sm">Follow-Up Needed</div>
                          <div className="text-xs text-slate-600">Awaiting responses</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">12</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium text-sm">VIP Customers</div>
                          <div className="text-xs text-slate-600">High-value accounts</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">5</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">Recurring Issues</div>
                          <div className="text-xs text-slate-600">Patterns detected</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">3</Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg p-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Wanda auto-creates filters based on your workflow</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How Wanda Works Section */}
        {!showLogin && (
          <div className="mt-24 space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-900">Meet Wanda</span>
              </div>
              <h2 className="text-4xl tracking-tight">Your AI Operations Brain</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Wanda extracts operational meaning from every message, turning unstructured conversations into structured, priority-driven workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {/* Extraction Capabilities */}
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Intelligent Extraction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Tasks & follow-ups
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Deadlines & dates
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Intent (refund, purchase, inquiry)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Sentiment & complaint signals
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Payment & risk indicators
                  </div>
                </CardContent>
              </Card>

              {/* Organization */}
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Filter className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Smart Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Auto-creates meaning-based filters
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Priority ranking by urgency
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Groups by human identity, not channel
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Detects recurring issues
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    Suggests filter improvements
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Thread summaries
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Recommended next steps
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Daily priority lists
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    What changed since last view
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    Trend & churn detection
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Who It's For */}
        {!showLogin && (
          <div className="mt-24 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl tracking-tight">Built for Teams Under Pressure</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Whether you're drowning in WhatsApp, managing support volume, or need visibility-Wondai adapts to your workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>SME Teams</CardTitle>
                  <CardDescription>Constantly overwhelmed by messages</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Get a clear priority list, cross-channel visibility, and AI-extracted tasks without switching between 7 apps.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Business Owners</CardTitle>
                  <CardDescription>Need visibility & accountability</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Track SLAs, see trends, understand recurring issues, and ensure nothing falls through the cracks.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Support & Ops</CardTitle>
                  <CardDescription>Handle volume at scale</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Balance workload, assign conversations, prioritize escalations, and collaborate on external threads.
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Unified Threads Section */}
        {!showLogin && (
          <div className="mt-24 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl tracking-tight">Feeds Organized by Meaning</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Conversation threads grouped by intent into Feeds-not scattered across channels.
              </p>
            </div>

            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
              <div className="space-y-4">
                {/* Thread Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white">JD</span>
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-slate-600">Customer • VIP Feed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                      <Target className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  </div>
                </div>

                {/* Messages from different channels */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="text-sm text-slate-600 mb-1">WhatsApp • 2 hours ago</div>
                      <div className="text-sm">Hi, I ordered product #1234 but haven't received shipping confirmation yet.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="text-sm text-slate-600 mb-1">Email • 1 hour ago</div>
                      <div className="text-sm">Following up on my WhatsApp message. This is urgent as I need it by Friday.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="text-sm text-slate-600 mb-1">Telegram • 30 minutes ago</div>
                      <div className="text-sm">If I don't get this by Friday, I'll need to cancel and request a refund.</div>
                    </div>
                  </div>
                </div>

                {/* Wanda AI Insight */}
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <div className="font-medium text-purple-900">Wanda AI Analysis:</div>
                      <div className="text-slate-700">
                        <strong>Intent:</strong> Shipping inquiry → Urgent complaint<br />
                        <strong>Risk:</strong> Potential cancellation & refund<br />
                        <strong>Deadline:</strong> Friday (2 days)<br />
                        <strong>Feed:</strong> Auto-sorted into "Urgent" Feed<br />
                        <strong>Recommended Action:</strong> Escalate to shipping team immediately
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                    <Filter className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Feeds</CardTitle>
                  <CardDescription>Organized by meaning</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Smart views like "Urgent", "VIP", "Follow-Up"-not "WhatsApp" or "Email"
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Threads</CardTitle>
                  <CardDescription>One person, all channels</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Each conversation thread contains messages from WhatsApp, Email, Telegram, etc.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>AI-Sorted</CardTitle>
                  <CardDescription>Automatically organized</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  Wanda analyzes each thread and places it in the right Feed based on intent
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Integration Channels */}
        {!showLogin && (
          <div className="mt-24 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl tracking-tight">All Your Channels, One Platform</h2>
              <p className="text-lg text-slate-600">
                Connect once. Work unified forever.
              </p>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-6 mt-12">
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">WhatsApp</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Email</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Telegram</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Slack</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Discord</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">SMS</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow border-2">
                <div className="w-10 h-10 bg-slate-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Voice Notes</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!showLogin && (
          <div className="mt-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl tracking-tight mb-4">Stop Missing Messages. Start Working Smarter.</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join teams that have reduced response time by 60% and eliminated missed follow-ups with Wondai's AI-first approach.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="px-8" onClick={() => { setIsSignUp(true); setShowLogin(true); }}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              No credit card required • Smoke Screen MVP Compliant • Free 14-day trial
            </p>
          </div>
        )}

        {/* Social Proof */}
        {!showLogin && (
          <div className="mt-24 pt-12 border-t space-y-8">
            <p className="text-center text-sm text-slate-500 mb-8">
              Trusted by high-performing teams at
            </p>
            <div className="flex items-center justify-center gap-12 opacity-40">
              <div className="text-2xl tracking-tight">Helb Co</div>
              <div className="text-2xl tracking-tight">Interpause Industries</div>
              <div className="text-2xl tracking-tight">Echo Inc</div>
              <div className="text-2xl tracking-tight">Maison Belora</div>
            </div>
            
            {/* Achievement Badge */}
            <div className="flex justify-center pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 rounded-full shadow-sm">
                <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full">
                  <span className="text-white text-xs">🏆</span>
                </div>
                <span className="text-sm font-medium text-amber-900">
                  1st Runner Up • TechTO x Penseum Toronto Student Hackathon
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}