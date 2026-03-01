const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
      <span>&copy; 2026 Muneer Puthiya Purayil. All rights reserved.</span>
      <div className="flex gap-8">
        <a href="https://linkedin.com/in/muneer-p-5052b6128" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">LinkedIn</a>
        <a href="https://github.com/muneerpp3333" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">GitHub</a>
        <a href="mailto:muneer@gitspark.com" className="hover:text-white/50 transition-colors">Email</a>
      </div>
      <span>Dubai, UAE</span>
    </div>
  </footer>
);

export default Footer;
