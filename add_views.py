import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Update Header Navigation
nav_replacement = """                            <button onClick={() => setCurrentView('dashboard')} className={`${currentView === 'dashboard' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Dashboard</button>
                            <button onClick={() => setCurrentView('planner')} className={`${currentView === 'planner' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Planner</button>
                            <button onClick={() => setCurrentView('generator')} className={`${currentView === 'generator' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>AI Generator</button>
                            <button onClick={() => setCurrentView('menu')} className={`${currentView === 'menu' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Menu</button>
                            <button onClick={() => setCurrentView('inventory')} className={`${currentView === 'inventory' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Inventory</button>
                            <button onClick={() => setCurrentView('optimizer')} className={`${currentView === 'optimizer' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Optimizer</button>
                            <button onClick={() => setCurrentView('analytics')} className={`${currentView === 'analytics' ? 'text-gold border-b-2 border-gold' : 'text-gray-300 hover:text-gold'} pb-1 transition-all`}>Analytics</button>"""

# Using regex to replace the nav inner content
nav_regex = re.compile(r'<nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide">.*?</nav>', re.DOTALL)
new_nav = f'<nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide">\n{nav_replacement}\n                        </nav>'
content = nav_regex.sub(new_nav, content)

# 2. Update Dashboard links
content = content.replace("alert('Planner Module')", "setCurrentView('planner')")
content = content.replace("alert('Analytics Module')", "setCurrentView('analytics')")

# 3. Update AI Generator View Style
aig_start = content.find('const AIGeneratorView = () => {')
aig_end = content.find('/* --- View: Digital Menu & Feedback Analyzer --- */')

new_aig = """const AIGeneratorView = () => {
            const { savedRecipes, setSavedRecipes, setViewMeal } = useContext(AppContext);
            const [query, setQuery] = useState('');
            const debouncedQuery = useDebounce(query, 600);
            const [results, setResults] = useState([]);
            const [loading, setLoading] = useState(false);
            const [improviseMode, setImproviseMode] = useState(null);

            useEffect(() => {
                if (!debouncedQuery) { setResults([]); return; }
                const fetchRecipes = async () => {
                    setLoading(true);
                    try {
                        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${debouncedQuery}`);
                        const data = await res.json();
                        setResults((data.meals || []).slice(0, 3)); 
                    } catch (e) {
                        console.error('Failed to fetch recipes', e);
                    }
                    setLoading(false);
                };
                fetchRecipes();
            }, [debouncedQuery]);

            const handleSave = (meal) => {
                if (!savedRecipes.find(r => r.idMeal === meal.idMeal)) {
                    setSavedRecipes([...savedRecipes, meal]);
                    alert(`${meal.strMeal} saved to favorites!`);
                } else {
                    alert(`${meal.strMeal} is already saved.`);
                }
            };

            const triggerImprovise = (meal) => {
                setImproviseMode(meal);
                setTimeout(() => {
                    alert(`Improvisation Suggestion for ${meal.strMeal}:\\n\\nSubstitute standard oil with Truffle Oil for luxury depth.\\nSwap ${getIngredients(meal)[0]?.name || 'main carb'} with locally sourced alternative.`);
                    setImproviseMode(null);
                }, 1000);
            };

            return (
                <div className="animate-fade-in pt-10">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-4xl text-white mb-4">AI Recipe Generator</h2>
                        <p className="text-gray-400 text-lg">Summon inspiration from the global index.</p>
                    </div>

                    <div className="max-w-3xl mx-auto mb-16 relative">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <span className="text-gold text-xl">🪄</span>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by ingredient, dish name, style..."
                            className="w-full bg-transparent border border-gray-600 focus:border-gold/50 text-white font-medium rounded-full py-4 pl-14 pr-6 transition-colors text-lg outline-none shadow-sm"
                        />
                        {loading && (
                            <div className="absolute inset-y-0 right-6 flex items-center">
                                <div className="spinner w-6 h-6 border-2 border-t-2"></div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {loading && <div className="col-span-3 text-center py-10 text-gray-500 font-medium">Consulting culinary database...</div>}
                        {!loading && query && results.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-red-400/80">No divine inspiration found for that query. Try broader strokes.</div>
                        )}
                        {!loading && results.map(meal => (
                            <RecipeCard
                                key={meal.idMeal}
                                meal={meal}
                                actions={[
                                    { label: 'View Recipe', icon: 'fa-regular fa-eye', onClick: () => setViewMeal(meal), primary: true },
                                    { label: 'Save', icon: 'fa-regular fa-bookmark', onClick: () => handleSave(meal), primary: false },
                                    { label: improviseMode?.idMeal === meal.idMeal ? 'Thinking...' : 'Improvise', icon: 'fa-solid fa-lightbulb', onClick: () => triggerImprovise(meal), primary: false }
                                ]}
                            />
                        ))}
                    </div>
                </div>
            );
        };
"""
content = content[:aig_start] + new_aig + '\n        ' + content[aig_end:]

# 4. Add Analytics and Planner Views right before /* --- MAIN APP --- */
main_app_start = content.find('/* --- MAIN APP --- */')

new_views = """
        /* --- View: Analytics Engine --- */
        const AnalyticsView = () => {
            return (
                <div className="animate-fade-in pt-4">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gold rounded-full"></div>
                            <h2 className="font-serif text-3xl font-bold text-white">Analytics Engine</h2>
                        </div>
                        <button className="text-gold font-bold text-sm tracking-wide hover:text-yellow-500 transition-colors">
                            <i className="fa-solid fa-file-csv mr-2"></i>Export CSV Report
                        </button>
                    </div>

                    <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-6 mb-6">
                        <h3 className="font-serif text-xl text-white mb-6">Recipe Performance Matrix</h3>
                        
                        <div className="relative h-72 border-b border-l border-gray-700 ml-6 mb-8 flex text-[10px] text-gray-500">
                            <div className="absolute -left-6 bottom-0 h-full flex flex-col justify-between w-4 text-right">
                                <span>5.0</span><span>4.5</span><span>4.0</span><span>3.5</span><span>3.0</span><span>2.5</span><span>2.0</span><span>1.5</span><span>1.0</span><span>0.5</span><span>0</span>
                            </div>
                            
                            {/* Bar Chart Mock - height 100% since rating is 5.0 */}
                            <div className="w-[45%] bg-[#a38a3d] h-full mx-auto relative bottom-0 rounded-t-sm opacity-90 transition-opacity hover:opacity-100 flex items-end justify-center">
                                <span className="absolute -bottom-6 text-gray-400">Chicken Handi...</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-6 text-center">
                            <h4 className="text-gold font-bold text-sm mb-3">Pattern Identification</h4>
                            <p className="text-gray-400 text-sm italic">"Dishes in the 'Seafood' category generally receive 15% higher feedback margins on weekends."</p>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-6 text-center">
                            <h4 className="text-white font-bold text-sm mb-3">Operational Insight</h4>
                            <p className="text-gray-400 text-sm italic">"Prep times exceeding 45 minutes correlate with lower kitchen efficiency during Friday rush."</p>
                        </div>
                    </div>
                </div>
            );
        };

        /* --- View: Weekly Logistics Planner --- */
        const PlannerView = () => {
            const { savedRecipes, setViewMeal } = useContext(AppContext);
            
            const [schedule, setSchedule] = useState({
                MONDAY: null, TUESDAY: null, WEDNESDAY: null,
                THURSDAY: null, FRIDAY: null, SATURDAY: null, SUNDAY: null
            });

            const onDragStart = (e, meal) => {
                e.dataTransfer.setData("mealId", meal.idMeal);
            };

            const onDragOver = (e) => {
                e.preventDefault();
            };

            const onDrop = (e, day) => {
                e.preventDefault();
                const mealId = e.dataTransfer.getData("mealId");
                const meal = savedRecipes.find(r => r.idMeal === mealId);
                if (meal) setSchedule({...schedule, [day]: meal});
            };

            const checkShoppingList = () => {
                const planned = Object.values(schedule).filter(Boolean);
                if (planned.length === 0) return "All planned ingredients are in inventory, or week is empty.";
                return "Shopping list generated based on " + planned.length + " planned dishes.";
            };

            return (
                <div className="animate-fade-in pt-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-gold rounded-full"></div>
                        <h2 className="font-serif text-3xl font-bold text-white">Weekly Logistics</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                            {Object.keys(schedule).map(day => (
                                <div 
                                    key={day}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, day)}
                                    className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-4 h-44 flex flex-col items-center justify-center transition-colors relative"
                                >
                                    <h4 className="absolute top-4 left-4 text-[10px] uppercase font-bold text-gray-500 tracking-wider w-full text-left">{day}</h4>
                                    {schedule[day] ? (
                                        <div onClick={() => setViewMeal(schedule[day])} className="mt-4 flex flex-col items-center gap-2 cursor-pointer group">
                                            <img src={schedule[day].strMealThumb} className="w-16 h-16 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform" />
                                            <p className="text-xs font-bold text-white text-center">{schedule[day].strMeal}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm italic pointer-events-none">Drag recipe here</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-6 flex-1 min-h-[300px]">
                                <h3 className="font-serif text-xl text-white border-b border-gray-600 pb-2 mb-4">Saved Repertoire</h3>
                                {savedRecipes.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No recipes saved yet.</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {savedRecipes.map(meal => (
                                            <div 
                                                key={meal.idMeal}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, meal)}
                                                className="flex items-center gap-4 bg-[#222] border border-gray-600 p-2 rounded-lg cursor-grab active:cursor-grabbing hover:border-gold/50 transition-colors"
                                            >
                                                <img src={meal.strMealThumb} className="w-10 h-10 rounded object-cover" />
                                                <span className="text-sm font-bold text-white">{meal.strMeal}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 p-6">
                                <h3 className="font-serif text-lg text-gold border-b border-gray-700/50 pb-2 mb-4">Auto-Shopping List</h3>
                                <p className="text-sm text-gray-400 italic">
                                    {checkShoppingList()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
"""

content = content[:main_app_start] + new_views + '\n' + content[main_app_start:]

# 5. Connect the views into the Main render switch
views_regex = re.compile(r"\{currentView === 'optimizer' && <RecipeOptimizerView />\}")
content = views_regex.sub("{currentView === 'optimizer' && <RecipeOptimizerView />}\n                                {currentView === 'planner' && <PlannerView />}\n                                {currentView === 'analytics' && <AnalyticsView />}", content)

with open('index.html', 'w') as f:
    f.write(content)
