import { useState, useEffect } from 'react';
import { VideoIdea, VideoScript, SocialPost, AutomationSettings, AutomationLog } from './types';
import DashboardTab from './components/DashboardTab';
import IdeasTab from './components/IdeasTab';
import ScriptTab from './components/ScriptTab';
import GeneratorTab from './components/GeneratorTab';
import CoPilotTab from './components/CoPilotTab';
import {
  TrendingUp,
  Lightbulb,
  BookOpen,
  Film,
  Smartphone,
  Menu,
  X,
  Sparkles,
  RefreshCw,
  Clock,
  Youtube,
  Instagram,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ideas' | 'scripts' | 'studio' | 'copilot'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data State
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [analyticsHistory, setAnalyticsHistory] = useState<any>(null);

  // Loading indicator states
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isCompilingScript, setIsCompilingScript] = useState(false);
  const [compilingIdeaId, setCompilingIdeaId] = useState<string | null>(null);
  const [isTriggeringAutomation, setIsTriggeringAutomation] = useState(false);
  const [isSimulatingEngagement, setIsSimulatingEngagement] = useState(false);
  const [selectedScriptIdForStudio, setSelectedScriptIdForStudio] = useState<string | null>(null);
  const [apiStatusMessage, setApiStatusMessage] = useState<string>('');

  // Fetch initial full-stack Express state
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
        setScripts(data.scripts || []);
        setPosts(data.posts || []);
        setSettings(data.settings || null);
        setLogs(data.logs || []);
        setAnalyticsHistory(data.analyticsHistory || null);
      }
    } catch (err) {
      console.error('Failed to fetch store state from server:', err);
    }
  };

  useEffect(() => {
    fetchState();
    
    // Auto-update stats simulated ticker every minute to keep visual graphs ticking
    const statsInterval = setInterval(() => {
      onEngagementTick(true); // silent background tick
    }, 45000);

    return () => clearInterval(statsInterval);
  }, []);

  // Update Settings
  const onUpdateSettings = async (updated: AutomationSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  // Delete Idea
  const onDeleteIdea = async (id: string) => {
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIdeas(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Error deleting idea:', err);
    }
  };

  // Generate Ideas using Gemini
  const onGenerateIdeas = async (niche: string, vibe: string) => {
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, vibe })
      });
      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to generate ideas:', err);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // Compile full script (dialogues, prompts, synced images) of chosen idea
  const onCompileScript = async (ideaId: string) => {
    setIsCompilingScript(true);
    setCompilingIdeaId(ideaId);
    try {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId })
      });
      if (res.ok) {
        const data = await res.json();
        setScripts(data.scripts);
        setIdeas(data.ideas);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to compile script storyboard:', err);
    } finally {
      setIsCompilingScript(false);
      setCompilingIdeaId(null);
    }
  };

  // Save customized text edits made in script workshop tab
  const onUpdateScript = async (updated: VideoScript) => {
    setScripts(prev => prev.map(s => s.id === updated.id ? updated : s));
    // Simulated saving success
  };

  // Manual Trigger automated morning creation co-pilot cycle ( researching, drafting, compiling, posting )
  const onTriggerMorningAutomation = async () => {
    setIsTriggeringAutomation(true);
    try {
      const res = await fetch('/api/scheduler/tick', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas);
        setScripts(data.scripts);
        setPosts(data.posts);
        setLogs(data.logs);
        
        // Push notification status
        setApiStatusMessage('Script Compiled & Published! Check portfolio views.');
        setTimeout(() => setApiStatusMessage(''), 5000);
      }
    } catch (err) {
      console.error('Failed to trigger morning copilot ticker:', err);
    } finally {
      setIsTriggeringAutomation(false);
    }
  };

  // Clear activity terminal dashboard logs
  const onClearLogs = async () => {
    try {
      const res = await fetch('/api/logs/clear', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  };

  // Manual trigger high-frequency organic scrolling traffic (views, comments, likes boost simulation)
  const onEngagementTick = async (silent = false) => {
    if (!silent) setIsSimulatingEngagement(true);
    try {
      const res = await fetch('/api/posts/simulation-tick', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setAnalyticsHistory(data.analyticsHistory);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed simulation ticker engagement scan:', err);
    } finally {
      if (!silent) setIsSimulatingEngagement(false);
    }
  };

  // Link helper to load storyboard from script designer right into the generator emulator active slot
  const onSelectVideoForStudio = (scriptId: string) => {
    setSelectedScriptIdForStudio(scriptId);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-dark-deep text-slate-300 flex flex-col font-sans relative overflow-x-hidden antialiased">
      
      {/* Background Ambient glow decorations */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-1/12 w-[280px] h-[280px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Floating Status Notification Alerts */}
      {apiStatusMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#111111] border border-white/10 text-slate-200 text-xxs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{apiStatusMessage}</span>
        </div>
      )}

      {/* Primary Navigation Shell Column */}
      <header className="border-b border-white/10 bg-dark-nav sticky top-0 z-40 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand logo details */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                AutoPilot <span className="text-indigo-400">AI</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 bg-indigo-500/10 border border-white/10 rounded text-[9px] font-mono text-indigo-400 uppercase">SYS ONLINE</span>
              </h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Creator Console • Active API</p>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { id: 'dashboard', label: 'Monitor Dashboard', icon: TrendingUp },
              { id: 'ideas', label: 'Idea Factory', icon: Lightbulb },
              { id: 'scripts', label: 'Script Designer', icon: BookOpen },
              { id: 'studio', label: 'Video Studio', icon: Smartphone },
              { id: 'copilot', label: 'Automator Co-Pilot', icon: Film }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md text-xxs font-semibold flex items-center gap-2 transition cursor-pointer border ${isActive ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/15' : 'bg-[#111111] border-white/5 text-slate-400 hover:text-white hover:bg-zinc-900 hover:border-white/10'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Target Social Connections Fast Display on Android navbar */}
          {settings && (
            <div className="hidden md:flex items-center gap-2 text-xxxxs font-mono text-slate-400 bg-dark-card p-1.5 px-3 border border-white/5 rounded-lg">
              <span className="flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                {settings.youtubeConnected ? settings.youtubeChannelName : "Discon."}
              </span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                {settings.instagramConnected ? `@${settings.instagramUsername}` : "Discon."}
              </span>
            </div>
          )}

          {/* Hamburger Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-[#111] border border-white/10 rounded-lg transition"
            aria-label="Toggle Navigation Options"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Dynamic Mobile Sliding Navigation Sidebar menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-dark-deep/95 backdrop-blur-xl z-30 animate-fade-in flex flex-col p-4 space-y-3">
          {[
            { id: 'dashboard', label: 'Monitor Dashboard', icon: TrendingUp },
            { id: 'ideas', label: 'Idea Factory', icon: Lightbulb },
            { id: 'scripts', label: 'Script Designer', icon: BookOpen },
            { id: 'studio', label: 'Video Studio', icon: Smartphone },
            { id: 'copilot', label: 'Automator Co-Pilot', icon: Film }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-3 px-5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer border ${isActive ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-dark-card border-white/5 text-slate-300 hover:bg-zinc-900'}`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {settings && (
            <div className="mt-auto bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
              <span className="text-xxxxs font-mono uppercase text-slate-500 block">Profiles Active</span>
              <div className="flex items-center justify-between text-xxs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Youtube className="w-4 h-4 text-red-500" />
                  {settings.youtubeChannelName}
                </span>
                <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">Live</span>
              </div>
              <div className="flex items-center justify-between text-xxs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  @{settings.instagramUsername}
                </span>
                <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded">Live</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Core Tab Workshop Page Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        {activeTab === 'dashboard' && analyticsHistory && (
          <DashboardTab
            posts={posts}
            analyticsHistory={analyticsHistory}
            onPlaySimulation={onSelectVideoForStudio}
            triggerEngagementTick={() => onEngagementTick(false)}
            isSimulatingEngagement={isSimulatingEngagement}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasTab
            ideas={ideas}
            onGenerateIdeas={onGenerateIdeas}
            onDeleteIdea={onDeleteIdea}
            onCompileScript={onCompileScript}
            isGenerating={isGeneratingIdeas}
            isCompiling={isCompilingScript}
            compilingIdeaId={compilingIdeaId}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptTab
            scripts={scripts}
            onUpdateScript={onUpdateScript}
            onSelectVideoForStudio={onSelectVideoForStudio}
          />
        )}

        {activeTab === 'studio' && (
          <GeneratorTab
            scripts={scripts}
            selectedScriptId={selectedScriptIdForStudio}
          />
        )}

        {activeTab === 'copilot' && settings && (
          <CoPilotTab
            settings={settings}
            logs={logs}
            onUpdateSettings={onUpdateSettings}
            onTriggerMorningAutomation={onTriggerMorningAutomation}
            onClearLogs={onClearLogs}
            isTriggeringAutomation={isTriggeringAutomation}
          />
        )}
      </main>

      {/* Bottom Status Bar Footer */}
      <footer className="h-12 bg-black border-t border-white/10 px-8 flex items-center justify-between text-[10px] text-slate-500 font-mono z-10 w-full mt-auto">
        <div className="flex space-x-6">
          <span className="hidden sm:inline">DISK: 22.4 GB FREE</span>
          <span>UPTIME: 142h 12m</span>
          <span className="hidden md:inline">NODE_PORT: 3000</span>
        </div>
        <div className="flex space-x-4">
          <span className="text-indigo-400 font-semibold animate-pulse">NEXT AUTOMATIC CYCLE: 04:22:18</span>
          <span className="hidden sm:inline text-slate-600">v3.0.4-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
