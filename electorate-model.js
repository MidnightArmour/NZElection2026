/* 71-seat electorate model. Candidate vote and party vote are deliberately separate. */
window.ElectorateModel=(()=>{
 const PARTIES=['NAT','LAB','GRN','ACT','NZF','TPM','TOP'];
 const DEFAULTS={
  nationalCandidateSwing:{NAT:-0.035,LAB:0.025,GRN:0.008,ACT:0.002,NZF:0.000,TPM:0.000,TOP:0.000},
  incumbencyBonus:0.035,newCandidatePenalty:0.018,
  strategicIntensity:{right:1,left:1},
  // Share of each minor party's electorate vote consolidated behind the major/bloc candidate.
  transfers:{ACT:{NAT:.60},NZF:{NAT:.30},GRN:{LAB:.45},TOP:{LAB:.20,NAT:.15}},
  maoriTransfers:{LAB:{TPM:.12},GRN:{TPM:.08},TPM:{LAB:.05}},
  correlation:.55
 };
 function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
 function softmax(scores){let m=Math.max(...Object.values(scores)),z=0,o={};for(const [k,v] of Object.entries(scores)){o[k]=Math.exp(v-m);z+=o[k]}for(const k in o)o[k]/=z;return o}
 function baselineShares(e){let b=e.baseline2023,w=b.winnerPct/100,r=b.runnerUpVotes/b.validVotesApprox,other=Math.max(.02,1-w-r);let runner=b.winnerParty==='NAT'?'LAB':b.winnerParty==='LAB'?'NAT':b.winnerParty==='TPM'?'LAB':b.winnerParty==='GRN'?'LAB':'NAT';let s={NAT:.02,LAB:.02,GRN:.01,ACT:.01,NZF:.005,TPM:e.type==='Māori'?.12:.002,TOP:.005};s[b.winnerParty]=w;s[runner]=Math.max(s[runner],r);let fixed=Object.values(s).reduce((a,b)=>a+b,0);if(fixed>1){for(const k in s)s[k]/=fixed}else{s[runner]+=1-fixed-other}return s}
 function electorateProbabilities(e,cfg=DEFAULTS,nationalShock={}){let s=baselineShares(e),scores={};for(const k of PARTIES){let p=Math.max(.002,s[k]||.002);scores[k]=Math.log(p)+((cfg.nationalCandidateSwing||{})[k]||0)+((nationalShock||{})[k]||0)+((e['2026'].candidateAdjustments||{})[k]||0)}
  let standing=e['2026'].incumbentStanding;if(standing===true)scores[e.baseline2023.winnerParty]+=cfg.incumbencyBonus;if(standing===false)scores[e.baseline2023.winnerParty]-=cfg.newCandidatePenalty;
  let right=cfg.strategicIntensity.right,left=cfg.strategicIntensity.left;
  scores.NAT+=(s.ACT*(cfg.transfers.ACT.NAT||0)+s.NZF*(cfg.transfers.NZF.NAT||0))*right*4;
  scores.LAB+=(s.GRN*(cfg.transfers.GRN.LAB||0)+s.TOP*(cfg.transfers.TOP.LAB||0))*left*4;
  if(e.type==='Māori'){scores.TPM+=(s.LAB*(cfg.maoriTransfers.LAB.TPM||0)+s.GRN*(cfg.maoriTransfers.GRN.TPM||0))*left*4}
  return softmax(scores)
 }
 function simulateElection(electorates,cfg=DEFAULTS,blocSwing={right:0,left:0}){let wins=Object.fromEntries(PARTIES.map(k=>[k,0])),details=[];let common=randn()*cfg.correlation;let national={NAT:common*.025+blocSwing.right,LAB:-common*.02+blocSwing.left,GRN:-common*.006+blocSwing.left*.35,ACT:common*.006,NZF:common*.005,TPM:blocSwing.left*.2,TOP:0};for(const e of electorates){let probs=electorateProbabilities(e,cfg,national),scores={};for(const k of PARTIES)scores[k]=Math.log(Math.max(.0001,probs[k]))+randn()*e.model.localSigma;let winner=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];wins[winner]++;details.push({id:e.id,name:e.name,winner,probabilities:probs})}return {wins,details}}
 function forecast(electorates,cfg=DEFAULTS,runs=5000){let counts=Object.fromEntries(PARTIES.map(k=>[k,[]])),seatWins=Object.fromEntries(electorates.map(e=>[e.id,Object.fromEntries(PARTIES.map(k=>[k,0]))]));for(let i=0;i<runs;i++){let r=simulateElection(electorates,cfg);for(const k of PARTIES)counts[k].push(r.wins[k]);for(const x of r.details)seatWins[x.id][x.winner]++}let q=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor((a.length-1)*p)];let summary={};for(const k of PARTIES)summary[k]={median:q(counts[k],.5),low:q(counts[k],.1),high:q(counts[k],.9)};let seats=electorates.map(e=>{let p={};for(const k of PARTIES)p[k]=seatWins[e.id][k]/runs;let order=Object.entries(p).sort((a,b)=>b[1]-a[1]);return {...e,forecast:{winner:order[0][0],probability:order[0][1],runnerUp:order[1][0],runnerProbability:order[1][1],probabilities:p}}});return {summary,seats,runs}}
 return {DEFAULTS,PARTIES,baselineShares,electorateProbabilities,simulateElection,forecast};
})();