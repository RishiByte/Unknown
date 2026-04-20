const { useContext, useState, useEffect } = window.React;

const AIGeneratorView = () => {
    const { savedRecipes, setSavedRecipes, addToast } = useContext(window.AppContext);
    const [query, setQuery] = useState('');
    const debouncedQuery = window.useDebounce(query, 600);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [improviseMode, setImproviseMode] = useState(null);

    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // To demonstrate pagination

    const cacheKey = `latelier_cache_${debouncedQuery}`;

    useEffect(() => {
        if (!debouncedQuery) { setResults([]); return; }
        
        // Optimizing API calls with session cache
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            setResults(JSON.parse(cached));
            return;
        }

        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`);
                const data = await res.json();
                const meals = data.meals || [];
                setResults(meals);
                sessionStorage.setItem(cacheKey, JSON.stringify(meals));
            } catch (e) {
                console.error('API Error', e);
            }
            setLoading(false);
        };
        fetchRecipes();
    }, [debouncedQuery]);

    const handleSave = (meal) => {
        if (!savedRecipes.find(r => r.idMeal === meal.idMeal)) {
            setSavedRecipes([...savedRecipes, meal]);
            addToast(`Recipe "${meal.strMeal}" secured.`, 'success');
        } else {
            addToast('Already in Repertoire.', 'info');
        }
    };

    const triggerImprovise = (meal) => {
        setImproviseMode(meal);
        setTimeout(() => {
            addToast(`Improvisation Suggestion for ${meal.strMeal}: Substitute standard oil with Truffle Oil.`, 'info');
            setImproviseMode(null);
        }, 1000);
    };

    const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="animate-fade-in">
            <div className="mb-10 text-center">
                <h2 className="font-serif text-3xl mb-3">AI Recipe Generator</h2>
                <p className="text-gray-500 max-w-xl mx-auto">Summon inspiration from the global index.</p>
            </div>

            <div className="max-w-2xl mx-auto mb-12 relative no-print">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <i className="fa-solid fa-wand-sparkles text-gold text-lg"></i>
                </div>
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    placeholder="Search by ingredient, dish name, style..."
                    className="w-full bg-white dark:bg-charcoal border-2 border-gray-200 dark:border-gray-700 rounded-full py-4 pl-12 pr-6 shadow-sm focus:border-gold transition-colors text-lg"
                />
                {loading && <div className="absolute inset-y-0 right-4 flex items-center"><div className="spinner w-6 h-6 border-2 border-t-2"></div></div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <div className="col-span-full py-10 text-center text-gray-500">Consulting culinary database...</div>}
                {!loading && query && results.length === 0 && <div className="col-span-full py-10 text-center text-red-400">No divine inspiration found. Try broader strokes.</div>}
                
                {!loading && paginatedResults.map(meal => (
                    <window.RecipeCard 
                        key={meal.idMeal} 
                        meal={meal} 
                        actions={[
                            { label: 'Save', icon: 'fa-regular fa-bookmark', onClick: handleSave, primary: true },
                            { label: improviseMode?.idMeal === meal.idMeal ? 'Thinking...' : 'Improvise', icon: 'fa-solid fa-lightbulb', onClick: () => triggerImprovise(meal) }
                        ]}
                    />
                ))}
            </div>

            {results.length > itemsPerPage && (
                <div className="mt-8 flex justify-center gap-4 no-print">
                    <button disabled={page === 1} onClick={() => setPage(page-1)} className="px-4 py-2 glass-card rounded disabled:opacity-50">Prev</button>
                    <span className="py-2 font-bold">{page} / Math.ceil({results.length} / {itemsPerPage})</span>
                    <button disabled={page * itemsPerPage >= results.length} onClick={() => setPage(page+1)} className="px-4 py-2 glass-card rounded disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
};

window.AIGeneratorView = AIGeneratorView;
