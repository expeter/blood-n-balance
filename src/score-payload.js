export function scorePayload(state,{playerName='Runner',gameVersion='0.0.0',gitHash='nogit',exportedAt=new Date().toISOString()}={}){
  return {
    schemaVersion:2,game:'N / Momentum',gameVersion,gitHash,playerName:String(playerName||'Runner').trim().slice(0,24)||'Runner',exportedAt,
    scores:state.completed,leaderboards:state.leaderboards,gatheredGold:state.gatheredGold,
    statistics:{deaths:state.deaths,deathsByCause:state.deathsByCause,itemUses:state.itemUses,shopPurchases:state.shopPurchases,levelPlays:state.levelPlays,totalGold:state.totalGold},
    achievements:state.achievements
  };
}
