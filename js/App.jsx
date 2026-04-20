const { useState, useEffect } = window.React;

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard'); // dashboard, planner, generator, menu, inventory, optimizer, analytics

    useEffect(() => {
        const timer = setTimeout(() => { setIsLoading(false); }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <window.LoadingScreen />;

    return (
        <window.AppProvider>
            <div className="min-h-screen flex flex-col">
                <window.Header currentView={currentView} setCurrentView={setCurrentView} />
                <main className="pt-32 pb-10 flex-grow relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
                        {currentView === 'dashboard' && <window.DashboardView setCurrentView={setCurrentView} />}
                        {currentView === 'planner' && <window.MealPlannerView />}
                        {currentView === 'generator' && <window.AIGeneratorView />}
                        {currentView === 'menu' && <window.MenuAnalyzerView />}
                        {currentView === 'inventory' && <window.InventoryManagerView setCurrentView={setCurrentView} />}
                        {currentView === 'optimizer' && <window.RecipeOptimizerView />}
                        {currentView === 'analytics' && <window.AnalyticsDashboardView />}
                    </div>
                </main>
                <window.Footer />
                <window.ToastContainer />
            </div>
        </window.AppProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
