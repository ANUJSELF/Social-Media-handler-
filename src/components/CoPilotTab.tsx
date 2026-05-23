import { useState } from 'react';
import { AutomationSettings, AutomationLog } from '../types';
import { Play, Sparkles, Terminal, Settings2, HelpCircle, Save, Check, RefreshCw, AlertCircle, Eye, Info } from 'lucide-react';

interface CoPilotTabProps {
  settings: AutomationSettings;
  logs: AutomationLog[];
  onUpdateSettings: (settings: AutomationSettings) => Promise<void>;
  onTriggerMorningAutomation: () => Promise<void>;
  onClearLogs: () => Promise<void>;
  isTriggeringAutomation: boolean;
}

export default function CoPilotTab({
  settings,
  logs,
  onUpdateSettings,
  onTriggerMorningAutomation,
  onClearLogs,
  isTriggeringAutomation
}: CoPilotTabProps) {
  const [autoPilot, setAutoPilot] = useState(settings.autoPilotEnabled);
  const [postTime, setPostTime] = useState(settings.postTime);
  const [niche, setNiche] = useState(settings.selectedNiche);
  const [ytChanName, setYtChanName] = useState(settings.youtubeChannelName);
  const [igUsername, setIgUsername] = useState(settings.instagramUsername);
  const [ytConnected, setYtConnected] = useState(settings.youtubeConnected);
  const [igConnected, setIgConnected] = useState(settings.instagramConnected);
  const [contentLanguage, setContentLanguage] = useState(settings.contentLanguage || 'english');
  const [styleTheme, setStyleTheme] = useState(settings.styleTheme || 'standard');
  const [ytClientId, setYtClientId] = useState(settings.youtubeClientId || '');
  const [ytClientSecret, setYtClientSecret] = useState(settings.youtubeClientSecret || '');
  const [igAccessToken, setIgAccessToken] = useState(settings.instagramAccessToken || '');
  const [igPassword, setIgPassword] = useState(settings.instagramPassword || '');
  const [targetFormat, setTargetFormat] = useState(settings.targetFormat || 'both');
  const [dailyInstaPostsCount, setDailyInstaPostsCount] = useState(settings.dailyInstaPostsCount || 4);
  const [customHashtags, setCustomHashtags] = useState(settings.customHashtags || '#anime #manga #naruto #otaku #shinobi #shonen');
  const [autoUpload, setAutoUpload] = useState(settings.autoUploadToPlatforms || false);

  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    await onUpdateSettings({
      autoPilotEnabled: autoPilot,
      postTime,
      selectedNiche: niche,
      youtubeChannelName: ytChanName,
      instagramUsername: igUsername,
      youtubeConnected: ytConnected,
      instagramConnected: igConnected,
      contentLanguage,
      styleTheme,
      youtubeClientId: ytClientId,
      youtubeClientSecret: ytClientSecret,
      instagramAccessToken: igAccessToken,
      instagramPassword: igPassword,
      targetFormat,
      dailyInstaPostsCount,
      customHashtags,
      autoUploadToPlatforms: autoUpload
    });
    setSaving(false);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div id="copilot-tab-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
      
      {/* Settings Grid Panel (Left 7 Columns) */}
      <div id="settings-pnl" className="lg:col-span-12 xl:col-span-7 space-y-6">
        
        {/* Scheduler Config */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between col-span-1">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">Daily Co-Pilot Scheduler</h4>
            </div>
            
            {/* Auto Pilot Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoPilot}
                onChange={(e) => setAutoPilot(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-black border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white" />
              <span className="ml-2 text-xxs font-mono text-slate-400 uppercase">
                {autoPilot ? "Auto Pilot On" : "Auto Pilot Off"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Morning Trigger Time</label>
              <input
                type="text"
                value={postTime}
                onChange={(e) => setPostTime(e.target.value)}
                placeholder="e.g. 08:30"
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Selected Default Niche</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                <option value="Anime Stories & Lore">Anime Stories & Lore</option>
                <option value="Facts & Science">Facts & Science</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Technology & Finance">Technology & Finance</option>
                <option value="Self-Improvement">Self-Improvement</option>
              </select>
            </div>

            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Caption & Audio Languages</label>
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value as any)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                <option value="english">🇺🇸 English Subtitles & Voice</option>
                <option value="hindi">🇮🇳 Hindi Voice & Subtitles (हिन्दी)</option>
                <option value="bilingual_hinglish">🇮🇳 Hinglish (Bilingual Dual Track)</option>
                <option value="spanish">🇪🇸 Spanish Captions (Español)</option>
                <option value="japanese">🇯🇵 Japanese Voice (Anime Vibe)</option>
              </select>
            </div>

            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">AI Video Vibe/Theme Style</label>
              <select
                value={styleTheme}
                onChange={(e) => setStyleTheme(e.target.value as any)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                <option value="standard">🌌 Standard Science Editorial</option>
                <option value="anime_naruto">🦊 Naruto Anime Chronicles</option>
                <option value="neon_cyberpunk">🌆 Neon Cyberpunk Universe</option>
                <option value="vibrant_comic">💥 Vibrant Manga Comic</option>
                <option value="science_editorial">🎒 Scholarly Facts & Mindsets</option>
              </select>
            </div>

            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Video Target Strategy / Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                <option value="shorts">📱 9:16 Portrait Shorts/Stories Only</option>
                <option value="long_form_7min">📺 16:9 7-8 Min Epic Compilation (7+ Story Chapters Combined)</option>
                <option value="both">🌟 Dual: 3-4 Daily Insta Stories + 7-8 Min Compilation Video</option>
              </select>
            </div>

            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Daily Insta Stories/Posts Count</label>
              <select
                value={dailyInstaPostsCount}
                onChange={(e) => setDailyInstaPostsCount(Number(e.target.value))}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans cursor-pointer"
              >
                <option value="1">1 Story Segment Daily</option>
                <option value="2">2 Unique Continuous Chapters</option>
                <option value="3">3 Unique Continuous Chapters</option>
                <option value="4">4 Unique Continuous Chapters (Best Virality)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">AI Search Engine & Viral Custom Hashtags</label>
              <input
                type="text"
                value={customHashtags}
                onChange={(e) => setCustomHashtags(e.target.value)}
                placeholder="e.g. #naruto #anime #shonen #otaku #manga"
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Social Profiles configuration */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xxxxs font-mono uppercase text-slate-400 block tracking-widest">Live API Connectors & Client Secret Storage</span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoUpload}
                  onChange={(e) => setAutoUpload(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-black border border-white/10 rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-500 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
                <span className="ml-1.5 text-xxxxs font-mono text-slate-450 uppercase">Live Uploads Mode</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/40 p-3.5 border border-white/5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-500 font-mono">YouTube Publish Engine</span>
                  <label className="relative inline-flex items-center cursor-pointer select-nonescale-90">
                    <input
                      type="checkbox"
                      checked={ytConnected}
                      onChange={(e) => setYtConnected(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-black border border-white/10 rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-500 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white" />
                  </label>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Channel Name</label>
                    <input
                      type="text"
                      value={ytChanName}
                      onChange={(e) => setYtChanName(e.target.value)}
                      disabled={!ytConnected}
                      placeholder="e.g. CosmoFacts AI Channel"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-red-500 disabled:opacity-45"
                    />
                  </div>
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Google Client ID</label>
                    <input
                      type="text"
                      value={ytClientId}
                      onChange={(e) => setYtClientId(e.target.value)}
                      disabled={!ytConnected}
                      placeholder="OAuth 2.0 app Client ID"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-red-500 disabled:opacity-45 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Google Client Secret</label>
                    <input
                      type="password"
                      value={ytClientSecret}
                      onChange={(e) => setYtClientSecret(e.target.value)}
                      disabled={!ytConnected}
                      placeholder="OAuth client secret token"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-red-500 disabled:opacity-45 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-3.5 border border-white/5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-pink-500 font-mono">Instagram Graph Engine</span>
                  <label className="relative inline-flex items-center cursor-pointer select-nonescale-90">
                    <input
                      type="checkbox"
                      checked={igConnected}
                      onChange={(e) => setIgConnected(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-black border border-white/10 rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-500 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-pink-600 peer-checked:after:bg-white" />
                  </label>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Username handle</label>
                    <input
                      type="text"
                      value={igUsername}
                      onChange={(e) => setIgUsername(e.target.value)}
                      disabled={!igConnected}
                      placeholder="e.g. cosmo_shorts_ai"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-pink-500 disabled:opacity-45"
                    />
                  </div>
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Meta Access Token</label>
                    <input
                      type="password"
                      value={igAccessToken}
                      onChange={(e) => setIgAccessToken(e.target.value)}
                      disabled={!igConnected}
                      placeholder="Long-lived page access token"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-pink-500 disabled:opacity-45 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xxxxxs uppercase font-mono text-slate-500">Instagram Password (For Live Flow)</label>
                    <input
                      type="password"
                      value={igPassword}
                      onChange={(e) => setIgPassword(e.target.value)}
                      disabled={!igConnected}
                      placeholder="Direct automation pass"
                      className="w-full bg-black border border-white/5 text-xxs text-slate-200 p-2 rounded-lg outline-none focus:border-pink-500 disabled:opacity-45 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/15 border border-indigo-500/20 transition"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : savedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Config Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Co-Pilot Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Integration Credentials Help / Guide */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-4.5 h-4.5 text-slate-450" />
            <h4 className="text-sm font-semibold text-white">Advanced API Connectivity Settings</h4>
          </div>

          <div className="space-y-4 text-xxs font-sans leading-relaxed text-slate-400">
            <p>
              To establish genuine automated publication triggers on live YouTube channels and Instagram Reels out-of-the-box, setup custom token proxies:
            </p>

            <div className="border-l-2 border-white/5 pl-3 py-1 space-y-2">
              <p className="text-white text-xxxxs uppercase font-mono font-bold flex items-center gap-1 text-red-500">
                <Info className="w-3.5 h-3.5" />
                YouTube Publishing Node API:
              </p>
              <span className="block text-xxxxs text-slate-500 font-mono">
                1. Navigate to Google Cloud Console. Enable "YouTube Data API v3"<br />
                2. Configure OAuth Consent. Request scope: <code className="text-slate-300 bg-black/60 px-1 py-0.5 rounded border border-white/5 font-mono">https://www.googleapis.com/auth/youtube.upload</code><br />
                3. Download client_secret.json and append token to your environment variables file.
              </span>
            </div>

            <div className="border-l-2 border-white/5 pl-3 py-1 space-y-2">
              <p className="text-white text-xxxxs uppercase font-mono font-bold flex items-center gap-1 text-pink-400">
                <Info className="w-3.5 h-3.5px" />
                Instagram Graph Access Node:
              </p>
              <span className="block text-xxxxs text-slate-500 font-mono">
                1. Go to Facebook Developer Suite. Enable Instagram Graph API endpoints.<br />
                2. Sync page with an Instagram Business profile.<br />
                3. Capture "Long-Lived Meta Access Tokens" and write to standard proxy nodes.
              </span>
            </div>
            
            <p className="text-xxxxs text-slate-500 font-mono">
              Note: Under current AI Studio dev sandbox environment variables, automated triggers resolve to high-precision API client proxies which correctly mock request endpoints to ensure free limits and zero token blocks!
            </p>
          </div>
        </div>
      </div>

      {/* Terminal Live logs (Right 5 Columns) */}
      <div id="logs-pnl" className="lg:col-span-12 xl:col-span-5 space-y-6">
        
        {/* Instant Automation trigger */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/10 border border-white/5 p-5 rounded-xl text-center space-y-4 shadow-xl">
          <div className="mx-auto p-3 w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse text-indigo-400" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Automate Morning Loop Demo</h4>
            <p className="text-xxs text-slate-400 mt-1 max-w-sm mx-auto leading-normal">
              Skip actual clocks and trigger the multi-part robot immediately. This researches ideas, drafts scenes, saves the script and simulates automated Shorts/Reels posts!
            </p>
          </div>

          <button
            onClick={onTriggerMorningAutomation}
            disabled={isTriggeringAutomation}
            className="w-full px-5 py-3 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 transition"
          >
            {isTriggeringAutomation ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Running Automation Loop...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Trigger Morning Automation (DEMO)</span>
              </>
            )}
          </button>
        </div>

        {/* Live Terminal Terminal console logs */}
        <div className="bg-dark-card border border-white/10 rounded-xl overflow-hidden flex flex-col h-[350px]">
          <div className="bg-black/40 p-3 px-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-450 font-bold">Co-Pilot Core Terminal Logs</span>
            </div>
            <button
              onClick={onClearLogs}
              className="text-xxxxs text-slate-500 hover:text-white font-mono cursor-pointer transition"
            >
              [Clear logs]
            </button>
          </div>

          <div id="live-logs-box" className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xxxxs">
                Terminal idle. No log activities recorded today.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="text-xxxxs font-mono leading-relaxed select-text flex items-start gap-2">
                  <span className="text-slate-605 select-none flex-shrink-0 text-slate-600">
                    [{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                  </span>
                  
                  <span className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    log.type === 'error' ? 'text-red-405 font-semibold' : 'text-slate-350'
                  }>
                    {log.type === 'success' ? '✔ ' : log.type === 'warning' ? '⚠ ' : log.type === 'error' ? '✖ ' : 'ℹ '}
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
