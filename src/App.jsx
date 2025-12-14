import React, { useState, useEffect, useRef } from 'react';
// UNCOMMENT THIS LINE LOCALLY AFTER RUNNING: npm install @emailjs/browser
import emailjs from '@emailjs/browser';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  Terminal, 
  Globe, 
  Database,
  Layout,
  Server,
  Smartphone,
  Send,
  MapPin,
  Menu,
  X,
  Cpu,
  Layers,
  CheckCircle,
  Loader2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

// --- CUSTOM STYLES & ANIMATIONS ---
const customStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float 3s ease-in-out infinite;
    animation-delay: 1.5s;
  }
  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .stagger-1 { transition-delay: 100ms; }
  .stagger-2 { transition-delay: 200ms; }
  .stagger-3 { transition-delay: 300ms; }
  .stagger-4 { transition-delay: 400ms; }
`;

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Store specific error text

  const form = useRef();
  
  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Close mobile menu when clicking a link
  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- EMAILJS HANDLER ---
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);
    setErrorMessage("");

    const SERVICE_ID = 'service_a3ux9ta';
    const TEMPLATE_ID = 'template_l2nm5mm';
    const PUBLIC_KEY = 'orfOk-sPfz8IJshSg';

    // --- REAL EMAILJS CODE (UNCOMMENT LOCALLY) ---
    
    // Check if emailjs is loaded
    if (!emailjs) {
        setFormStatus('error');
        setErrorMessage("EmailJS package not found. Run: npm install @emailjs/browser");
        setIsSubmitting(false);
        return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log('SUCCESS!', result.text);
          setFormStatus('success');
          setIsSubmitting(false);
          e.target.reset();
          setTimeout(() => setFormStatus(null), 5000);
      }, (error) => {
          console.error('FAILED...', error.text);
          setFormStatus('error');
          setErrorMessage(error.text || "Connection failed. Check console.");
          setIsSubmitting(false);
      });
    

    // --- SIMULATION FOR PREVIEW ONLY ---
    // This allows you to test the UI right now without the API keys/package.
    
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white overflow-x-hidden">
      <style>{customStyles}</style>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg z-50 border-b border-slate-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex-shrink-0 font-bold text-2xl text-teal-400 tracking-tighter cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center gap-1 group" 
              onClick={() => handleNavClick('home')}
            >
              <Terminal size={20} className="group-hover:rotate-12 transition-transform" />
              AM<span className="text-slate-100">.DEV</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {['Home', 'Projects', 'Skills', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item.toLowerCase())}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${activeSection === item.toLowerCase() ? 'text-teal-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    {item}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out ${activeSection === item.toLowerCase() ? 'scale-x-100' : ''}`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white p-2 transition-transform active:scale-95"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-slate-800 border-b border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Home', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className="text-slate-300 hover:text-teal-400 hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between min-h-screen relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="md:w-1/2 text-left space-y-6 z-10 reveal-section is-visible">
          <div className="inline-block px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm font-medium border border-teal-500/20 mb-2 hover:bg-teal-500/20 transition-colors cursor-default">
            Full Stack Developer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 tracking-tight leading-tight">
            Hi, I'm <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 animate-gradient">
              Abdelrhman Maged
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
            I'm an 18-year-old developer passionate about building robust web applications. 
            From <span className="text-teal-400 font-semibold">Laravel</span> backends to <span className="text-blue-400 font-semibold">React</span> frontends, I bring ideas to life with code.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => handleNavClick('projects')}
              className="group px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 flex items-center gap-2 transform hover:-translate-y-1 hover:scale-105"
            >
              View Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-700 hover:border-slate-600 transform hover:-translate-y-1 hover:bg-slate-700/80"
            >
              Contact Me
            </button>
          </div>
          
          <div className="flex gap-6 pt-8 text-slate-400">
            <a href="https://github.com/AbdelrhmanMaged1" target="_blank" className="hover:text-teal-400 transition-all hover:scale-125 hover:rotate-6"><Github size={24} /></a>
            <a href="#" className="hover:text-teal-400 transition-all hover:scale-125 hover:-rotate-6"><Linkedin size={24} /></a>
            {/* UPDATED: Direct Gmail Link for Hero Section */}
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abdelrhman@example.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-all hover:scale-125 hover:rotate-6"><Mail size={24} /></a>
          </div>
        </div>
        
        {/* Abstract Hero Visual */}
        <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center z-10 reveal-section stagger-2">
           <div className="relative w-80 h-80 md:w-96 md:h-96 group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="relative z-10 w-full h-full rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 shadow-2xl transition-all duration-700 ease-out group-hover:rotate-1 group-hover:scale-105">
                <div className="h-full w-full rounded-lg bg-slate-900/80 border border-slate-700/50 flex flex-col items-center justify-center space-y-4 overflow-hidden relative">
                  {/* Floating elements inside card */}
                  <div className="absolute top-10 right-10 w-20 h-20 bg-teal-500/10 rounded-full blur-xl animate-blob"></div>
                  <div className="absolute bottom-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-blob animation-delay-2000"></div>

                  <div className="relative animate-float">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <Code size={64} className="text-teal-400 relative z-10" />
                  </div>
                  <div className="flex gap-6 text-slate-500 pt-4">
                    <Cpu size={24} className="animate-float hover:text-teal-400 transition-colors" style={{ animationDelay: '0.1s' }} />
                    <Database size={24} className="animate-float-delayed hover:text-blue-400 transition-colors" style={{ animationDelay: '0.2s' }} />
                    <Globe size={24} className="animate-float hover:text-purple-400 transition-colors" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-section">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Featured Projects</h2>
              <div className="h-1 w-20 bg-teal-500 rounded transition-all duration-300 hover:w-32"></div>
            </div>
            <a href="https://github.com/AbdelrhmanMaged1" target='_blank' className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-2 mt-4 md:mt-0 group transition-colors">
              View Github <Github size={16} className="group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mindflow */}
            <div className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-teal-500/10 reveal-section stagger-1">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40 z-10 transition-opacity group-hover:opacity-0"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/80 to-slate-900 group-hover:scale-110 transition-transform duration-700">
                  <div className="text-center z-20">
                    <Layout size={48} className="mx-auto text-indigo-400 mb-2 drop-shadow-lg" />
                    <span className="font-bold text-lg text-slate-300">Mindflow</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">Mindflow</h3>
                  <div className="flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <a href="https://mindflow-notes.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700" title="View Live">
                      <ExternalLink size={16} />
                    </a>
                    <a href="https://github.com/AbdelrhmanMaged1/mindflow-notes" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700" title="View Code">
                      <Github size={16} />
                    </a>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  A productivity application with notes, AI enhancement, and dark/light mode.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">React</span>
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">Firebase</span>
                </div>
              </div>
            </div>

            {/* Shop Backend */}
            <div className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-teal-500/10 reveal-section stagger-2">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40 z-10 transition-opacity group-hover:opacity-0"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/80 to-slate-900 group-hover:scale-110 transition-transform duration-700">
                  <div className="text-center z-20">
                    <Server size={48} className="mx-auto text-emerald-400 mb-2 drop-shadow-lg" />
                    <span className="font-bold text-lg text-slate-300">E-Commerce API</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">Shop Backend</h3>
                  <div className="flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                     <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700"><ExternalLink size={16} /></a>
                     <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700"><Github size={16} /></a>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  A robust REST API for an e-commerce platform built with Laravel. Features auth, cart management, and payment gateways.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">Laravel</span>
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">MySQL</span>
                </div>
              </div>
            </div>

            {/* Chat App */}
            <div className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-teal-500/10 reveal-section stagger-3">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40 z-10 transition-opacity group-hover:opacity-0"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/80 to-slate-900 group-hover:scale-110 transition-transform duration-700">
                  <div className="text-center z-20">
                    <Smartphone size={48} className="mx-auto text-purple-400 mb-2 drop-shadow-lg" />
                    <span className="font-bold text-lg text-slate-300">Chat App</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors">Realtime Chat</h3>
                  <div className="flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                     <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700"><ExternalLink size={16} /></a>
                     <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-500 hover:text-white transition-colors border border-slate-700"><Github size={16} /></a>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  A real-time messaging application using Node.js and Socket.io.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">Node.js</span>
                  <span className="px-3 py-1 bg-slate-800 text-teal-400 text-xs rounded-full border border-slate-700 hover:border-teal-500/50 transition-colors">Socket.io</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 reveal-section">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Technical Skills</h2>
            <div className="h-1 w-20 bg-teal-500 rounded transition-all duration-300 hover:w-32"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Frontend */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 reveal-section stagger-1">
              <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                <Layout className="text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Frontend</h3>
              <ul className="space-y-2 text-slate-400">
                {['JavaScript', 'React.js', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>{skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 reveal-section stagger-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Server className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Backend</h3>
              <ul className="space-y-2 text-slate-400">
                {['PHP', 'Laravel', 'Node.js', 'Express', 'Python', 'Firebase'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>{skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 reveal-section stagger-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Terminal className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Tools</h3>
              <ul className="space-y-2 text-slate-400">
                {['Git', 'GitHub', 'VS Code', 'Postman', 'MySQL', 'Composer'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>{skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* Soft Skills */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-pink-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 reveal-section stagger-4">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                <Globe className="text-pink-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-4">Soft Skills</h3>
              <ul className="space-y-2 text-slate-400">
                {['Problem Solving', 'Teamwork', 'Communication', 'Time Management', 'Adaptability'].map(skill => (
                  <li key={skill} className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>{skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-section">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Get In Touch</h2>
            <p className="text-slate-400">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden reveal-section stagger-1">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>

            {/* Form */}
            <form ref={form} onSubmit={sendEmail} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="user_name" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-teal-400 transition-colors">Name</label>
                  <input 
                    type="text" 
                    name="user_name" 
                    required 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-100 placeholder-slate-500 transition-all focus:bg-slate-800/80" 
                    placeholder="Abdelrhman Maged" 
                  />
                </div>
                <div className="group">
                  <label htmlFor="user_email" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-teal-400 transition-colors">Email</label>
                  <input 
                    type="email" 
                    name="user_email" 
                    required 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-100 placeholder-slate-500 transition-all focus:bg-slate-800/80" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-teal-400 transition-colors">Message</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  required 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-slate-100 placeholder-slate-500 transition-all focus:bg-slate-800/80" 
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-500/20 active:scale-95"
              >
                {isSubmitting ? (
                  <>Sending... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              {/* Status Messages */}
              {formStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-lg flex items-center gap-2 animate-fadeIn border border-green-500/30">
                  <CheckCircle size={18} /> Message sent successfully!
                </div>
              )}
              {formStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2 animate-fadeIn border border-red-500/30">
                  <AlertCircle size={18} /> {errorMessage ? errorMessage : "Failed to send message. Please try again."}
                </div>
              )}
            </form>
            
            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400 border-t border-slate-800 pt-8 relative z-10">
              {/* UPDATED: Direct Gmail Link for Contact Section */}
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abdelrhman@example.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-teal-400 transition-all hover:scale-105">
                <Mail size={18} className="text-teal-400" />
                <span>abdelrhman.syam1@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 hover:text-teal-400 transition-all hover:scale-105 cursor-default">
                <MapPin size={18} className="text-teal-400" />
                <span>Egypt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-center text-slate-500 text-sm">
        <p>© 2024 Abdelrhman Maged. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}