const { useContext, useState } = window.React;

const MealPlannerView = () => {
    const { savedRecipes, mealPlan, setMealPlan, inventory } = useContext(window.AppContext);
    const [draggedMeal, setDraggedMeal] = useState(null);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDrop = (day) => {
        if (!draggedMeal) return;
        setMealPlan(prev => ({ ...prev, [day]: draggedMeal }));
        setDraggedMeal(null);
    };

    const clearDay = (day) => {
        setMealPlan(prev => ({ ...prev, [day]: null }));
    };

    // Auto-calculate shopping list
    const shoppingList = {};
    Object.values(mealPlan).forEach(meal => {
        if (!meal) return;
        const ingredients = window.getIngredients(meal);
        ingredients.forEach(ing => {
            const lowName = ing.name.toLowerCase();
            const inInventory = inventory.some(item => item.name.toLowerCase() === lowName);
            if (!inInventory) {
                if (shoppingList[ing.name]) shoppingList[ing.name].push(ing.measure);
                else shoppingList[ing.name] = [ing.measure];
            }
        });
    });

    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
                <h2 className="font-serif text-3xl mb-6 border-l-4 border-gold pl-4">Weekly Logistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {DAYS.map(day => (
                        <div 
                            key={day}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(day)}
                            className={`glass-card rounded-xl p-4 min-h-[160px] flex flex-col transition-colors border-2 ${mealPlan[day] ? 'border-transparent' : 'border-dashed border-gray-300 dark:border-gray-700 hover:border-gold'}`}
                        >
                            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase text-gray-500">
                                <span>{day}</span>
                                {mealPlan[day] && <button onClick={() => clearDay(day)} className="text-red-400 hover:text-red-600"><i className="fa-solid fa-times"></i></button>}
                            </div>
                            {mealPlan[day] ? (
                                <div className="flex-1 flex flex-col justify-center">
                                    <img src={mealPlan[day].strMealThumb} className="w-full h-24 object-cover rounded mb-2"/>
                                    <p className="text-sm font-bold text-center line-clamp-1">{mealPlan[day].strMeal}</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                                    Drag recipe here
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6 h-64 overflow-y-auto print-friendly no-print">
                    <h3 className="font-serif text-xl border-b border-gray-200 pb-2 mb-4">Saved Repertoire</h3>
                    {savedRecipes.length === 0 ? <p className="text-gray-500 text-xs">No saved recipes.</p> : (
                        <div className="flex flex-col gap-3">
                            {savedRecipes.map(meal => (
                                <div 
                                    key={meal.idMeal}
                                    draggable
                                    onDragStart={() => setDraggedMeal(meal)}
                                    className="flex items-center gap-3 p-2 border border-gray-200 rounded cursor-grab active:cursor-grabbing hover:bg-gold/10"
                                >
                                    <img src={meal.strMealThumb} className="w-10 h-10 rounded object-cover"/>
                                    <span className="text-xs font-bold line-clamp-1">{meal.strMeal}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-card rounded-2xl p-6 bg-charcoal text-white print-friendly">
                    <h3 className="font-serif text-xl text-gold border-b border-gold/30 pb-2 mb-4">Auto-Shopping List</h3>
                    {Object.keys(shoppingList).length === 0 ? (
                        <p className="text-gray-400 text-sm italic">All planned ingredients are in inventory, or week is empty.</p>
                    ) : (
                        <ul className="text-xs space-y-2">
                            {Object.entries(shoppingList).map(([item, measures], i) => (
                                <li key={i} className="flex justify-between items-start border-b border-gray-700 pb-1">
                                    <span className="font-bold">{item}</span>
                                    <span className="text-gray-400 text-right">{measures.join(', ')}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

window.MealPlannerView = MealPlannerView;
