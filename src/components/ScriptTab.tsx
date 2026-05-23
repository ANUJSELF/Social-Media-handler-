import { useState, useEffect } from 'react';
import { VideoScript } from '../types';
import { Play, Sparkles, AlertCircle, Save, CheckCircle, Smartphone } from 'lucide-react';

interface ScriptTabProps {
  scripts: VideoScript[];
  onUpdateScript: (updatedScript: VideoScript) => void;
  onSelectVideoForStudio: (scriptId: string) => void;
}

export default function ScriptTab({
  scripts,
  onUpdateScript,
  onSelectVideoForStudio
}: ScriptTabProps) {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('');
  const [activeScript, setActiveScript] = useState<VideoScript | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    if (scripts.length > 0) {
      if (!selectedScriptId) {
        setSelectedScriptId(scripts[0].id);
        setActiveScript(scripts[0]);
      } else {
        const found = scripts.find(s => s.id === selectedScriptId);
        if (found) setActiveScript(found);
      }
    } else {
      setActiveScript(null);
    }
  }, [scripts, selectedScriptId]);

  const handleScriptSelect = (id: string) => {
    setSelectedScriptId(id);
    const found = scripts.find(s => s.id === id);
    if (found) setActiveScript(found);
  };

  // Allow live text edits from their Android phone
  const handleSceneTextChange = (sceneIndex: number, field: 'dialogue' | 'visualPrompt', value: string) => {
    if (!activeScript) return;
    
    const updatedScenes = [...activeScript.scenes];
    updatedScenes[sceneIndex] = {
      ...updatedScenes[sceneIndex],
      [field]: value,
      // Update voiceover text in sync with dialogue changes
      voiceoverText: field === 'dialogue' ? value : updatedScenes[sceneIndex].voiceoverText
    };

    setActiveScript({
      ...activeScript,
      scenes: updatedScenes
    });
  };

  const handleSaveEdits = () => {
    if (!activeScript) return;
    onUpdateScript(activeScript);
    setSaveStatus('Changes compiled successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div id="script-tab-root" className="space-y-6">
      {/* Script Selector Dropdown */}
      <div id="script-selector-panel" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-dark-card border border-white/10 p-4 rounded-xl">
        <div className="flex-1">
          <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">Active AI Video Storyboard</label>
          {scripts.length === 0 ? (
            <span className="text-slate-400 text-xs font-semibold">No storyboards drafted yet</span>
          ) : (
            <select
              value={selectedScriptId}
              onChange={(e) => handleScriptSelect(e.target.value)}
              className="w-full bg-black border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
            >
              {scripts.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          )}
        </div>

        {activeScript && (
          <button
            onClick={() => onSelectVideoForStudio(activeScript.id)}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Load into Video Sim Studio</span>
          </button>
        )}
      </div>

      {!activeScript ? (
        <div className="p-12 text-center bg-black/40 border border-white/10 rounded-xl flex flex-col items-center gap-2 text-slate-500">
          <AlertCircle className="w-8 h-8 text-slate-700" />
          <span className="text-slate-400 text-xs font-bold">No Storyboard Story Selected</span>
          <p className="text-xxs text-slate-500 max-w-sm">Tap on the Idea Factory tab, click "Compile AI Storyboard" on any draft, then return here to customize captions.</p>
        </div>
      ) : (
        <div id="script-editor-workspace" className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">Script Chapters & Narration ({activeScript.scenes.length})</h4>
            <div className="flex items-center gap-2">
              {saveStatus ? (
                <span className="text-emerald-400 text-xxs font-semibold flex items-center gap-1 animate-fade-in">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {saveStatus}
                </span>
              ) : (
                <button
                  onClick={handleSaveEdits}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-lg shadow-emerald-500/5 border border-emerald-500/15"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Build Story Changes</span>
                </button>
              )}
            </div>
          </div>

          <div id="scenes-container" className="space-y-4">
            {activeScript.scenes.map((scene, idx) => (
              <div
                key={scene.sceneNumber}
                id={`scene-box-${scene.sceneNumber}`}
                className="bg-dark-card border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col xl:flex-row gap-4 transition duration-200"
              >
                {/* Scene Meta Column */}
                <div className="w-full xl:w-44 flex flex-row xl:flex-col justify-between items-start xl:items-stretch gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-white/5 text-indigo-400 rounded text-xxxxs uppercase tracking-wider font-mono">
                      Scene #{scene.sceneNumber}
                    </span>
                    <h5 className="text-xs font-bold text-slate-300 mt-1.5 font-mono">Duration: {scene.duration}s</h5>
                  </div>
                  
                  {scene.imageUrl && (
                    <div className="relative w-16 h-28 xl:w-28 xl:h-44 rounded-lg overflow-hidden bg-black/40 border border-white/5 shadow-lg mt-0 xl:mt-3 flex-shrink-0 group">
                      <img
                        src={scene.imageUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* Edit Form Column */}
                <div className="flex-1 space-y-3.5">
                  <div>
                    <label className="text-xxxxs font-mono uppercase text-slate-500 block mb-1">
                      Visual Backdrop Art Prompt (AI Diffusion Description)
                    </label>
                    <textarea
                      value={scene.visualPrompt}
                      onChange={(e) => handleSceneTextChange(idx, 'visualPrompt', e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-white/5 text-xs text-slate-300 p-2.5 rounded-lg outline-none focus:border-indigo-500 resize-none font-mono"
                      placeholder="Atmospheric cinematic description..."
                    />
                  </div>

                  <div>
                    <label className="text-xxxxs font-mono uppercase text-indigo-400 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse text-indigo-400" />
                      Narration Captions (Spoken Dialogue)
                    </label>
                    <textarea
                      value={scene.dialogue}
                      onChange={(e) => handleSceneTextChange(idx, 'dialogue', e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-white/5 text-xs text-indigo-400 font-semibold p-2.5 rounded-lg outline-none focus:border-indigo-500"
                      placeholder="What the synthetic vocal synthesiser reads..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-xxxxs sm:text-xxs text-slate-500 font-mono">
              Feel free to tweak captions directly on your mobile browser. Once done, tap the **"Build Story Changes"** button at the top right to compile coordinates. Next, go to the Video Studio to render your Short preview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
