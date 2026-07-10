import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, X, Check, ChevronDown, Globe,
  Sparkles, FileVideo, FileImage, Loader2, Zap, Plus
} from 'lucide-react';
import Navbar from '@/components/ui-custom/Navbar';
import GlassCard from '@/components/ui-custom/GlassCard';
import NetworkGraph from '@/components/effects/NetworkGraph';

// ─── Types ───
interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  message?: string;
}

interface Feature {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// ─── Data ───
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Arabic', 'Hindi'];

const REGIONS = [
  'North America', 'Europe', 'Asia Pacific', 'Latin America',
  'Middle East', 'Africa', 'Oceania', 'Southeast Asia', 'South Asia', 'Eastern Europe'
];

const INITIAL_FEATURES: Feature[] = [
  { id: 'mobile', label: 'Generate Mobile Version', price: 0.03, checked: false },
  { id: 'translate-en', label: 'Translate to English (subtitles)', price: 0.02, checked: false },
  { id: 'translate-es', label: 'Translate to Spanish (subtitles)', price: 0.02, checked: false },
  { id: 'smart-match', label: 'Enable Smart Context Matching', price: 0.01, checked: false },
];

// ─── Page Component ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'upload' | 'myads' | 'analytics'>('upload');
  const [creditBalance, setCreditBalance] = useState(4.20);
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['North America']);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Animated credit counter
  const [displayCredit, setDisplayCredit] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCredit(Number((eased * creditBalance).toFixed(2)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [creditBalance]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangDropdown(false);
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setShowRegionDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ─── Upload Handlers ───
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  }, []);

  const handleFile = (file: File) => {
    setUploadFile({ file, progress: 0, status: 'uploading' });
    setProcessingSteps([]);
    setShowFeatures(false);
    setProcessingComplete(false);
    setShowNetwork(false);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadFile(prev => prev ? { ...prev, progress: 100, status: 'complete' } : null);
        startProcessing();
      } else {
        setUploadFile(prev => prev ? { ...prev, progress: Math.min(progress, 99) } : null);
      }
    }, 200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // ─── Processing Pipeline ───
  const startProcessing = () => {
    const steps: ProcessingStep[] = [
      { id: 'filtration', label: 'Content Filtration', status: 'running' },
      { id: 'optimization', label: 'Asset Optimization', status: 'pending' },
      { id: 'context', label: 'Context Matching', status: 'pending' },
    ];
    setProcessingSteps(steps);

    // Step 1: Content Filtration
    setTimeout(() => {
      setProcessingSteps(prev =>
        prev.map(s => s.id === 'filtration' ? { ...s, status: 'complete' as const } : s)
      );
      setShowFeatures(true);

      // Step 2: Asset Optimization
      setTimeout(() => {
        setProcessingSteps(prev =>
          prev.map(s => s.id === 'optimization' ? { ...s, status: 'running' as const } : s)
        );
        setTimeout(() => {
          setProcessingSteps(prev =>
            prev.map(s => s.id === 'optimization' ? { ...s, status: 'complete' as const } : s)
          );

          // Step 3: Context Matching
          setTimeout(() => {
            setProcessingSteps(prev =>
              prev.map(s => s.id === 'context' ? { ...s, status: 'running' as const } : s)
            );
            setTimeout(() => {
              setProcessingSteps(prev =>
                prev.map(s => s.id === 'context' ? { ...s, status: 'complete' as const } : s)
              );
              setProcessingComplete(true);
              setShowNetwork(true);
            }, 2000);
          }, 500);
        }, 2000);
      }, 800);
    }, 2500);
  };

  // ─── Feature Handlers ───
  const toggleFeature = (id: string) => {
    setFeatures(prev =>
      prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f)
    );
  };

  const totalPrice = features.reduce((sum, f) => f.checked ? sum + f.price : sum, 0);

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setCreditBalance(prev => Number((prev - totalPrice).toFixed(2)));
    setFeatures(prev => prev.map(f => ({ ...f, checked: false })));
    setIsProcessing(false);
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  // Stable chart data — regenerating on every render makes the bars jitter
  const chartHeights = useMemo(
    () => Array.from({ length: 30 }, () => 20 + Math.random() * 80),
    []
  );

  // ─── My Ads Mock Data ───
  const myAds = [
    { id: 1, title: 'Summer Campaign 2024', status: 'Active', impressions: '12.4K', ctr: '3.2%', gradient: 'from-electric-blue/40 via-vibrant-purple/30 to-neon-cyan/20' },
    { id: 2, title: 'Product Launch Promo', status: 'Processing', impressions: '—', ctr: '—', gradient: 'from-vibrant-purple/40 via-electric-blue/30 to-pending/20' },
    { id: 3, title: 'Brand Awareness Q3', status: 'Active', impressions: '8.7K', ctr: '2.8%', gradient: 'from-neon-cyan/40 via-electric-blue/30 to-vibrant-purple/20' },
    { id: 4, title: 'Holiday Special', status: 'Draft', impressions: '—', ctr: '—', gradient: 'from-pending/30 via-vibrant-purple/30 to-electric-blue/20' },
  ];

  return (
    <div className="min-h-screen bg-base-bg">
      <Navbar
        creditBalance={displayCredit}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── UPLOAD TAB ─── */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-medium text-white">Upload Content</h1>
                <p className="mt-2 text-white/50">Upload your video or image assets for AI-powered ad generation</p>
              </motion.div>

              {/* Upload Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {!uploadFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative cursor-pointer rounded-2xl border-2 border-dashed 
                      transition-all duration-300 ease-smooth
                      flex flex-col items-center justify-center
                      min-h-[320px]
                      ${isDragging
                        ? 'border-electric-blue bg-electric-blue/5 shadow-glow-blue'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {/* Animated border on drag */}
                    {isDragging && (
                      <motion.div
                        layoutId="dragGlow"
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(147,51,234,0.1))',
                        }}
                      />
                    )}

                    <motion.div
                      animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative z-10"
                    >
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                        ${isDragging ? 'bg-electric-blue/20' : 'bg-white/5'}
                        transition-colors duration-300
                      `}>
                        <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-electric-blue' : 'text-white/40'}`} />
                      </div>
                    </motion.div>

                    <p className="relative z-10 text-white/70 font-medium">
                      {isDragging ? 'Drop your file here' : 'Drag & drop your video or image'}
                    </p>
                    <p className="relative z-10 text-white/40 text-sm mt-2">
                      or click to browse files
                    </p>
                    <p className="relative z-10 text-white/30 text-xs mt-4">
                      Supports MP4, MOV, PNG, JPG up to 500MB
                    </p>
                  </div>
                ) : (
                  <GlassCard className="p-6" glow="blue">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center">
                        {uploadFile.file.type.startsWith('video') ? (
                          <FileVideo className="w-6 h-6 text-electric-blue" />
                        ) : (
                          <FileImage className="w-6 h-6 text-electric-blue" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{uploadFile.file.name}</p>
                        <p className="text-white/40 text-sm">
                          {(uploadFile.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {uploadFile.status === 'complete' ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          </motion.div>
                        ) : (
                          <span className="text-white/50 text-sm font-mono">{Math.round(uploadFile.progress)}%</span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setUploadFile(null);
                            setProcessingSteps([]);
                            setShowFeatures(false);
                            setProcessingComplete(false);
                            setShowNetwork(false);
                          }}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4 text-white/50" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {uploadFile.status === 'uploading' && (
                      <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-brand"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadFile.progress}%` }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    )}
                  </GlassCard>
                )}
              </motion.div>

              {/* Ad Details Form */}
              <AnimatePresence>
                {uploadFile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Title */}
                      <GlassCard delay={0}>
                        <div className="p-5">
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Ad Title
                          </label>
                          <input
                            type="text"
                            value={adTitle}
                            onChange={(e) => setAdTitle(e.target.value)}
                            placeholder="Enter a catchy title for your ad"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue focus:shadow-glow-blue transition-all duration-200"
                          />
                        </div>
                      </GlassCard>

                      {/* Language */}
                      <GlassCard delay={0.05} className="relative z-20">
                        <div className="p-5" ref={langRef}>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Language
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setShowLangDropdown(!showLangDropdown)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between hover:border-white/20 transition-colors"
                            >
                              <span className={language ? 'text-white' : 'text-white/30'}>
                                {language || 'Select language'}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {showLangDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute z-50 top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto glass rounded-xl py-2"
                                >
                                  {LANGUAGES.map(lang => (
                                    <button
                                      key={lang}
                                      onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${language === lang ? 'text-electric-blue' : 'text-white/70'}`}
                                    >
                                      {lang}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </GlassCard>

                      {/* Description */}
                      <GlassCard delay={0.1} className="lg:col-span-2">
                        <div className="p-5">
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Description / Target Context
                          </label>
                          <textarea
                            value={adDescription}
                            onChange={(e) => setAdDescription(e.target.value)}
                            placeholder="Describe your ad's message and audience — used for smart ad matching"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-electric-blue focus:shadow-glow-blue transition-all duration-200 resize-none"
                          />
                          <p className="mt-2 text-xs text-white/40">
                            This helps our AI understand your ad's intent and match it with the right audience
                          </p>
                        </div>
                      </GlassCard>

                      {/* Target Regions */}
                      <GlassCard delay={0.15} className="relative z-10 lg:col-span-2">
                        <div className="p-5" ref={regionRef}>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Target Regions
                          </label>
                          <div className="relative">
                          <button
                            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between hover:border-white/20 transition-colors"
                          >
                            <div className="flex flex-wrap gap-2">
                              {selectedRegions.length > 0 ? (
                                selectedRegions.map(region => (
                                  <span key={region} className="px-2 py-1 rounded-md bg-electric-blue/20 text-electric-blue text-xs">
                                    {region}
                                  </span>
                                ))
                              ) : (
                                <span className="text-white/30">Select target regions</span>
                              )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform flex-shrink-0 ml-2 ${showRegionDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {showRegionDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-50 top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto glass rounded-xl py-2"
                              >
                                {REGIONS.map(region => (
                                  <button
                                    key={region}
                                    onClick={() => toggleRegion(region)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                                  >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedRegions.includes(region) ? 'bg-electric-blue border-electric-blue' : 'border-white/20'}`}>
                                      {selectedRegions.includes(region) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={selectedRegions.includes(region) ? 'text-white' : 'text-white/70'}>
                                      {region}
                                    </span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Processing Pipeline */}
              <AnimatePresence>
                {processingSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Steps */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-electric-blue" />
                          AI Processing Pipeline
                        </h3>
                        <div className="space-y-0">
                          {processingSteps.map((step, index) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex gap-4"
                            >
                              {/* Connector line */}
                              <div className="flex flex-col items-center">
                                <motion.div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    step.status === 'complete' ? 'bg-success/20' :
                                    step.status === 'running' ? 'bg-electric-blue/20' :
                                    step.status === 'error' ? 'bg-error/20' :
                                    'bg-white/5'
                                  }`}
                                  animate={step.status === 'running' ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  {step.status === 'complete' && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                                      <Check className="w-5 h-5 text-success" />
                                    </motion.div>
                                  )}
                                  {step.status === 'running' && (
                                    <Loader2 className="w-5 h-5 text-electric-blue animate-spin" />
                                  )}
                                  {step.status === 'error' && <X className="w-5 h-5 text-error" />}
                                  {step.status === 'pending' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                  )}
                                </motion.div>
                                {index < processingSteps.length - 1 && (
                                  <motion.div
                                    className="w-0.5 flex-1 min-h-8 bg-white/10 relative overflow-hidden"
                                  >
                                    {step.status === 'complete' && (
                                      <motion.div
                                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-success to-electric-blue"
                                        initial={{ height: 0 }}
                                        animate={{ height: '100%' }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    )}
                                  </motion.div>
                                )}
                              </div>

                              {/* Step content */}
                              <div className={`pt-2 ${index < processingSteps.length - 1 ? 'pb-8' : ''}`}>
                                <p className={`font-medium ${
                                  step.status === 'complete' ? 'text-success' :
                                  step.status === 'running' ? 'text-white' :
                                  'text-white/40'
                                }`}>
                                  {step.label}
                                </p>
                                {step.status === 'running' && (
                                  <p className="text-sm text-white/40 mt-1">Processing...</p>
                                )}
                                {step.status === 'complete' && (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-success/70 mt-1"
                                  >
                                    Complete
                                  </motion.p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Feature Selection Panel */}
                      <AnimatePresence>
                        {showFeatures && !processingComplete && (
                          <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                            className="lg:w-80"
                          >
                            <GlassCard className="p-5 sticky top-24" glow="purple">
                              <h4 className="text-white font-medium mb-1">Choose Features</h4>
                              <p className="text-white/40 text-sm mb-4">Enhance your ad with AI features</p>

                              <div className="space-y-3">
                                {features.map((feature, i) => (
                                  <motion.button
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    onClick={() => toggleFeature(feature.id)}
                                    className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 text-left ${
                                      feature.checked
                                        ? 'border-electric-blue/50 bg-electric-blue/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/[0.07]'
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                      feature.checked ? 'bg-electric-blue border-electric-blue' : 'border-white/20'
                                    }`}>
                                      {feature.checked && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                                          <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-medium">{feature.label}</p>
                                    </div>
                                    <span className="text-neon-cyan font-mono text-sm flex-shrink-0">
                                      ${feature.price.toFixed(2)}
                                    </span>
                                  </motion.button>
                                ))}
                              </div>

                              {/* Total */}
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-white/60">Total</span>
                                  <motion.span
                                    key={totalPrice}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="text-xl font-mono text-white"
                                  >
                                    ${totalPrice.toFixed(2)}
                                  </motion.span>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.97 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                  onClick={handlePurchase}
                                  disabled={totalPrice === 0 || isProcessing || creditBalance < totalPrice}
                                  className="w-full py-3 rounded-xl bg-gradient-brand text-white font-medium flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  {isProcessing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Zap className="w-4 h-4" />
                                      Purchase & Process
                                    </>
                                  )}
                                </motion.button>

                                {creditBalance < totalPrice && totalPrice > 0 && (
                                  <p className="text-error text-xs mt-2 text-center">
                                    Insufficient credit. Please top up.
                                  </p>
                                )}
                              </div>
                            </GlassCard>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Completion Message */}
              <AnimatePresence>
                {processingComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GlassCard className="p-8 text-center" glow="cyan">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <Check className="w-8 h-8 text-success" />
                      </motion.div>
                      <h3 className="text-xl font-medium text-white">Processing Complete!</h3>
                      <p className="text-white/50 mt-2">Your ad has been generated and is ready for distribution.</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab('myads')}
                        className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
                      >
                        View My Ads
                      </motion.button>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Network Graph */}
              <AnimatePresence>
                {showNetwork && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-neon-cyan" />
                      Live Distribution Network
                    </h3>
                    <NetworkGraph />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── MY ADS TAB ─── */}
          {activeTab === 'myads' && (
            <motion.div
              key="myads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-medium text-white">My Ads</h1>
                <p className="mt-2 text-white/50">Manage and track all your advertisement campaigns</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAds.map((ad, i) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <GlassCard className="overflow-hidden group cursor-pointer" hover>
                      <div className="relative h-40 overflow-hidden">
                        <div
                          className={`w-full h-full bg-gradient-to-br ${ad.gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                        >
                          <FileVideo className="w-10 h-10 text-white/30" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-base-bg/80 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ad.status === 'Active' ? 'bg-success/20 text-success' :
                            ad.status === 'Processing' ? 'bg-pending/20 text-pending' :
                            'bg-white/10 text-white/60'
                          }`}>
                            {ad.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-medium">{ad.title}</h3>
                        <div className="mt-3 flex items-center gap-6">
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider">Impressions</p>
                            <p className="text-white font-mono text-sm mt-1">{ad.impressions}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider">CTR</p>
                            <p className="text-white font-mono text-sm mt-1">{ad.ctr}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}

                {/* Create New Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  onClick={() => setActiveTab('upload')}
                  className="cursor-pointer"
                >
                  <div className="h-full min-h-[240px] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-electric-blue/50 hover:bg-electric-blue/5 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors">
                      <Plus className="w-6 h-6 text-white/40 group-hover:text-electric-blue transition-colors" />
                    </div>
                    <p className="text-white/50 group-hover:text-white/70 transition-colors font-medium">Create New Ad</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ─── ANALYTICS TAB ─── */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-medium text-white">Analytics</h1>
                <p className="mt-2 text-white/50">Track performance metrics across all campaigns</p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Impressions', value: '45.2K', change: '+12.5%', positive: true },
                  { label: 'Avg. CTR', value: '3.1%', change: '+0.4%', positive: true },
                  { label: 'Active Campaigns', value: '8', change: '+2', positive: true },
                  { label: 'Total Spent', value: '$142.80', change: '-5.2%', positive: false },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <GlassCard className="p-5">
                      <p className="text-white/40 text-sm">{stat.label}</p>
                      <div className="mt-2 flex items-end justify-between">
                        <p className="text-2xl font-mono text-white">{stat.value}</p>
                        <span className={`text-xs font-medium ${stat.positive ? 'text-success' : 'text-error'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-white font-medium mb-6">Impressions Over Time</h3>
                  <div className="h-64 flex items-end gap-2">
                    {chartHeights.map((height, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.02 }}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-electric-blue/40 to-electric-blue/10 hover:from-electric-blue/60 hover:to-electric-blue/20 transition-colors"
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-white/30">
                    <span>Jun 10</span>
                    <span>Jun 20</span>
                    <span>Jul 1</span>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Top Performing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-white font-medium mb-4">Top Performing Ads</h3>
                  <div className="space-y-3">
                    {myAds.filter(a => a.status === 'Active').map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${ad.gradient} flex items-center justify-center flex-shrink-0`}>
                          <FileVideo className="w-5 h-5 text-white/40" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{ad.title}</p>
                          <p className="text-white/40 text-xs">{ad.impressions} impressions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-success font-mono text-sm">{ad.ctr}</p>
                          <p className="text-white/30 text-xs">CTR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
