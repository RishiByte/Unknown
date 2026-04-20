const { useContext, useState } = window.React;

const InventoryManagerView = ({ setCurrentView }) => {
    const { inventory, setInventory, addToast } = useContext(window.AppContext);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState('');
    
    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItemName || !newItemQty) return;
        const newItem = { id: Date.now(), name: newItemName, quantity: newItemQty, low: false };
        setInventory([...inventory, newItem]);
        setNewItemName(''); setNewItemQty('');
        addToast(`${newItemName} added to inventory.`, 'success');
    };

    const toggleLow = (id) => {
        setInventory(inventory.map(item => item.id === id ? { ...item, low: !item.low } : item));
    };

    const deleteItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
        addToast('Item removed.', 'info');
    };

    return (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
                    <h2 className="font-serif text-3xl border-l-4 border-gold pl-4">Cold Room & Dry Store</h2>
                    <button onClick={() => setCurrentView('generator')} className="text-sm font-bold text-gold hover:opacity-80">
                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>Auto-Suggest Meal
                    </button>
                </div>

                <div className="glass-card rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-charcoal text-gold text-xs uppercase tracking-wider">
                                <th className="p-4 border-b border-gray-800">Ingredient Form</th>
                                <th className="p-4 border-b border-gray-800">Volume/Qty</th>
                                <th className="p-4 border-b border-gray-800 text-center">Status</th>
                                <th className="p-4 border-b border-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">Inventory is completely depleted.</td></tr>}
                            {inventory.map(item => (
                                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gold/5 transition-colors">
                                    <td className="p-4 font-medium">{item.name}</td>
                                    <td className="p-4 text-gray-500">{item.quantity}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => toggleLow(item.id)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${item.low ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                            {item.low ? 'LOW STOCK' : 'OPTIMAL'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6 self-start sticky top-24 no-print">
                <h3 className="font-serif text-xl border-b border-gray-100 dark:border-gray-700 pb-3 mb-4"><i className="fa-solid fa-truck-ramp-box text-gold mr-2"></i>Receiving Cargo</h3>
                <form onSubmit={handleAddItem}>
                    <div className="mb-4">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Item Name</label>
                        <input type="text" value={newItemName} onChange={e=>setNewItemName(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm bg-gray-50 dark:bg-charcoal" placeholder="e.g. Saffron Threads"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Quantity & Measure</label>
                        <input type="text" value={newItemQty} onChange={e=>setNewItemQty(e.target.value)} required className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 text-sm bg-gray-50 dark:bg-charcoal" placeholder="e.g. 500g, 2 cases"/>
                    </div>
                    <button type="submit" className="w-full bg-gold text-charcoal font-bold py-3 rounded-lg hover:bg-yellow-500 shadow-md transition-all">Add to Manifest</button>
                </form>
            </div>
        </div>
    );
};

window.InventoryManagerView = InventoryManagerView;
