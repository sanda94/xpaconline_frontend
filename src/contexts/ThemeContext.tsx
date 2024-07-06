import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeColors {
  mainBg: string;
  softBg: string;
  darkBg: string;
  mainColor: string;
  softColor: string;
  darkColor: string;
}

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  themeColors: ThemeColors;
}

const darkThemeColors: ThemeColors = {
  mainBg: "#2a3447",
  softBg: "#384256",
  darkBg: "#222b3c",
  mainColor: "#ffffff",
  softColor: "#ddd",
  darkColor: "#2a3447",
};

const lightThemeColors: ThemeColors = {
  mainBg: "#ffffff",
  softBg: "#a8a8a8",
  darkBg: "#2a3447",
  mainColor: "#2a3447",
  softColor: "#384256",
  darkColor: "#222b3c",
};

const THEME_STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
  themeColors: lightThemeColors,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as Theme) || "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const themeColors = theme === "dark" ? darkThemeColors : lightThemeColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
