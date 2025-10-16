import logoImage from 'figma:asset/e94e31d557b531bbff850d12750a11fe68edae35.png';

export function MobileHeader() {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-sidebar border-b border-sidebar-border z-30 flex items-center px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-purple-500/50 ring-2 ring-purple-500/30">
          <img src={logoImage} alt="RudraCore" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-white">RudraCore</h2>
          <p className="text-xs text-gray-400">Client Portal</p>
        </div>
      </div>
    </div>
  );
}
