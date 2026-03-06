import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  User, 
  Shield, 
  Activity, 
  Send, 
  Facebook, 
  Youtube, 
  ExternalLink,
  Cpu,
  Lock,
  Globe,
  Database,
  Instagram,
  Music,
  AlertTriangle,
  ShieldCheck,
  Folder,
  Plus,
  Trash2,
  LogIn,
  LogOut,
  X,
  Play,
  PlayCircle,
  Mail,
  Edit
} from 'lucide-react';

const LOG_MESSAGES = [
  "Shell: Initializing...",
  "System: Loading profile data...",
  "Network: Establishing secure tunnel...",
  "Status: Connection encrypted.",
  "Session: Active (UID: 0x7F2A)",
  "Bypassing firewall...",
  "Accessing personnel database...",
  "Identity verified.",
  "Welcome back, Agent.",
  "Monitoring traffic...",
  "Logs cleared."
];

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  source: string;
}

const MatrixBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff41";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
    />
  );
};

const MarqueeText = ({ className = "" }: { className?: string }) => (
  <div className={`marquee-container py-1 bg-red-600/5 border-y border-red-600/20 ${className}`}>
    <div className="marquee-content text-red-600 font-bold text-[10px] md:text-xs">
      হ্যাকিং কোন খারাপ কিছু না। এটি একটি পেশা ও নেশা। যেটি থেকে সকলকে সাবধানে থাকতে হবে। তাই আপনার বন্ধুদেরকে রাগান্বিত করবেন না ধন্যবাদ। - (সাদাত হোসেন)
    </div>
  </div>
);

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [adminPass, setAdminPass] = useState(() => {
    return localStorage.getItem('adminPass') || '';
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const adminEmail = 'sadat310710@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
    localStorage.setItem('adminPass', adminPass);
  }, [isAdmin, adminPass]);

  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWelcome]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        setAdminPass(password);
        setShowLogin(false);
        setUsername('');
        setPassword('');
      } else {
        alert("Access Denied: Invalid Encryption Key");
      }
    } catch (err) {
      alert("System Error: Login sequence failed");
    }
  };

  const getThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }
    return `https://picsum.photos/seed/${encodeURIComponent(url)}/300/200`;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl || !newVideoTitle) return;

    const thumbnail = getThumbnail(newVideoUrl);
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPass
        },
        body: JSON.stringify({ title: newVideoTitle, url: newVideoUrl, thumbnail })
      });
      setNewVideoUrl('');
      setNewVideoTitle('');
      fetchVideos();
    } catch (err) {
      alert("Failed to add video");
    }
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    const thumbnail = getThumbnail(editingVideo.url);
    try {
      await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPass
        },
        body: JSON.stringify({ ...editingVideo, thumbnail })
      });
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      alert("Failed to update video");
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      console.log(`Attempting to delete video ID: ${id}`);
      const res = await fetch(`/api/videos/${id}`, { 
        method: 'DELETE',
        headers: { 'x-admin-password': adminPass }
      });
      const data = await res.json();
      if (data.success) {
        fetchVideos();
      } else {
        alert("Server failed to delete video");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete video. Check connection.");
    }
  };

  const handleDeleteCategory = async (source: string) => {
    if (!confirm(`Are you sure you want to delete ALL videos in the ${source} directory?`)) return;
    try {
      console.log(`Attempting to delete category: ${source}`);
      const res = await fetch(`/api/videos/category/${source}`, { 
        method: 'DELETE',
        headers: { 'x-admin-password': adminPass }
      });
      const data = await res.json();
      if (data.success) {
        fetchVideos();
      } else {
        alert("Server failed to delete category content");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      alert("Failed to delete category content. Check connection.");
    }
  };

  const groupedVideos = videos.reduce((acc, video) => {
    const source = video.source || 'other';
    if (!acc[source]) acc[source] = [];
    acc[source].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube': return <Youtube className="w-4 h-4 text-[#ff0000]" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-[#1877f2]" />;
      case 'tiktok': return <Music className="w-4 h-4 text-white" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-[#e4405f]" />;
      default: return <Globe className="w-4 h-4 text-neon-green" />;
    }
  };

  useEffect(() => {
    if (currentLogIndex < LOG_MESSAGES.length) {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, LOG_MESSAGES[currentLogIndex]].slice(-6));
        setCurrentLogIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]].slice(-6));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentLogIndex, logs]);

  return (
    <div className="min-h-screen bg-black text-neon-green p-4 md:p-8 selection:bg-neon-green selection:text-black relative overflow-x-hidden">
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4"
          >
            <MatrixBackground />
            <div className="scanline" />
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10 max-w-md w-full text-center space-y-8 p-8 terminal-border bg-black/80 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,255,65,0.1)]"
            >
              <div className="relative group">
                <motion.div 
                  animate={{ 
                    boxShadow: ["0 0 20px rgba(0,255,65,0.2)", "0 0 40px rgba(0,255,65,0.4)", "0 0 20px rgba(0,255,65,0.2)"] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-neon-green/30 bg-black p-4"
                >
                  <img 
                    src="https://storage.googleapis.com/static-content-ais/pu5ojbllw6hsfna5e6xwrv/559260013478/64_1741246728867.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -inset-4 bg-neon-green/5 blur-3xl -z-10 rounded-full" />
              </div>

              <div className="space-y-2">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-4xl md:text-5xl font-calligraphy text-white terminal-glow"
                >
                  Sadat Hossain
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1.2 }}
                  className="text-[10px] uppercase tracking-[0.4em] text-neon-green"
                >
                  System Architect & Developer
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="group relative px-8 py-3 bg-neon-green text-black font-bold uppercase tracking-widest text-xs rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                  <span className="relative z-10">Open App</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </button>
              </motion.div>

              <div className="pt-4 flex justify-center gap-4 opacity-30">
                <div className="w-1 h-1 bg-neon-green rounded-full animate-ping" />
                <div className="w-1 h-1 bg-neon-green rounded-full animate-ping [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-neon-green rounded-full animate-ping [animation-delay:0.4s]" />
              </div>

              <MarqueeText className="mt-4 rounded" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MatrixBackground />
      <div className="scanline" />

      {/* Admin Mode Banner */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-neon-green text-black py-1 text-center font-bold text-[10px] uppercase tracking-[0.5em] shadow-[0_0_20px_rgba(0,255,65,0.5)]"
          >
            Terminal Admin Mode Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Right Mail Action */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={() => setShowEmail(!showEmail)}
            title={showEmail ? "Hide Email" : "Show Admin Email"}
            className="flex items-center gap-2 bg-terminal-bg/80 backdrop-blur-md border border-neon-green/30 px-3 py-2 rounded-full hover:border-neon-green hover:bg-neon-green/10 transition-all group cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline group-hover:text-white transition-colors">
              {showEmail ? "Close Info" : "Contact Admin"}
            </span>
            <div className="p-1.5 bg-neon-green/20 rounded-full group-hover:bg-neon-green group-hover:text-black transition-all">
              <Mail className="w-4 h-4" />
            </div>
          </button>
          
          <AnimatePresence>
            {showEmail && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="bg-black/90 border border-neon-green/50 p-3 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-md flex flex-col gap-2 min-w-[200px]"
              >
                <div className="text-[10px] text-white/40 uppercase tracking-widest border-b border-neon-green/20 pb-1">Admin Contact</div>
                <div className="text-xs text-neon-green font-mono break-all">{adminEmail}</div>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={handleCopyEmail}
                    className="flex-1 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 py-1 rounded text-[10px] uppercase font-bold transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Mail"}
                  </button>
                  <a 
                    href={`mailto:${adminEmail}`}
                    className="flex-1 bg-neon-green text-black hover:bg-white py-1 rounded text-[10px] uppercase font-bold transition-colors text-center"
                  >
                    Send
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Main Container */}
      <div className="max-w-2xl mx-auto space-y-8 relative z-20">
        
        {/* Official Warning Notice */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-red-600 bg-red-600/10 p-4 rounded-lg flex items-center gap-4 text-red-500 terminal-glow"
        >
          <AlertTriangle className="w-12 h-12 flex-shrink-0 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg uppercase tracking-tighter">Official Security Warning</h3>
            <p className="text-xs font-mono leading-tight">
              THIS IS AN OFFICIAL AUTHORIZED TERMINAL OF SADAT HOSSAIN. UNAUTHORIZED ACCESS OR ATTEMPTED BREACH WILL BE LOGGED AND TRACED. ALL ACTIONS ARE MONITORED BY SYSTEM SECURITY.
            </p>
          </div>
        </motion.div>
        
        {/* Header Section */}
        <header className="text-center space-y-2 border-b border-neon-green/30 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neon-green/30 bg-black/50 p-2 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <img 
                src="https://storage.googleapis.com/static-content-ais/pu5ojbllw6hsfna5e6xwrv/559260013478/64_1741246728867.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tighter terminal-glow">
              SADAT HOSSAIN
            </h1>
          </motion.div>
          
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xs md:text-sm font-bold bg-neon-green/10 inline-block px-3 py-1 rounded border border-neon-green/50"
          >
            STATUS: UNTRACEABLE
          </motion.div>
        </header>

        {/* Personnel Identity Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <User className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-widest font-bold">Personnel Identity</h2>
          </div>
          <div className="terminal-border bg-terminal-bg/50 overflow-hidden rounded-lg">
            <table className="w-full text-left text-sm border-collapse">
              <tbody>
                {[
                  { label: "REAL NAME", value: "SADAT HOSSAIN" },
                  { label: "BIRTH DATE", value: "31-07-20**" },
                  { label: "RELIGION", value: "ISLAM" },
                  { label: "BLOOD GROUP", value: "O+ (POSITIVE)" },
                  { label: "LOCATION", value: "THAKURGAON, BANGLADESH" }
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-neon-green/10 last:border-0 hover:bg-neon-green/5 transition-colors">
                    <td className="p-3 font-bold text-white/60 w-1/3 bg-neon-green/5">{item.label}</td>
                    <td className="p-3 text-neon-green">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Viral Videos Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white/80">
              <PlayCircle className="w-4 h-4" />
              <h2 className="text-sm uppercase tracking-widest font-bold">Video Gallery</h2>
              <span className="text-[8px] bg-neon-green/20 text-neon-green px-1.5 py-0.5 rounded border border-neon-green/30 font-mono animate-pulse">PUBLIC_ACCESS</span>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsAdmin(false)}
                className="text-[10px] text-red-500 flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3 h-3" /> Logout Admin
              </button>
            )}
          </div>

          {isAdmin && (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddVideo}
              className="terminal-border p-4 rounded-lg bg-neon-green/5 space-y-3"
            >
              <div className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Add New Video</div>
              <input 
                type="text" 
                placeholder="Video Title" 
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="w-full bg-black border border-neon-green/30 p-2 text-xs text-neon-green outline-none focus:border-neon-green"
              />
              <input 
                type="text" 
                placeholder="Video URL (YouTube/Direct)" 
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full bg-black border border-neon-green/30 p-2 text-xs text-neon-green outline-none focus:border-neon-green"
              />
              <button 
                type="submit"
                className="w-full bg-neon-green text-black font-bold py-2 text-xs uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to Folder
              </button>
            </motion.form>
          )}

          <div className="space-y-4">
            {videos.length === 0 ? (
              <div className="text-center py-8 text-white/20 text-xs italic border border-dashed border-white/10 rounded-lg">
                No data found in this directory...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <motion.div 
                    key={video.id}
                    layout
                    className="terminal-border overflow-hidden rounded-lg bg-terminal-bg/50 group relative"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-10 h-10 text-neon-green" />
                      </a>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate pr-2">
                        {getSourceIcon(video.source)}
                        <div className="text-xs font-bold text-white truncate">{video.title}</div>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setEditingVideo(video)}
                            className="text-neon-green/50 hover:text-neon-green p-1 transition-colors"
                            title="Edit Video"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-500/50 hover:text-red-400 p-1 transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dark Expertise Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <Shield className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-widest font-bold">Dark Expertise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <Cpu className="w-4 h-4" />, title: "App Developer", desc: "Flutter & React Native" },
              { icon: <Globe className="w-4 h-4" />, title: "Web Developer", desc: "Fullstack Specialist" },
              { icon: <Database className="w-4 h-4" />, title: "Kali Linux User", desc: "Penetration Testing" },
              { icon: <Lock className="w-4 h-4" />, title: "Cyber Security", desc: "Network Hardening" }
            ].map((skill, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
                className="terminal-border p-3 rounded-lg flex items-start gap-3 bg-terminal-bg/30"
              >
                <div className="mt-1 text-neon-green">{skill.icon}</div>
                <div>
                  <div className="text-sm font-bold text-white">{skill.title}</div>
                  <div className="text-[10px] text-neon-green/70 uppercase">{skill.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Logs Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <Activity className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-widest font-bold">Live Logs</h2>
          </div>
          <div className="terminal-border bg-black p-4 rounded-lg min-h-[160px] font-mono text-xs space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            </div>
            <AnimatePresence mode="popLayout">
              {logs.map((log, idx) => (
                <motion.div
                  key={`${log}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2"
                >
                  <span className="text-white/30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={idx === logs.length - 1 ? "text-neon-green" : "text-neon-green/60"}>
                    {idx === logs.length - 1 ? "> " : "$ "}{log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white/80 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h2 className="text-sm uppercase tracking-widest font-bold">Secure Channels</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Telegram", icon: <Send className="w-5 h-5" />, color: "bg-[#0088cc]", link: "https://t.me/Sadat_Hossain_369" },
              { name: "Facebook ID", icon: <Facebook className="w-5 h-5" />, color: "bg-[#1877f2]", link: "https://www.facebook.com/sadathossain0369" },
              { name: "Facebook Page", icon: <Facebook className="w-5 h-5" />, color: "bg-[#1877f2]", link: "https://www.facebook.com/profile.php?id=61560502086655" },
              { name: "Instagram", icon: <Instagram className="w-5 h-5" />, color: "bg-[#e4405f]", link: "https://www.instagram.com/sadat_hossain_369/" },
              { name: "TikTok", icon: <Music className="w-5 h-5" />, color: "bg-[#000000] border border-white/20", link: "https://www.tiktok.com/@sadat_hossain_369?lang=en" },
              { name: "YouTube", icon: <Youtube className="w-5 h-5" />, color: "bg-[#ff0000]", link: "https://www.youtube.com/@crazysadat" },
              { 
                name: "Email Admin", 
                icon: <Mail className="w-5 h-5" />, 
                color: "bg-neon-green/20 text-neon-green border border-neon-green/30", 
                onClick: () => setShowEmail(true) 
              }
            ].map((social, idx) => {
              const Component = (social as any).onClick ? 'button' : 'a';
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <Component
                    href={(social as any).link}
                    onClick={(social as any).onClick}
                    target={(social as any).link?.startsWith('mailto:') ? undefined : "_blank"}
                    rel={(social as any).link?.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                    className="flex items-center justify-between p-3 rounded-lg terminal-border bg-terminal-bg/50 group w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${social.color} text-white`}>
                        {social.icon}
                      </div>
                      <span className="font-bold text-xs text-white group-hover:text-neon-green transition-colors">{social.name}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-neon-green transition-colors" />
                  </Component>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center space-y-4 border-t border-neon-green/10">
          <div className="text-[10px] text-white/40 uppercase tracking-[0.3em]">
            UID: 7F-2A-99-BC-01 | SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
              className="group relative px-4 py-2 border border-neon-green/20 rounded bg-black/40 hover:border-neon-green/60 transition-all flex items-center gap-2 overflow-hidden"
            >
              <div className={`absolute inset-0 ${isAdmin ? 'bg-red-500/10' : 'bg-neon-green/5'} translate-y-full group-hover:translate-y-0 transition-transform`} />
              {isAdmin ? (
                <ShieldCheck className="w-3 h-3 text-neon-green transition-colors" />
              ) : (
                <LogIn className="w-3 h-3 text-neon-green/40 group-hover:text-neon-green transition-colors" />
              )}
              <span className={`text-[10px] ${isAdmin ? 'text-neon-green' : 'text-neon-green/40 group-hover:text-neon-green'} transition-colors uppercase tracking-[0.2em] font-bold`}>
                {isAdmin ? 'Admin Active' : 'Admin Login'}
              </span>
            </button>
          </div>

          <div className="text-[10px] text-neon-green/60">
            © {new Date().getFullYear()} SADAT HOSSAIN. ALL RIGHTS RESERVED.
          </div>
        </footer>

        <MarqueeText className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm" />
      </div>

      {/* Edit Video Modal */}
      <AnimatePresence>
        {editingVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm terminal-border bg-black p-6 rounded-lg space-y-6 relative"
            >
              <button 
                onClick={() => setEditingVideo(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <Folder className="w-10 h-10 mx-auto text-neon-green" />
                <h2 className="text-xl font-bold uppercase tracking-widest">Edit Video</h2>
              </div>

              <form onSubmit={handleUpdateVideo} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-white/60">Title</label>
                  <input 
                    type="text" 
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                    className="w-full bg-terminal-bg border border-neon-green/30 p-3 text-sm text-neon-green outline-none focus:border-neon-green rounded"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-white/60">URL</label>
                  <input 
                    type="text" 
                    value={editingVideo.url}
                    onChange={(e) => setEditingVideo({...editingVideo, url: e.target.value})}
                    className="w-full bg-terminal-bg border border-neon-green/30 p-3 text-sm text-neon-green outline-none focus:border-neon-green rounded"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-neon-green text-black font-bold py-3 uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Animated Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full max-w-sm terminal-border bg-black/80 p-8 rounded-lg space-y-8 relative overflow-hidden"
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent animate-pulse" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.1),transparent_70%)]" />
              </div>

              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-neon-green transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-4 relative z-10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-neon-green/30 bg-black/50 p-2 shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  <img 
                    src="https://storage.googleapis.com/static-content-ais/pu5ojbllw6hsfna5e6xwrv/559260013478/64_1741246728867.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-neon-green">Security Override</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-neon-green/30" />
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">Biometric Verification Required</p>
                  <span className="h-px w-8 bg-neon-green/30" />
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase text-neon-green/60 font-bold tracking-widest ml-1">Identity Code</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ENTER USERNAME"
                      className="w-full bg-black/60 border border-neon-green/30 p-4 text-sm text-neon-green outline-none focus:border-neon-green rounded transition-all placeholder:text-neon-green/20"
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green group-focus-within:w-full transition-all duration-500" />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase text-neon-green/60 font-bold tracking-widest ml-1">Access Key</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/60 border border-neon-green/30 p-4 text-sm text-neon-green outline-none focus:border-neon-green rounded transition-all placeholder:text-neon-green/20"
                      required
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green group-focus-within:w-full transition-all duration-500" />
                  </div>
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,65,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-neon-green text-black font-black py-4 uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-3"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Initialize Access
                </motion.button>
              </form>

              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


