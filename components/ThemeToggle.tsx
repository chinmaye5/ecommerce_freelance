"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="group relative p-3 rounded-full bg-secondary text-foreground transition-all hover:scale-110 active:scale-95 border border-border/50"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-accent" />
            <Moon className="absolute top-3 left-3 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-accent" />
        </button>
    );
}
