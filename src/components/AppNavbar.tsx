import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/home" },
  { label: "Skin Detection Page", to: "/skin-detection" },
  { label: "About", to: "/about" },
];

export function AppNavbar() {
  return (
    <header className='sticky top-0 z-20 border-b border-rose-200/60 bg-gradient-to-r from-rose-400 to-pink-300 shadow-sm'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4 md:px-8'>
        <div className='flex items-center gap-3'>
          <div className='grid h-10 w-10 place-items-center rounded-full bg-white text-xl'>✨</div>
          <div>
            <p className='text-xl font-bold text-white'>GlowAI</p>
            <p className='text-xs text-white/85'>Skin Health AI</p>
          </div>
        </div>

        <nav className='flex max-w-[58vw] items-center gap-2 overflow-x-auto md:max-w-none'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-lg px-3 py-2 text-sm font-medium text-white transition",
                  isActive ? "bg-white/30" : "hover:bg-white/20",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
