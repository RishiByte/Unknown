const getIngredients = (meal) => {
    let ing = [];
    for (let i = 1; i <= 20; i++) {
        const item = meal[`strIngredient${i}`];
        if (item && item.trim() !== '') {
            ing.push({ name: item, measure: meal[`strMeasure${i}`] });
        }
    }
    return ing;
};

const generateMockStats = (id) => {
    const numericId = parseInt(id) || 12345;
    return {
        difficulty: numericId % 3 === 0 ? 'Hard' : numericId % 2 === 0 ? 'Medium' : 'Easy',
        calories: (numericId % 600) + 300,
        prepTime: (numericId % 45) + 15
    };
};

const CHEF_TIPS = [
    "Always taste your food at every stage of cooking. The palate is the chef's most vital tool.",
    "Resting meat is just as important as cooking it. Allow the juices to redistribute.",
    "A dull knife is more dangerous than a sharp one. Keep your steel honed.",
    "Acid makes flavors pop. A squeeze of lemon or a dash of vinegar can rescue a flat dish.",
    "Season your pasta water until it tastes like the sea."
];

window.getIngredients = getIngredients;
window.generateMockStats = generateMockStats;
window.CHEF_TIPS = CHEF_TIPS;
