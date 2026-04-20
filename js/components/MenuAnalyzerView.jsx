const { useContext, useState } = window.React;

const MenuAnalyzerView = () => {
    const { savedRecipes, feedbacks, setFeedbacks, addToast } = useContext(window.AppContext);
    const [selectedMealId, setSelectedMealId] = useState(null);
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState('');

    const handleAddFeedback = () => {
        if (!selectedMealId) return;
        const newFeedbacks = { ...feedbacks };
        if (!newFeedbacks[selectedMealId]) {
            newFeedbacks[selectedMealId] = { rating: ratingInput, comments: [] };
        } else {
            newFeedbacks[selectedMealId].rating = (newFeedbacks[selectedMealId].rating + ratingInput) / 2;
        }
        if (commentInput) {
            newFeedbacks[selectedMealId].comments.push(commentInput);
        }
        setFeedbacks(newFeedbacks);
        setCommentInput('');
        addToast('Feedback logged securely to ledger.', 'success');
    };

    return (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="font-serif text-3xl mb-3 border-l-4 border-gold pl-4">Digital Menu Ledger</h2>
                <p className="text-gray-500 mb-8">Tap a recipe to manage guest feedback.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedRecipes.length === 0 ? (
                        <p className="text-gray-400 italic col-span-2">Menu is empty.</p>
                    ) : (
                        savedRecipes.map(meal => (
                            <div key={meal.idMeal} 
                                 className={`glass-card p-4 flex gap-4 cursor-pointer transition-colors ${selectedMealId === meal.idMeal ? 'border-gold bg-gold/5 dark:bg-gold/10' : ''}`}
                                 onClick={() => setSelectedMealId(meal.idMeal)}>
                                <img src={meal.strMealThumb} className="w-16 h-16 rounded object-cover shadow-sm" loading="lazy"/>
                                <div>
                                    <h5 className="font-serif font-bold line-clamp-1">{meal.strMeal}</h5>
                                    <div className="text-gold text-xs mt-1">
                                        <i className="fa-solid fa-star mr-1"></i>
                                        {feedbacks[meal.idMeal] ? feedbacks[meal.idMeal].rating.toFixed(1) : 'No Ratings'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 self-start sticky top-24 no-print">
                <h3 className="font-serif text-xl border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">Feedback Engine</h3>
                {!selectedMealId ? (
                    <p className="text-sm text-gray-500">Select a dish from the menu to analyze.</p>
                ) : (
                    <div className="animate-fade-in">
                        <h4 className="font-bold mb-4 line-clamp-1">{savedRecipes.find(r=>r.idMeal===selectedMealId)?.strMeal}</h4>
                        <div className="mb-4">
                            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Guest Rating (1-5)</label>
                            <input type="range" min="1" max="5" value={ratingInput} onChange={e=>setRatingInput(Number(e.target.value))} className="w-full accent-gold"/>
                            <div className="text-center font-bold text-gold mt-2 text-lg">{ratingInput} Stars</div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Tasting Notes</label>
                            <textarea value={commentInput} onChange={e=>setCommentInput(e.target.value)} rows="3" className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm bg-gray-50 dark:bg-charcoal"></textarea>
                        </div>
                        <button onClick={handleAddFeedback} className="w-full bg-charcoal dark:bg-cream text-white dark:text-charcoal font-bold py-3 rounded-lg hover:bg-gold dark:hover:bg-gold transition-colors">Commit Feedback</button>
                        
                        {feedbacks[selectedMealId]?.comments?.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3">Recent Comments</h5>
                                <ul className="text-xs space-y-2">
                                    {feedbacks[selectedMealId].comments.map((c, i) => (
                                        <li key={i} className="bg-cream dark:bg-charcoal p-2 rounded border-l-2 border-gold italic">"{c}"</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

window.MenuAnalyzerView = MenuAnalyzerView;
