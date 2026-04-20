const { useState, useEffect } = window.React;

const RecipeOptimizerView = () => {
    const [query, setQuery] = useState('');
    const [calories, setCalories] = useState(600);
    const debouncedQuery = window.useDebounce(query, 600);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!debouncedQuery) { setResults([]); return; }
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`);
                const data = await res.json();
                setResults((data.meals || []).slice(0, 4));
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchRecipes();
    }, [debouncedQuery]);

    return (
        <div className="animate-fade-in">
            <div className="mb-8 border-b-4 border-gold inline-block">
                <h2 className="font-serif text-3xl mb-2">Recipe Optimizer Matrix</h2>
            </div>

            <div className="bg-charcoal text-white rounded-2xl p-6 mb-10 shadow-lg flex flex-col md:flex-row gap-6 items-end no-print">
                <div className="flex-1 w-full">
                    <label className="block text-xs uppercase text-gold font-bold mb-2">Target Recipe Type / Ingredient</label>
                    <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. Salmon" className="w-full bg-white/10 border border-gray-600 focus:border-gold rounded p-3 text-white placeholder-gray-400"/>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs uppercase text-gold font-bold mb-2">Dietary Target (Calories: {calories})</label>
                    <input type="range" min="300" max="1200" step="50" value={calories} onChange={e=>setCalories(Number(e.target.value))} className="w-full accent-gold mt-2"/>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>300 kcal (Lean)</span>
                        <span>1200 kcal (Indulgent)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading && <div className="col-span-full text-center py-10 text-gray-500">Calculating nutrition density matrices...</div>}
                {!loading && results.map(meal => (
                    <window.RecipeCard 
                        key={meal.idMeal} 
                        meal={meal} 
                        showNutrition={true}
                        targetCalories={calories}
                        actions={[
                            { label: 'Print Spec', icon: 'fa-solid fa-print', onClick: () => window.print(), primary: false }
                        ]}
                    />
                ))}
            </div>
        </div>
    );
};

window.RecipeOptimizerView = RecipeOptimizerView;
