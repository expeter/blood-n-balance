export function compareVersions(a,b){
  const tuple=value=>String(value??'').replace(/^v/i,'').split('.').slice(0,3).map(part=>/^\d+$/.test(part)?Number(part):0);
  const left=tuple(a),right=tuple(b);
  for(let i=0;i<3;i++){if((left[i]||0)!==(right[i]||0))return (left[i]||0)>(right[i]||0)?1:-1;}
  return 0;
}

export function updateAvailable(current,release){
  if(!release||typeof release!=='object'||typeof release.version!=='string')return false;
  const order=compareVersions(release.version,current.version);
  return order>0||(order===0&&typeof release.gitHash==='string'&&release.gitHash!==current.gitHash);
}
