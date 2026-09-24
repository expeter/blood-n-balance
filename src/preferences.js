export const THEME_KEY='n-momentum-theme';

export function loadTheme(storage){
  try{return storage.getItem(THEME_KEY)==='light'?'light':'dark';}catch{return 'dark';}
}

export function setTheme(storage,root,theme){
  if(theme!=='light'&&theme!=='dark')throw new RangeError('Theme must be light or dark.');
  root.dataset.theme=theme;
  try{storage.setItem(THEME_KEY,theme);}catch{}
  return theme;
}
