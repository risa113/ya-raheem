import React from 'react';
import { CustomerTab } from '../types';
import { useStore } from '../context/StoreContext';
import { ChevronRight, Home } from 'lucide-react';
import { getSeoConfigForTab } from './SEOHead';

interface BreadcrumbsProps {
  customerTab: CustomerTab;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customerTab }) => {
  const { setCustomerTab, activeProductDetail } = useStore();
  const seoConfig = getSeoConfigForTab(customerTab, activeProductDetail);

  if (customerTab === 'home' && !activeProductDetail) {
    return null; // Don't render top-level breadcrumb on home page root
  }

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="bg-secondary/60 border-b border-white/5 py-2.5 px-4 text-xs text-gray-300 font-semibold backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setCustomerTab('home')}
          className="flex items-center gap-1 hover:text-amber-400 transition"
          title="Return to MidnightFuelss Homepage"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span>Home</span>
        </button>

        {seoConfig.breadcrumbs.slice(1).map((b, index) => {
          const isLast = index === seoConfig.breadcrumbs.length - 2;
          return (
            <React.Fragment key={b.name}>
              <ChevronRight className="w-3 h-3 text-gray-500 shrink-0" />
              {isLast ? (
                <span className="text-amber-400 font-extrabold truncate max-w-[200px] sm:max-w-xs">
                  {b.name}
                </span>
              ) : (
                <button
                  onClick={() => setCustomerTab('menu')}
                  className="hover:text-amber-400 transition truncate max-w-[150px]"
                >
                  {b.name}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
