import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('default'); // 'default', 'light', 'dark'
  const [isAnimated, setIsAnimated] = useState(true);

  const toggleTheme = () => {
    setTheme(current => {
      switch(current) {
        case 'default':
          return 'light';
        case 'light':
          return 'dark';
        default:
          return 'default';
      }
    });
  };

  const toggleAnimation = () => {
    setIsAnimated(current => !current);
  };

  const getBackgroundUrl = () => {
    if (!isAnimated && theme !== 'default') {
      return null;
    }
    
    switch(theme) {
      case 'light':
        return '/assets/backgrounds/light-animated.svg';
      case 'dark':
        return '/assets/backgrounds/dark-animated.svg';
      default:
        return '/assets/backgrounds/default.svg';
    }
  };

  const getThemeClass = () => {
    return `theme-${theme} ${isAnimated ? 'animated' : ''}`;
  };

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        isAnimated,
        toggleTheme,
        toggleAnimation,
        getBackgroundUrl,
        getThemeClass
      }}
    >
      <div 
        className={getThemeClass()}
        style={{
          backgroundImage: `url(${getBackgroundUrl()})`,
          transition: 'background-image 0.5s ease-in-out',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;