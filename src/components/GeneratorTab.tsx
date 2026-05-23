import { useState, useEffect, useRef } from 'react';
import { VideoScript } from '../types';
import { Play, Pause, RotateCcw, AlertCircle, Sparkles, Film, Volume2, Type } from 'lucide-react';

interface GeneratorTabProps {
  scripts: VideoScript[];
  selectedScriptId: string | null;
}

export default function GeneratorTab({ scripts, selectedScriptId }: GeneratorTabProps) {
  const [activeScript, setActiveScript] = useState<VideoScript | null>(null);
  const [captionMode, setCaptionMode] = useState<'english' | 'hindi' | 'bilingual' | 'default'>('default');
  
  // Compiler state variables
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compiled, setCompiled] = useState<Record<string, boolean>>({
    "script-1": true,
    "script-space": true
  });

  // Playback state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100 for active scene timer

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (scripts.length > 0) {
      const idToLoad = selectedScriptId || scripts[0].id;
      const found = scripts.find(s => s.id === idToLoad);
      if (found) {
        setActiveScript(found);
        // Reset playback when switching script
        resetPlayback();
      }
    }
  }, [scripts, selectedScriptId]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopSpeech = () => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (e) {
        console.error("SpeechSynthesis error:", e);
      }
    }
  };

  const playSpeechForActiveScene = (text: string) => {
    stopSpeech();
    if (!synthRef.current) return;
    try {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 1.05; // slightly faster for Shorts layout style
      utteranceRef.current.pitch = activeScript?.voiceName === 'Kore' ? 0.95 : 1.05; // tone shifter
      synthRef.current.speak(utteranceRef.current);
    } catch (e) {
      console.error("Speech play failed:", e);
    }
  };

  const handleScriptSelect = (id: string) => {
    const found = scripts.find(s => s.id === id);
    if (found) {
      setActiveScript(found);
      resetPlayback();
    }
  };

  const startCompileSimulation = () => {
    if (!activeScript) return;
    setIsCompiling(true);
    setCompileProgress(0);
    stopPlayback();

    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompiling(false);
          setCompiled((prevCompiled) => ({
            ...prevCompiled,
            [activeScript.id]: true
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const togglePlayback = () => {
    if (!activeScript) return;
    
    // Ensure compiled first
    if (!compiled[activeScript.id]) {
      startCompileSimulation();
      return;
    }

    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    if (!activeScript) return;
    setIsPlaying(true);

    const activeScene = activeScript.scenes[currentSceneIdx];
    if (activeScene) {
      playSpeechForActiveScene(activeScene.dialogue);
    }

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        const sceneDuration = activeScript.scenes[currentSceneIdx]?.duration || 8;
        const tickStep = (100 / (sceneDuration * 5)); // 5 checks per second (200ms)

        if (prev >= 100) {
          // Progress complete, check if we shift to next scene
          if (currentSceneIdx < activeScript.scenes.length - 1) {
            const nextIdx = currentSceneIdx + 1;
            setCurrentSceneIdx(nextIdx);
            
            // Speak next line
            const nextSceneText = activeScript.scenes[nextIdx]?.dialogue || '';
            playSpeechForActiveScene(nextSceneText);
            
            return 0; // Reset progress bar for next scene
          } else {
            // End of entire video script reached
            stopPlayback();
            resetPlayback();
            return 0;
          }
        }
        return prev + tickStep;
      });
    }, 200);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    stopSpeech();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetPlayback = () => {
    stopPlayback();
    setCurrentSceneIdx(0);
    setSceneProgress(0);
  };

  const currentScene = activeScript?.scenes[currentSceneIdx];
  const isCurrentlyCompiled = activeScript ? compiled[activeScript.id] : false;

  return (
    <div id="generator-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* 9:16 Short Video Mockup Player (Covers Left 5 columns) */}
      <div id="video-player-container" className="lg:col-span-12 xl:col-span-5 flex flex-col items-center">
        <label className="text-xxxxs font-mono uppercase text-slate-500 mb-2 tracking-widest">Portrait Channel Studio Preview</label>
        
        <div id="phone-housing" className="relative w-[280px] h-[500px] sm:w-[310px] sm:h-[550px] bg-black rounded-[32px] shadow-2xl shadow-indigo-500/5 ring-8 ring-zinc-900 overflow-hidden flex flex-col border-4 border-zinc-800">
          
          {/* Top Notch Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full border border-zinc-850" />
          </div>

          {currentScene ? (
            <div className="relative flex-1 overflow-hidden select-none bg-[#020202] flex items-center justify-center">
              
              {/* Active Image with Slow Zoom Panning Animation */}
              <img
                src={currentScene.imageUrl}
                alt={`Scene ${currentScene.sceneNumber}`}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[10s] ease-out ${isPlaying ? 'scale-108 translate-y-1' : 'scale-100'}`}
              />

              {/* Ambient Shadow Gradients over Top and Bottom for legibility */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

              {/* Precise Centered Subtitles Captain */}
              <div className="absolute inset-x-4 bottom-20 z-20 text-center px-2 animate-pulse">
                <span className="inline-block bg-yellow-450 border border-yellow-350 text-slate-950 text-xxxxs sm:text-xxs font-extrabold tracking-tight px-3 py-1.5 rounded bg-amber-400 font-sans shadow-xl uppercase leading-normal">
                  {captionMode === 'english' ? (currentScene.captionEnglish || currentScene.voiceoverText) :
                   captionMode === 'hindi' ? (currentScene.captionHindi || currentScene.voiceoverText) :
                   captionMode === 'bilingual' ? (currentScene.captionBilingual || currentScene.voiceoverText) :
                   currentScene.voiceoverText}
                </span>
              </div>

              {/* Absolute Watermarks */}
              <div className="absolute top-8 left-4 z-20 flex items-center gap-1 opacity-70">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-[9px] font-mono text-white/90 uppercase tracking-widest font-semibold">PREVIEW PORT</span>
              </div>

              <div className="absolute top-8 right-4 z-20 font-mono text-white/80 text-[9px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
                Scene {currentScene.sceneNumber}/{activeScript?.scenes.length}
              </div>

              {/* Sound Overlay Visualizer */}
              {isPlaying && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
                  <span className="text-[8px] font-mono text-white/60 text-right">TTS ACTIVE</span>
                  <div className="flex justify-end gap-0.5 h-6 items-end mt-1">
                    <div className="w-0.5 bg-yellow-400 animate-pulse h-3" />
                    <div className="w-0.5 bg-yellow-400 animate-pulse h-5 delay-75" />
                    <div className="w-0.5 bg-yellow-400 animate-pulse h-2 delay-150" />
                    <div className="w-0.5 bg-yellow-400 animate-pulse h-6 delay-100" />
                  </div>
                </div>
              )}

              {/* Non-compiled Overlay blur */}
              {!isCurrentlyCompiled && (
                <div className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-3 bg-amber-500/5 border border-white/5 rounded-2xl text-amber-500 mb-3">
                    <Film className="w-6 h-6 animate-bounce" />
                  </div>
                  <h5 className="text-white text-xs font-bold font-sans">Full Video Compilation Required</h5>
                  <p className="text-slate-400 text-xxs mt-1.5 max-w-xs leading-relaxed">
                    Render synthesis files, audio accents, and layered subtitles to prepare high-resolution mobile exports.
                  </p>
                  <button
                    onClick={startCompileSimulation}
                    disabled={isCompiling}
                    className="mt-4 px-4 py-2 bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 text-white text-xxs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition cursor-pointer"
                  >
                    {isCompiling ? "Compiling Layers..." : "Compile Video Layers"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Film className="w-8 h-8 text-slate-800 mb-2" />
              <span className="text-xxs">No assets loaded</span>
            </div>
          )}

          {/* Bottom Progress Scrub Row and Controls */}
          {currentScene && isCurrentlyCompiled && (
            <div className="bg-[#0c0c0e] p-4 border-t border-white/5 z-20 space-y-3">
              {/* Multi-scene progress dots */}
              <div className="grid grid-cols-3 gap-1.5 h-1">
                {activeScript?.scenes.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full rounded transition-all duration-300 ${idx < currentSceneIdx ? 'bg-indigo-500' : idx === currentSceneIdx ? 'bg-slate-300' : 'bg-slate-800'}`}
                  >
                    {idx === currentSceneIdx && (
                      <div className="bg-indigo-500 h-full rounded transition-all" style={{ width: `${sceneProgress}%` }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Tactile Media Play controls */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={resetPlayback}
                  className="p-1.5 text-slate-500 hover:text-white hover:bg-zinc-900 border border-white/5 rounded-md transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlayback}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Shorts Clip</span>
                    </>
                  )}
                </button>

                <div className="p-1.5 bg-black rounded border border-white/5 text-slate-400 text-xxxxs cursor-default flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>TTS Synth</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Studio Caption Control Tracks */}
        {currentScene && isCurrentlyCompiled && (
          <div className="mt-4 bg-[#0a0a0d] border border-white/5 p-3 rounded-2xl w-[280px] sm:w-[310px] space-y-2 select-none shadow-xl">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
              <Type className="w-3.5 h-3.5 text-yellow-400" />
              <span>Interactive Subtitle Tracks</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1 rounded-xl">
              <button
                onClick={() => setCaptionMode('default')}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold transition cursor-pointer ${captionMode === 'default' ? 'bg-zinc-800 text-white border border-white/10' : 'text-slate-400 hover:text-white'}`}
                title="Default original generated text"
              >
                DEFAULT
              </button>
              <button
                onClick={() => setCaptionMode('english')}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold transition cursor-pointer ${captionMode === 'english' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                title="Verify matching English translation layers"
              >
                ENGLISH
              </button>
              <button
                onClick={() => setCaptionMode('hindi')}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-mono font-bold transition cursor-pointer ${captionMode === 'hindi' ? 'bg-pink-600/20 text-pink-400 border border-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                title="Verify matching Hindi translation layers"
              >
                हिन्दी
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => setCaptionMode('bilingual')}
                className={`w-full px-2 py-1 rounded-lg text-[8px] font-mono font-bold transition cursor-pointer text-center ${captionMode === 'bilingual' ? 'bg-purple-600/25 text-purple-300 border border-purple-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                title="Verify combined romanized Hinglish translation layers"
              >
                🌟 COMBINED HINGLISH DUO-TRACK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compiler Specs panel (Covers Right 7 columns) */}
      <div id="compiler-specs-panel" className="lg:col-span-12 xl:col-span-7 space-y-6">
        <div className="bg-dark-card border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">Compilation Console Logs</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Select Storyboard to Render</label>
              <select
                value={activeScript?.id || ''}
                onChange={(e) => handleScriptSelect(e.target.value)}
                className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
              >
                {scripts.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* If currently compiling simulation */}
            {isCompiling && (
              <div className="bg-black/40 p-4 border border-white/5 rounded-lg space-y-3 animate-pulse">
                <h5 className="text-xxs font-semibold text-white flex items-center justify-between">
                  <span>Bundling Assets containing text & vector coordinates...</span>
                  <span className="font-mono text-indigo-400">{compileProgress}%</span>
                </h5>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded transition-all duration-300" style={{ width: `${compileProgress}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xxxxs font-mono text-slate-500 mt-1">
                  <p>✔ Synthesis audio tracks: OK</p>
                  <p>✔ Layering captions: OK</p>
                  <p>✔ Rendering visual prompt layers: BUSY</p>
                  <p>✔ Compiling 9:16 vertical overlay: WAITING</p>
                </div>
              </div>
            )}

            {/* Active scene details */}
            {currentScene && (
              <div className="bg-black/20 border border-white/5 p-4 rounded-lg space-y-3.5">
                <span className="text-xxxxs font-mono text-slate-500 uppercase tracking-wider block">Currently Playing Segment Metadata</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xxxxs font-mono text-slate-400 block uppercase">Spoken Voice Volume</span>
                    <span className="text-xs font-semibold text-white font-mono mt-0.5 block flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Accent: {activeScript?.voiceName} (1.05x rate)
                    </span>
                  </div>
                  <div>
                    <span className="text-xxxxs font-mono text-slate-400 block uppercase">Subtitles Sync</span>
                    <span className="text-xs font-semibold text-indigo-400 font-mono mt-0.5 block flex items-center gap-1">
                      <Type className="w-4 h-4" />
                      Captions: ON (Centered)
                    </span>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/5">
                  <span className="text-xxxxs font-mono text-slate-400 block uppercase mb-1">Scene visual description prompt passed to engine</span>
                  <p className="text-xxs text-slate-300 font-mono bg-black/40 p-3 rounded-lg leading-relaxed border border-white/5">
                    "{currentScene.visualPrompt}"
                  </p>
                </div>
              </div>
            )}

            <div className="bg-indigo-950/5 border border-white/5 p-4 rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-xxs font-bold text-white uppercase tracking-wider">How to play preview correctly:</h5>
                <p className="text-xxxxs sm:text-xxs text-slate-400 mt-1 leading-relaxed">
                  Hit **"Compile Video Layers"** first to aggregate visual and auditory resources. Once completed, tap **"Play Shorts Clip"**! Our customized preview engine executes slow CSS pan animations in sync with captions, while the integrated Web Speech engine synthesizes spoken dialogues out-of-the-box! Perfect for showing off results on Android phones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
