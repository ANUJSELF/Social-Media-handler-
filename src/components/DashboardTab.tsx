import { useState } from 'react';
import { SocialPost } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Youtube, Instagram, Play, Eye, Heart, MessageSquare, Share2, TrendingUp, Sparkles, AlertCircle, BarChart3, Globe, Users, Clock, Languages, Tag, Check, ArrowUpDown, Filter, X, Calendar, Copy } from 'lucide-react';

interface DashboardTabProps {
  posts: SocialPost[];
  analyticsHistory: {
    days: string[];
    youtubeViews: number[];
    instagramViews: number[];
    youtubeSubscribers: number[];
    instagramFollowers: number[];
  };
  onPlaySimulation: (scriptId: string) => void;
  triggerEngagementTick: () => void;
  isSimulatingEngagement: boolean;
}

export default function DashboardTab({
  posts,
  analyticsHistory,
  onPlaySimulation,
  triggerEngagementTick,
  isSimulatingEngagement
}: DashboardTabProps) {
  const [activePlatform, setActivePlatform] = useState<'all' | 'youtube' | 'instagram'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Helper procedurally generating premium metrics & demographics for posts
  const getPostAnalytics = (post: SocialPost) => {
    if (post.analytics) return post.analytics;

    // Stable seed based on ID
    let seed = 0;
    for (let i = 0; i < post.id.length; i++) {
      seed += post.id.charCodeAt(i);
    }

    const isAnime = post.title.toLowerCase().includes('jupiter') || 
                    post.title.toLowerCase().includes('anime') || 
                    post.title.toLowerCase().includes('naruto') || 
                    post.title.toLowerCase().includes('ninja') || 
                    post.niche.includes('Anime');

    const hashtags = isAnime
      ? ["#AnimeStory", "#NarutoVibe", "#NinjaMantra", "#ShinobiQuest", "#HindiAnimeCaption", "#AnimeDaily", "#ViralFeeds"]
      : ["#SpaceScience", "#DiamondRain", "#CosmosSecrets", "#HinglishCaptions", "#GeminiCompiler", "#FactTok", "#ScienceShorts"];

    const language = isAnime ? "Hindi & English (Dual Track)" : "English & Hinglish Captions";

    // Stable retention percentage curve
    const retentionCurve = [
      100,
      82 + (seed % 15),  // 25% duration
      65 + (seed % 17),  // 50% duration
      48 + (seed % 13),  // 75% duration
      40 + (seed % 11)   // 100% duration
    ];

    // Build age brackets
    const age = [
      { label: "13-17", value: 12 + (seed % 10) },
      { label: "18-24", value: 38 + (seed % 15) },
      { label: "25-34", value: 26 + (seed % 8) },
      { label: "35+", value: 10 + (seed % 6) }
    ];
    const ageSum = age.reduce((s, a) => s + a.value, 0);
    age.forEach(a => a.value = Math.round((a.value / ageSum) * 100));

    // Male gender %
    const male = 50 + (seed % 28);
    const female = 100 - male - 3;
    const gender = [
      { label: "Male ♂", value: male },
      { label: "Female ♀", value: female },
      { label: "Other ⚨", value: 3 }
    ];

    // Countries
    const countries = [
      { label: "India 🇮🇳", value: 35 + (seed % 18) },
      { label: "United States 🇺🇸", value: 28 + (seed % 12) },
      { label: "United Kingdom 🇬🇧", value: 12 + (seed % 6) },
      { label: "Germany 🇩🇪", value: 8 + (seed % 5) },
      { label: "Other 🌐", value: 8 }
    ];
    const countSum = countries.reduce((s, c) => s + c.value, 0);
    countries.forEach(c => c.value = Math.round((c.value / countSum) * 100));

    return {
      language,
      hashtags,
      retentionCurve,
      demographics: { age, gender, countries }
    };
  };

  // Aggregated calculations based on filters
  let filteredPosts = [...posts];

  // Apply platform filtering
  if (activePlatform === 'youtube') {
    filteredPosts = filteredPosts.filter(p => !!p.youtube);
  } else if (activePlatform === 'instagram') {
    filteredPosts = filteredPosts.filter(p => !!p.instagram);
  }

  // Apply Date Range filtering
  const now = new Date();
  if (dateFilter === '7days') {
    const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredPosts = filteredPosts.filter(p => new Date(p.postedAt) >= limit);
  } else if (dateFilter === '30days') {
    const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredPosts = filteredPosts.filter(p => new Date(p.postedAt) >= limit);
  }

  // Calculate sum counts for filtered or full lists
  const totalYtViews = posts.reduce((acc, p) => acc + (p.youtube?.views || 0), 0);
  const totalIgViews = posts.reduce((acc, p) => acc + (p.instagram?.views || 0), 0);
  const totalYtLikes = posts.reduce((acc, p) => acc + (p.youtube?.likes || 0), 0);
  const totalIgLikes = posts.reduce((acc, p) => acc + (p.instagram?.likes || 0), 0);
  const totalYtCmts = posts.reduce((acc, p) => acc + (p.youtube?.comments || 0), 0);
  const totalIgCmts = posts.reduce((acc, p) => acc + (p.instagram?.comments || 0), 0);

  // Apply sorting
  filteredPosts.sort((a, b) => {
    let propA = 0;
    let propB = 0;

    if (sortBy === 'date') {
      propA = new Date(a.postedAt).getTime();
      propB = new Date(b.postedAt).getTime();
    } else if (sortBy === 'views') {
      propA = (a.youtube?.views || 0) + (a.instagram?.views || 0);
      propB = (b.youtube?.views || 0) + (b.instagram?.views || 0);
    } else if (sortBy === 'likes') {
      propA = (a.youtube?.likes || 0) + (a.instagram?.likes || 0);
      propB = (b.youtube?.likes || 0) + (b.instagram?.likes || 0);
    }

    return sortOrder === 'desc' ? propB - propA : propA - propB;
  });

  // Prepare overall views chart data
  const chartData = analyticsHistory.days.map((day, idx) => ({
    name: day,
    "YouTube Views": analyticsHistory.youtubeViews[idx] || 0,
    "Instagram Views": analyticsHistory.instagramViews[idx] || 0,
    "YouTube Subs": analyticsHistory.youtubeSubscribers[idx] || 0,
    "Instagram Followers": analyticsHistory.instagramFollowers[idx] || 0
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleCopyTags = (hashtags: string[]) => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedStatus(text);
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  return (
    <div id="dashboard-container" className="space-y-6">
      {/* Simulation Engagement Trigger */}
      <div id="simulation-banner" className="bg-gradient-to-r from-zinc-900 via-[#121216] to-[#0a0a0f] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-500/5 rounded-xl border border-white/5 text-slate-300 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Cloud Traffic Simulation Engine
              <span className="text-[10px] font-mono font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-1.5 py-0.5 rounded uppercase">API Active</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Simulate dynamic, real-world scrolling audiences. Clicking triggers the local agent scheduler which boosts mock views, retention levels, comments, and follower metrics organically.
            </p>
          </div>
        </div>
        <button
          id="btn-trigger-engagement"
          onClick={triggerEngagementTick}
          disabled={isSimulatingEngagement}
          className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white text-xs font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
        >
          {isSimulatingEngagement ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Polling Channel Impressions...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              <span>Simulate Real-time Impressions (+Tock)</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Summary Cards */}
      <div id="stats-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111115] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">YouTube Views</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-1 px-1.5 bg-red-500/5 rounded border border-red-500/10 text-red-500">
              <Youtube className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">{formatNumber(totalYtViews + 12500)}</span>
          </div>
          <p className="text-xxs text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
            <span>↑ 18.2%</span>
            <span className="text-slate-500 font-normal">this week</span>
          </p>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Instagram Views</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-1 px-1.5 bg-pink-500/5 rounded border border-pink-500/10 text-pink-550">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">{formatNumber(totalIgViews + 18400)}</span>
          </div>
          <p className="text-xxs text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
            <span>↑ 24.5%</span>
            <span className="text-slate-500 font-normal">this week</span>
          </p>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Est. Engagement Rate</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-1 px-1.5 bg-purple-500/5 rounded border border-purple-500/10 text-purple-400">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              {posts.length > 0 ? (((totalYtLikes + totalYtCmts + totalIgLikes + totalIgCmts) / (totalYtViews + totalIgViews || 1)) * 100).toFixed(2) : "0.00"}%
            </span>
          </div>
          <p className="text-xxs text-indigo-400 font-mono mt-1.5">
            Avg audience index is high
          </p>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Automation Portfolio</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="p-1 px-1.5 bg-indigo-500/5 rounded border border-indigo-500/10 text-indigo-500">
              <Play className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">{posts.length} published</span>
          </div>
          <p className="text-xxs text-slate-500 font-mono mt-1.5">
            Synced via custom nodes
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div id="chart-panel" className="bg-[#111115] border border-white/10 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Aggregate Performance Metrics Overview</h4>
            <span className="text-slate-500 text-xxs font-mono">Channel impressions comparison over selected cycle</span>
          </div>
          <div className="flex gap-1 bg-black border border-white/10 p-1 rounded-lg">
            <button
              onClick={() => setActivePlatform('all')}
              className={`px-3 py-1 rounded text-xxs font-semibold transition cursor-pointer ${activePlatform === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Channels
            </button>
            <button
              onClick={() => setActivePlatform('youtube')}
              className={`px-3 py-1 rounded text-xxs font-semibold transition cursor-pointer ${activePlatform === 'youtube' ? 'bg-red-600/20 text-red-400 border border-red-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              YouTube
            </button>
            <button
              onClick={() => setActivePlatform('instagram')}
              className={`px-3 py-1 rounded text-xxs font-semibold transition cursor-pointer ${activePlatform === 'instagram' ? 'bg-pink-600/20 text-pink-400 border border-pink-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              Instagram
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a0a0af0', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ fontSize: '11px', color: '#fff' }}
              />
              {(activePlatform === 'all' || activePlatform === 'youtube') && (
                <Area type="monotone" name="YouTube Views" dataKey="YouTube Views" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorYt)" />
              )}
              {(activePlatform === 'all' || activePlatform === 'instagram') && (
                <Area type="monotone" name="Instagram Views" dataKey="Instagram Views" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorIg)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Posts Breakdown with Advanced Filters */}
      <div id="posts-list-section" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">Video Content Portfolio & Reports</h4>
            <p className="text-xxs text-slate-400 mt-1">Analytics parsed on dynamic publication feeds</p>
          </div>

          {/* Interactive filter and sort controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Date */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 p-1.5 px-3 rounded-lg text-xxs font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Range:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-transparent border-none text-slate-200 text-xxs outline-none cursor-pointer font-sans"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Sort by parameter */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 p-1.5 px-3 rounded-lg text-xxs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-slate-200 text-xxs outline-none cursor-pointer font-sans"
              >
                <option value="date">Date Published</option>
                <option value="views">Total Views</option>
                <option value="likes">Total Likes</option>
              </select>
            </div>

            {/* Toggle Ascending/Descending */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="bg-black/60 hover:bg-zinc-800 border border-white/10 p-1.5 px-3 rounded-lg text-xxs font-mono text-slate-355 flex items-center gap-1 transition-all cursor-pointer"
              title={sortOrder === 'desc' ? "Descending Order" : "Ascending Order"}
            >
              <span>{sortOrder === 'desc' ? "Highest First" : "Lowest First"}</span>
            </button>
          </div>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-[#111115]/50 border border-white/5 rounded-2xl flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-indigo-400/45" />
            <span className="text-slate-350 text-xs font-semibold">No Matching Videos Found</span>
            <p className="text-xxs text-slate-500 max-w-sm">Try relaxing your date or platform options, or triggers the Daily Morning Automations.</p>
          </div>
        ) : (
          <div id="posts-container" className="space-y-4">
            {filteredPosts.map((post) => {
              const meta = getPostAnalytics(post);
              return (
                <div
                  key={post.id}
                  id={`post-card-${post.id}`}
                  className="bg-[#111115] hover:bg-[#141419] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 transition duration-200"
                >
                  {/* Thumbnail Preview Area */}
                  <div className="relative w-full md:w-36 h-48 md:h-28 rounded-lg overflow-hidden bg-black flex-shrink-0 group">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 text-center">
                      <button
                        onClick={() => onPlaySimulation(post.scriptId)}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100 shadow-md transition duration-200 cursor-pointer"
                        title="Load Video Simulator"
                      >
                        <Play className="w-4.5 h-4.5 fill-current" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-xxxxs text-slate-405 uppercase font-mono tracking-wider">
                      {post.niche}
                    </span>
                  </div>

                  {/* Info and Platform Stats */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-white leading-tight hover:text-indigo-400 cursor-pointer transition" onClick={() => setSelectedPost(post)}>
                          {post.title}
                        </h5>
                        <p className="text-xxs text-slate-500 mt-1 flex items-center gap-2">
                          <span>Posted: {new Date(post.postedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span className="text-indigo-400 uppercase font-mono text-[9px] font-bold">{meta.language}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-450 border border-indigo-500/15 text-[10px] uppercase font-mono rounded font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>View Analytics Report</span>
                      </button>
                    </div>

                    {/* Twin Pillar Platform Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/5">
                      {/* YouTube Stats */}
                      {post.youtube && (
                        <div className="bg-black/30 border border-white/5 p-2.5 rounded-lg flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <YouTubeIcon />
                              <span className="text-xxxxs font-mono uppercase text-slate-400 font-bold">YouTube Shorts</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">Avg Retention: {meta.retentionCurve[2]}%</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Views</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.youtube.views)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Likes</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.youtube.likes)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Cmts</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.youtube.comments)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Shrs</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.youtube.shares)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Instagram Stats */}
                      {post.instagram && (
                        <div className="bg-black/30 border border-white/5 p-2.5 rounded-lg flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <InstagramIcon />
                              <span className="text-xxxxs font-mono uppercase text-slate-400 font-bold">Instagram Reel</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 font-bold text-pink-400">Perfect active feed</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Views</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.instagram.views)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Likes</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.instagram.likes)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Cmts</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.instagram.comments)}</span>
                            </div>
                            <div className="text-center">
                              <span className="text-slate-500 text-[9px] font-mono uppercase block">Shrs</span>
                              <span className="text-xxs font-semibold text-white">{formatNumber(post.instagram.shares)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED INSIGHTS DIALOG MODAL PANEL */}
      {selectedPost && (() => {
        const meta = getPostAnalytics(selectedPost);
        
        // Map 5 points into a nice visual curve for Line Chart
        const lineData = [
          { name: '0s (Hook)', value: meta.retentionCurve[0] },
          { name: '25% duration', value: meta.retentionCurve[1] },
          { name: '50% duration', value: meta.retentionCurve[2] },
          { name: '75% duration', value: meta.retentionCurve[3] },
          { name: 'End (CTA)', value: meta.retentionCurve[4] }
        ];

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-slate-350">
            <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/5">
                    <img src={selectedPost.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xxs font-mono uppercase tracking-wider text-indigo-400">{selectedPost.niche} Niche</span>
                    <h5 className="text-sm font-bold text-white max-w-md truncate">{selectedPost.title}</h5>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1 px-1.5 hover:bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  aria-label="Close analytics report dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Contents panel */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Visual side-by-side Platforms totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* YouTube report block */}
                  {selectedPost.youtube && (
                    <div className="bg-black/30 border border-red-500/10 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5">
                        <YouTubeIcon />
                        <span className="text-xxs font-mono uppercase tracking-wider text-red-500 font-bold">YouTube Reels Analytics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Shorts Views</span>
                          <span className="text-lg font-bold text-white">{selectedPost.youtube.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Watch Time</span>
                          <span className="text-lg font-bold text-white font-mono">{selectedPost.youtube.watchTimeHours || 0} hrs</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Reaction Swipes</span>
                          <span className="text-xs text-slate-300 font-semibold">{selectedPost.youtube.likes.toLocaleString()} likes • {selectedPost.youtube.comments.toLocaleString()} cmts</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Shares Triggered</span>
                          <span className="text-xs text-slate-300 font-semibold">{selectedPost.youtube.shares} direct taps</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instagram report block */}
                  {selectedPost.instagram && (
                    <div className="bg-black/30 border border-pink-500/10 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5">
                        <InstagramIcon />
                        <span className="text-xxs font-mono uppercase tracking-wider text-pink-500 font-bold">Instagram Reels Insights</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Reels Views</span>
                          <span className="text-lg font-bold text-white">{selectedPost.instagram.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Likes & Comments</span>
                          <span className="text-lg font-bold text-white font-mono">{selectedPost.instagram.likes.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Organic Comments</span>
                          <span className="text-xs text-slate-300 font-semibold">{selectedPost.instagram.comments} engagement threads</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Fwd Shares</span>
                          <span className="text-xs text-slate-300 font-semibold">{selectedPost.instagram.shares} reels-story forwards</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Audience Retention Curve Panel */}
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="text-xxs font-mono uppercase tracking-wider text-slate-300 font-bold">Audience Retention Curve</span>
                    </div>
                    <span className="text-xxs text-slate-450 font-mono">Avg Watch Duration: <strong className="text-indigo-400">82.1%</strong></span>
                  </div>

                  <p className="text-xxxxs text-slate-500 uppercase tracking-wide font-mono leading-relaxed">
                    Visual curve indicates the percentage of viewers who remain engaged across the complete runtime. A 50% watch time marker holds high algorithmic leverage on recommendation feeds.
                  </p>

                  <div className="h-44 w-full pr-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={9} />
                        <YAxis domain={[0, 100]} stroke="#52525b" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: '#09090c', border: '1px solid #1f1f23', borderRadius: '6px' }} />
                        <Line type="monotone" name="Retention %" dataKey="value" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Demographics breakdown: Age distribution, Gender index, Countries Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Demographics columns 1: Age & Gender */}
                  <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-xxs font-mono uppercase tracking-wider text-slate-200 font-bold">Audience Demographics Split</span>
                    </div>

                    {/* Gender representation bars */}
                    <div className="space-y-2">
                      <span className="text-xxxxs font-mono uppercase text-slate-400 block tracking-wider">Gender Identities Percentage:</span>
                      <div className="flex hover:opacity-95 transition-all">
                        {meta.demographics.gender.map((g, idx) => (
                          <div
                            key={g.label}
                            style={{ width: `${g.value}%` }}
                            className={`h-5 flex items-center justify-center text-[8px] font-mono text-white font-bold tracking-tight ${idx === 0 ? "bg-indigo-600 rounded-l" : idx === 1 ? "bg-pink-600" : "bg-neutral-700 rounded-r"}`}
                            title={`${g.label}: ${g.value}%`}
                          >
                            <span>{g.value}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xxxxs font-mono text-slate-500 pt-1">
                        <span className="text-indigo-450 font-bold">■ Male ({meta.demographics.gender[0].value}%)</span>
                        <span className="text-pink-450 font-bold">■ Female ({meta.demographics.gender[1].value}%)</span>
                        <span className="text-slate-400 font-bold">■ Other (3%)</span>
                      </div>
                    </div>

                    {/* Age indicators bars schema */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-xxxxs font-mono uppercase text-slate-400 block tracking-wider">Viewer Age Segments:</span>
                      <div className="space-y-2">
                        {meta.demographics.age.map((a) => (
                          <div key={a.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xxxxs font-mono">
                              <span className="text-slate-300 font-bold">{a.label} Bracket</span>
                              <span className="text-indigo-400">{a.value}% of views</span>
                            </div>
                            <div className="h-1.5 w-full bg-black rounded overflow-hidden border border-white/5">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded" style={{ width: `${a.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Demographics columns 2: Geography Location mapping */}
                  <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      <span className="text-xxs font-mono uppercase tracking-wider text-slate-200 font-bold">Top Geographic Territories</span>
                    </div>
                    <p className="text-xxxxs text-slate-500 font-mono tracking-wide leading-relaxed">
                      Geographic indexes correspond strictly to targeted multi-language localization nodes designed by the compiler schema.
                    </p>

                    <div className="space-y-3 pt-1">
                      {meta.demographics.countries.map((c) => (
                        <div key={c.label} className="space-y-1">
                          <div className="flex items-center justify-between text-xxxxs font-mono">
                            <span className="text-slate-350 font-semibold">{c.label}</span>
                            <span className="text-white font-mono">{c.value}%</span>
                          </div>
                          <div className="h-1 bg-black rounded overflow-hidden">
                            <div className="h-full bg-indigo-550 rounded" style={{ width: `${c.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Subtitles & Dynamic Feeds Hashtags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#121217] p-4 rounded-xl space-y-3 border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-purple-400" />
                      <span className="text-xxs font-mono uppercase tracking-wider text-slate-200 font-bold">Language Tracks & Captions</span>
                    </div>
                    <div className="space-y-2 text-xxxxs leading-relaxed font-mono">
                      <p className="text-slate-250">
                        Tracks contain synchronized subtitle arrays embedded natively in compiled audio clips of English & Hindi tracks:
                      </p>
                      <div className="p-2.5 bg-black/60 rounded border border-white/5 space-y-1 text-slate-400 text-xxs">
                        <span className="block text-xxxxs text-indigo-400 uppercase font-bold">Generated tracks checklist:</span>
                        <div className="flex items-center gap-1">✅ <span className="text-xxxxs select-text">English (En) voiceover subtitles compiled</span></div>
                        <div className="flex items-center gap-1">✅ <span className="text-xxxxs select-text">Hindi (Hi) synthetic translation captions written</span></div>
                        <div className="flex items-center gap-1">✅ <span className="text-xxxxs select-text">Bilingual (Hinglish) romanized dialogue subtitles</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121217] p-4 rounded-xl space-y-3 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-indigo-400" />
                        <span className="text-xxs font-mono uppercase tracking-wider text-slate-200 font-bold">Active Search Hashtags</span>
                      </div>
                      <button
                        onClick={() => handleCopyTags(meta.hashtags)}
                        className="p-1 px-2.5 hover:bg-neutral-800 text-xxs font-mono text-slate-350 border border-white/10 rounded-md transition flex items-center gap-1 cursor-pointer"
                        title="Copy hashtags string to clipboard"
                      >
                        {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedStatus ? "Copied" : "Copy Tags"}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {meta.hashtags.map((tag) => (
                        <span key={tag} className="text-xxxxs font-mono bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/15 rounded px-2.5 py-1 select-all cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono tracking-tight leading-normal pt-1.5">
                      Perfect tags index to maximize YouTube feeds placement index.
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer controls */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-2.5">
                <button
                  onClick={() => onPlaySimulation(selectedPost.scriptId)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Video Studio Simulator</span>
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-zinc-900 border border-white/10 text-slate-300 hover:text-white hover:bg-zinc-800 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <span>Close report</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Inline platform color helpers
const YouTubeIcon = () => (
  <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163c-.272-1.015-1.072-1.815-2.083-2.087C19.577 3.5 12 3.5 12 3.5s-7.577 0-9.415.576c-1.011.272-1.811 1.072-2.083 2.087C0 8.002 0 12 0 12s0 3.998.576 5.837c.272 1.014 1.072 1.814 2.083 2.086C4.423 20.5 12 20.5 12 20.5s7.577 0 9.415-.576c1.011-.272 1.811-1.072 2.083-2.086C24 15.998 24 12 24 12s0-3.998-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 text-pink-500 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
