import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser'; // UNCOMMENT THIS LINE FOR LOCAL USE
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Cpu, 
  Globe, 
  Menu, 
  X,
  ChevronDown,
  Database,
  Sparkles
} from 'lucide-react';

// --- DATA SECTIONS ---

const PERSONAL_INFO = {
  name: "Abdelrhman Maged Ahmed",
  titles: ["Frontend Developer", "Backend Developer", "Fullstack Engineer"],
  tagline: "Building digital products with clean code and pixel-perfect design.",
  about: "I am an 18-year-old passionate developer bridging the gap between elegant user interfaces and robust backend architecture. With a diverse skill set ranging from React & Next.js to Laravel & Python, I build scalable web applications that solve real-world problems.",
  email: "abdelrhman.syam1@gmail.com",
  socials: {
    github: "https://github.com/AbdelrhmanMaged1",
    linkedin: "#",
    twitter: "#"
  }
};

const SKILLS = [
  { 
    category: "Frontend", 
    icon: <Code2 className="w-6 h-6" />, 
    items: ["React.js", "Next.js", "HTML", "CSS", "JavaScript", "Tailwind CSS"] 
  },
  { 
    category: "Backend", 
    icon: <Terminal className="w-6 h-6" />, 
    items: ["Node.js", "Express", "Python", "PHP", "Laravel"] 
  },
  { 
    category: "DevOps & Tools", 
    icon: <Cpu className="w-6 h-6" />, 
    items: ["Git", "GitHub", "Vercel"] 
  }
];

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "A comprehensive analytics dashboard for online retailers featuring real-time data visualization and inventory management.",
    tags: ["React", "Chart.js", "Node.js", "MongoDB"],
    links: { demo: "#", code: "#" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "TaskMaster Pro",
    description: "Collaborative project management tool allowing teams to track progress, assign tasks, and share files in real-time.",
    tags: ["Next.js", "TypeScript", "Prisma", "Socket.io"],
    links: { demo: "#", code: "#" },
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "SaaS application that uses OpenAI's API to help marketers generate blog posts and social media captions instantly.",
    tags: ["React", "Tailwind", "OpenAI API", "Stripe"],
    links: { demo: "#", code: "#" },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  }
];

// --- UTILITY COMPONENTS ---

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {children}
    </div>
  );
};

const Typewriter = ({ text, speed = 100, delay = 1000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, started]);

  return (
    <span className="inline-block">
      {displayedText}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  );
};

// --- MAIN COMPONENTS ---

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-2xl text-cyan-400 font-mono flex items-center gap-2 group cursor-pointer">
            <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">&lt;</span>
            <span className="group-hover:text-white transition-colors">Abdelrhman</span>
            <span className="text-3xl group-hover:-rotate-12 transition-transform duration-300">/&gt;</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link, index) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-[0_4px_14px_0_rgba(34,211,238,0.39)] animate-fadeIn"
                >
                  <span className="text-cyan-400 mr-1">0{index + 1}.</span> {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2 transition-transform active:scale-95">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-slate-900 border-b border-slate-800 transition-all duration-300 ease-in-out origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden pt-16">
      {/* Background Gradient Orbs - Floating Animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fadeInUp delay-100">
          <p className="text-cyan-400 font-mono mb-4 text-lg inline-flex items-center gap-2">
            <Sparkles size={16} /> Hi, my name is
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight hover:tracking-wide transition-all duration-500">
            {PERSONAL_INFO.name}.
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 min-h-[60px] md:min-h-[80px]">
            <Typewriter text="I build things for the web." delay={500} />
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fadeIn delay-1000 fill-mode-forwards">
            {PERSONAL_INFO.tagline}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center opacity-0 animate-fadeInUp delay-1000 fill-mode-forwards">
          <a href="#projects" className="group relative px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <span className="relative z-10">Check out my work</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </a>
          <a href="#contact" className="px-8 py-4 border border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/20">
            Contact Me
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors">
        <a href="#about"><ChevronDown size={32} /></a>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 bg-slate-900 relative">
      <RevealOnScroll>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <span className="text-cyan-400 mr-2 font-mono">01.</span> About Me
                <span className="h-px bg-slate-700 flex-grow ml-4"></span>
              </h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p className="hover:text-slate-300 transition-colors duration-300">{PERSONAL_INFO.about}</p>
                <p className="hover:text-slate-300 transition-colors duration-300">
                  My journey into software development started with a curiosity for how things work on the web, and it has evolved into a full-blown passion. I enjoy tackling complex problems and turning them into simple, beautiful, and intuitive designs.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center perspective-1000">
              <div className="relative group w-80 h-80 transition-transform duration-500 transform-style-3d hover:rotate-y-12 hover:rotate-x-12">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                <div className="relative h-full bg-slate-800 ring-1 ring-white/10 rounded-2xl p-8 flex flex-col justify-center space-y-8 backdrop-blur-sm border border-slate-700/50">
                   <div className="flex items-center gap-4 text-slate-300 group-hover:text-cyan-400 transition-colors transform group-hover:translate-x-2 duration-300">
                      <div className="p-3 bg-slate-900/50 rounded-lg"><Globe size={24} /></div>
                      <span className="font-semibold">Based in Cairo</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-300 group-hover:text-cyan-400 transition-colors transform group-hover:translate-x-2 duration-300 delay-75">
                      <div className="p-3 bg-slate-900/50 rounded-lg"><Database size={24} /></div>
                      <span className="font-semibold">Fullstack Architecture</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-300 group-hover:text-cyan-400 transition-colors transform group-hover:translate-x-2 duration-300 delay-150">
                      <div className="p-3 bg-slate-900/50 rounded-lg"><Code2 size={24} /></div>
                      <span className="font-semibold">Clean Code</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative BG elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-white mb-16 flex items-center">
            <span className="text-cyan-400 mr-2 font-mono">02.</span> Tech Stack
            <span className="h-px bg-slate-800 flex-grow ml-4"></span>
          </h2>
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILLS.map((skillGroup, idx) => (
            <RevealOnScroll key={idx} delay={idx * 200}>
              <div className="h-full bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] group hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-slate-800/50 rounded-xl text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-300 shadow-lg">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-200">{skillGroup.category}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skillGroup.items.map((item, i) => (
                    <span 
                      key={i} 
                      style={{ transitionDelay: `${i * 50}ms` }}
                      className="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded-lg font-mono hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-default border border-transparent hover:border-cyan-500/30 hover:scale-105"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-white mb-16 flex items-center">
            <span className="text-cyan-400 mr-2 font-mono">03.</span> Some Things I've Built
            <span className="h-px bg-slate-700 flex-grow ml-4"></span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PROJECTS.map((project, index) => (
            <RevealOnScroll key={project.id} delay={index * 150}>
              <div className="group bg-slate-800 rounded-xl overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/20 border border-slate-700/50 hover:border-cyan-500/30 flex flex-col h-full">
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500"></div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <a href={project.links.code} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg" title="View Code">
                      <Github size={18} />
                    </a>
                    <a href={project.links.demo} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg" title="Live Demo">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-mono text-cyan-400 bg-cyan-900/10 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formStatus, setFormStatus] = useState('idle');
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    // --- FOR LIVE PREVIEW ONLY (Simulated) ---
    
    
    // --- FOR LOCAL VS CODE USE (Real Email) ---
    // 1. Install EmailJS: npm install @emailjs/browser
    // 2. Uncomment the import at the top
    // 3. Uncomment the code below and delete the setTimeout block above
    
    
    emailjs.sendForm(
      'service_a3ux9ta',
      'template_l2nm5mm',
      form.current,
      'orfOk-sPfz8IJshSg'
    )
    .then((result) => {
        console.log('Success:', result.text);
        setFormStatus('success');
    }, (error) => {
        console.log('Error:', error.text);
        setFormStatus('error');
        alert("Failed to send message: " + error.text);
    });
    
  };

  return (
    <section id="contact" className="py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950"></div>
      
      <RevealOnScroll>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-cyan-400 font-mono text-lg mb-4">04. What's Next?</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Get In Touch</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Although I'm not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          {formStatus === 'success' ? (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 rounded-xl mb-12 animate-fadeIn flex flex-col items-center">
              <Sparkles className="mb-2 h-8 w-8" />
              <span className="font-bold text-xl">Message Sent!</span>
              <span className="text-sm opacity-80 mt-1">I'll get back to you soon.</span>
            </div>
          ) : (
            <form ref={form} onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-16 text-left bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Your Email</label>
                  <input 
                    type="email" 
                    name="user_email"
                    id="email"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600"
                    placeholder="john@example.com"
                  />
              </div>
              <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <textarea 
                    name="message"
                    id="message"
                    required
                    rows="4"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-600 resize-none"
                    placeholder="Hello, I'd like to talk about..."
                  ></textarea>
              </div>
              <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50 hover:-translate-y-1 shadow-lg shadow-cyan-500/20 active:scale-95 flex justify-center items-center gap-2"
              >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={20} /> Send Message
                    </>
                  )}
              </button>
            </form>
          )}

          <div className="flex justify-center gap-10">
            <a href={PERSONAL_INFO.socials.github} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110 hover:-translate-y-1">
              <Github size={28} />
            </a>
            <a href={PERSONAL_INFO.socials.linkedin} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110 hover:-translate-y-1">
              <Linkedin size={28} />
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110 hover:-translate-y-1">
              <Mail size={28} />
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 py-8 text-center text-slate-500 text-sm font-mono border-t border-slate-900">
      <p className="hover:text-cyan-400 transition-colors cursor-default">Designed & Built by {PERSONAL_INFO.name}</p>
      <div className="mt-2 text-xs opacity-60">
        v2.0 • React • Tailwind • Framer Motion
      </div>
    </footer>
  );
};

// --- MAIN COMPONENT ---

export default function App() {
  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes float-delayed {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-20px, 20px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-1000 { animation-delay: 1s; }
        .fill-mode-forwards { animation-fill-mode: forwards; }
        
        /* Smooth Scrolling */
        html { scroll-behavior: smooth; }
      `}</style>
      
      <div className="bg-slate-900 min-h-screen text-slate-300 selection:bg-cyan-300 selection:text-cyan-900 font-sans">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}