'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackCTAClick } from '../lib/analytics';

const NavLink = ({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={`relative py-1 transition-colors duration-300 ${active ? 'text-white' : 'text-white/40 hover:text-white'}`}
  >
    {children}
  </Link>
);

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  /* ─── Scroll-aware background ─── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Templates', path: '/templates' },
    { name: 'Open Source', path: '/open-source' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] px-6 transition-all duration-500 ${
          scrolled
            ? 'py-4 bg-onyx/80 backdrop-blur-xl'
            : 'py-8 bg-transparent mix-blend-difference'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <button
            onClick={() => { router.push('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-mono text-lg tracking-tight hover:opacity-70 transition-opacity duration-300"
          >
            MUNEER <span className="text-white/40 text-sm hidden sm:inline">/ ARCHITECTURE & AI</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-10 items-center text-[10px] uppercase tracking-[0.2em] font-mono">
            {links.map(link => (
              <NavLink
                key={link.path}
                href={link.path}
                active={pathname === link.path || (link.path === '/blog' && pathname.startsWith('/blog/')) || (link.path === '/templates' && pathname.startsWith('/templates/'))}
              >
                {link.name}
              </NavLink>
            ))}
            <a
              href="#intake"
              onClick={() => trackCTAClick('intake_form', 'nav')}
              className="ml-4 px-5 py-2.5 border border-white/20 text-white/60 hover:border-white/60 hover:text-white transition-all duration-300"
            >
              Inquire
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-onyx p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs tracking-tighter">MENU</span>
              <button onClick={() => setIsOpen(false)}><X className="w-8 h-8" /></button>
            </div>

            <div className="flex flex-col gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-medium tracking-tighter hover:text-white/60 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/40">
              <a href="https://linkedin.com/in/muneer-p-5052b6128">LinkedIn</a>
              <a href="https://github.com/muneerpp3333">GitHub</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
