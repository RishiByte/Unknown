const { useContext } = window.React;

const LoadingScreen = () => (
    <div className="fixed inset-0 bg-charcoal z-50 flex flex-col items-center justify-center">
        <i className="fa-solid fa-utensils text-gold text-4xl animate-bounce mb-6"></i>
        <h2 className="font-serif text-3xl gold-gradient-text tracking-wider">L'Atelier</h2>
        <div className="mt-8 w-48 h-1 bg-charcoal-light rounded-full overflow-hidden">
            <div className="h-full bg-gold animate-pulse-slow w-full origin-left" style={{ animationDuration: '1.5s' }}></div>
        </div>
    </div>
);

const ToastContainer = () => {
    const { toasts } = useContext(window.AppContext);
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="animate-toast-entry glass-nav border-l-4 border-gold text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check text-green-400' : 'fa-circle-info text-blue-400'}`}></i>
                    <p className="text-sm font-medium">{toast.message}</p>
                </div>
            ))}
        </div>
    );
};

const Header = ({ currentView, setCurrentView }) => {
    const { theme, toggleTheme } = window.useTheme();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-40 glass-nav animate-fade-in text-white shadow-sm print-friendly no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('dashboard')}>
                        <i className="fa-solid fa-bell-concierge text-gold text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
                        <span className="font-serif text-2xl tracking-widest font-semibold hidden sm:block">L'ATELIER</span>
                    </div>
                    <nav className="hidden lg:flex items-center gap-6 font-sans text-sm tracking-wide">
                        <button onClick={() => setCurrentView('dashboard')} className={`${currentView === 'dashboard' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Dashboard</button>
                        <button onClick={() => setCurrentView('planner')} className={`${currentView === 'planner' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Planner</button>
                        <button onClick={() => setCurrentView('generator')} className={`${currentView === 'generator' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>AI Generator</button>
                        <button onClick={() => setCurrentView('menu')} className={`${currentView === 'menu' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Menu</button>
                        <button onClick={() => setCurrentView('inventory')} className={`${currentView === 'inventory' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Inventory</button>
                        <button onClick={() => setCurrentView('optimizer')} className={`${currentView === 'optimizer' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Optimizer</button>
                        <button onClick={() => setCurrentView('analytics')} className={`${currentView === 'analytics' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Analytics</button>
                    </nav>
                    <div className="flex items-center gap-6">
                        <button onClick={toggleTheme} className="text-gray-300 hover:text-gold transition-colors" title="Toggle Theme">
                            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer border-l border-gray-700 pl-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Chef&backgroundColor=d4af37" alt="Profile" className="w-9 h-9 rounded-full border-2 border-gold object-cover"/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const RecipeCard = ({ meal, actions = [], showNutrition = false, targetCalories = null, draggable, onDragStart }) => {
    const stats = window.generateMockStats(meal.idMeal);
    let score = 0;
    if (targetCalories) {
        const diff = Math.abs(stats.calories - targetCalories);
        score = Math.max(0, 100 - (diff / targetCalories) * 100).toFixed(0);
    }

    const handleGenerateQR = (e) => {
        e.stopPropagation();
        alert(`Sharing Recipe: ${meal.strMeal}\nQR Generation via QRCode.js would be tethered to a public URL here.`);
    };

    return (
        <div 
            draggable={draggable}
            onDragStart={onDragStart}
            className={`glass-card rounded-2xl overflow-hidden flex flex-col h-full relative print-friendly ${draggable ? 'cursor-grab active:cursor-grabbing' : 'group hover-lift'}`}
        >
            {targetCalories && (
                <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {score}% Match
                </div>
            )}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button onClick={handleGenerateQR} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:bg-gold hover:text-white transition-colors">
                    <i className="fa-solid fa-qrcode text-charcoal"></i>
                </button>
            </div>
            <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-charcoal/30 z-10 transition-colors group-hover:bg-transparent"></div>
                <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"/>
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white font-medium shadow-md">
                        {stats.difficulty}
                    </span>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow dark:bg-charcoal-light">
                <h4 className="font-serif text-xl font-bold mb-2 line-clamp-1">{meal.strMeal}</h4>
                <p className="text-xs text-gold font-medium mb-3 uppercase tracking-wider">{meal.strCategory} &bull; {meal.strArea}</p>
                
                {showNutrition && (
                    <div className="mb-4 grid grid-cols-2 gap-2 text-xs border-y border-gray-100 dark:border-gray-700 py-3">
                        <div><span className="text-gray-500 block">Calories</span><span className="font-bold">{stats.calories} kcal</span></div>
                        <div><span className="text-gray-500 block">Est. Yield</span><span className="font-bold">4 Servings</span></div>
                    </div>
                )}
                
                <div className="mt-auto pt-4 flex flex-wrap gap-2 no-print">
                    {actions.map((action, idx) => (
                        <button key={idx} onClick={() => action.onClick(meal)} className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-sm font-semibold transition-all ${action.primary ? 'bg-charcoal dark:bg-cream dark:text-charcoal text-gold hover:opacity-80' : 'bg-cream dark:bg-charcoal-dark text-charcoal dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gold/20'}`}>
                            <i className={`${action.icon} mr-2`}></i>{action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
};

const Footer = () => (
    <footer className="bg-charcoal text-white pt-12 pb-8 mt-20 border-t border-gold/20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} L'Atelier Management Inc.</p>
            <p>Designed for Executive Precision.</p>
        </div>
    </footer>
);

window.LoadingScreen = LoadingScreen;
window.ToastContainer = ToastContainer;
window.Header = Header;
window.RecipeCard = RecipeCard;
window.Footer = Footer;
