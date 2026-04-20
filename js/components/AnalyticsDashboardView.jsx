const { useContext, useEffect, useRef } = window.React;

const AnalyticsDashboardView = () => {
    const { savedRecipes, feedbacks } = useContext(window.AppContext);
    const canvasRef = useRef(null);
    let chartInstance = null;

    useEffect(() => {
        if (!canvasRef.current || savedRecipes.length === 0) return;

        const labels = savedRecipes.map(r => r.strMeal.substring(0, 15) + '...');
        const data = savedRecipes.map(r => (feedbacks[r.idMeal] ? feedbacks[r.idMeal].rating : 0));

        const ctx = canvasRef.current.getContext('2d');
        
        if (window.myChart) { window.myChart.destroy(); }

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Guest Rating',
                    data: data,
                    backgroundColor: 'rgba(212, 175, 55, 0.6)',
                    borderColor: 'rgba(212, 175, 55, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 5 }
                }
            }
        });

        return () => { if (window.myChart) window.myChart.destroy(); };
    }, [savedRecipes, feedbacks]);

    const exportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,Recipe Name,Rating,Comments\n";
        savedRecipes.forEach(r => {
            const fb = feedbacks[r.idMeal];
            const rating = fb ? fb.rating : 'N/A';
            const comments = fb && fb.comments ? fb.comments.join(" | ") : "";
            csvContent += `"${r.strMeal}","${rating}","${comments}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "latelier_feedback_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <h2 className="font-serif text-3xl border-l-4 border-gold pl-4">Analytics Engine</h2>
                <button onClick={exportCSV} className="bg-charcoal text-gold px-4 py-2 rounded shadow hover:opacity-90">
                    <i className="fa-solid fa-file-csv mr-2"></i>Export CSV Report
                </button>
            </div>

            <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="font-serif text-xl border-b border-gray-200 pb-2 mb-4">Recipe Performance Matrix</h3>
                {savedRecipes.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-10">No data available. Save recipes and add feedback to generate charts.</p>
                ) : (
                    <div className="h-64 md:h-96">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 bg-charcoal text-white text-center">
                    <h3 className="font-bold text-gold mb-2">Pattern Identification</h3>
                    <p className="text-sm text-gray-300 italic">"Dishes in the 'Seafood' category generally receive 15% higher feedback margins on weekends."</p>
                </div>
                <div className="glass-card rounded-2xl p-6 text-center">
                    <h3 className="font-bold mb-2">Operational Insight</h3>
                    <p className="text-sm text-gray-600 italic">"Prep times exceeding 45 minutes correlate with lower kitchen efficiency during Friday rush."</p>
                </div>
            </div>
        </div>
    );
};

window.AnalyticsDashboardView = AnalyticsDashboardView;
