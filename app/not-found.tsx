import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] uppercase tracking-widest font-mono text-white/30 mb-6">Error 404</p>
      <h1 className="text-6xl font-medium tracking-tight mb-4">Page not found</h1>
      <p className="text-white/40 text-lg mb-12 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-6">
        <Link href="/" className="px-6 py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
          Home
        </Link>
        <Link href="/blog" className="px-6 py-3 border border-white/20 text-sm font-medium text-white/60 hover:text-white hover:border-white/40 transition-colors">
          Blog
        </Link>
        <Link href="/templates" className="px-6 py-3 border border-white/20 text-sm font-medium text-white/60 hover:text-white hover:border-white/40 transition-colors">
          Templates
        </Link>
      </div>
    </div>
  );
}
