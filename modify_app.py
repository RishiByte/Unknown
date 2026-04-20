import re

with open('index.html', 'r') as f:
    content = f.read()

# Make sure it's dark mode
content = content.replace('background-color: #f5f1e8;', 'background-color: #151515;')
content = content.replace('color: #1a1a1a;', 'color: #f5f1e8;')
content = content.replace('background: white;', 'background: #2a2a2a;')
content = re.sub(r'bg-\[\#fbf9f6\]', 'bg-[#151515]', content)
content = content.replace('text-charcoal', 'text-white')
content = content.replace('text-white', 'text-[#f5f1e8]') # Just a safeguard
content = content.replace('text-[this-was-charcoal]', 'text-white')
content = content.replace('bg-white', 'bg-[#2a2a2a]')
content = content.replace('bg-white/90', 'bg-[#2a2a2a]/90')
content = content.replace('bg-gray-50', 'bg-[#222]')
content = content.replace('border-gray-100', 'border-gray-700')
content = content.replace('border-gray-200', 'border-gray-700')
content = content.replace('border-gray-300', 'border-gray-600')
content = content.replace('text-gray-700', 'text-gray-300')
content = content.replace('text-gray-600', 'text-gray-400')
content = content.replace('text-gray-500', 'text-gray-400')
content = content.replace('bg-cream', 'bg-[#333]')

# Fix up specific AIGenerator text
content = content.replace('text-[#f5f1e8]', 'text-white') # Revert the safeguard

# We need to extract the Modal and put it in App level, and also inject DashboardView replacement.
# Let's find the start and end of DashboardView
dashboard_view_start = content.find('const DashboardView = ({ setCurrentView }) => {')
dashboard_view_end = content.find('/* --- View: AI Generator --- */')

new_dashboard_view = """const DashboardView = ({ setCurrentView }) => {
            const { inventory, savedRecipes, feedbacks, setViewMeal } = useContext(AppContext);

            const avgRating = Object.values(feedbacks).length > 0
                ? (Object.values(feedbacks).reduce((acc, curr) => acc + curr.rating, 0) / Object.values(feedbacks).length).toFixed(1)
                : '5.0';

            const [bestMatch, setBestMatch] = useState(null);
            const [trending, setTrending] = useState(null);

            useEffect(() => {
                fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52795')
                    .then(res => res.json())
                    .then(data => data.meals && setBestMatch(data.meals[0]));
                fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52854')
                    .then(res => res.json())
                    .then(data => data.meals && setTrending(data.meals[0]));
            }, []);

            return (
                <div className="animate-fade-in text-white pt-4">
                    <div className="mb-10">
                        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                            Good Evening, <span className="gold-gradient-text italic">Chef Auguste.</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            The kitchen awaits. Your smart recommendations are ready.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700/50">
                            <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-wider">Inventory</p>
                            <h3 className="text-xl md:text-2xl font-bold text-white">{inventory.length || '2'}</h3>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700/50">
                            <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-wider">Saved Recipes</p>
                            <h3 className="text-xl md:text-2xl font-bold text-white">{savedRecipes.length || '1'}</h3>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700/50">
                            <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-wider">Avg Rating</p>
                            <h3 className="text-xl md:text-2xl font-bold text-white"><i className="fa-solid fa-star text-gold mr-2 text-lg"></i>{avgRating}</h3>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700/50">
                            <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">Pro Tip</p>
                            <h3 className="text-xs font-serif italic text-gray-300 leading-relaxed">
                                Resting meat is just as important as cooking it. Allow the juices to redistribute.
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700/50 relative overflow-hidden group min-h-[200px] flex flex-col">
                            <div className="absolute top-4 right-4 bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-sm z-10 font-sans tracking-wide">
                                TOP PATTERN
                            </div>
                            <h2 className="font-serif text-xl font-bold mb-1">Today's Best Match</h2>
                            <p className="text-[11px] text-gray-400 mb-6 font-light">Based on your highest rated recipes and current inventory availability.</p>
                            
                            {bestMatch ? (
                                <div onClick={() => setViewMeal(bestMatch)} className="group/item flex items-center gap-4 cursor-pointer hover:bg-[#333] p-2 -ml-2 rounded-lg transition-colors mt-auto w-max pr-6">
                                    <img src={bestMatch.strMealThumb} alt="Chicken Handi" className="w-16 h-16 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold text-white text-[15px] mb-1 group-hover/item:text-gold transition-colors">{bestMatch.strMeal}</h3>
                                        <p className="text-[10px] text-gold font-bold uppercase tracking-wider">{bestMatch.strCategory}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-16 flex items-center mt-auto"><div className="spinner w-5 h-5 ml-4"></div></div>
                            )}
                        </div>

                        <div className="bg-[#2a2a2a] rounded-xl border border-gray-700/50 relative overflow-hidden group cursor-pointer min-h-[200px]" onClick={() => trending && setViewMeal(trending)}>
                            {trending ? (
                                <>
                                    <div className="absolute inset-0 bg-black z-0"></div>
                                    <img src={trending.strMealThumb} alt="Pancakes" className="w-full h-full absolute inset-0 object-cover opacity-60 group-hover:opacity-80 transition-opacity z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20"></div>
                                    <div className="absolute bottom-6 left-6 z-30">
                                        <div className="bg-white/20 backdrop-blur border border-white/30 text-white text-[9px] font-bold px-2 py-1 rounded inline-block mb-2 uppercase tracking-widest">
                                            Global Trending
                                        </div>
                                        <h2 className="font-serif text-[26px] text-white shadow-sm font-medium">{trending.strMeal}</h2>
                                    </div>
                                </>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center"><div className="spinner w-8 h-8"></div></div>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-1 h-5 bg-gold rounded-full"></div>
                        <h2 className="font-serif text-xl font-bold">Dashboard Modules</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
                        <button onClick={() => alert('Planner Module')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Planner</button>
                        <button onClick={() => setCurrentView('generator')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Generator</button>
                        <button onClick={() => setCurrentView('menu')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Menu</button>
                        <button onClick={() => setCurrentView('inventory')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Inventory</button>
                        <button onClick={() => setCurrentView('optimizer')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Optimizer</button>
                        <button onClick={() => alert('Analytics Module')} className="bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold py-6 rounded-xl border border-gray-700/50 transition-colors">Go To Analytics</button>
                    </div>
                </div>
            );
        };
        
        const RecipeModal = () => {
            const { viewMeal, setViewMeal } = useContext(AppContext);
            if (!viewMeal) return null;
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur" onClick={() => setViewMeal(null)}>
                    <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700/50" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#1e1e1e]/90 backdrop-blur p-4 border-b border-gray-700 flex justify-between items-center z-10">
                            <h3 className="font-serif text-2xl text-white font-bold">{viewMeal.strMeal}</h3>
                            <button onClick={() => setViewMeal(null)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-times text-2xl"></i></button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-6">
                                <span className="bg-gold text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{viewMeal.strCategory}</span>
                                <span className="bg-[#333] text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-gold/30">{viewMeal.strArea}</span>
                            </div>
                            <img src={viewMeal.strMealThumb} className="w-full h-80 object-cover rounded-xl mb-8 shadow-sm" />
                            <h4 className="font-serif text-xl font-bold text-white mb-4 border-l-4 border-gold pl-3">Ingredients Needed</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                                {getIngredients(viewMeal).map((ing, i) => (
                                    <li key={i} className="flex justify-between bg-[#2a2a2a] px-4 py-3 rounded-lg text-sm border border-gray-700/50 shadow-sm">
                                        <span className="font-bold text-white uppercase">{ing.name}</span>
                                        <span className="text-gray-400 font-medium">{ing.measure}</span>
                                    </li>
                                ))}
                            </ul>
                            <h4 className="font-serif text-xl font-bold text-white mb-4 border-l-4 border-gold pl-3">Step-by-Step Instructions</h4>
                            <div className="text-sm text-gray-300 leading-loose whitespace-pre-wrap bg-[#222] p-6 rounded-xl border border-gray-700/50">
                                {viewMeal.strInstructions}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        """

content = content[:dashboard_view_start] + new_dashboard_view + '\n        ' + content[dashboard_view_end:]

# Now modify AppProvider to hold viewMeal state
app_provider_start = content.find('const AppProvider = ({ children }) => {')
app_provider_block_re = r'(const AppProvider = \(\{ children \}\) => \{.*?)(return <AppContext\.Provider value=\{\{.*?\}\}>\{children\}</AppContext\.Provider>;)'
match = re.search(app_provider_block_re, content, re.DOTALL)
if match:
    provider_init = match.group(1)
    provider_init += "            const [viewMeal, setViewMeal] = useState(null);\n"
    provider_return = "            return <AppContext.Provider value={{ inventory, setInventory, savedRecipes, setSavedRecipes, feedbacks, setFeedbacks, viewMeal, setViewMeal }}>{children}</AppContext.Provider>;\n"
    content = content[:match.start()] + provider_init + provider_return + content[match.end():]

# Now insert <RecipeModal /> in App
app_return_start = content.find('return (\n                <AppProvider>')
if app_return_start != -1:
    content = content.replace('<Header currentView={currentView} setCurrentView={setCurrentView} />', '<Header currentView={currentView} setCurrentView={setCurrentView} />\n                        <RecipeModal />')

# Now clean up AIGeneratorView where it had viewMeal stuff
remove_viewmeal_state = r"const \[viewMeal, setViewMeal\] = useState\(null\);"
content = re.sub(remove_viewmeal_state, "const { setViewMeal } = useContext(AppContext);", content)

# Remove the Modal JSX from AIGeneratorView
modal_jsx_re = r"\{\/\* View Recipe Modal \*\/.*?\}\)\}"
content = re.sub(modal_jsx_re, "", content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)
