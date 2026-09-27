export const THEME_KEY='n-momentum-theme';
export const MINIMAP_KEY='blood-and-balance-minimap';

export function loadMinimapVisible(storage,fallback=true){
  try{const value=storage.getItem(MINIMAP_KEY);return value==='show'?true:value==='hide'?false:fallback;}catch{return fallback;}
}

export function saveMinimapVisible(storage,visible){
  try{storage.setItem(MINIMAP_KEY,visible?'show':'hide');}catch{}
}

export function loadTheme(storage){
  try{return storage.getItem(THEME_KEY)==='light'?'light':'dark';}catch{return 'dark';}
}

export function setTheme(storage,root,theme){
  if(theme!=='light'&&theme!=='dark')throw new RangeError('Theme must be light or dark.');
  root.dataset.theme=theme;
  try{storage.setItem(THEME_KEY,theme);}catch{}
  return theme;
}
