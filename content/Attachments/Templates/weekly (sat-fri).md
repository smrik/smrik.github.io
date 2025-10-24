<%*
/* ================== CONFIG ================== */
const DAILY_FOLDER  = "Daily/Daily";
const WEEKLY_FOLDER = "Daily/Weekly";
const THINO_HEADING = "Thino";    // heading inside your dailies

/* ====== WEEK MATH (Saturday → Friday) ====== */
const now = moment();
// Saturday of "this week" (1=Mon ... 6=Sat)
const satThisWeek = now.clone().isoWeekday(6);
// If we’re before Saturday, use last Saturday; if today is Sat, use today
const start = satThisWeek.isAfter(now, 'day') ? satThisWeek.subtract(7,'days') : satThisWeek.clone();
const end   = start.clone().add(6,'days');           // Friday
// Previous week (also Sat→Fri)
const prevStart = start.clone().subtract(7,'days');
const prevEnd   = start.clone().subtract(1,'days');

/* ====== NAME THE FILE (ISO week of the Saturday start) ====== */
const weekLabel     = start.format("GGGG-[W]WW");
const prevWeekLabel = prevStart.format("GGGG-[W]WW");

/* ====== BUILD NOTE ====== */
let out = "";
out += "---\n";
out += "type: weekly\n";
out += "week_label: " + weekLabel + "\n";
out += "week_start: " + start.format("YYYY-MM-DD") + "\n";
out += "week_end: "   + end.format("YYYY-MM-DD")   + "\n";
out += "prev_week_label: " + prevWeekLabel + "\n";
out += "prev_week_start: " + prevStart.format("YYYY-MM-DD") + "\n";
out += "prev_week_end: "   + prevEnd.format("YYYY-MM-DD")   + "\n";
out += "daily_folder: \""  + DAILY_FOLDER  + "\"\n";
out += "weekly_folder: \"" + WEEKLY_FOLDER + "\"\n";
out += "thino_heading: \"" + THINO_HEADING + "\"\n";
out += "---\n\n";

const headerRange = "Sat " + start.format("MMM D") + " → Fri " + end.format("MMM D");
out += "# " + weekLabel + "  _(" + headerRange + ")_\n\n";

out += "## Focus (one line)\n- \n\n";
out += "## Big 3\n- [ ] \n- [ ] \n- [ ] \n\n";
out += "---\n\n";

/* ====== CARRY-OVER TASKS (no path filters) ====== */
out += "## Carry-over — created last week (open)\n\n";
out += "```tasks\n";
out += "not done\n";
out += "created on or after " + prevStart.format("YYYY-MM-DD") + "\n";
out += "created before "      + start.format("YYYY-MM-DD")     + "\n";
out += "short mode\n";
out += "```\n\n";

out += "## Carry-over — due/scheduled last week (open)\n\n";
out += "```tasks\n";
out += "not done\n";
out += "happens between " + prevStart.format("YYYY-MM-DD") + " and " + prevEnd.format("YYYY-MM-DD") + "\n";
out += "short mode\n";
out += "```\n\n";

out += "---\n\n";

/* ====== THINO — LAST WEEK (capture ALL text after '## Thino', verbatim) ====== */
out += "## Thino — last week (Sat " + prevStart.format("YYYY-MM-DD") + " → Fri " + prevEnd.format("YYYY-MM-DD") + ")\n";
out += "```dataviewjs\n";
out += "const folder = "  + JSON.stringify(DAILY_FOLDER)  + ";\n";
out += "const fm = dv.current();\n";
// normalize date-like values to 'YYYY-MM-DD'
out += "function toISODateLocal(x){ if(!x) return null; if(typeof x==='object'&&x.toISODate) return x.toISODate(); if(typeof x==='string') return x.slice(0,10); try{ return new Date(x).toISOString().slice(0,10);}catch{return null;} }\n";
out += "const startISO = toISODateLocal(fm.prev_week_start) || " + JSON.stringify(prevStart.format("YYYY-MM-DD")) + ";\n";
out += "const endISO   = toISODateLocal(fm.prev_week_end)   || " + JSON.stringify(prevEnd.format("YYYY-MM-DD"))   + ";\n";
// iterate dates (local)
out += "function* days(s,e){ const d=new Date(s+\"T00:00:00\"), f=new Date(e+\"T00:00:00\"); for(let x=new Date(d); x<=f; x.setDate(x.getDate()+1)) yield new Date(x);} \n";
// load with/without .md
out += "async function loadEither(base){ try{ return await dv.io.load(base+\".md\"); }catch{} try{ return await dv.io.load(base);}catch{} return null; }\n";
out += "const pad=n=>String(n).padStart(2,'0'); const fmt=d=> d.getFullYear()+\"-\"+pad(d.getMonth()+1)+\"-\"+pad(d.getDate());\n";
// slice everything after '## Thino'
out += "function sliceAfterThino(fullText){ if(!fullText) return \"\"; const lines=fullText.split(/\\r?\\n/); const idx=lines.findIndex(l=>/^\\s*#{2}\\s*thino\\s*$/i.test(l)); if(idx===-1) return \"\"; return lines.slice(idx+1).join(\"\\n\").trim(); }\n";
out += "let printed=0; for(const d of days(startISO,endISO)){ const name=fmt(d); const base=(folder?folder+\"/\":\"\")+name; const txt=await loadEither(base); if(!txt) continue; const body=sliceAfterThino(txt); if(!body) continue; const wrap=dv.container.createEl('div'); wrap.createEl('h4',{text:d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}); const pre=wrap.createEl('div'); pre.setAttr('style','white-space: pre-wrap; line-height: 1.4'); pre.setText(body); printed++; }\n";
out += "if(!printed) dv.paragraph(\"_No Thino entries last week._\");\n";
out += "```\n\n";

/* ====== THINO — THIS WEEK (capture ALL text after '## Thino', verbatim) ====== */
out += "## Thino — this week (Sat " + start.format("YYYY-MM-DD") + " → Fri " + end.format("YYYY-MM-DD") + ")\n";
out += "```dataviewjs\n";
out += "const folder = "  + JSON.stringify(DAILY_FOLDER)  + ";\n";
out += "const fm = dv.current();\n";
out += "function toISODateLocal(x){ if(!x) return null; if(typeof x==='object'&&x.toISODate) return x.toISODate(); if(typeof x==='string') return x.slice(0,10); try{ return new Date(x).toISOString().slice(0,10);}catch{return null;} }\n";
out += "const startISO = toISODateLocal(fm.week_start) || " + JSON.stringify(start.format("YYYY-MM-DD")) + ";\n";
out += "const endISO   = toISODateLocal(fm.week_end)   || " + JSON.stringify(end.format("YYYY-MM-DD"))   + ";\n";
out += "function* days(s,e){ const d=new Date(s+\"T00:00:00\"), f=new Date(e+\"T00:00:00\"); for(let x=new Date(d); x<=f; x.setDate(x.getDate()+1)) yield new Date(x);} \n";
out += "async function loadEither(base){ try{ return await dv.io.load(base+\".md\"); }catch{} try{ return await dv.io.load(base);}catch{} return null; }\n";
out += "const pad=n=>String(n).padStart(2,'0'); const fmt=d=> d.getFullYear()+\"-\"+pad(d.getMonth()+1)+\"-\"+pad(d.getDate());\n";
out += "function sliceAfterThino(fullText){ if(!fullText) return \"\"; const lines=fullText.split(/\\r?\\n/); const idx=lines.findIndex(l=>/^\\s*#{2}\\s*thino\\s*$/i.test(l)); if(idx===-1) return \"\"; return lines.slice(idx+1).join(\"\\n\").trim(); }\n";
out += "let printed=0; for(const d of days(startISO,endISO)){ const name=fmt(d); const base=(folder?folder+\"/\":\"\")+name; const txt=await loadEither(base); if(!txt) continue; const body=sliceAfterThino(txt); if(!body) continue; const wrap=dv.container.createEl('div'); wrap.createEl('h4',{text:d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}); const pre=wrap.createEl('div'); pre.setAttr('style','white-space: pre-wrap; line-height: 1.4'); pre.setText(body); printed++; }\n";
out += "if(!printed) dv.paragraph(\"_No Thino entries yet this week._\");\n";
out += "```\n\n";

/* ====== THIS WEEK – TASKS (no path filters) ====== */
out += "---\n\n";
out += "## This week — created last/this week (open)\n\n";
out += "```tasks\n";
out += "not done\n";
out += "created on or after " + prevStart.format("YYYY-MM-DD") + "\n";
out += "created before "      + end.clone().add(1,"day").format("YYYY-MM-DD") + "\n";
out += "short mode\n";
out += "```\n\n";

out += "## This week — due/scheduled (open)\n\n";
out += "```tasks\n";
out += "not done\n";
out += "happens between " + start.format("YYYY-MM-DD") + " and " + end.format("YYYY-MM-DD") + "\n";
out += "short mode\n";
out += "```\n\n";

/* ====== NOTES ====== */
out += "## Notes\n- \n";

tR += out;

/* ====== MOVE TO CORRECT LOCATION/NAME ====== */
const newPath = WEEKLY_FOLDER + "/" + weekLabel;
await tp.file.move(newPath);
_%>
