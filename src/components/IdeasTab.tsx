import { useState } from 'react';
import { VideoIdea } from '../types';
import { Sparkles, Trash2, BookOpen, Clock, Users, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';

interface IdeasTabProps {
  ideas: VideoIdea[];
  onGenerateIdeas: (niche: string, vibe: string) => Promise<void>;
  onDeleteIdea: (id: string) => Promise<void>;
  onCompileScript: (ideaId: string) => Promise<void>;
  isGenerating: boolean;
  isCompiling: boolean;
  compilingIdeaId: string | null;
}

const NICHES = [
  "Anime Stories & Lore",
  "Facts & Science",
  "Health & Fitness",
  "Technology & Finance",
  "Self-Improvement"
];

const VIBES = [
  { value: "mysterious", label: "Mysterious (Deep Voice)" },
  { value: "energetic", label: "Energetic (Fast-paced Upbeat)" },
  { value: "informative", label: "Informative (Calm Professional)" },
  { value: "cinematic", label: "Cinematic (Epic Orchestral)" }
];

export default function IdeasTab({
  ideas,
  onGenerateIdeas,
  onDeleteIdea,
  onCompileScript,
  isGenerating,
  isCompiling,
  compilingIdeaId
}: IdeasTabProps) {
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0].value);

  const handleGenerate = () => {
    onGenerateIdeas(selectedNiche, selectedVibe);
  };

  return (
    <div id="ideas-tab-root" className="space-y-6">
      {/* Target Generator Config Card */}
      <div id="ideas-generator-card" className="bg-dark-card border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-semibold text-white">Gemini Idea Forge</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1.5">Target Video Niche</label>
            <div className="grid grid-cols-2 gap-2">
              {NICHES.map((niche) => (
                <button
                  key={niche}
                  type="button"
                  onClick={() => setSelectedNiche(niche)}
                  className={`px-3 py-2 border text-left text-xxs font-semibold rounded-lg transition cursor-pointer ${selectedNiche === niche ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-300'}`}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1.5">Vibe Accent</label>
              <select
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
              >
                {VIBES.map((vibe) => (
                  <option key={vibe.value} value={vibe.value}>{vibe.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-4 w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini Researching Trends...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>Research & Draft 3 Trending Ideas with AI</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ideas list queue */}
      <div id="ideas-queue-section" className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">Video Ideas Workshop Queue</h4>

        {ideas.length === 0 ? (
          <div className="p-8 text-center bg-black/40 border border-white/10 rounded-xl flex flex-col items-center gap-2 text-slate-500 text-xs">
            <Lightbulb className="w-8 h-8 text-slate-700 mb-1" />
            <span>Idea list is empty. Click the button above to request Gemini trends!</span>
          </div>
        ) : (
          <div id="ideas-list-grid" className="grid grid-cols-1 gap-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                id={`idea-card-${idea.id}`}
                className="bg-dark-card border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-indigo-500/20 transition duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 bg-black border border-white/10 text-slate-400 rounded font-mono text-xxxxs uppercase tracking-wider">
                        {idea.niche} • {idea.vibe}
                      </span>
                      <h5 className="text-sm font-semibold text-white mt-2 leading-snug">{idea.title}</h5>
                    </div>
                    <button
                      onClick={() => onDeleteIdea(idea.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition cursor-pointer"
                      title="Dismiss Idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 bg-black/40 border border-dashed border-white/5 p-3 rounded-lg mt-3 leading-relaxed">
                    <span className="text-xxxxs font-mono uppercase text-indigo-400 block mb-1">Attention Trigger / Opening Hook</span>
                    "{idea.hook}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-4 text-xxxxs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {idea.durationSeconds}s duration
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Audience: {idea.targetAudience}
                    </span>
                  </div>

                  {idea.status === 'pending' ? (
                    <button
                      onClick={() => onCompileScript(idea.id)}
                      disabled={isCompiling}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white text-xxs font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {isCompiling && compilingIdeaId === idea.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>AI Scriptwriting Storyboard...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Draft Scene Storyboard & Dialogue</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xxs font-bold rounded-lg self-start sm:self-auto flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {idea.status === 'scripted' ? 'Storyboard Compiled' : 'Posted Live'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
