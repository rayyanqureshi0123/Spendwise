const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/[0.04] bg-surface-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text tracking-tight">SpendWise</span>
          </div>
          
          <p className="text-sm text-surface-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} SpendWise. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-surface-400">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
