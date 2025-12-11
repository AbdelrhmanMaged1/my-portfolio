import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// import emailjs from '@emailjs/browser'; // UNCOMMENT FOR REAL EMAIL
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, Terminal, Cpu, Globe, 
  Menu, X, Sparkles, Database
} from 'lucide-react';

// --- DATA ---
const PERSONAL_INFO = {
  name: "Abdelrhman Maged Ahmed",
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
  { category: "Frontend", icon: <Code2 className="w-6 h-6" />, items: ["React.js", "Next.js", "HTML", "CSS", "JavaScript", "Tailwind CSS"] },
  { category: "Backend", icon: <Terminal className="w-6 h-6" />, items: ["Node.js", "Express", "Python", "PHP", "Laravel"] },
  { category: "DevOps & Tools", icon: <Cpu className="w-6 h-6" />, items: ["Git", "GitHub", "Vercel"] }
];

const PROJECTS = [
  {
    id: 1,
    title: "MindFlow AI Notes",
    description: "A powerful full-stack note-taking application featuring AI summarization, auto-tagging, and a modern VS Code-like interface.",
    tags: ["React", "Node.js", "AI Integration", "Tailwind"],
    links: { demo: "/mindflow", code: "#" }, // Internal Route
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "E-Commerce Dashboard",
    description: "A comprehensive analytics dashboard for online retailers featuring real-time data visualization and inventory management.",
    tags: ["React", "Chart.js", "Node.js", "MongoDB"],
    links: { demo: "#", code: "#" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
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

// --- UTILITIES ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
};

const Typewriter = ({ text, speed = 100, delay = 1000 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const t = setTimeout(() => setDisplayedText(text.slice(0, displayedText.length + 1)), speed);
      return () => clearTimeout(t);
    }
  }, [displayedText, text, speed, started]);
  return <span className="inline-block">{displayedText}<span className="animate-pulse text-cyan-400">|</span></span>;
};

// --- COMPONENT ---
export default function Portfolio() {
  const [isOpen, setIsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // LOCAL USE: Uncomment emailjs here
    /*
    emailjs.sendForm('service_a3ux9ta', 'template_l2nm5mm', form.current, 'orfOk-sPfz8IJshSg')
      .then(() => setFormStatus('success'), (err) => { setFormStatus('error'); alert(err.text); });
    */
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 selection:bg-cyan-300 selection:text-cyan-900 font-sans">
      <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-2xl text-cyan-400 font-mono">&lt;Abdelrhman/&gt;</div>
            <div className="hidden md:block ml-10 flex items-baseline space-x-8">
              {['About', 'Skills', 'Projects', 'Contact'].map((item, i) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:-translate-y-1"><span className="text-cyan-400 mr-1">0{i+1}.</span> {item}</a>
              ))}
            </div>
            <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
          </div>
        </div>
        {isOpen && <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1">{['About', 'Skills', 'Projects', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400">{item}</a>)}</div>}
      </nav>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden pt-16">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-cyan-400 font-mono mb-4 text-lg inline-flex items-center gap-2"><Sparkles size={16} /> Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">{PERSONAL_INFO.name}.</h1>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 min-h-[60px] md:min-h-[80px]"><Typewriter text="I build things for the web." delay={500} /></h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-12">
              <a href="#projects" className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:scale-105 transition-all">Check out my work</a>
              <a href="#contact" className="px-8 py-4 border border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">Contact Me</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-32 bg-slate-900"><RevealOnScroll><div className="max-w-7xl mx-auto px-4"><h2 className="text-3xl font-bold text-white mb-8"><span className="text-cyan-400 mr-2">01.</span> About Me</h2><p className="text-slate-400 text-lg leading-relaxed">{PERSONAL_INFO.about}</p></div></RevealOnScroll></section>

        {/* Skills */}
        <section id="skills" className="py-32 bg-slate-950"><RevealOnScroll><div className="max-w-7xl mx-auto px-4"><h2 className="text-3xl font-bold text-white mb-16"><span className="text-cyan-400 mr-2">02.</span> Tech Stack</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{SKILLS.map((grp, i) => <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all"><div className="flex items-center gap-4 mb-8 text-cyan-400">{grp.icon}<h3 className="text-xl font-bold text-slate-200">{grp.category}</h3></div><div className="flex flex-wrap gap-3">{grp.items.map((item, j) => <span key={j} className="px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded-lg border border-transparent hover:border-cyan-500/30">{item}</span>)}</div></div>)}</div></div></RevealOnScroll></section>

        {/* Projects */}
        <section id="projects" className="py-32 bg-slate-900">
          <RevealOnScroll>
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-white mb-16"><span className="text-cyan-400 mr-2">03.</span> Some Things I've Built</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PROJECTS.map((proj) => (
                  <div key={proj.id} className="group bg-slate-800 rounded-xl overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl border border-slate-700/50 flex flex-col h-full">
                    <div className="h-52 overflow-hidden relative">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                      <div className="absolute bottom-4 right-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                         {/* Check if link is internal (React Router) or external */}
                         {proj.links.demo.startsWith('/') ? (
                            <Link to={proj.links.demo} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg"><ExternalLink size={18} /></Link>
                         ) : (
                            <a href={proj.links.demo} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg"><ExternalLink size={18} /></a>
                         )}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400">{proj.title}</h3>
                      <p className="text-slate-400 mb-6 text-sm flex-grow">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">{proj.tags.map(tag => <span key={tag} className="text-xs font-mono text-cyan-400 bg-cyan-900/10 px-2 py-1 rounded">#{tag}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 bg-slate-950 relative overflow-hidden">
          <RevealOnScroll>
            <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
              <p className="text-cyan-400 font-mono text-lg mb-4">04. What's Next?</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Get In Touch</h2>
              {formStatus === 'success' ? (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 rounded-xl mb-12 flex flex-col items-center"><Sparkles className="mb-2 h-8 w-8" /><span className="font-bold text-xl">Message Sent!</span></div>
              ) : (
                <form ref={form} onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mb-16 text-left bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
                  <div><label className="block text-sm font-medium text-slate-400 mb-2">Email</label><input type="email" name="user_email" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400" placeholder="john@example.com" /></div>
                  <div><label className="block text-sm font-medium text-slate-400 mb-2">Message</label><textarea name="message" required rows="4" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 resize-none" placeholder="Hi..."></textarea></div>
                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50">{formStatus === 'submitting' ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
              <div className="flex justify-center gap-10"><a href={PERSONAL_INFO.socials.github} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110"><Github size={28} /></a><a href={PERSONAL_INFO.socials.linkedin} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110"><Linkedin size={28} /></a><a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-400 hover:text-cyan-400 transition-colors transform hover:scale-110"><Mail size={28} /></a></div>
            </div>
          </RevealOnScroll>
        </section>
      </main>
      
      <footer className="bg-slate-950 py-8 text-center text-slate-500 text-sm font-mono border-t border-slate-900">
        <p>Designed & Built by {PERSONAL_INFO.name}</p>
      </footer>
    </div>
  );
}