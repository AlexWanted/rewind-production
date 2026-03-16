'use client';

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-2xl font-display uppercase tracking-wider text-white">
          REWIND<span className="text-orange-500">.</span>
        </div>
        
        /*! <p className="text-xs uppercase tracking-widest text-gray-500 font-light">
          &copy; {new Date().getFullYear()} Rewind Production. Все права защищены.
        </p>

         <div className="flex gap-6 text-xs uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-orange-500 transition-colors">Политика конфиденциальности</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Условия использования</a>
        </div> */
      </div>
    </footer>
  );
}
