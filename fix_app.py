import re

with open('index.html', 'r') as f:
    content = f.read()

# Fix AppProvider
bad_app_provider = r"const \[feedbacks\, setFeedbacks\] \= useLocalStorage\('latelier_feedbacks'\, \{\}\);\n\n                        const \{ setViewMeal \} \= useContext\(AppContext\);"
replacement_app_provider = r"const [feedbacks, setFeedbacks] = useLocalStorage('latelier_feedbacks', {});\n            const [viewMeal, setViewMeal] = useState(null);"
content = re.sub(bad_app_provider, replacement_app_provider, content)

# Fix AIGeneratorView redundant contexts
bad_aigen = r"const \{ savedRecipes\, setSavedRecipes \} \= useContext\(AppContext\);\n            const \[query\, setQuery\] \= useState\(''\);\n            const debouncedQuery \= useDebounce\(query\, 600\);\n            const \[results\, setResults\] \= useState\(\[\]\);\n            const \[loading\, setLoading\] \= useState\(false\);\n            const \[improviseMode\, setImproviseMode\] \= useState\(null\);\n            const \{ setViewMeal \} \= useContext\(AppContext\);"
replacement_aigen = r"const { savedRecipes, setSavedRecipes, setViewMeal } = useContext(AppContext);\n            const [query, setQuery] = useState('');\n            const debouncedQuery = useDebounce(query, 600);\n            const [results, setResults] = useState([]);\n            const [loading, setLoading] = useState(false);\n            const [improviseMode, setImproviseMode] = useState(null);"
content = re.sub(bad_aigen, replacement_aigen, content)

with open('index.html', 'w') as f:
    f.write(content)
