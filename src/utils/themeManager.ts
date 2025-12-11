// 🌓 Simple Local Storage Theme Manager

export function getTheme(): "light" | "dark" {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  }
  
  export function saveTheme(theme: "light" | "dark") {
    localStorage.setItem("theme", theme);
  }