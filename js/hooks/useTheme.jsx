const { useEffect } = window.React;

function useTheme() {
    const [theme, setTheme] = window.useLocalStorage('latelier_theme', 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}

window.useTheme = useTheme;
