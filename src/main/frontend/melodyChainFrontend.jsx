
import { Play, Pause, Music, Disc, Mic2, Download, Sparkles, Volume2, Search } from 'lucide-react';

const MelodyChainApp = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setResult(null);
    setIsPlaying(false);

    // Simulation of the Microservice Orchestration
    try {
      setGenerationStep('Connecting to reasoning layer (AWS Bedrock)...');
      await new Promise(r => setTimeout(r, 1500));

      setGenerationStep('Generating lyrics and metadata...');
      await new Promise(r => setTimeout(r, 1500));

      setGenerationStep('Synthesizing Audio via MusicGen (AWS SageMaker)...');
      await new Promise(r => setTimeout(r, 3000)); // Longer delay for "audio gen"

      setGenerationStep('Finalizing and uploading to S3...');
      await new Promise(r => setTimeout(r, 1000));

      setResult(MOCK_GENERATED_DATA);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            MelodyChain
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Input Section */}
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mb-10">
          <label className="block text-base font-medium text-slate-300 mb-3">
            Describe the track you want to create
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A melancholy piano piece with rain sounds for studying..."
              disabled={isGenerating}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-32 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Generate'
              )}
            </button>
          </div>

          {/* Progress Indicators */}
          {isGenerating && (
            <div className="mt-6 flex flex-col items-center justify-center py-8 space-y-3 animate-in fade-in slide-in-from-top-4">
              <div className="w-full max-w-md bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-purple-500 animate-progress origin-left w-full"></div>
              </div>
              <p className="text-purple-300 text-sm font-mono animate-pulse">
                {generationStep}
              </p>
            </div>
          )}
        </div>

        {/* Result Section */}
        {result && !isGenerating && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-700 slide-in-from-bottom-8">

            {/* Player Card */}
            <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
              {/* Background Blur Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110 transition-transform duration-[10s] ease-in-out group-hover:scale-125"
                style={{ backgroundImage: `url(${result.albumArt})` }}
              />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl mb-6 ring-4 ring-white/10">
                  <img
                    src={result.albumArt}
                    alt="Album Art"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">{result.title}</h2>
                <p className="text-purple-400 font-medium mb-8">{result.artist}</p>

                {/* Audio Controls */}
                <div className="w-full max-w-xs space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <Disc className="w-6 h-6" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </button>

                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <Download className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 px-4">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={result.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>

            {/* Lyrics / Metadata Card */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Mic2 className="w-24 h-24 rotate-12" />
               </div>

               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Mic2 className="w-5 h-5 text-purple-400" />
                 Generated Lyrics
               </h3>

               <div className="prose prose-invert max-w-none">
                 <div className="whitespace-pre-line text-lg text-slate-300 font-medium leading-relaxed font-mono">
                   {result.lyrics}
                 </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-700">
                 <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Technicals</h4>
                 <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-700">BPM: 85</span>
                   <span className="px-3 py-1 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-700">Key: C Minor</span>
                   <span className="px-3 py-1 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-700">Model: MusicGen-Large</span>
                 </div>
               </div>
            </div>

          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default MelodyChainApp;