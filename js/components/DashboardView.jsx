const { useContext, useMemo, useState, useEffect } = window.React;

const DashboardView = ({ setCurrentView }) => {
    const { inventory, savedRecipes, feedbacks } = useContext(window.AppContext);
    const [trending, setTrending] = useState(null);

    // Smart Recommendations Algorithm: Find highest rated saved recipes
    const bestMatch = useMemo(() => {
        if (savedRecipes.length === 0) return null;
        let best = savedRecipes[0];
        let highestRating = 0;
        savedRecipes.forEach(recipe => {
            const fb = feedbacks[recipe.idMeal];
            const rating = fb ? fb.rating : 2.5; // default fallback
            if (rating > highestRating) { highestRating = rating; best = recipe; }
        });
        return best;
    }, [savedRecipes, feedbacks]);

    useEffect(() => {
        // Fetch a random trending meal from MealDB
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(r => r.json())
            .then(d => setTrending(d.meals[0]));
    }, []);

    const avgRating = Object.values(feedbacks).length > 0 
        ? (Object.values(feedbacks).reduce((a, c) => a + c.rating, 0) / Object.values(feedbacks).length).toFixed(1)
        : 'N/A';

    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                    Good Evening, <span className="gold-gradient-text italic">Chef Auguste.</span>
                </h1>
                <p className="text-gray-500 max-w-2xl text-lg font-light">
                    The kitchen awaits. Your smart recommendations are ready.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <p className="text-sm text-gray-500 uppercase">Inventory</p>
                    <h3 className="font-serif text-3xl font-bold">{inventory.length}</h3>
                </div>
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between animate-slide-up" style={{animationDelay: '0.2s'}}>
                    <p className="text-sm text-gray-500 uppercase">Saved Recipes</p>
                    <h3 className="font-serif text-3xl font-bold">{savedRecipes.length}</h3>
                </div>
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between animate-slide-up" style={{animationDelay: '0.3s'}}>
                    <p className="text-sm text-gray-500 uppercase">Avg Rating</p>
                    <h3 className="font-serif text-3xl font-bold"><i className="fa-solid fa-star text-gold text-2xl mr-2"></i>{avgRating}</h3>
                </div>
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <p className="text-sm text-gray-500 uppercase">Pro Tip</p>
                    <p className="text-xs italic mt-2">{window.CHEF_TIPS[Math.floor(Math.random() * window.CHEF_TIPS.length)]}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {bestMatch && (
                    <div className="glass-card rounded-2xl p-6 flex flex-col relative overflow-hidden border-t-4 border-gold">
                        <div className="absolute top-0 right-0 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-bl-lg">TOP PATTERN</div>
                        <h2 className="font-serif text-2xl mb-2">Today's Best Match</h2>
                        <p className="text-sm text-gray-500 mb-4">Based on your highest rated recipes and current inventory availability.</p>
                        <div className="flex gap-4">
                            <img src={bestMatch.strMealThumb} className="w-24 h-24 rounded-lg object-cover shadow-sm"/>
                            <div>
                                <h4 className="font-bold text-lg">{bestMatch.strMeal}</h4>
                                <p className="text-xs text-gold uppercase tracking-widest">{bestMatch.strCategory}</p>
                            </div>
                        </div>
                    </div>
                )}

                {trending && (
                    <div className="glass-card flex flex-col justify-end p-6 rounded-2xl relative overflow-hidden h-48 group cursor-pointer" onClick={() => setCurrentView('generator')}>
                        <img src={trending.strMealThumb} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent"></div>
                        <div className="relative z-10 text-white">
                            <div className="text-xs font-bold bg-white/20 backdrop-blur rounded px-2 py-1 inline-block mb-2">GLOBAL TRENDING</div>
                            <h4 className="font-serif text-xl">{trending.strMeal}</h4>
                        </div>
                    </div>
                )}
            </div>

            <h2 className="font-serif text-2xl border-l-4 border-gold pl-4 mt-8">Dashboard Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['planner', 'generator', 'menu', 'inventory', 'optimizer', 'analytics'].map((view, i) => (
                      <button key={view} onClick={() => setCurrentView(view)} className="glass-card p-6 rounded-2xl flex flex-col items-center hover-lift justify-center capitalize font-bold h-32 text-charcoal dark:text-cream">
                           Go to {view}
                      </button>
                 ))}
            </div>
        </div>
    );
};

window.DashboardView = DashboardView;
