const { createContext, useState, useCallback } = window.React;

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [inventory, setInventory] = window.useLocalStorage('latelier_inventory', [
        { id: 1, name: 'Saffron Threads', quantity: '10g', low: false },
        { id: 2, name: 'Truffle Oil', quantity: '500ml', low: true }
    ]);
    const [savedRecipes, setSavedRecipes] = window.useLocalStorage('latelier_saved_recipes', []);
    const [feedbacks, setFeedbacks] = window.useLocalStorage('latelier_feedbacks', {});
    const [mealPlan, setMealPlan] = window.useLocalStorage('latelier_mealplan', {
        Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null, Saturday: null, Sunday: null
    });
    
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return (
        <AppContext.Provider value={{ 
            inventory, setInventory, 
            savedRecipes, setSavedRecipes, 
            feedbacks, setFeedbacks,
            mealPlan, setMealPlan,
            toasts, addToast
        }}>
            {children}
        </AppContext.Provider>
    );
};

window.AppContext = AppContext;
window.AppProvider = AppProvider;
