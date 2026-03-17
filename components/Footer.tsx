'use client';

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-2xl font-display uppercase tracking-wider text-white mb-10">
          REWIND<span className="text-orange-500">.</span>
        </div>
      </div>
    </footer>
  );
}
