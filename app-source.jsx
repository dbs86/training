const {useState, useEffect, useRef, useMemo, useContext, createContext} = React;

/* =========================================================
   DBS PPLX — personal training app
   ========================================================= */
const APP_NAME = 'DBS PPLX';
const TOTAL_WEEKS = 12;

/* ---------------- PROGRAMME DATA ---------------- */
const SESSIONS = [
  {id:'push', name:'Push', subtitle:'Chest · Shoulders · Triceps', duration:'55–65 min', optional:false, color:'#FF6B4A', icon:'push',
    groups:[
      {type:'straight', title:'Chest', exercises:[
        {name:'Barbell Bench Press', sets:5, reps:'5', rest:120, note:'Working sets'},
        {name:'Barbell Bench Press · Back-off', sets:3, reps:'8', rest:90, note:'Drop ~15% load'},
        {name:'Barbell Bench Press · Drop Set', sets:1, reps:'AMRAP', rest:90, note:'20% less weight'},
      ]},
      {type:'superset', title:'Superset A', restAfter:75, exercises:[
        {name:'Incline Dumbbell Press', sets:4, reps:'10–12'},
        {name:'Low-to-High Cable Fly', sets:4, reps:'12–15'},
      ]},
      {type:'superset', title:'Superset B', restAfter:60, exercises:[
        {name:'Seated DB Shoulder Press', sets:4, reps:'10–12'},
        {name:'Lateral Raise (Thumbs-Down)', sets:4, reps:'12–15'},
      ]},
      {type:'straight', title:'Rear Delt & Rotator Cuff', exercises:[
        {name:'Rear Delt Cable Fly (Face Pull)', sets:3, reps:'15', rest:45},
        {name:'Band Pull-Apart', sets:3, reps:'20', rest:30},
      ]},
      {type:'triset', title:'Triceps Tri-Set', note:'No rest between exercises', restAfter:90, exercises:[
        {name:'Overhead Cable Extension', sets:3, reps:'10'},
        {name:'Tricep Rope Pushdown', sets:3, reps:'12'},
        {name:'Bench Dips or Bar Dips', sets:3, reps:'Failure'},
      ]},
      {type:'finisher', title:'Finisher', rounds:3, restBetweenRounds:90, exercises:[
        {name:'Push-Up', reps:'Failure'},
        {name:'Wall Angels', reps:'15'},
        {name:'Plank Shoulder Taps', reps:'20 each side'},
      ]},
    ]
  },
  {id:'pull', name:'Pull', subtitle:'Back · Biceps · Rear Delts', duration:'55–65 min', optional:false, color:'#8B7CFF', icon:'pull',
    groups:[
      {type:'straight', title:'Back · Vertical Pull', exercises:[
        {name:'Weighted Pull-Up (Pronated)', sets:5, reps:'5', rest:120},
        {name:'Neutral-Grip Pull-Up · Back-off', sets:3, reps:'8–10', rest:90},
      ]},
      {type:'superset', title:'Superset A', restAfter:75, exercises:[
        {name:'Bent-Over Barbell Row', sets:4, reps:'6–8'},
        {name:'DB Pendlay Row', sets:4, reps:'8–10'},
      ]},
      {type:'superset', title:'Superset B', restAfter:60, exercises:[
        {name:'Chest-Supported DB Row', sets:3, reps:'12'},
        {name:'Single-Arm DB Row', sets:3, reps:'10–12 each'},
      ]},
      {type:'triset', title:'Biceps Tri-Set', note:'No rest between exercises', restAfter:60, exercises:[
        {name:'Incline DB Curl (Supinated)', sets:3, reps:'10–12'},
        {name:'Hammer Curl', sets:3, reps:'12'},
        {name:'Face Pull', sets:3, reps:'15'},
      ]},
      {type:'finisher', title:'Finisher', rounds:3, restBetweenRounds:20, note:'Minimum rest between rounds', exercises:[
        {name:'Straight-Arm Lat Pulldown', reps:'15'},
        {name:'Band Pull-Apart', reps:'20'},
        {name:'Dead Hang', reps:'20–30 sec'},
      ]},
    ]
  },
  {id:'legs', name:'Legs', subtitle:'Quads · Hamstrings · Glutes · Calves', duration:'60–70 min', optional:false, color:'#F5B83D', icon:'legs',
    groups:[
      {type:'straight', title:'Quads & Glutes', exercises:[
        {name:'Barbell Back Squat', sets:5, reps:'5', rest:150},
        {name:'Barbell Back Squat · Back-off', sets:3, reps:'8', rest:120, note:'Drop 15–20%, 3 sec eccentric'},
      ]},
      {type:'straight', title:'Hamstrings', exercises:[
        {name:'Barbell Romanian Deadlift', sets:4, reps:'8–10', rest:90},
      ]},
      {type:'superset', title:'Superset A', restAfter:90, exercises:[
        {name:'Bulgarian Split Squat', sets:3, reps:'10 each'},
        {name:'Nordic Hamstring Curl', sets:3, reps:'5–8'},
      ]},
      {type:'superset', title:'Superset B', restAfter:75, exercises:[
        {name:'Leg Press (High Foot Placement)', sets:3, reps:'12–15'},
        {name:'DB Walking Lunge', sets:3, reps:'10 each'},
      ]},
      {type:'straight', title:'Calves & Tibialis', exercises:[
        {name:'Single-Leg Calf Raise (Standing)', sets:4, reps:'12–15 each', rest:45},
        {name:'Seated Calf Raise', sets:3, reps:'15–20', rest:45},
        {name:'Tibialis Anterior Raise', sets:3, reps:'15–20', rest:30},
      ]},
      {type:'finisher', title:'Finisher', rounds:5, restBetweenRounds:60, note:'Finish with a 5 min walk or 400m easy jog', exercises:[
        {name:'Squat Jump', reps:'10 (land soft)'},
        {name:'Glute Bridge', reps:'15'},
        {name:'Lateral Band Walk', reps:'10 each direction'},
      ]},
    ]
  },
  {id:'arms', name:'Arms', subtitle:'Biceps · Triceps · Brachialis · Forearms', duration:'45–55 min', optional:true, color:'#FF5C8A', icon:'arms',
    groups:[
      {type:'circuit', title:'Warm-Up · Plate Flow', rounds:1, note:'Continuous, no rest', exercises:[
        {name:'Plate Pinch Hold', reps:'20 sec'},
        {name:'Plate Front Raise', reps:'10'},
        {name:'Plate Halo', reps:'10 each direction'},
        {name:'Plate Curl', reps:'15'},
        {name:'Plate Overhead Tricep Extension', reps:'15'},
        {name:'Plate Twist', reps:'15 each side'},
        {name:'Plate Wrist Roller', reps:'20 each direction'},
      ]},
      {type:'straight', title:'Biceps', exercises:[
        {name:'Dumbbell Curl', sets:4, reps:'8', rest:90},
        {name:'Preacher Curl', sets:3, reps:'10–12', rest:60, note:'Last set to failure'},
      ]},
      {type:'triset', title:'Mechanical Drop Set', note:'No rest within round', rounds:3, restBetweenRounds:90, exercises:[
        {name:'Incline Position', reps:'5', note:'Max long head stretch'},
        {name:'Standing Position', reps:'5', note:'Standard curl, mid-range'},
        {name:'Peak Position', reps:'5', note:'Short head peak contraction'},
      ]},
      {type:'straight', title:'Brachialis & Forearms', exercises:[
        {name:'Cross-Body Pronated Curl', sets:3, reps:'12 each', rest:45},
        {name:'Forearm Bar Twist Burner', sets:2, reps:'20 each direction', rest:45},
      ]},
      {type:'straight', title:'Triceps', exercises:[
        {name:'Incline Skull Crusher', sets:4, reps:'10', rest:90},
        {name:'Cable Push-Out', sets:3, reps:'12', rest:60},
        {name:'Bench Dip', sets:3, reps:'12–15', rest:60},
        {name:'PJR Pullover', sets:3, reps:'12', rest:60},
        {name:'Kickback Pushdown', sets:3, reps:'15', rest:45},
      ]},
      {type:'finisher', title:'Finisher', rounds:1, restBetweenRounds:0, note:'No rest', exercises:[
        {name:'Pushdown', reps:'20'},
        {name:'Overhead Extension', reps:'15'},
        {name:'Diamond Push-Up', reps:'Failure'},
      ]},
    ]
  },
];

/* Log-only cards */
const LOG_CARDS = [
  {id:'cardio', name:'Cardio', color:'#38BDF8', icon:'flame'},
  {id:'stretch', name:'Stretching', color:'#34D399', icon:'stretch'},
];
const CARDIO_TYPES = ['Running','Cycling','Rowing','Swimming','Walking','Elliptical','Other'];

/* =========================================================
   DAILY CALISTHENICS — 7-day focus cycle × 3 weekly variants (21 sessions)
   Equipment: pull-up bar, floor, a chair/bench (and a wall). 20–25 min.
   ========================================================= */
const CALI_ANCHOR = '2026-10-05'; // a Monday — week A starts here
const CALI_VARIANTS = ['A','B','C'];
const CALI_REST_LEAD = 3000;      // ms "get set" before timed holds that roll on

const CALI_FOCUS = [
  {id:'push', name:'Push', blurb:'Chest · shoulders · triceps', color:'#FF6B4A', icon:'push',
    warmup:[
      {name:'Arm circles', detail:'10 each direction'},
      {name:'Wrist rocks', detail:'10 forward + back'},
      {name:'Scapular press-ups', detail:'10'},
      {name:'Incline press-ups (hands on chair)', detail:'8'},
      {name:'Down-dog to cobra', detail:'5 slow'},
    ],
    cooldown:[
      {name:'Chest stretch (doorway)', side:'Left', secs:30},
      {name:'Chest stretch (doorway)', side:'Right', secs:30},
      {name:'Overhead triceps stretch', side:'Left', secs:30},
      {name:'Overhead triceps stretch', side:'Right', secs:30},
      {name:'Wrist flexor stretch', secs:30},
    ],
    variants:[
      {title:'Press-up Builder', main:{format:'circuit', rounds:4, rest:75, exercises:[
        {name:'Press-ups', reps:15},
        {name:'Pike push-ups', reps:8},
        {name:'Chair dips', reps:12},
        {name:'Diamond press-ups', reps:8},
      ]}, finisher:{id:'push_60', name:'Max press-ups in 60s', unit:'reps', window:60}},
      {title:'Angles & Leans', main:{format:'circuit', rounds:4, rest:75, exercises:[
        {name:'Archer press-ups', reps:5, each:true},
        {name:'Decline press-ups (feet on chair)', reps:10},
        {name:'Planche lean', secs:20},
        {name:'Close-grip press-ups', reps:10},
      ]}, finisher:{id:'dips_max', name:'Max chair dips — one set', unit:'reps'}},
      {title:'Push EMOM', main:{format:'emom', minutes:16, exercises:[
        {name:'Clap / explosive press-ups', reps:6},
        {name:'Pike push-ups', reps:8},
        {name:'Chair dips', reps:12},
        {name:'Plank shoulder taps', reps:20},
      ]}, finisher:{id:'pushup_bottom', name:'Bottom press-up hold — max', unit:'secs'}},
    ]},

  {id:'pull', name:'Pull', blurb:'Back · biceps · grip', color:'#8B7CFF', icon:'pull',
    warmup:[
      {name:'Arm circles', detail:'10 each direction'},
      {name:'Prone Y-T-W raises', detail:'5 each letter'},
      {name:'Dead hang', detail:'20 sec'},
      {name:'Scapular pull-ups', detail:'10'},
      {name:'Cat-cow', detail:'8'},
    ],
    cooldown:[
      {name:'Lat stretch (hang or door frame)', side:'Left', secs:30},
      {name:'Lat stretch (hang or door frame)', side:'Right', secs:30},
      {name:'Biceps wall stretch', side:'Left', secs:30},
      {name:'Biceps wall stretch', side:'Right', secs:30},
      {name:"Child's pose", secs:30},
    ],
    variants:[
      {title:'Pull-up Volume', main:{format:'circuit', rounds:4, rest:90, exercises:[
        {name:'Pull-ups', reps:6},
        {name:'Chin-ups', reps:6},
        {name:'Hanging knee raises', reps:10},
        {name:'Scapular pull-ups', reps:8},
      ]}, finisher:{id:'hang_max', name:'Dead hang — max', unit:'secs'}},
      {title:'Slow & Strict', main:{format:'circuit', rounds:4, rest:90, exercises:[
        {name:'Wide-grip pull-ups', reps:5},
        {name:'Chin-up negatives (5s down)', reps:4},
        {name:'Hanging hollow hold', secs:20},
        {name:'Superman lat pulls', reps:12},
      ]}, finisher:{id:'pullup_max', name:'Max pull-ups — one set', unit:'reps'}},
      {title:'Pull EMOM', main:{format:'emom', minutes:15, exercises:[
        {name:'Pull-ups', reps:5},
        {name:'Hanging leg raises', reps:8},
        {name:'Chin-up top hold', secs:15},
      ]}, finisher:{id:'chinup_max', name:'Max chin-ups — one set', unit:'reps'}},
    ]},

  {id:'legs', name:'Legs', blurb:'Quads · glutes · hamstrings', color:'#F5B83D', icon:'legs',
    warmup:[
      {name:'Leg swings', detail:'10 each leg, both planes'},
      {name:'Hip circles', detail:'10 each way'},
      {name:'Bodyweight squats', detail:'15'},
      {name:'Walking lunges', detail:'10'},
      {name:'Ankle rocks', detail:'10 each'},
    ],
    cooldown:[
      {name:'Quad stretch', side:'Left', secs:30},
      {name:'Quad stretch', side:'Right', secs:30},
      {name:'Hamstring stretch', side:'Left', secs:30},
      {name:'Hamstring stretch', side:'Right', secs:30},
      {name:'Deep squat hold', secs:30},
    ],
    variants:[
      {title:'Single-Leg Strength', main:{format:'circuit', rounds:4, rest:75, exercises:[
        {name:'Bulgarian split squats (rear foot on chair)', reps:10, each:true},
        {name:'Jump squats', reps:12},
        {name:'Single-leg glute bridge', reps:12, each:true},
        {name:'Wall sit', secs:45},
      ]}, finisher:{id:'squat_60', name:'Max squats in 60s', unit:'reps', window:60}},
      {title:'Pistol Prep', main:{format:'circuit', rounds:4, rest:75, exercises:[
        {name:'Box pistol to chair', reps:6, each:true},
        {name:'Reverse lunges', reps:12, each:true},
        {name:'Towel slide leg curls', reps:10},
        {name:'Single-leg calf raises', reps:15, each:true},
      ]}, finisher:{id:'wallsit_max', name:'Wall sit — max', unit:'secs'}},
      {title:'Legs EMOM', main:{format:'emom', minutes:16, exercises:[
        {name:'Jump lunges', reps:12},
        {name:'Cossack squats', reps:6, each:true},
        {name:'Skater jumps', reps:12},
        {name:'Glute bridge march', reps:20},
      ]}, finisher:{id:'jumpsquat_45', name:'Max jump squats in 45s', unit:'reps', window:45}},
    ]},

  {id:'core', name:'Core', blurb:'Abs · obliques · trunk', color:'#2EC5B6', icon:'core',
    warmup:[
      {name:'Cat-cow', detail:'8'},
      {name:'Dead bugs', detail:'10'},
      {name:'Bird dogs', detail:'8 each side'},
      {name:'Glute bridges', detail:'12'},
      {name:'Hollow rocks', detail:'10'},
    ],
    cooldown:[
      {name:'Cobra stretch', secs:30},
      {name:"Child's pose", secs:30},
      {name:'Supine twist', side:'Left', secs:30},
      {name:'Supine twist', side:'Right', secs:30},
    ],
    variants:[
      {title:'Hang & Hold', main:{format:'circuit', rounds:3, rest:60, exercises:[
        {name:'Hanging knee raises', reps:12},
        {name:'Hollow hold', secs:30},
        {name:'Side plank', secs:30, each:true},
        {name:'Mountain climbers', reps:30},
      ]}, finisher:{id:'plank_max', name:'Plank — max', unit:'secs'}},
      {title:'Leg Raise Ladder', main:{format:'circuit', rounds:3, rest:60, exercises:[
        {name:'Hanging leg raises', reps:8},
        {name:'V-ups', reps:12},
        {name:'Russian twists', reps:20},
        {name:'Superman hold', secs:30},
      ]}, finisher:{id:'hollow_max', name:'Hollow hold — max', unit:'secs'}},
      {title:'Core EMOM', main:{format:'emom', minutes:12, exercises:[
        {name:'Toes-to-bar', reps:6},
        {name:'Lying leg raises', reps:12},
        {name:'Plank to press-up', reps:10},
        {name:'Bicycle crunches', reps:20},
      ]}, finisher:{id:'lsit_max', name:'Tuck L-sit (chairs or floor) — max', unit:'secs'}},
    ]},

  {id:'skills', name:'Skills', blurb:'Handstand · levers · balance', color:'#5B8CFF', icon:'skills',
    warmup:[
      {name:'Wrist prep circles + rocks', detail:'60 sec'},
      {name:'Scapular press-ups', detail:'10'},
      {name:'Pike shoulder taps', detail:'10'},
      {name:'Hollow-to-arch rocks', detail:'8'},
      {name:'Active hang + scap pulls', detail:'20 sec'},
    ],
    cooldown:[
      {name:'Wrist extensor + flexor stretch', secs:30},
      {name:'Shoulder stretch across body', side:'Left', secs:30},
      {name:'Shoulder stretch across body', side:'Right', secs:30},
      {name:'Pike stretch (seated)', secs:30},
    ],
    variants:[
      {title:'Handstand & Crow', main:{format:'circuit', rounds:3, rest:90, exercises:[
        {name:'Chest-to-wall handstand', secs:30},
        {name:'Crow hold', secs:20},
        {name:'Tuck L-sit', secs:15},
        {name:'Tuck front lever (bar)', secs:10},
      ]}, finisher:{id:'handstand_max', name:'Chest-to-wall handstand — max', unit:'secs'}},
      {title:'Lean & Lever', main:{format:'circuit', rounds:3, rest:90, exercises:[
        {name:'Wall walks', reps:3},
        {name:'Planche lean', secs:20},
        {name:'Tuck front lever (bar)', secs:10},
        {name:'Seated pike compression lifts', reps:10},
      ]}, finisher:{id:'crow_max', name:'Crow hold — max', unit:'secs'}},
      {title:'Control Work', main:{format:'circuit', rounds:3, rest:90, exercises:[
        {name:'Kick-ups to wall handstand', reps:5},
        {name:'Archer pull-up negatives', reps:3, each:true},
        {name:'Wall handstand shoulder taps', reps:10},
        {name:'Hollow body hold', secs:30},
      ]}, finisher:{id:'frontlever_max', name:'Tuck front lever — max', unit:'secs'}},
    ]},

  {id:'cond', name:'Conditioning', blurb:'Engine · full body', color:'#FF5C8A', icon:'flame',
    warmup:[
      {name:'Jumping jacks', detail:'45 sec'},
      {name:'High knees', detail:'30 sec'},
      {name:'Inchworms', detail:'5'},
      {name:'Squat to stand', detail:'8'},
      {name:'Arm swings', detail:'20'},
    ],
    cooldown:[
      {name:'Hip flexor stretch', side:'Left', secs:30},
      {name:'Hip flexor stretch', side:'Right', secs:30},
      {name:'Standing forward fold', secs:30},
      {name:'Box breathing (4-4-4-4)', secs:60},
    ],
    variants:[
      {title:'Burpee Grinder', main:{format:'circuit', rounds:5, rest:60, exercises:[
        {name:'Burpees', reps:10},
        {name:'Jump squats', reps:15},
        {name:'Press-ups', reps:10},
        {name:'Mountain climbers', reps:30},
      ]}, finisher:{id:'burpee_120', name:'Max burpees in 2 min', unit:'reps', window:120}},
      {title:'Full-Body EMOM', main:{format:'emom', minutes:20, exercises:[
        {name:'Burpee pull-ups', reps:6},
        {name:'Jump lunges', reps:12},
        {name:'Plank jacks', reps:20},
        {name:'Squat thrusts', reps:12},
      ]}, finisher:{id:'burpee_60', name:'Max burpees in 60s', unit:'reps', window:60}},
      {title:'Bar & Floor Blitz', main:{format:'circuit', rounds:4, rest:60, exercises:[
        {name:'Sprawls', reps:10},
        {name:'Tuck jumps', reps:8},
        {name:'Pull-ups', reps:5},
        {name:'Bear crawl', secs:30},
      ]}, finisher:{id:'squatjump_60', name:'Max jump squats in 60s', unit:'reps', window:60}},
    ]},

  {id:'mob', name:'Mobility', blurb:'Flow · recovery · hang', color:'#34D399', icon:'stretch',
    warmup:[
      {name:'Cat-cow', detail:'10'},
      {name:'Neck circles', detail:'5 each way'},
      {name:'Hip circles', detail:'10 each way'},
      {name:'Arm swings', detail:'20'},
    ],
    cooldown:[
      {name:"Child's pose", secs:45},
      {name:'Supine twist', side:'Left', secs:30},
      {name:'Supine twist', side:'Right', secs:30},
      {name:'Box breathing (4-4-4-4)', secs:60},
    ],
    variants:[
      {title:'Hips & Spine Flow', main:{format:'circuit', rounds:2, rest:30, exercises:[
        {name:"World's greatest stretch", reps:5, each:true},
        {name:'Deep squat hold', secs:45},
        {name:'Cossack shifts', reps:8, each:true},
        {name:'Thoracic openers', reps:8, each:true},
        {name:'Dead hang', secs:30},
      ]}, finisher:{id:'squathold_max', name:'Deep squat hold — max', unit:'secs'}},
      {title:'Floor Flow', main:{format:'circuit', rounds:2, rest:30, exercises:[
        {name:'90/90 hip switches', reps:10},
        {name:'Pigeon stretch', secs:45, each:true},
        {name:'Bodyweight Jefferson curl (slow)', reps:6},
        {name:'Scapular pull-ups', reps:10},
      ]}, finisher:{id:'hang_max', name:'Dead hang — max', unit:'secs'}},
      {title:'Open Up', main:{format:'circuit', rounds:2, rest:30, exercises:[
        {name:'Kneeling hip flexor stretch', secs:45, each:true},
        {name:'Wall slides', reps:10},
        {name:'Frog stretch', secs:45},
        {name:'Bridge hold (or glute bridge)', secs:20},
        {name:'Active hang', secs:30},
      ]}, finisher:null},
    ]},
];
const CALI_PLAN_DEFAULT = {levels:{push:0, pull:0, legs:0, core:0, skills:0, cond:0, mob:0}};
const CALI_DAY_LETTERS = ['M','T','W','T','F','S','S'];
const CALI_DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const FAST_PRESETS = [16, 18, 24, 36, 48, 72];

/* ---------------- STORAGE ---------------- */
// Keys keep the original "ftx_" prefix so all existing saved data carries over.
const load = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
function usePersisted(key, fallback){
  const [v, setV] = useState(()=> load(key, fallback));
  useEffect(()=> save(key, v), [key, v]);
  return [v, setV];
}

/* ---------------- THEME ---------------- */
const ThemeContext = createContext('dark');
const THEME_COLORS = {dark:'#0B0C0F', light:'#F2F3F7'};
function cssVar(name){
  try { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); } catch(e){ return ''; }
}
function applyTheme(resolved){
  const root = document.documentElement;
  if(root.getAttribute('data-theme') !== resolved) root.setAttribute('data-theme', resolved);
  const m = document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute('content', THEME_COLORS[resolved]);
}
function useSystemDark(){
  const get = () => { try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch(e){ return true; } };
  const [dark, setDark] = useState(get);
  useEffect(()=>{
    let mq; try { mq = window.matchMedia('(prefers-color-scheme: dark)'); } catch(e){ return; }
    const on = () => setDark(mq.matches);
    if(mq.addEventListener) mq.addEventListener('change', on); else if(mq.addListener) mq.addListener(on);
    return () => { if(mq.removeEventListener) mq.removeEventListener('change', on); else if(mq.removeListener) mq.removeListener(on); };
  }, []);
  return dark;
}
/* ---------------- BEEP / NOTIFY ---------------- */
let _audioCtx = null;
function getAudioCtx(){
  try{
    if(!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(_audioCtx.state === 'suspended') _audioCtx.resume().catch(()=>{});
    return _audioCtx;
  }catch(e){ return null; }
}
function playBeep(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  try{
    [0,0.18,0.36].forEach((t,i)=>{
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type='sine'; o.frequency.value = i===2?1050:850;
      g.gain.setValueAtTime(0.0001, ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime+t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+t+0.15);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.16);
    });
  }catch(e){}
}
function playTick(final){
  const ctx = getAudioCtx();
  if(!ctx) return;
  try{
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = final ? 1320 : 990;
    const t = ctx.currentTime, len = final ? 0.32 : 0.09;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(final ? 0.3 : 0.22, t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t+len);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t+len+0.02);
  }catch(e){}
}
function vibrate(p){ if(navigator.vibrate){ try{ navigator.vibrate(p); }catch(e){} } }
function requestNotifyPermission(cb){
  try{
    if('Notification' in window && Notification.permission==='default'){
      const r = Notification.requestPermission(()=>cb && cb());
      if(r && r.then) r.then(()=>cb && cb());
    }
  }catch(e){}
}
function notify(title, body){
  try{
    if('Notification' in window && Notification.permission==='granted'){
      new Notification(title, {body});
    }
  }catch(e){}
}

/* ---------------- SPOTIFY (PKCE) ---------------- */
const SPOTIFY_SCOPES = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';
function getRedirectUri(){ return window.location.origin + window.location.pathname; }
function base64UrlEncode(buffer){
  return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function generateRandomString(len){
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return base64UrlEncode(arr.buffer).slice(0,len);
}
async function sha256(plain){
  return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
}
async function startSpotifyAuth(clientId){
  const verifier = generateRandomString(64);
  localStorage.setItem('ftx_spotify_verifier', verifier);
  const challenge = base64UrlEncode(await sha256(verifier));
  const params = new URLSearchParams({
    client_id: clientId, response_type: 'code', redirect_uri: getRedirectUri(),
    scope: SPOTIFY_SCOPES, code_challenge_method: 'S256', code_challenge: challenge,
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
async function exchangeSpotifyCode(clientId, code){
  const verifier = localStorage.getItem('ftx_spotify_verifier');
  const body = new URLSearchParams({client_id: clientId, grant_type:'authorization_code', code, redirect_uri:getRedirectUri(), code_verifier:verifier});
  const res = await fetch('https://accounts.spotify.com/api/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body});
  if(!res.ok) throw new Error('token exchange failed');
  return res.json();
}
async function refreshSpotifyToken(clientId, refreshToken){
  const body = new URLSearchParams({client_id: clientId, grant_type:'refresh_token', refresh_token: refreshToken});
  const res = await fetch('https://accounts.spotify.com/api/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body});
  if(!res.ok) throw new Error('refresh failed');
  return res.json();
}
async function getValidSpotifyToken(clientId, tokens, setTokens){
  if(!tokens) return null;
  if(Date.now() < tokens.expires_at - 15000) return tokens.access_token;
  try{
    const data = await refreshSpotifyToken(clientId, tokens.refresh_token);
    const next = {access_token:data.access_token, refresh_token:data.refresh_token || tokens.refresh_token, expires_at:Date.now()+data.expires_in*1000};
    setTokens(next);
    return next.access_token;
  }catch(e){ return null; }
}

/* ---------------- HELPERS ---------------- */
function roundTo(v, step){ return Math.round(v/step)*step; }
function estimate1RM(weight, reps){ return weight*(1+reps/30); }
function firstNumber(str){
  if(str==null) return null;
  const m = String(str).match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}
function computeWarmup(weight){
  return [
    {pct:40, w:roundTo(weight*0.4,2.5), reps:5},
    {pct:60, w:roundTo(weight*0.6,2.5), reps:3},
    {pct:80, w:roundTo(weight*0.8,2.5), reps:2},
  ];
}
const PLATES = [25,20,15,10,5,2.5,1.25];
function computePlates(weight){
  const bar = 20;
  if(weight < bar) return null;
  let remaining = roundTo((weight-bar)/2, 1.25);
  const used = [];
  for(const p of PLATES){
    while(remaining >= p - 0.001){ used.push(p); remaining = Math.round((remaining-p)*100)/100; }
  }
  return used;
}
function kgToUnit(kg, unit){ return unit==='lb' ? kg*2.20462 : kg; }
function unitToKg(val, unit){ return unit==='lb' ? val/2.20462 : val; }
function computeBMI(weightKg, heightCm){
  if(!weightKg || !heightCm) return null;
  const h = heightCm/100;
  return weightKg/(h*h);
}
// Value logged for one set: per-set override if present, else the exercise's working value
function setVal(entry, i, field){
  const sv = entry && entry.sets && entry.sets[i];
  const v = sv && sv[field==='weight'?'w':'r'];
  return (v!==undefined && v!==null && v!=='') ? v : (entry ? entry[field] : '');
}
function entryVolume(entry, ex){
  if(!entry || !entry.done) return {volume:0, sets:0, top:null};
  let volume = 0, sets = 0, top = null;
  entry.done.forEach((d,i)=>{
    if(!d) return;
    sets++;
    const w = parseFloat(setVal(entry, i, 'weight'));
    const r = firstNumber(setVal(entry, i, 'reps')) || firstNumber(ex.reps);
    if(isFinite(w) && w>0){ top = top==null ? w : Math.max(top, w); if(r) volume += w*r; }
  });
  return {volume, sets, top};
}
function computeSessionVolume(session, week, logs){
  let total = 0;
  session.groups.forEach((g, gi)=>{
    g.exercises.forEach((ex, ei)=>{ total += entryVolume(logs[`w${week}_${session.id}_${gi}_${ei}`], ex).volume; });
  });
  return total;
}
function sessionSetCounts(session, week, logs){
  let done = 0, total = 0;
  session.groups.forEach((g, gi)=>{
    g.exercises.forEach((ex, ei)=>{
      const n = g.rounds || ex.sets || 0;
      total += n;
      const e = logs[`w${week}_${session.id}_${gi}_${ei}`];
      done += e && e.done ? Math.min(n, e.done.filter(Boolean).length) : 0;
    });
  });
  return {done, total};
}
const pad2 = n => String(n).padStart(2,'0');
function dayKey(d){ const x = new Date(d); return `${x.getFullYear()}-${pad2(x.getMonth()+1)}-${pad2(x.getDate())}`; }
function fmtDate(d, opts){ return new Date(d).toLocaleDateString('en-GB', opts || {day:'numeric', month:'short'}); }
function fmtHMS(totalSec){
  const s = Math.max(0, Math.floor(totalSec));
  const hh = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60;
  return `${hh}:${pad2(mm)}:${pad2(ss)}`;
}
function fmtMS(totalSec){
  const s = Math.max(0, Math.floor(totalSec));
  const hh = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60;
  return hh ? `${hh}:${pad2(mm)}:${pad2(ss)}` : `${mm}:${pad2(ss)}`;
}
function toDatetimeLocalValue(iso){
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function fromDatetimeLocalValue(val){ return new Date(val).toISOString(); }
function greetingWord(){
  const h = new Date().getHours();
  if(h<5) return 'Up early';
  if(h<12) return 'Good morning';
  if(h<18) return 'Good afternoon';
  return 'Good evening';
}
function fmtSigned(x, d=1){ const v = Number(x.toFixed(d)); return (v>0?'+':v<0?'\u2212':'') + Math.abs(v).toFixed(d); }
function plural(n, word){ return `${n} ${word}${n===1?'':'s'}`; }
function useNow(active, ms=1000){
  const [now, setNow] = useState(Date.now());
  useEffect(()=>{
    if(!active) return;
    const tick = () => setNow(Date.now());
    tick();
    const iv = setInterval(tick, ms);
    const onVis = () => { if(document.visibilityState==='visible') tick(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', tick);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('focus', tick); };
  }, [active, ms]);
  return now;
}



/* ================= ICONS (24px grid, 1.9 stroke) ================= */
const Icon = ({name, size=20, color='currentColor', stroke=1.9}) => {
  const p = {width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round', 'aria-hidden':true};
  const f = {width:size, height:size, viewBox:'0 0 24 24', fill:color, 'aria-hidden':true};
  switch(name){
    case 'back': return <svg {...p}><path d="M15 18.5L8.5 12 15 5.5"/></svg>;
    case 'chevronLeft': return <svg {...p}><path d="M14.5 6l-6 6 6 6"/></svg>;
    case 'chevronRight': return <svg {...p}><path d="M9.5 6l6 6-6 6"/></svg>;
    case 'chevronDown': return <svg {...p}><path d="M6 9.5l6 6 6-6"/></svg>;
    case 'close': return <svg {...p}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>;
    case 'plus': return <svg {...p}><path d="M12 5.5v13M5.5 12h13"/></svg>;
    case 'minus': return <svg {...p}><path d="M5.5 12h13"/></svg>;
    case 'check': return <svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>;
    case 'clock': return <svg {...p}><circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3 2"/></svg>;
    case 'timer': return <svg {...p}><circle cx="12" cy="13.4" r="7.6"/><path d="M12 9.6v3.8l2.4 1.5M9.6 2.6h4.8"/></svg>;
    case 'flame': return <svg {...p}><path d="M12 2.8c.7 3.4-3.6 4.8-3.6 9a3.6 3.6 0 007.2 0c0-1.4-.8-2.3-.8-2.3s2.5 1.2 2.5 4.6a5.3 5.3 0 01-10.6 0C6.7 8.5 12 7.2 12 2.8z"/></svg>;
    case 'gear': return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case 'edit': return <svg {...p}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 00-4-4L4 16v4z"/></svg>;
    case 'play': return <svg {...f}><path d="M7.5 4.8c0-.8.9-1.3 1.6-.9l10.2 6.4c.6.4.6 1.3 0 1.7L9.1 18.4c-.7.4-1.6-.1-1.6-.9V4.8z"/></svg>;
    case 'pause': return <svg {...f}><rect x="6" y="4.5" width="4.2" height="15" rx="1.3"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3"/></svg>;
    case 'next': return <svg {...f}><path d="M5 5.2c0-.8.9-1.3 1.5-.8l8.6 6.6c.5.4.5 1.2 0 1.6l-8.6 6.6c-.6.5-1.5 0-1.5-.8V5.2z"/><rect x="16.5" y="4.5" width="2.6" height="15" rx="1.2"/></svg>;
    case 'stretch': return <svg {...p}><circle cx="12" cy="4.6" r="1.9"/><path d="M12 6.6v6M5.5 9.6l6.5 3 6.5-3M8 20.4l4-6 4 6"/></svg>;
    case 'push': return <svg {...p}><path d="M12 19V6.5M6.8 11.6L12 6.4l5.2 5.2M4.5 3.6h15"/></svg>;
    case 'pull': return <svg {...p}><path d="M12 5v12.5M6.8 12.4l5.2 5.2 5.2-5.2M4.5 20.4h15"/></svg>;
    case 'legs': return <svg {...p}><path d="M13.2 2.8L7 13.4h5l-1.2 7.8 6.2-10.6h-5l1.2-7.8z"/></svg>;
    case 'arms': return <svg {...p}><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>;
    case 'core': return <svg {...p}><circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1" fill={color}/></svg>;
    case 'skills': return <svg {...p}><circle cx="12" cy="19.2" r="1.7"/><path d="M12 17.2V9M8 4.6l4 4.4 4-4.4M7.2 13h9.6"/></svg>;
    case 'dumbbell': return <svg {...p}><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>;
    case 'home': return <svg {...f}><path d="M12 3.1l8.6 7.2V20a1.1 1.1 0 01-1.1 1.1H15v-6.2H9v6.2H4.5A1.1 1.1 0 013.4 20v-9.7L12 3.1z"/></svg>;
    case 'homeO': return <svg {...p}><path d="M12 3.6l8 6.7V20a.9.9 0 01-.9.9H15v-6H9v6H4.9A.9.9 0 014 20v-9.7l8-6.7z"/></svg>;
    case 'chart': return <svg {...p}><path d="M3.5 20h17M6.5 16.5v-4M11 16.5V8M15.5 16.5v-6M20 16.5V5"/></svg>;
    case 'user': return <svg {...p}><circle cx="12" cy="8.4" r="3.9"/><path d="M4.4 20.6c1.2-3.9 4.2-5.7 7.6-5.7s6.4 1.8 7.6 5.7"/></svg>;
    case 'sun': return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case 'sunrise': return <svg {...p}><path d="M17 18a5 5 0 00-10 0M12 2.5v6.5M4.2 10.2l1.4 1.4M1.5 18h2M20.5 18h2M18.4 11.6l1.4-1.4M22.5 22h-21M8.5 5.8L12 2.5l3.5 3.3"/></svg>;
    case 'moon': return <svg {...p}><path d="M20.5 13.2A8.5 8.5 0 1110.8 3.5a6.6 6.6 0 009.7 9.7z"/></svg>;
    case 'monitor': return <svg {...p}><rect x="2.8" y="4" width="18.4" height="12.6" rx="2.2"/><path d="M8.5 20.5h7M12 16.6v3.9"/></svg>;
    case 'scale': return <svg {...p}><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.6"/><path d="M8.2 9.2a5.3 5.3 0 017.6 0M12 9.6l1.4-1.9"/></svg>;
    case 'trophy': return <svg {...p}><path d="M8 20.5h8M12 16.5v4M7 3.8h10V9a5 5 0 01-10 0V3.8zM7 6H4.2v1.4A3.4 3.4 0 007.4 11M17 6h2.8v1.4A3.4 3.4 0 0116.6 11"/></svg>;
    case 'bell': return <svg {...p}><path d="M17.8 8.6a5.8 5.8 0 00-11.6 0c0 6.8-2.9 8.7-2.9 8.7h17.4s-2.9-1.9-2.9-8.7M13.7 20.8a2 2 0 01-3.4 0"/></svg>;
    case 'music': return <svg {...p}><path d="M9 18V5.5l11-2v12.5"/><circle cx="6.2" cy="18" r="2.8"/><circle cx="17.2" cy="16" r="2.8"/></svg>;
    case 'download': return <svg {...p}><path d="M12 3.5v11.5M7.5 10.5L12 15l4.5-4.5M4.5 15.5v3a2 2 0 002 2h11a2 2 0 002-2v-3"/></svg>;
    case 'upload': return <svg {...p}><path d="M12 15V3.5M7.5 8L12 3.5 16.5 8M4.5 15.5v3a2 2 0 002 2h11a2 2 0 002-2v-3"/></svg>;
    case 'palette': return <svg {...p}><path d="M12 3a9 9 0 100 18c1.3 0 2-.8 2-1.8 0-1.4-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6H17a4 4 0 004-4C21 6.6 17 3 12 3z"/><circle cx="7.6" cy="11" r="1.1" fill={color}/><circle cx="10.4" cy="7.2" r="1.1" fill={color}/><circle cx="15" cy="7.6" r="1.1" fill={color}/></svg>;
    case 'reset': return <svg {...p}><path d="M3.5 12a8.5 8.5 0 108.5-8.5 9 9 0 00-6.2 2.6L3.5 8.3"/><path d="M3.5 3.5v4.8h4.8"/></svg>;
    case 'list': return <svg {...p}><path d="M8.5 6h12M8.5 12h12M8.5 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>;
    case 'calendar': return <svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>;
    case 'bolt': return <svg {...p}><path d="M13.2 2.8L5.5 13.4h6l-1 7.8 7.7-10.6h-6l1-7.8z"/></svg>;
    case 'heart': return <svg {...p}><path d="M12 20.3S3.6 15.4 3.6 9.2A4.6 4.6 0 0112 6.6a4.6 4.6 0 018.4 2.6c0 6.2-8.4 11.1-8.4 11.1z"/></svg>;
    case 'swap': return <svg {...p}><path d="M7 4.5L3.5 8 7 11.5M3.5 8H16M17 12.5l3.5 3.5-3.5 3.5M20.5 16H8"/></svg>;
    case 'info': return <svg {...p}><circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.5M12 7.6h.01"/></svg>;
    case 'kettlebell': return <svg {...p}><path d="M8.6 9.4a3.4 3.4 0 116.8 0"/><path d="M6.6 11.4a6.8 6.8 0 1010.8 0z"/></svg>;
    default: return null;
  }
};

/* ================= HOOKS ================= */
function useScrolled(threshold=10){
  const [s, setS] = useState(false);
  useEffect(()=>{
    const on = () => setS(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, {passive:true});
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return s;
}

/* ================= SHARED UI ================= */
// Sticky top bar. `fadeTitle` hides the centered title until the page is scrolled (iOS large-title style).
function TopBar({left, title, sub, right, fadeTitle=false, threshold=40}){
  const scrolled = useScrolled(threshold);
  return (
    <div className={`topbar ${scrolled?'scrolled':''}`}>
      <div>{left}</div>
      <div className={`mid ${fadeTitle?'fade':''}`}>{title && <b>{title}</b>}{sub && <span>{sub}</span>}</div>
      <div className="right">{right}</div>
    </div>
  );
}
function BackBtn({onClick, icon='back', label='Back'}){
  return <button className="cbtn" onClick={onClick} aria-label={label}><Icon name={icon} size={icon==='close'?17:20} stroke={2.2}/></button>;
}

function Sheet({title, onClose, children, actions}){
  const sheetRef = useRef(null);
  const bgRef = useRef(null);
  const drag = useRef(null);
  const closingRef = useRef(false);
  useEffect(()=>{
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const close = () => {
    if(closingRef.current) return;
    closingRef.current = true;
    const el = sheetRef.current, bg = bgRef.current;
    if(el){ el.style.transition = 'transform .24s cubic-bezier(.4,0,1,1)'; el.style.transform = 'translateY(105%)'; }
    if(bg) bg.classList.add('closing');
    setTimeout(onClose, 230);
  };
  const down = (e) => {
    drag.current = {y:e.clientY, dy:0, t:Date.now()};
    const el = sheetRef.current; if(el){ el.style.transition = 'none'; el.style.animation = 'none'; }
    try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){}
  };
  const move = (e) => {
    if(!drag.current) return;
    const dy = Math.max(0, e.clientY - drag.current.y);
    drag.current.dy = dy;
    if(sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const up = () => {
    if(!drag.current) return;
    const {dy, t} = drag.current; drag.current = null;
    const fast = dy > 40 && (Date.now()-t) < 220;
    if(dy > 120 || fast) close();
    else if(sheetRef.current){ sheetRef.current.style.transition = 'transform .35s cubic-bezier(.32,1.24,.46,1)'; sheetRef.current.style.transform = ''; }
  };
  return ReactDOM.createPortal(
    <div className="sheet-bg" ref={bgRef} onClick={close}>
      <div className="sheet" ref={sheetRef} onClick={e=>e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="sheet-grab" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><i></i></div>
        {title && <div className="sheet-title">{title}</div>}
        {typeof children === 'function' ? children(close) : children}
        {actions && <div className="sheet-actions">{typeof actions === 'function' ? actions(close) : actions}</div>}
      </div>
    </div>, document.body
  );
}

function Segmented({options, value, onChange}){
  return (
    <div className="seg" role="tablist">
      {options.map(o=>(
        <button key={o.value} className={value===o.value?'on':''} onClick={()=>{ if(value!==o.value){ vibrate(8); onChange(o.value); } }} role="tab" aria-selected={value===o.value}>
          {o.icon && <Icon name={o.icon} size={15}/>}{o.label}
        </button>
      ))}
    </div>
  );
}

function Stat({value, unit, label}){
  const long = String(value).length >= 6;
  return (
    <div className="stat">
      <div className="v" style={long ? {fontSize:21} : undefined}>{value}{unit && value!=='—' && <small>{unit}</small>}</div>
      <div className="l">{label}</div>
    </div>
  );
}

// Ring that animates from empty on mount and eases between values
function Ring({size=120, stroke=10, pct=0, color='var(--accent)', children, gradient=false, track}){
  const [shown, setShown] = useState(0);
  useEffect(()=>{ const id = requestAnimationFrame(()=> setShown(Math.max(0, Math.min(1, pct||0)))); return ()=>cancelAnimationFrame(id); }, [pct]);
  const r = (size-stroke)/2;
  const c = 2*Math.PI*r;
  const gid = useMemo(()=> 'rg'+Math.random().toString(36).slice(2,8), []);
  return (
    <div className="ring" style={{width:size, height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gradient && <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8FB0FF"/><stop offset="1" stopColor="#3D6BFF"/></linearGradient></defs>}
        <circle className="track" cx={size/2} cy={size/2} r={r} strokeWidth={stroke} style={track ? {stroke:track} : undefined}/>
        <circle className="arc" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}
          stroke={gradient ? `url(#${gid})` : color} strokeDasharray={c} strokeDashoffset={c*(1-shown)} style={{opacity: shown>0.001 ? 1 : 0}}/>
      </svg>
      <div className="in">{children}</div>
    </div>
  );
}
// Ring for live timers: no easing lag
function LiveRing(props){
  const {size=120, stroke=10, pct=0, color='var(--accent)', children, gradient=false} = props;
  const r = (size-stroke)/2, c = 2*Math.PI*r;
  const gid = useMemo(()=> 'lg'+Math.random().toString(36).slice(2,8), []);
  const v = Math.max(0, Math.min(1, pct||0));
  return (
    <div className="ring" style={{width:size, height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gradient && <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8FB0FF"/><stop offset="1" stopColor="#3D6BFF"/></linearGradient></defs>}
        <circle className="track" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}/>
        {v>0.001 && <circle className="arc" cx={size/2} cy={size/2} r={r} strokeWidth={stroke} stroke={gradient ? `url(#${gid})` : color} strokeDasharray={c} strokeDashoffset={c*(1-v)} style={{transition:'stroke-dashoffset .3s linear'}}/>}
      </svg>
      <div className="in">{children}</div>
    </div>
  );
}

// Lightweight SVG line chart (no external library): smooth line, gradient fill, draw-in, tap to inspect
function LineChart({labels, data, fill=true, height=170, unit=''}){
  const boxRef = useRef(null);
  const [w, setW] = useState(320);
  const [hover, setHover] = useState(null);
  const gid = useMemo(()=> 'lc'+Math.random().toString(36).slice(2,8), []);
  useEffect(()=>{
    const el = boxRef.current; if(!el) return;
    const measure = () => setW(Math.max(200, el.clientWidth));
    measure();
    let ro; if(window.ResizeObserver){ ro = new ResizeObserver(measure); ro.observe(el); }
    window.addEventListener('resize', measure);
    return () => { if(ro) ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  if(!data || data.length===0) return null;
  const padL = 36, padR = 10, padT = 12, padB = 22;
  const iw = w - padL - padR, ih = height - padT - padB;
  let min = Math.min(...data), max = Math.max(...data);
  if(min===max){ min -= 1; max += 1; }
  const span = max - min; min -= span*0.12; max += span*0.12;
  const step = niceStep((max-min)/4);
  const t0 = Math.ceil(min/step)*step;
  const ticks = []; for(let t=t0; t<=max+1e-9; t+=step) ticks.push(Math.round(t*100)/100);
  const X = (i) => padL + (data.length===1 ? iw/2 : (i/(data.length-1))*iw);
  const Y = (v) => padT + ih - ((v-min)/(max-min))*ih;
  const pts = data.map((v,i)=>[X(i), Y(v)]);
  const line = smoothPath(pts);
  const area = line + ` L ${pts[pts.length-1][0].toFixed(1)} ${padT+ih} L ${pts[0][0].toFixed(1)} ${padT+ih} Z`;
  const labelIdx = data.length<=4 ? data.map((_,i)=>i) : [0, Math.round((data.length-1)/3), Math.round(2*(data.length-1)/3), data.length-1];
  const pick = (clientX) => {
    const r = boxRef.current.getBoundingClientRect();
    const x = clientX - r.left;
    let best = 0, bd = Infinity;
    pts.forEach((p,i)=>{ const d = Math.abs(p[0]-x); if(d<bd){ bd=d; best=i; } });
    setHover(best);
  };
  const h = hover!=null ? pts[hover] : null;
  return (
    <div className="chart-box" ref={boxRef} style={{height}}
      onPointerDown={e=>pick(e.clientX)} onPointerMove={e=>{ if(e.pointerType!=='mouse' || e.buttons || hover!=null) pick(e.clientX); }}
      onPointerLeave={()=>setHover(null)} onPointerUp={e=>{ if(e.pointerType!=='mouse') setTimeout(()=>setHover(null), 1600); }}>
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{display:'block', touchAction:'pan-y'}}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28"/>
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {ticks.map((t,i)=>(
          <g key={i}>
            <line x1={padL} x2={w-padR} y1={Y(t)} y2={Y(t)} stroke="var(--chart-grid)" strokeWidth="1"/>
            <text x={padL-8} y={Y(t)+3.5} textAnchor="end" fontSize="10.5" fontWeight="600" fill="var(--t3)" fontFamily="var(--font-num)">{fmtTick(t, step)}</text>
          </g>
        ))}
        {fill && <path d={area} fill={`url(#${gid})`} className="chart-area"/>}
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="chart-line"/>
        {data.length<=14 && pts.map((p,i)=> <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill="var(--accent)" stroke="var(--s1)" strokeWidth="2" className="chart-dot" style={{animationDelay:`${0.5+i*0.03}s`}}/>)}
        {labelIdx.map(i=> <text key={'x'+i} x={X(i)} y={height-5} textAnchor={i===0 && data.length>1 ? 'start' : i===data.length-1 && data.length>1 ? 'end' : 'middle'} fontSize="10.5" fontWeight="600" fill="var(--t3)">{labels[i]}</text>)}
        {h && (
          <g>
            <line x1={h[0]} x2={h[0]} y1={padT} y2={padT+ih} stroke="var(--t3)" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx={h[0]} cy={h[1]} r="6" fill="var(--accent)" stroke="var(--s1)" strokeWidth="2.5"/>
          </g>
        )}
      </svg>
      {h && (
        <div className="chart-tip" style={{left: Math.min(Math.max(h[0], 50), w-50), top: Math.max(0, h[1]-46)}}>
          <b className="num">{data[hover]}{unit}</b><span>{labels[hover]}</span>
        </div>
      )}
    </div>
  );
}
function niceStep(raw){
  const p = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const n = raw / p;
  return (n<=1 ? 1 : n<=2 ? 2 : n<=2.5 ? 2.5 : n<=5 ? 5 : 10) * p;
}
function fmtTick(t, step){ return step < 1 ? t.toFixed(1) : String(Math.round(t)); }
function smoothPath(pts){
  if(pts.length===1) return `M ${pts[0][0]} ${pts[0][1]}`;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for(let i=0;i<pts.length-1;i++){
    const p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || p2;
    const t = 0.18;
    const c1x = p1[0] + (p2[0]-p0[0])*t, c1y = p1[1] + (p2[1]-p0[1])*t;
    const c2x = p2[0] - (p3[0]-p1[0])*t, c2y = p2[1] - (p3[1]-p1[1])*t;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/* 3-2-1 countdown ticks before a timer ends (each tick fires once per end time) */
function useCountdownTicks(endAt, now, enabled=true){
  const fired = useRef({});
  useEffect(()=>{
    if(!enabled || !endAt) return;
    const left = (endAt - now)/1000;
    if(left <= 0 || left > 3) return;
    const sec = Math.ceil(left);
    const key = endAt + ':' + sec;
    if(fired.current[key]) return;
    fired.current[key] = true;
    playTick(false);
  }, [endAt, now, enabled]);
}

/* Swipe gestures: edge-swipe back (screen follows the finger) + left/right swipes on content */
function useSwipe(ref, {onBack, onLeft, onRight}){
  const handlers = useRef({onBack, onLeft, onRight});
  handlers.current = {onBack, onLeft, onRight};
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    let st = null;
    const ignore = (t) => t && t.closest && t.closest('input, textarea, select, .stepper, .nf, .chart-box, .sheet, .no-swipe');
    const start = (e) => {
      if(e.touches && e.touches.length > 1) return;
      const p = e.touches ? e.touches[0] : e;
      if(ignore(e.target)) { st = null; return; }
      st = {x:p.clientX, y:p.clientY, edge:p.clientX < 26 && !!handlers.current.onBack, lock:null, dx:0};
    };
    const move = (e) => {
      if(!st) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - st.x, dy = p.clientY - st.y;
      if(!st.lock){ if(Math.abs(dx) > 10 || Math.abs(dy) > 10) st.lock = Math.abs(dx) > Math.abs(dy)*1.3 ? 'x' : 'y'; else return; }
      if(st.lock !== 'x') return;
      st.dx = dx;
      if(st.edge && dx > 0){
        el.style.transition = 'none';
        el.style.transform = `translateX(${dx*0.92}px)`;
        el.style.boxShadow = '-18px 0 40px -20px rgba(0,0,0,.6)';
        if(e.cancelable) e.preventDefault();
      }
    };
    const end = () => {
      if(!st) return;
      const {dx, edge, lock} = st; st = null;
      if(edge){
        if(dx > 90){
          el.style.transition = 'transform .22s cubic-bezier(.2,.8,.2,1)';
          el.style.transform = 'translateX(100%)';
          setTimeout(()=>{ el.style.transform=''; el.style.transition=''; el.style.boxShadow=''; handlers.current.onBack && handlers.current.onBack(); }, 200);
        } else {
          el.style.transition = 'transform .3s cubic-bezier(.32,1.24,.46,1)';
          el.style.transform = '';
          setTimeout(()=>{ el.style.boxShadow=''; el.style.transition=''; }, 300);
        }
        return;
      }
      if(lock==='x' && Math.abs(dx) > 70){
        if(dx < 0 && handlers.current.onLeft){ vibrate(10); handlers.current.onLeft(); }
        if(dx > 0 && handlers.current.onRight){ vibrate(10); handlers.current.onRight(); }
      }
    };
    el.addEventListener('touchstart', start, {passive:true});
    el.addEventListener('touchmove', move, {passive:false});
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);
    return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchmove', move); el.removeEventListener('touchend', end); el.removeEventListener('touchcancel', end); };
  }, [ref]);
}

function Sparkline({data, width=130, height=26, color='var(--accent)'}){
  if(!data || data.length < 2) return <div style={{height}}></div>;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v,i)=> [ (i/(data.length-1))*width, height - 3 - ((v-min)/span)*(height-6) ]);
  const d = pts.map((p,i)=> (i?'L':'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow:'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/>
    </svg>
  );
}

// Big number field with − / + (tap the number to type)
function NumField({label, value, onChange, step=1, min=0, max=999, placeholder='—', decimals=false}){
  const num = parseFloat(value);
  const bump = (d) => {
    const base = isFinite(num) ? num : (parseFloat(placeholder) || 0);
    let next = Math.max(min, Math.min(max, Math.round((base + d)*100)/100));
    vibrate(8);
    onChange(String(next));
  };
  return (
    <div className="nf">
      <div className="k">{label}</div>
      <div className="ctl">
        <button className="pm" onClick={()=>bump(-step)} aria-label={`Less ${label}`}><Icon name="minus" size={18} stroke={2.2}/></button>
        <input type="text" inputMode={decimals ? 'decimal' : 'numeric'} value={value} placeholder={placeholder}
          style={{fontSize: String(value || placeholder || '').length >= 5 ? 23 : String(value || placeholder || '').length === 4 ? 27 : 30}}
          onChange={e=>onChange(e.target.value.replace(/[^0-9.,\-–]/g,'').replace(',', '.'))} onFocus={e=>e.target.select()}/>
        <button className="pm" onClick={()=>bump(step)} aria-label={`More ${label}`}><Icon name="plus" size={18} stroke={2.2}/></button>
      </div>
    </div>
  );
}

function Stepper({value, onChange, min=0, max=30}){
  return (
    <div className="stepper" onClick={e=>e.stopPropagation()}>
      <button onClick={()=>{ vibrate(8); onChange(Math.max(min, value-1)); }} aria-label="Fewer"><Icon name="minus" size={16} stroke={2.3}/></button>
      <span>{value}</span>
      <button onClick={()=>{ vibrate(8); onChange(Math.min(max, value+1)); }} aria-label="More"><Icon name="plus" size={16} stroke={2.3}/></button>
    </div>
  );
}

function Empty({icon='info', title, text}){
  return (
    <div className="empty">
      <div className="ei"><Icon name={icon} size={22}/></div>
      {title && <b>{title}</b>}
      {text}
    </div>
  );
}
const FEELS = [{value:'easy', label:'Easy'},{value:'solid', label:'Solid'},{value:'hard', label:'Hard'}];


/* =========================================================
   FORM CUES + FIGURES
   ========================================================= */
// Simple stick-figure pictograms by movement pattern (120×90 grid)
const FIGS = {
  press:   {h:[28,55], p:['M34 56L72 56','M72 56l12 10v12','M40 56V30','M28 30h24','M22 63h76','M30 63v12','M90 63v12']},
  pushup:  {h:[24,47], p:['M30 51L66 60L98 70','M33 52v24','M64 60l-2 16','M14 78h96']},
  ohp:     {h:[60,17], p:['M60 23v29','M60 52l-8 28','M60 52l8 28','M60 29l-13-6-2-15','M60 29l13-6 2-15','M34 8h52']},
  pullup:  {h:[60,25], p:['M18 8h84','M48 8l5 23','M72 8l-5 23','M60 31v27','M60 58l-6 13 6 12','M60 58l6 13-2 12']},
  hang:    {h:[60,25], p:['M18 8h84','M52 8l3 23','M68 8l-3 23','M60 31v28','M60 59l-3 24','M60 59l3 24']},
  hangraise:{h:[56,25], p:['M18 8h84','M50 8l3 23','M64 8l-3 23','M57 31v27','M57 58l26-2','M57 58l26 4']},
  row:     {h:[35,33], p:['M41 38L70 50','M70 50l-4 30','M70 50l6 30','M45 40l8 16 8-8','M55 52h8']},
  squat:   {h:[54,21], p:['M56 27l6 25','M62 52l18 4-4 24','M62 52l14 6-2 22','M57 32l23 2']},
  hinge:   {h:[33,30], p:['M39 34L72 41','M72 41v39','M72 41l4 39','M42 36l2 28','M32 64h24']},
  lunge:   {h:[58,14], p:['M58 20v28','M58 48l20 10v22','M58 48l-12 18-12 14','M58 26l-4 18','M58 26l4 18']},
  curl:    {h:[60,14], p:['M60 20v30','M60 50l-6 30','M60 50l6 30','M60 26l-2 17 11-12','M64 28h8','M60 26l3 20']},
  triceps: {h:[60,18], p:['M60 24v28','M60 52l-6 28','M60 52l6 28','M60 28l-7-17 10-6','M60 28l7-17-10-6']},
  dip:     {h:[60,22], p:['M60 28v28','M60 30l-12 10v6','M60 30l12 10v6','M38 47h20','M62 47h20','M60 56l-6 14 8 10']},
  core:    {h:[22,64], p:['M28 66l36 2','M64 68L86 40','M64 68L82 38','M32 66l14 6','M10 76h100']},
  bridge:  {h:[20,69], p:['M26 70L56 55','M56 55l18-4 6 23','M56 55l14 2 8 17','M10 76h100']},
  plank:   {h:[24,50], p:['M30 54L98 66','M33 56v16h14','M14 74h96']},
  jump:    {h:[60,12], p:['M60 18v26','M60 24L46 8','M60 24L74 8','M60 44l-10 14 8 10','M60 44l10 14-4 12','M40 86h40']},
  raise:   {h:[60,14], p:['M60 20v30','M60 50l-6 30','M60 50l6 30','M60 26L34 26','M60 26L86 26']},
  calf:    {h:[60,10], p:['M60 16v30','M60 46l-2 28 4 6','M60 46l2 28 4 6','M60 22l-6 18','M60 22l6 18','M44 82h32']},
  handstand:{h:[60,70], p:['M52 82l8-20 8 20','M60 62V34','M60 34l-4-26','M60 34l4-26','M42 84h36']},
  stretch: {h:[52,14], p:['M57 20q4 14 3 30','M60 50l-8 30','M60 50l8 30','M57 24L42 6','M58 26l8 16']},
};
const FORM_RULES = [
  // ---- specific matches first ----
  [/rear delt cable fly|face pull/i, 'raise', 'Rear delts · rotator cuff', ['Rope at face height, elbows high', 'Pull apart towards the ears, thumbs back', 'Pause and squeeze the upper back']],
  [/scapular pull/i, 'hang', 'Lower traps · lats · shoulder health', ['From a dead hang, arms stay straight', 'Pull the shoulders down away from the ears', 'Pause, then relax back into the hang']],
  [/chin-up top hold/i, 'pullup', 'Lats · biceps · grip', ['Pull up until the chin is over the bar', 'Hold with the chest up and shoulders down', 'Lower slowly when the time is up']],
  [/burpee|jump lunges|skater|tuck jumps|sprawl|squat thrust|plank jacks/i, 'jump', 'Full body · conditioning', ['Stay light on the feet', 'Land soft and keep moving', 'Keep form sharp even when tired']],
  [/plate front raise/i, 'raise', 'Front delts', ['Arms nearly straight, ribs down', 'Raise the plate to eye level', 'Lower slowly, no swinging']],
  [/plate overhead tricep/i, 'triceps', 'Triceps (long head)', ['Elbows pointing forward, close to the head', 'Lower the plate behind the head', 'Extend fully without the elbows flaring']],
  // ---- gym ----
  [/bench press.*drop|bench press.*back-off|barbell bench press/i, 'press', 'Chest · triceps · front delts', ['Shoulder blades squeezed back and down, feet planted', 'Lower the bar to mid-chest with elbows at about 45°', 'Drive up and slightly back over the shoulders']],
  [/incline dumbbell press/i, 'press', 'Upper chest · front delts · triceps', ['Bench at 30–45°, shoulder blades pinned', 'Lower the bells to the sides of the upper chest', 'Press up and in without clanging them together']],
  [/cable fly/i, 'raise', 'Upper chest', ['Slight bend in the elbows, locked in place', 'Sweep low to high, hands meeting at chin height', 'Control the stretch on the way back']],
  [/seated db shoulder press|shoulder press/i, 'ohp', 'Shoulders · triceps', ['Ribs down, glutes and core braced', 'Lower to ear height, forearms vertical', 'Press straight up, finishing over the shoulders']],
  [/lateral raise/i, 'raise', 'Side delts', ['Lead with the elbows, slight forward lean', 'Raise to shoulder height, no higher', '2 seconds down, no swinging']],
  [/face pull|rear delt cable fly/i, 'raise', 'Rear delts · rotator cuff', ['Rope at face height, elbows high', 'Pull apart towards the ears, thumbs back', 'Pause and squeeze the upper back']],
  [/band pull-apart/i, 'raise', 'Rear delts · upper back', ['Arms straight at shoulder height', 'Pull the band to the chest by squeezing the shoulder blades', 'Slow return, keep tension']],
  [/overhead (cable )?extension/i, 'triceps', 'Triceps (long head)', ['Elbows pointing forward, close to the head', 'Let the hands travel deep behind the head', 'Extend fully without the elbows flaring']],
  [/rope pushdown|pushdown/i, 'triceps', 'Triceps', ['Elbows pinned to the sides', 'Push down and split the rope at the bottom', 'Control back up to 90°']],
  [/kickback/i, 'triceps', 'Triceps', ['Upper arm parallel to the floor and still', 'Straighten the arm fully and squeeze', 'Slow return']],
  [/skull crusher/i, 'triceps', 'Triceps', ['Upper arms angled slightly back, fixed', 'Lower behind the head, not to the nose', 'Extend without flaring the elbows']],
  [/cable push-out/i, 'triceps', 'Triceps', ['Elbows tucked, slight forward lean', 'Push the handle forward and out to lockout', 'Pause, then control back']],
  [/pjr pullover/i, 'triceps', 'Triceps · lats', ['Lying, elbows tucked and pointed up', 'Lower the weight behind the head with a stretch', 'Pull over and extend to lockout']],
  [/bench dips? or bar dips|bar dips|bench dip|chair dips/i, 'dip', 'Triceps · chest', ['Shoulders down and back, chest proud', 'Lower until upper arms are parallel to the floor', 'Press to lockout without shrugging']],
  [/weighted pull-up|wide-grip pull-up|pull-ups?$|^pull-ups/i, 'pullup', 'Lats · upper back · biceps', ['Start from a dead hang, shoulders set down', 'Drive the elbows to the ribs, chest to the bar', 'Lower all the way under control']],
  [/neutral-grip pull-up/i, 'pullup', 'Lats · biceps', ['Palms facing, shoulders packed', 'Pull until the chin clears the bar', 'Full hang between reps']],
  [/chin-up negatives|chin-up/i, 'pullup', 'Lats · biceps', ['Palms towards you, shoulder width', 'Chest up to the bar, elbows down and in', 'Lower slowly to a full hang']],
  [/archer pull-up/i, 'pullup', 'Lats · biceps', ['Wide grip; pull towards one hand', 'The other arm stays near straight as an assist', 'Lower slowly, alternate sides']],
  [/bent-over barbell row/i, 'row', 'Mid back · lats · rear delts', ['Hinge to about 45°, flat back, braced', 'Row the bar to the lower ribs', 'Pause and lower with control']],
  [/pendlay row/i, 'row', 'Upper back · lats', ['Torso near parallel, weights start from the floor', 'Explode up to the ribs', 'Reset at the bottom each rep']],
  [/chest-supported db row/i, 'row', 'Mid back · rear delts', ['Chest glued to the bench', 'Pull the elbows back and squeeze the blades', 'Slow lower to a full stretch']],
  [/single-arm db row/i, 'row', 'Lats · mid back', ['Knee and hand on the bench, flat back', 'Pull the dumbbell to the hip, not the chest', 'Full stretch at the bottom']],
  [/superman lat pulls/i, 'row', 'Lats · upper back', ['Face down, arms overhead, chest slightly lifted', 'Pull the elbows down to the ribs', 'Squeeze, then reach back out']],
  [/incline db curl/i, 'curl', 'Biceps (long head)', ['Bench at 45°, arms hanging straight', 'Curl without moving the elbows forward', 'Lower fully into the stretch']],
  [/hammer curl/i, 'curl', 'Brachialis · forearms', ['Thumbs up, elbows by the sides', 'Curl to shoulder height', 'No swinging, slow down']],
  [/preacher curl/i, 'curl', 'Biceps (short head)', ['Armpits snug to the pad', 'Lower until nearly straight', 'Squeeze hard at the top']],
  [/cross-body.*curl/i, 'curl', 'Brachialis · forearms', ['Curl across the body towards the opposite shoulder', 'Palm facing down or in, elbow fixed', 'Control the lowering']],
  [/dumbbell curl|incline position|standing position|peak position|plate curl/i, 'curl', 'Biceps', ['Elbows fixed by the sides', 'Supinate (turn the pinkie up) as you curl', 'Lower with control']],
  [/forearm|wrist roller|plate pinch|plate twist|plate halo|plate front raise|plate overhead/i, 'curl', 'Forearms · grip · shoulders', ['Move slowly and stay tall', 'Keep a tight grip throughout', 'Breathe, no rushing']],
  [/back squat/i, 'squat', 'Quads · glutes · core', ['Big breath and brace before each rep', 'Knees track over the toes, chest up', 'Hit depth, then drive the floor away']],
  [/romanian deadlift/i, 'hinge', 'Hamstrings · glutes', ['Soft knees, push the hips back', 'Bar slides down the thighs, back flat', 'Stop at the hamstring stretch, squeeze glutes up']],
  [/bulgarian split squat/i, 'lunge', 'Quads · glutes', ['Rear foot on the bench, front foot well forward', 'Drop straight down, front knee over the toes', 'Drive through the front heel']],
  [/nordic/i, 'hinge', 'Hamstrings', ['Ankles anchored, hips straight', 'Lower as slowly as you can', 'Catch yourself and push back up']],
  [/leg press/i, 'squat', 'Glutes · hamstrings · quads', ['Feet high and shoulder width on the platform', 'Lower until the hips just start to tuck', 'Press through the heels, don\'t lock the knees']],
  [/walking lunge|reverse lunges|lunges?$/i, 'lunge', 'Quads · glutes', ['Long stride, torso upright', 'Back knee kisses the floor', 'Push off the front heel']],
  [/single-leg calf|calf raise|seated calf/i, 'calf', 'Calves', ['Full stretch at the bottom, pause', 'Rise as high as possible onto the big toe', 'Slow 2-second lower']],
  [/tibialis/i, 'calf', 'Shins (tibialis)', ['Back against a wall, heels forward', 'Pull the toes up as high as you can', 'Lower slowly']],
  [/squat jump|jump squats/i, 'jump', 'Legs · power', ['Quarter-squat, arms back', 'Explode up through the toes', 'Land soft, knees bent, straight into the next']],
  [/glute bridge|bridge hold|single-leg glute/i, 'bridge', 'Glutes · hamstrings', ['Heels close to the hips, ribs down', 'Drive the hips up and squeeze the glutes', 'Pause at the top, don\'t arch the back']],
  [/band walk/i, 'squat', 'Glute medius', ['Band above the knees, half squat', 'Step wide, keep tension the whole time', 'Don\'t let the knees cave']],
  // ---- calisthenics ----
  [/pike push-up/i, 'ohp', 'Shoulders · triceps', ['Hips high, an upside-down V', 'Lower the head in front of the hands (a tripod)', 'Press back up through the shoulders']],
  [/archer press-up/i, 'pushup', 'Chest · triceps (one side)', ['Wide hands; shift your weight to one arm', 'The straight arm only assists', 'Alternate sides, body rigid']],
  [/decline press-up/i, 'pushup', 'Upper chest · shoulders', ['Feet on the chair, body straight', 'Chest towards the floor between the hands', 'Full lockout at the top']],
  [/diamond|close-grip press/i, 'pushup', 'Triceps · inner chest', ['Hands together under the chest', 'Elbows brush the ribs on the way down', 'Lock out fully']],
  [/clap|explosive press/i, 'pushup', 'Chest · power', ['Fast push to leave the floor', 'Land with soft elbows', 'Reset the plank each rep']],
  [/plank to press-up/i, 'plank', 'Core · triceps · shoulders', ['From forearms up to hands, one arm at a time', 'Keep the hips level, no rocking', 'Alternate the leading arm']],
  [/press-ups?$|press-up to downward|incline press-ups|scapular press|^push-up|^press-ups|^press-up/i, 'pushup', 'Chest · triceps · core', ['Hands under the shoulders, body in one straight line', 'Elbows about 45° from the body', 'Chest to an inch off the floor, full lockout']],
  [/planche lean/i, 'pushup', 'Shoulders · core · wrists', ['Plank with fingers pointing back or out', 'Lean the shoulders well past the hands', 'Arms locked, protract (push the floor away)']],
  [/crow/i, 'pushup', 'Wrists · shoulders · core', ['Knees high on the backs of the upper arms', 'Lean forward until the feet float', 'Look slightly ahead, not down']],
  [/handstand|wall walk|kick-up|shoulder taps.*wall|wall handstand/i, 'handstand', 'Shoulders · core · balance', ['Hands shoulder width, fingers spread', 'Push tall through the shoulders, ribs in', 'Squeeze the glutes and point the toes']],
  [/front lever/i, 'hangraise', 'Lats · core', ['Arms straight, shoulders pulled down', 'Tuck the knees to the chest, hips up level', 'Hold the body parallel to the floor']],
  [/hanging hollow|chin-up top hold/i, 'hang', 'Lats · core · grip', ['Shoulders engaged, not shrugged', 'Hold a tight hollow position', 'Breathe and keep still']],
  [/toes-to-bar|hanging (leg|knee) raises/i, 'hangraise', 'Lower abs · hip flexors · grip', ['Shoulders active, no big swing', 'Curl the pelvis up as the legs rise', 'Lower slowly to stop the swing']],
  [/dead hang|active hang|scapular pull/i, 'hang', 'Grip · shoulders · decompression', ['Full grip, thumbs around the bar', 'Active: pull the shoulders away from the ears', 'Relax the legs, breathe steadily']],
  [/straight-arm lat pulldown/i, 'raise', 'Lats', ['Arms straight, slight forward hinge', 'Sweep the bar down to the thighs', 'Squeeze the lats, control up']],
  [/box pistol|pistol/i, 'squat', 'Quads · glutes · balance', ['One leg out in front, sit back to the chair', 'Touch down lightly, don\'t collapse', 'Drive up through the whole foot']],
  [/cossack/i, 'lunge', 'Adductors · glutes · quads', ['Wide stance, sit into one hip', 'Other leg straight, toes up', 'Chest up, heel stays down']],
  [/wall sit/i, 'squat', 'Quads', ['Back flat on the wall', 'Thighs parallel, knees over the ankles', 'Breathe and hold']],
  [/towel slide leg curl/i, 'bridge', 'Hamstrings', ['Bridge up with heels on a towel', 'Slide the heels out slowly, hips high', 'Curl back in with the hamstrings']],
  [/jump lunges|skater|tuck jumps|burpee|sprawl|squat thrust|jumping jacks|high knees|plank jacks/i, 'jump', 'Full body · conditioning', ['Stay light on the feet', 'Land soft and keep moving', 'Keep form sharp even when tired']],
  [/mountain climbers|bear crawl|shoulder taps/i, 'plank', 'Core · shoulders', ['Hips level with the shoulders', 'Brace the abs, move quietly', 'Steady rhythm, no hip sway']],
  [/side plank/i, 'plank', 'Obliques · glutes', ['Elbow under the shoulder', 'Hips high, body in a straight line', 'Squeeze the glutes']],
  [/^plank|plank/i, 'plank', 'Core', ['Elbows under the shoulders', 'Squeeze the glutes, tuck the pelvis', 'Straight line from head to heels']],
  [/hollow|v-ups|lying leg raises|dead bug|bicycle|russian twist|bird dog/i, 'core', 'Abs · core', ['Lower back pressed into the floor', 'Move slowly and breathe out on effort', 'Stop before the back arches']],
  [/l-sit|compression/i, 'core', 'Hip flexors · abs · triceps', ['Push the floor (or chairs) away hard', 'Lift the knees or legs, toes pointed', 'Shoulders down, chest up']],
  [/superman hold|y-t-w|prone/i, 'core', 'Upper back · lower back', ['Face down, squeeze the glutes', 'Lift the chest and arms a few centimetres', 'Neck long, look at the floor']],
  [/jefferson curl/i, 'hinge', 'Spine mobility · hamstrings', ['Bodyweight only, very slow', 'Roll down one vertebra at a time', 'Roll back up, head last']],
  [/bodyweight squats|squat hold|deep squat|squat to stand/i, 'squat', 'Legs · hips', ['Feet shoulder width, toes slightly out', 'Sit between the heels, chest up', 'Heels stay down']],
  [/stretch|pose|fold|breath|circles|swings|rocks|cat-cow|world|supine twist|90\/90|pigeon|frog|thoracic|wall slides|wall angels|inchworm|arm swings|down-dog|leg swings|hip circles|wrist/i, 'stretch', 'Mobility', ['Move slowly and breathe', 'Ease into range, never force it', 'Stay relaxed in the position']],
];
function formFor(name){
  const n = String(name||'');
  for(const [re, fig, muscles, cues] of FORM_RULES){ if(re.test(n)) return {fig, muscles, cues}; }
  return {fig:'stretch', muscles:'Full body', cues:['Control every rep', 'Full range of motion', 'Stop a rep short of form breaking down']};
}
function FormFigure({fig, size=120}){
  const f = FIGS[fig] || FIGS.stretch;
  return (
    <svg width={size} height={size*0.75} viewBox="0 0 120 90" aria-hidden="true">
      <circle cx={f.h[0]} cy={f.h[1]} r="5.5" fill="var(--accent)"/>
      {f.p.map((d,i)=>{ const prop = /^M[\d.]+ [\d.]+(h[\d.]+|H[\d.]+|v12)$/.test(d); return <path key={i} d={d} fill="none" stroke={prop ? 'var(--t3)' : 'var(--accent)'} strokeWidth={prop ? 3 : 4.2} strokeLinecap="round" strokeLinejoin="round" opacity={prop ? 0.7 : 1}/>; })}
    </svg>
  );
}
function FormSheet({name, target, onClose}){
  const f = formFor(name);
  return (
    <Sheet title={name} onClose={onClose} actions={(close)=><button className="btn btn-ghost" onClick={close}>Got it</button>}>
      <div className="form-hero">
        <FormFigure fig={f.fig} size={150}/>
        <div className="form-meta">
          <div className="eyebrow">Works</div>
          <b>{f.muscles}</b>
          {target && <span className="pill accent num" style={{marginTop:8}}>{target}</span>}
        </div>
      </div>
      <div className="flabel" style={{marginTop:18}}>Form cues</div>
      <div className="card list" style={{boxShadow:'none'}}>
        {f.cues.map((c,i)=>(
          <div className="row" key={i}>
            <span className="badge num">{i+1}</span>
            <div className="grow" style={{fontSize:15, fontWeight:500, lineHeight:1.35}}>{c}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
function FormBtn({onClick}){
  return <button className="cbtn sm form-btn" onClick={e=>{ e.stopPropagation(); onClick(); }} aria-label="Form cues"><Icon name="info" size={16}/></button>;
}


/* =========================================================
   FINISH SUMMARY (+ share image)
   ========================================================= */
function drawShareImage(d){
  const W = 1080, H = 1350, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  const F = '-apple-system, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif';
  const FR = 'ui-rounded, "SF Pro Rounded", -apple-system, "Inter", Arial, sans-serif';
  const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#181B21'); g.addColorStop(1,'#0B0C0F');
  x.fillStyle = g; x.fillRect(0,0,W,H);
  const rg = x.createRadialGradient(W*0.8, 160, 0, W*0.8, 160, 520); rg.addColorStop(0,'rgba(76,125,255,0.30)'); rg.addColorStop(1,'rgba(76,125,255,0)');
  x.fillStyle = rg; x.fillRect(0,0,W,H);
  const rr = (X,Y,w,h,r) => { x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); };
  // brand
  x.fillStyle = '#F5F6F8'; x.font = `700 34px ${F}`; x.textBaseline = 'alphabetic';
  x.fillText('DBS PPL', 80, 120); const bw = x.measureText('DBS PPL').width; x.fillStyle = '#7EA2FF'; x.fillText('X', 80+bw, 120);
  x.fillStyle = '#9BA1AD'; x.font = `500 30px ${F}`; x.textAlign = 'right'; x.fillText(d.date, W-80, 120); x.textAlign = 'left';
  // ring
  x.lineWidth = 22; x.lineCap = 'round';
  x.strokeStyle = 'rgba(255,255,255,0.08)'; x.beginPath(); x.arc(W-190, 290, 80, 0, Math.PI*2); x.stroke();
  const ring = x.createLinearGradient(W-270, 210, W-110, 370); ring.addColorStop(0,'#8FB0FF'); ring.addColorStop(1,'#3D6BFF');
  x.strokeStyle = ring; x.beginPath(); x.arc(W-190, 290, 80, -Math.PI/2, Math.PI*1.5); x.stroke();
  x.strokeStyle = '#fff'; x.lineWidth = 16; x.beginPath(); x.moveTo(W-225, 292); x.lineTo(W-200, 318); x.lineTo(W-152, 264); x.stroke();
  // titles
  x.fillStyle = '#9BA1AD'; x.font = `600 30px ${F}`; x.fillText(d.eyebrow.toUpperCase(), 80, 250);
  x.fillStyle = '#F5F6F8'; x.font = `700 78px ${F}`;
  const words = d.title.split(' '); let line = '', y = 340;
  words.forEach(wd=>{ const t = line ? line+' '+wd : wd; if(x.measureText(t).width > 700 && line){ x.fillText(line, 80, y); y += 86; line = wd; } else line = t; });
  x.fillText(line, 80, y);
  x.fillStyle = '#9BA1AD'; x.font = `500 32px ${F}`; x.fillText(d.subtitle || '', 80, y+56);
  // stats grid
  const top = Math.max(y + 110, 470), gw = (W-160-24)/2, gh = 190;
  d.stats.slice(0,4).forEach((s,i)=>{
    const X = 80 + (i%2)*(gw+24), Y = top + Math.floor(i/2)*(gh+24);
    rr(X,Y,gw,gh,36); x.fillStyle = '#16181C'; x.fill(); x.strokeStyle = 'rgba(255,255,255,0.06)'; x.lineWidth = 2; x.stroke();
    x.fillStyle = '#F5F6F8'; x.font = `600 76px ${FR}`; x.fillText(String(s.v), X+36, Y+110);
    const vw = x.measureText(String(s.v)).width;
    if(s.u){ x.fillStyle = '#626875'; x.font = `500 32px ${F}`; x.fillText(s.u, X+44+vw, Y+110); }
    x.fillStyle = '#9BA1AD'; x.font = `500 30px ${F}`; x.fillText(s.l, X+36, Y+155);
  });
  // highlights
  let hy = top + 2*(gh+24) + 40;
  (d.highlights||[]).slice(0,3).forEach(h=>{
    rr(80, hy, W-160, 96, 28); x.fillStyle = h.tone==='gold' ? 'rgba(255,159,10,0.13)' : 'rgba(76,125,255,0.13)'; x.fill();
    x.fillStyle = h.tone==='gold' ? '#FFB340' : '#9DB9FF'; x.font = `600 32px ${F}`;
    let t = h.text; while(x.measureText(t).width > W-240 && t.length > 4) t = t.slice(0,-2);
    if(t !== h.text) t = t.trim()+'…';
    x.fillText(t, 116, hy+60); hy += 116;
  });
  x.fillStyle = '#626875'; x.font = `600 26px ${F}`; x.textAlign = 'center'; x.fillText('TRAINED WITH DBS PPLX', W/2, H-70);
  return c;
}
async function shareSummary(d, setToast){
  try{
    const canvas = drawShareImage(d);
    const blob = await new Promise(res=> canvas.toBlob(res, 'image/png'));
    const name = `dbs-pplx-${dayKey(new Date())}.png`;
    const file = new File([blob], name, {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({files:[file], title:d.title});
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
    setToast && setToast('Image saved', 'download');
  }catch(e){ if(e && e.name==='AbortError') return; setToast && setToast('Could not create the image', 'close'); }
}

function SummaryOverlay({data, onClose, setToast}){
  const [closing, setClosing] = useState(false);
  useEffect(()=>{ playBeep(); vibrate([40,60,90]); const prev = document.body.style.overflow; document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow = prev; }; }, []);
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  return (
    <div className={`summary ${closing?'closing':''}`} style={{'--c':data.color || 'var(--accent)'}}>
      <div className="summary-in">
        <div className="sum-ring">
          <Ring size={128} stroke={12} pct={1} gradient>
            <svg width="52" height="52" viewBox="0 0 24 24" className="sum-check"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--text)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Ring>
        </div>
        <div className="sum-eyebrow eyebrow" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:7}}><span className="dot"></span>{data.eyebrow}</div>
        <h1 className="sum-title">{data.title}</h1>
        {data.subtitle && <div className="sum-sub">{data.subtitle}</div>}
        <div className="sum-grid">
          {data.stats.map((s,i)=>(
            <div key={i} className="card sum-stat" style={{animationDelay:`${0.25+i*0.07}s`}}>
              <div className="v num">{s.v}{s.u && <small>{s.u}</small>}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
        {data.compare && <div className={`sum-compare ${data.compare.tone||''}`}><Icon name={data.compare.tone==='up' ? 'push' : data.compare.tone==='down' ? 'pull' : 'chart'} size={16} stroke={2.2}/>{data.compare.text}</div>}
        {(data.highlights||[]).length>0 && (
          <div className="sum-hl">
            {data.highlights.map((h,i)=>(
              <div key={i} className={`sum-h ${h.tone||''}`} style={{animationDelay:`${0.5+i*0.08}s`}}><Icon name={h.icon||'check'} size={17}/>{h.text}</div>
            ))}
          </div>
        )}
      </div>
      <div className="summary-actions">
        <button className="btn btn-ghost" onClick={()=>shareSummary(data, setToast)}><Icon name="upload" size={18}/>Share</button>
        <button className="btn btn-primary" onClick={close}>Done</button>
      </div>
    </div>
  );
}

/* =========================================================
   WEEKLY CHECK-IN
   ========================================================= */
function weekStart(d){ const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - ((x.getDay()+6)%7)); return x; }
function computeCheckin(d){
  const thisMon = weekStart(new Date());
  const start = new Date(thisMon); start.setDate(start.getDate()-7);
  const prevStart = new Date(start); prevStart.setDate(prevStart.getDate()-7);
  const inR = (date, a, b) => { const t = new Date(date).getTime(); return t >= a.getTime() && t < b.getTime(); };
  const gym = d.completions.filter(c=>inR(c.date, start, thisMon));
  const gymPrev = d.completions.filter(c=>inR(c.date, prevStart, start));
  const vol = gym.reduce((s,c)=>s+(c.volume||0),0), volPrev = gymPrev.reduce((s,c)=>s+(c.volume||0),0);
  const cali = d.caliLog.filter(c=>isCali(c) && inR(c.date, start, thisMon));
  const prsWeek = Object.values(d.prs||{}).filter(p=>p && p.date && inR(p.date, start, thisMon));
  const cardio = d.cardioLog.filter(c=>inR(c.date, start, thisMon)).reduce((s,e)=>s+(Number(e.duration)||0),0);
  const stretch = d.stretchLog.filter(c=>inR(c.date, start, thisMon)).reduce((s,e)=>s+(Number(e.duration)||0),0);
  const fasts = d.fastHistory.filter(f=>f.completed && inR(f.end || f.start, start, thisMon)).length;
  const sorted = [...d.stats].sort((a,b)=> new Date(a.date)-new Date(b.date));
  const lastIn = sorted.filter(s=>inR(s.date, start, thisMon)).pop();
  const lastBefore = sorted.filter(s=>new Date(s.date) < start).pop();
  const wDelta = lastIn && lastBefore ? lastIn.weight - lastBefore.weight : null;
  // Plateau check on each session's main lift: last 3 logged weeks without a heavier top set
  const plateaus = [];
  SESSIONS.forEach(s=>{
    const ex = s.groups[0].exercises[0];
    const tops = [];
    for(let w=1; w<=TOTAL_WEEKS; w++){
      const e = d.logs[`w${w}_${s.id}_0_0`];
      const t = entryVolume(e, ex).top;
      if(t!=null) tops.push(t);
    }
    const last3 = tops.slice(-3);
    if(last3.length===3 && last3[2] <= last3[0]) plateaus.push({name:(d.swaps||{})[`${s.id}_0_0`] || ex.name, top:last3[2]});
  });
  const tips = [];
  if(plateaus.length>=2) tips.push({icon:'reset', tone:'gold', title:'Take a lighter week', text:'Two main lifts have stalled. Keep every session but drop one set per exercise and use about 10% less weight, then push again next week.'});
  else if(plateaus.length===1) tips.push({icon:'chart', tone:'gold', title:`${plateaus[0].name} has stalled`, text:`No heavier top set in 3 sessions (stuck at ${plateaus[0].top} kg). Add a rep per set before adding weight, or rest a little longer between sets.`});
  if(gym.length < 3) tips.push({icon:'dumbbell', title:'Hit all three', text:`${gym.length} of 3 PPL sessions last week. Get Push, Pull and Legs in this week.`});
  if(volPrev>0 && vol > volPrev*1.03) tips.push({icon:'push', title:'Volume is climbing', text:`Up ${Math.round((vol/volPrev-1)*100)}% on the week before. Keep it steady and sleep well.`});
  if(cali.length >= 5) tips.push({icon:'flame', title:'Great daily consistency', text:`${cali.length} calisthenics sessions last week.`});
  if(!tips.length) tips.push({icon:'check', title:'Steady week', text:'Nothing flagged. Keep stacking sessions.'});
  const fmtR = (a,b) => `${a.toLocaleDateString('en-GB',{day:'numeric', month:'short'})} – ${b.toLocaleDateString('en-GB',{day:'numeric', month:'short'})}`;
  const endShow = new Date(thisMon); endShow.setDate(endShow.getDate()-1);
  return {key:dayKey(thisMon), range:fmtR(start, endShow), gym:gym.length, vol, volPrev, volPct: volPrev>0 ? Math.round((vol/volPrev-1)*100) : null,
    cali:cali.length, prs:prsWeek, cardio, stretch, fasts, wDelta, plateaus, tips,
    any: gym.length + cali.length + cardio + stretch + fasts > 0 || prsWeek.length>0};
}
function CheckinCard({ci, onOpen, onDismiss}){
  return (
    <div className="card checkin press" onClick={onOpen} role="button">
      <div className="hero-top">
        <span className="eyebrow" style={{display:'flex', alignItems:'center', gap:7}}><Icon name="calendar" size={14}/>Weekly check-in</span>
        <button className="cbtn sm" onClick={e=>{ e.stopPropagation(); onDismiss(); }} aria-label="Dismiss"><Icon name="close" size={14} stroke={2.4}/></button>
      </div>
      <div className="ck-title">{ci.range}</div>
      <div className="stats c3" style={{marginTop:10}}>
        <Stat value={`${ci.gym}/3`} label="Gym"/>
        <Stat value={ci.volPct!=null ? fmtSigned(ci.volPct,0) : (ci.vol>=1000 ? (ci.vol/1000).toFixed(1) : Math.round(ci.vol))} unit={ci.volPct!=null ? '%' : (ci.vol>=1000?'t':'kg')} label="Volume"/>
        <Stat value={ci.prs.length} label={ci.prs.length===1 ? 'Record' : 'Records'}/>
      </div>
      <div className="ck-tip"><Icon name={ci.tips[0].icon} size={15}/>{ci.tips[0].title}<Icon name="chevronRight" size={14} stroke={2.2}/></div>
    </div>
  );
}
function CheckinSheet({ci, unit, onClose}){
  return (
    <Sheet title="Weekly check-in" onClose={onClose} actions={(close)=><button className="btn btn-primary" onClick={close}>Let's go</button>}>
      <div className="t2" style={{margin:'-8px 2px 14px', fontSize:14}}>{ci.range}</div>
      <div className="card pad" style={{background:'var(--s2)', boxShadow:'none', border:'none'}}>
        <div className="stats c3">
          <Stat value={`${ci.gym}/3`} label="Gym sessions"/>
          <Stat value={ci.cali} label="Daily sessions"/>
          <Stat value={ci.vol>=1000 ? (ci.vol/1000).toFixed(1) : Math.round(ci.vol)} unit={ci.vol>=1000?'t':'kg'} label="Volume"/>
        </div>
        <div className="stats c3" style={{marginTop:14}}>
          <Stat value={ci.cardio} unit="min" label="Cardio"/>
          <Stat value={ci.fasts} label="Fasts hit"/>
          <Stat value={ci.wDelta!=null ? fmtSigned(kgToUnit(ci.wDelta, unit)) : '—'} unit={ci.wDelta!=null ? unit : ''} label="Weight"/>
        </div>
      </div>
      {ci.volPct!=null && <div className={`sum-compare ${ci.volPct>=0?'up':'down'}`} style={{marginTop:12}}><Icon name={ci.volPct>=0?'push':'pull'} size={16} stroke={2.2}/>Volume {ci.volPct>=0?'up':'down'} {Math.abs(ci.volPct)}% on the week before</div>}
      {ci.prs.length>0 && (
        <React.Fragment>
          <div className="flabel" style={{marginTop:18}}>New records</div>
          <div className="card list" style={{boxShadow:'none'}}>
            {ci.prs.map((p,i)=>(
              <div className="row" key={i}><span className="ico" style={{color:'var(--orange)', background:'var(--orange-soft)'}}><Icon name="trophy" size={16}/></span><div className="grow"><div className="t" style={{fontSize:15}}>{p.name}</div><div className="s">{p.weight} kg × {p.reps}</div></div><span className="num" style={{fontWeight:600}}>{Math.round(p.est1RM)} kg</span></div>
            ))}
          </div>
        </React.Fragment>
      )}
      <div className="flabel" style={{marginTop:18}}>Coach notes</div>
      {ci.tips.map((t,i)=>(
        <div key={i} className={`tip ${t.tone||''}`}><span className="ti"><Icon name={t.icon} size={16}/></span><div><b>{t.title}</b><span>{t.text}</span></div></div>
      ))}
    </Sheet>
  );
}


/* ================= CALISTHENICS HELPERS ================= */
const isMorningV2 = (x) => !!x && x.v===2;
const isCali = (x) => !!x && x.v===3;
function caliDayIndex(d){ return (new Date(d).getDay()+6)%7; } // Mon=0 … Sun=6
function caliWeekIndex(d){
  const a = new Date(CALI_ANCHOR+'T00:00:00');
  const x = new Date(d); x.setHours(0,0,0,0);
  const w = Math.floor(Math.round((x - a)/864e5)/7);
  return ((w % 3) + 3) % 3;
}
function caliSession(focusId, vi){
  const focus = CALI_FOCUS.find(f=>f.id===focusId) || CALI_FOCUS[0];
  const v = focus.variants[vi] || focus.variants[0];
  return {focus, vi, v};
}
function caliFor(d){ const f = CALI_FOCUS[caliDayIndex(d)]; return caliSession(f.id, caliWeekIndex(d)); }
function caliScale(ex, level){
  const L = level||0;
  return ex.reps!=null ? {...ex, reps:Math.ceil(ex.reps*(1+0.1*L))} : {...ex, secs:ex.secs + 5*L};
}
function exTarget(ex){ return ex.reps!=null ? `${ex.reps}${ex.each?' each':''}` : `${ex.secs}s${ex.each?' each':''}`; }
function mainLine(v){ return v.main.format==='emom' ? `EMOM · ${v.main.minutes} min` : `${v.main.rounds} rounds · rest ${v.main.rest}s`; }
function morningStreak(log){
  const days = new Set(log.map(e=>dayKey(e.date)));
  const d = new Date();
  if(!days.has(dayKey(d))) d.setDate(d.getDate()-1);
  let n = 0;
  while(days.has(dayKey(d))){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function caliPB(log, finId){
  return log.filter(e=>isCali(e) && e.finisher && e.finisher.id===finId && e.finisher.value!=null)
    .reduce((m,e)=> m==null ? e.finisher.value : Math.max(m, e.finisher.value), null);
}
function caliWeekDates(ref){
  const d = new Date(ref); d.setHours(0,0,0,0);
  d.setDate(d.getDate() - caliDayIndex(d));
  return Array.from({length:7}, (_,i)=>{ const x = new Date(d); x.setDate(d.getDate()+i); return x; });
}
// Which session the Today hero shows: an in-progress/swapped one from today, else the calendar slot
function caliToday(active){
  const today = dayKey(new Date());
  const activeToday = isCali(active) && active.date===today && (active.startedAt || active.chosen);
  const sess = activeToday ? caliSession(active.focusId, active.vi) : caliFor(new Date());
  return {...sess, started: activeToday && !!active.startedAt, activeToday};
}

/* ================= ACTIVITY (for rings / streaks) ================= */
function activityByDay(d){
  const m = {};
  const add = (date, pts) => { const k = dayKey(date); m[k] = (m[k]||0) + pts; };
  (d.completions||[]).forEach(c=>add(c.date, 1));
  (d.caliLog||[]).forEach(c=>add(c.date, 1));
  (d.morningLog||[]).forEach(c=>add(c.date, 1));
  (d.cardioLog||[]).forEach(c=>add(c.date, 0.5));
  (d.stretchLog||[]).forEach(c=>add(c.date, 0.5));
  return m;
}
function activityStreak(map){
  const d = new Date();
  if(!map[dayKey(d)]) d.setDate(d.getDate()-1);
  let n = 0;
  while(map[dayKey(d)]){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function bestActivityStreak(map){
  const keys = Object.keys(map).sort();
  let best = 0, run = 0, prev = null;
  keys.forEach(k=>{
    const t = new Date(k+'T12:00:00').getTime();
    run = (prev!=null && Math.round((t-prev)/864e5)===1) ? run+1 : 1;
    best = Math.max(best, run); prev = t;
  });
  return best;
}

/* ================= TODAY ================= */
function Today(p){
  const {week, completions, caliActive, caliLog, caliPlan, morningLog, cardioLog, stretchLog, stats, height, unit, fast,
    onOpenCali, onOpenSession, onTab, onOpenBodyStats, onOpenFasting, logs, prs, swaps, fastHistory} = p;
  const [seenCheckin, setSeenCheckin] = usePersisted('ftx_checkinSeen', '');
  const [showCheckin, setShowCheckin] = useState(false);
  const ci = useMemo(()=> computeCheckin({completions, caliLog, prs, cardioLog, stretchLog, fastHistory, stats, logs, swaps}), [completions, caliLog, prs, cardioLog, stretchLog, fastHistory, stats, logs, swaps]);
  const showCiCard = ci.any && seenCheckin !== ci.key;
  const now = new Date();
  const {focus, vi, v, started} = caliToday(caliActive);
  const level = (caliPlan.levels||{})[focus.id] || 0;
  const exs = v.main.exercises.map(ex=>caliScale(ex, level));
  const todaysCali = caliLog.filter(e=>isCali(e) && dayKey(e.date)===dayKey(now));
  const doneCali = todaysCali.length>0 && !started;
  const pb = v.finisher ? caliPB(caliLog, v.finisher.id) : null;
  const act = activityByDay({completions, caliLog, morningLog, cardioLog, stretchLog});
  const streak = activityStreak(act);
  const best = bestActivityStreak(act);
  const thisWeekCount = Object.entries(act).filter(([k])=>{ const dd = new Date(k+'T12:00:00'); return (now - dd) < 7*864e5 && (now - dd) >= -864e5; }).length;

  const last7 = Array.from({length:7}, (_,i)=>{ const d = new Date(now); d.setDate(now.getDate()-(6-i)); return d; });
  const doneFor = (id) => completions.some(c=>c.sessionId===id && c.week===week);
  const lastFor = (id) => { const l = completions.filter(c=>c.sessionId===id); return l.length ? l[l.length-1].date : null; };

  const sorted = [...stats].sort((a,b)=> new Date(a.date)-new Date(b.date));
  const latest = sorted[sorted.length-1];
  const monthAgo = Date.now() - 30*864e5;
  const base = sorted.find(s=> new Date(s.date).getTime() >= monthAgo) || sorted[0];
  const wChange = latest && base && latest!==base ? kgToUnit(latest.weight - base.weight, unit) : null;
  const bfList = sorted.filter(s=>s.bodyFat!=null);
  const bfLatest = bfList[bfList.length-1];
  const bfBase = bfList.find(s=> new Date(s.date).getTime() >= monthAgo) || bfList[0];
  const bfChange = bfLatest && bfBase && bfLatest!==bfBase ? bfLatest.bodyFat - bfBase.bodyFat : null;
  const fastNow = useNow(!!fast);
  const fastEl = fast ? Math.max(0, (fastNow - new Date(fast.startTime).getTime())/1000) : 0;

  return (
    <div className="screen anim-tab">
      <TopBar title="Today" fadeTitle/>
      <div className="stagger">
        <div className="large">
          <div>
            <div className="eyebrow">{now.toLocaleDateString('en-GB',{weekday:'long', day:'numeric', month:'long'})}</div>
            <h1>Today</h1>
          </div>
          <button className="avatar press" onClick={()=>onTab('you')} aria-label="You">D</button>
        </div>

        {showCiCard && <div style={{marginTop:16}}><CheckinCard ci={ci} onOpen={()=>setShowCheckin(true)} onDismiss={()=>{ vibrate(8); setSeenCheckin(ci.key); }}/></div>}

        <div className="card hero hero-card">
          <div className="hero-top">
            <span className="eyebrow" style={{display:'flex', alignItems:'center', gap:7, '--c':focus.color}}><span className="dot"></span>Daily calisthenics · {focus.name}</span>
            <span className="pill accent">Week {CALI_VARIANTS[vi]}</span>
          </div>
          <h2>{v.title}</h2>
          <div className="sub">{focus.blurb}</div>
          <div className="hero-meta">
            <div><b className="num">{v.main.format==='emom' ? v.main.minutes : v.main.rounds}</b>{v.main.format==='emom' ? 'min EMOM' : 'rounds'}</div>
            <div><b className="num">{v.main.format==='emom' ? '~24' : '~22'}</b>min total</div>
            <div><b className="num">{level}</b>level</div>
            <div><b className="num">{pb!=null ? pb : '—'}</b>{v.finisher ? (v.finisher.unit==='secs' ? 'PB secs' : 'PB reps') : 'no test'}</div>
          </div>
          <div className="chips">{exs.map((ex,i)=><span key={i}>{ex.name.replace(/ \(.*\)/,'')} {exTarget(ex)}</span>)}</div>
          {doneCali && (
            <div className="done-banner"><Icon name="check" size={18} stroke={2.6}/>Done today · {todaysCali[todaysCali.length-1].totalReps} reps</div>
          )}
          <button className={`btn ${doneCali ? 'btn-ghost' : 'btn-primary'}`} onClick={onOpenCali}>
            {doneCali ? <React.Fragment><Icon name="calendar" size={17}/>See the week</React.Fragment>
              : <React.Fragment><Icon name="play" size={15}/>{started ? 'Continue session' : 'Start session'}</React.Fragment>}
          </button>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Last 7 days</h3><button className="link" onClick={()=>onTab('progress')}>Week {week} of {TOTAL_WEEKS}</button></div>
          <div className="card week7">
            {last7.map((d,i)=>{
              const k = dayKey(d);
              const val = Math.min(1, act[k]||0);
              const isToday = i===6;
              return (
                <div key={i} className={`wd ${isToday?'today':''}`}>
                  <Ring size={34} stroke={4} pct={val}/>
                  {d.toLocaleDateString('en-GB',{weekday:'narrow'})}
                </div>
              );
            })}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Gym</h3><button className="link" onClick={()=>onTab('train')}>See all</button></div>
          <div className="card list" style={{'--indent':'36px'}}>
            {SESSIONS.map(s=>{
              const done = doneFor(s.id);
              const last = lastFor(s.id);
              return (
                <button key={s.id} className="row" style={{'--c':s.color}} onClick={()=>onOpenSession(s.id)}>
                  <span className="dot"></span>
                  <div className="grow"><div className="t">{s.name}{s.optional && <span className="pill" style={{marginLeft:8, verticalAlign:2}}>Optional</span>}</div><div className="s">{s.subtitle}</div></div>
                  {done ? <span className="rt accent-txt"><Icon name="check" size={15} stroke={2.8}/>Done</span>
                    : <span className="rt">{last ? fmtDate(last) : 'Not yet'}<Icon name="chevronRight" size={15} stroke={2.2}/></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Body &amp; recovery</h3></div>
          <div className="tiles">
            <button className="card tile press" onClick={onOpenBodyStats}>
              <div className="lbl">Weight<Icon name="chevronRight" size={14} color="var(--t3)" stroke={2.2}/></div>
              {sorted.length>1 && <div style={{marginTop:8}}><Sparkline data={sorted.slice(-12).map(s=>kgToUnit(s.weight,unit))}/></div>}
              <div className="v">{latest ? kgToUnit(latest.weight,unit).toFixed(1) : '—'}{latest && <small>{unit}</small>}</div>
              <div className="d" style={wChange!=null ? {color: wChange<=0 ? 'var(--green)' : 'var(--orange)'} : undefined}>{wChange!=null ? `${fmtSigned(wChange)} ${unit} · 30 days` : latest ? 'Log again to see a trend' : 'Tap to log your first'}</div>
            </button>
            <button className="card tile press" onClick={onOpenFasting}>
              <div className="lbl">Fasting<Icon name="chevronRight" size={14} color="var(--t3)" stroke={2.2}/></div>
              {fast ? (
                <div style={{display:'flex', alignItems:'center', gap:10, marginTop:'auto'}}>
                  <LiveRing size={42} stroke={5} pct={fastEl/(fast.goalHours*3600)} color={fastEl>=fast.goalHours*3600 ? 'var(--green)' : 'var(--accent)'}/>
                  <div><div className="v num" style={{fontSize:22, margin:0}}>{fmtHMS(fastEl).slice(0,-3)}</div><div className="d" style={{marginTop:0}}>of {fast.goalHours}h</div></div>
                </div>
              ) : (
                <React.Fragment><div className="v" style={{fontSize:20}}>Not fasting</div><div className="d">Tap to start</div></React.Fragment>
              )}
            </button>
            <button className="card tile press" onClick={onOpenBodyStats}>
              <div className="lbl">Body fat</div>
              <div className="v">{bfLatest ? bfLatest.bodyFat : '—'}{bfLatest && <small>%</small>}</div>
              <div className="d" style={bfChange!=null ? {color: bfChange<=0 ? 'var(--green)' : 'var(--orange)'} : undefined}>{bfChange!=null ? `${fmtSigned(bfChange)}% · 30 days` : height && latest ? `BMI ${computeBMI(latest.weight, height).toFixed(1)}` : 'Optional'}</div>
            </button>
            <button className="card tile press" onClick={()=>onTab('progress')}>
              <div className="lbl">Streak<Icon name="flame" size={15} color={streak ? 'var(--orange)' : 'var(--t3)'}/></div>
              <div className="v">{streak}<small>{streak===1?'day':'days'}</small></div>
              <div className="d">Best {best} · {thisWeekCount} active this wk</div>
            </button>
          </div>
        </div>
      </div>
      {showCheckin && <CheckinSheet ci={ci} unit={unit} onClose={()=>{ setShowCheckin(false); setSeenCheckin(ci.key); }}/>}
    </div>
  );
}

/* ================= TRAIN ================= */
function Train(p){
  const {week, setWeek, completions, caliActive, caliLog, caliPlan, cardioLog, stretchLog, fast, stats,
    onOpenSession, onOpenCali, onOpenCaliWeek, onOpenFasting, onOpenBodyStats} = p;
  const thisWeek = completions.filter(c=>c.week===week).length;
  const {focus, v, started} = caliToday(caliActive);
  const today = dayKey(new Date());
  const doneDays = new Set(caliLog.filter(isCali).map(e=>dayKey(e.date)));
  const wk = caliWeekDates(new Date());
  const lastFor = (id) => { const l = completions.filter(c=>c.sessionId===id); return l.length ? l[l.length-1].date : null; };
  return (
    <div className="screen anim-tab">
      <TopBar title="Train" fadeTitle/>
      <div className="stagger">
        <div className="large"><div><div className="eyebrow">12-week block</div><h1>Train</h1></div></div>

        <div className="card week-card" style={{marginTop:16}}>
          <div className="week-row">
            <div>
              <div className="eyebrow">Training week</div>
              <div className="week-big" style={{marginTop:6}}>{week}<small>of {TOTAL_WEEKS}</small></div>
            </div>
            <div className="btn-row" style={{flex:'0 0 auto'}}>
              <button className="cbtn" disabled={week<=1} onClick={()=>{ vibrate(8); setWeek(w=>Math.max(1,w-1)); }} aria-label="Previous week"><Icon name="chevronLeft" size={19} stroke={2.2}/></button>
              <button className="cbtn" disabled={week>=TOTAL_WEEKS} onClick={()=>{ vibrate(8); setWeek(w=>Math.min(TOTAL_WEEKS,w+1)); }} aria-label="Next week"><Icon name="chevronRight" size={19} stroke={2.2}/></button>
            </div>
          </div>
          <div className="segs">{Array.from({length:TOTAL_WEEKS}).map((_,i)=> <i key={i} className={i+1<week?'done':i+1===week?'now':''}></i>)}</div>
          <div className="help" style={{marginTop:10}}>{thisWeek ? `${plural(thisWeek,'gym session')} logged this week.` : 'No gym sessions logged this week yet.'} You move the week on yourself.</div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Daily calisthenics</h3><button className="link" onClick={onOpenCaliWeek}>Week &amp; levels</button></div>
          <div className="card list">
            <div className="cali-strip">
              {wk.map((d,i)=>{
                const f = CALI_FOCUS[i]; const k = dayKey(d);
                return (
                  <div key={i} className={`cs ${doneDays.has(k)?'done':''} ${k===today?'today':''}`} style={{'--c':f.color}}>
                    <i>{doneDays.has(k) ? <Icon name="check" size={13} stroke={3}/> : <Icon name={f.icon} size={14} color="var(--t2)"/>}</i>
                    {CALI_DAY_LETTERS[i]}
                  </div>
                );
              })}
            </div>
            <button className="row" style={{'--c':focus.color, marginTop:6}} onClick={onOpenCali}>
              <span className="ico tint"><Icon name={focus.icon} size={18}/></span>
              <div className="grow"><div className="t">Today · {focus.name}</div><div className="s">{v.title} · {mainLine(v)}</div></div>
              <span className="rt">{doneDays.has(today) && !started ? <span className="accent-txt" style={{display:'flex', gap:5, alignItems:'center'}}><Icon name="check" size={15} stroke={2.8}/>Done</span> : started ? 'Continue' : 'Start'}<Icon name="chevronRight" size={15} stroke={2.2}/></span>
            </button>
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Gym sessions</h3><span className="meta">Week {week}</span></div>
          <div className="card list" style={{'--indent':'62px'}}>
            {SESSIONS.map(s=>{
              const done = completions.some(c=>c.sessionId===s.id && c.week===week);
              const last = lastFor(s.id);
              return (
                <button key={s.id} className="row" style={{'--c':s.color}} onClick={()=>onOpenSession(s.id)}>
                  <span className="ico tint"><Icon name={s.icon} size={18}/></span>
                  <div className="grow"><div className="t">{s.name}{s.optional && <span className="pill" style={{marginLeft:8, verticalAlign:2}}>Optional</span>}</div><div className="s">{s.subtitle} · {s.duration}</div></div>
                  {done ? <span className="rt accent-txt"><Icon name="check" size={15} stroke={2.8}/></span> : <span className="rt">{last ? fmtDate(last) : ''}<Icon name="chevronRight" size={15} stroke={2.2}/></span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Log &amp; track</h3></div>
          <div className="card list" style={{'--indent':'62px'}}>
            <button className="row" style={{'--c':'#38BDF8'}} onClick={()=>onOpenSession('cardio')}>
              <span className="ico tint"><Icon name="heart" size={18}/></span>
              <div className="grow"><div className="t">Cardio</div><div className="s">{cardioLog.length ? `${plural(cardioLog.length,'session')} · ${cardioLog.reduce((a,e)=>a+(Number(e.duration)||0),0)} min` : 'Runs, rides, rows and more'}</div></div>
              <span className="rt"><Icon name="chevronRight" size={15} stroke={2.2}/></span>
            </button>
            <button className="row" style={{'--c':'#34D399'}} onClick={()=>onOpenSession('stretch')}>
              <span className="ico tint"><Icon name="stretch" size={18}/></span>
              <div className="grow"><div className="t">Stretching</div><div className="s">{stretchLog.length ? `${plural(stretchLog.length,'session')} · ${stretchLog.reduce((a,e)=>a+(Number(e.duration)||0),0)} min` : 'Log a stretch session'}</div></div>
              <span className="rt"><Icon name="chevronRight" size={15} stroke={2.2}/></span>
            </button>
            <button className="row" style={{'--c':'#4C7DFF'}} onClick={onOpenFasting}>
              <span className="ico tint"><Icon name="timer" size={18}/></span>
              <div className="grow"><div className="t">Fasting</div><div className="s">{fast ? `In progress · goal ${fast.goalHours}h` : 'Start a fast or see history'}</div></div>
              <span className="rt"><Icon name="chevronRight" size={15} stroke={2.2}/></span>
            </button>
            <button className="row" style={{'--c':'#A78BFA'}} onClick={onOpenBodyStats}>
              <span className="ico tint"><Icon name="scale" size={18}/></span>
              <div className="grow"><div className="t">Body stats</div><div className="s">{stats.length ? `${plural(stats.length,'check-in')}` : 'Weight, body fat and BMI'}</div></div>
              <span className="rt"><Icon name="chevronRight" size={15} stroke={2.2}/></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= PROGRESS ================= */
function Progress(p){
  const {week, completions, prs, caliLog, morningLog, cardioLog, stretchLog, fastHistory, stats, unit, onOpenBodyStats, logs, swaps} = p;
  const [showCheckin, setShowCheckin] = useState(false);
  const ci = useMemo(()=> computeCheckin({completions, caliLog, prs, cardioLog, stretchLog, fastHistory, stats, logs, swaps}), [completions, caliLog, prs, cardioLog, stretchLog, fastHistory, stats, logs, swaps]);
  let wkStreak = 0;
  for(let w=week; w>=1; w--){ if(completions.some(c=>c.week===w)) wkStreak++; else break; }
  const totalVol = completions.reduce((s,c)=> s + (c.volume||0), 0);
  const cellCount = (w) => completions.filter(c=>c.week===w).length;
  const sorted = [...stats].sort((a,b)=> new Date(a.date)-new Date(b.date));
  const latest = sorted[sorted.length-1];
  const first = sorted[0];
  const change = latest && first && sorted.length>1 ? kgToUnit(latest.weight - first.weight, unit) : null;
  const prList = Object.values(prs||{}).filter(x=>x && x.est1RM).sort((a,b)=> b.est1RM - a.est1RM).slice(0,8);
  const pbs = [];
  CALI_FOCUS.forEach(f=> f.variants.forEach(v=>{ if(v.finisher && !pbs.some(x=>x.id===v.finisher.id)){ const b = caliPB(caliLog, v.finisher.id); if(b!=null) pbs.push({id:v.finisher.id, name:v.finisher.name, unit:v.finisher.unit, best:b, color:f.color}); } }));
  const act = activityByDay({completions, caliLog, morningLog, cardioLog, stretchLog});
  const streak = activityStreak(act);
  const cardioMin = cardioLog.reduce((a,e)=>a+(Number(e.duration)||0),0);
  const stretchMin = stretchLog.reduce((a,e)=>a+(Number(e.duration)||0),0);
  const fastsHit = fastHistory.filter(f=>f.completed).length;
  return (
    <div className="screen anim-tab">
      <TopBar title="Progress" fadeTitle/>
      <div className="stagger">
        <div className="large"><div><div className="eyebrow">All your numbers</div><h1>Progress</h1></div></div>
        <div className="card list" style={{marginTop:16}}>
          <button className="row" onClick={()=>setShowCheckin(true)}>
            <span className="ico tint"><Icon name="calendar" size={18}/></span>
            <div className="grow"><div className="t">Weekly check-in</div><div className="s">{ci.range} · {ci.tips[0].title}</div></div>
            <span className="rt"><Icon name="chevronRight" size={15} stroke={2.2}/></span>
          </button>
        </div>

        <div className="sec" style={{marginTop:16}}>
          <div className="card pad">
            <div className="stats c3">
              <Stat value={wkStreak} unit="wk" label="Gym streak"/>
              <Stat value={completions.length} label="Gym sessions"/>
              <Stat value={totalVol>=1000 ? (totalVol/1000).toFixed(1) : Math.round(totalVol)} unit={totalVol>=1000?'t':'kg'} label="Volume"/>
            </div>
            <div className="heat">
              {Array.from({length:TOTAL_WEEKS}).map((_,i)=>{ const c = cellCount(i+1); return <i key={i} className={`${c===0?'':c===1?'l1':c===2?'l2':'l3'} ${i+1===week?'now':''}`} title={`Week ${i+1}: ${plural(c,'session')}`}></i>; })}
            </div>
            <div className="heat-l"><span>Week 1</span><span>Week 6</span><span>Week 12</span></div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Weight</h3><button className="link" onClick={onOpenBodyStats}>Body stats</button></div>
          <div className="card pad">
            {sorted.length ? (
              <React.Fragment>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                  <div className="num" style={{fontSize:30, fontWeight:600}}>{kgToUnit(latest.weight,unit).toFixed(1)}<span className="t3" style={{fontSize:14, fontFamily:'var(--font)', marginLeft:4}}>{unit}</span></div>
                  {change!=null && <span className={`pill ${change<=0?'green':'orange'}`}>{fmtSigned(change)} {unit} overall</span>}
                </div>
                {sorted.length>1 && <div style={{marginTop:10}}><LineChart labels={sorted.map(s=>fmtDate(s.date))} data={sorted.map(s=>Number(kgToUnit(s.weight,unit).toFixed(1)))} height={160} unit={` ${unit}`}/></div>}
              </React.Fragment>
            ) : <Empty icon="scale" title="No weigh-ins yet" text="Log your weight in Body stats to see your trend here."/>}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Gym records</h3><span className="meta">Estimated 1RM</span></div>
          <div className="card list">
            {prList.length===0 && <Empty icon="trophy" title="No records yet" text="Tick off weighted sets and your bests appear here."/>}
            {prList.map((x,i)=>(
              <div key={i} className="row">
                <span className="ico" style={{color:'var(--orange)', background:'var(--orange-soft)'}}><Icon name="trophy" size={17}/></span>
                <div className="grow"><div className="t" style={{fontSize:15}}>{x.name}</div><div className="s">{x.weight} kg × {x.reps} · {fmtDate(x.date)}</div></div>
                <span className="num" style={{fontSize:18, fontWeight:600}}>{Math.round(x.est1RM)}<span className="t3" style={{fontSize:12, marginLeft:2}}>kg</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Calisthenics benchmarks</h3></div>
          <div className="card list">
            {pbs.length===0 && <Empty icon="bolt" title="No benchmarks yet" text="Each daily session ends with a finisher test. Your bests land here."/>}
            {pbs.map(x=>(
              <div key={x.id} className="row" style={{'--c':x.color}}>
                <span className="dot"></span>
                <div className="grow"><div className="t" style={{fontSize:15}}>{x.name}</div></div>
                <span className="num" style={{fontSize:18, fontWeight:600}}>{x.best}<span className="t3" style={{fontSize:12, marginLeft:1}}>{x.unit==='secs'?'s':''}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Everything else</h3></div>
          <div className="card pad">
            <div className="stats c3">
              <Stat value={streak} unit={streak===1?'day':'days'} label="Active streak"/>
              <Stat value={cardioMin} unit="min" label="Cardio"/>
              <Stat value={stretchMin} unit="min" label="Stretching"/>
            </div>
            <div className="stats c3" style={{marginTop:14}}>
              <Stat value={caliLog.filter(isCali).length} label="Daily sessions"/>
              <Stat value={fastsHit} label="Fasts hit"/>
              <Stat value={stats.length} label="Check-ins"/>
            </div>
          </div>
        </div>
      </div>
      {showCheckin && <CheckinSheet ci={ci} unit={unit} onClose={()=>setShowCheckin(false)}/>}
    </div>
  );
}

/* ================= YOU (settings) ================= */
function You({week, themePref, setThemePref, unit, setUnit, onExport, onImport, spotifyClientId, setSpotifyClientId, spotifyTokens, setSpotifyTokens, setToast}){
  const fileRef = useRef(null);
  const [, force] = useState(0);
  const notifSupported = typeof Notification !== 'undefined';
  const notifGranted = notifSupported && Notification.permission==='granted';
  const notifDenied = notifSupported && Notification.permission==='denied';
  const [clientIdInput, setClientIdInput] = useState(spotifyClientId || '');
  const connectSpotify = async () => {
    if(!window.isSecureContext){ setToast('Spotify needs https — works once hosted on GitHub Pages'); return; }
    const id = clientIdInput.trim();
    if(!id) return;
    setSpotifyClientId(id);
    try{ await startSpotifyAuth(id); }catch(e){ setToast('Could not start Spotify login'); }
  };
  return (
    <div className="screen anim-tab">
      <TopBar title="You" fadeTitle/>
      <div className="stagger">
        <div className="large"><div><div className="eyebrow">Profile &amp; settings</div><h1>You</h1></div></div>
        <div className="card profile" style={{marginTop:16}}>
          <div className="av">D</div>
          <div><b>David</b><span>DBS PPLX · Week {week} of {TOTAL_WEEKS}</span></div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Appearance</h3></div>
          <div className="card">
            <div className="set-block">
              <Segmented value={themePref} onChange={setThemePref} options={[
                {value:'light', label:'Light', icon:'sun'},
                {value:'dark', label:'Dark', icon:'moon'},
                {value:'system', label:'System', icon:'monitor'},
              ]}/>
              <div className="help">System follows your phone's light and dark setting.</div>
            </div>
            <div className="set-block">
              <div className="h">Body stats units</div>
              <Segmented value={unit} onChange={setUnit} options={[{value:'kg', label:'Kilograms'},{value:'lb', label:'Pounds'}]}/>
            </div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Alerts</h3></div>
          <div className="card set-block">
            <button className="btn btn-ghost" disabled={!notifSupported || notifGranted || notifDenied} onClick={()=>requestNotifyPermission(()=>force(x=>x+1))}>
              <Icon name="bell" size={18}/>{!notifSupported ? 'Not supported on this browser' : notifGranted ? 'Notifications on' : notifDenied ? 'Blocked in browser settings' : 'Turn on notifications'}
            </button>
            <div className="help">Beeps and vibration always work while the app is open. Background notifications are best-effort and unreliable on a locked iPhone.</div>
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Spotify</h3></div>
          <div className="card set-block">
            {!spotifyTokens ? (
              <React.Fragment>
                <input className="input" type="text" placeholder="Spotify Client ID" value={clientIdInput} onChange={e=>setClientIdInput(e.target.value)} style={{marginBottom:10}}/>
                <button className="btn btn-ghost" disabled={!clientIdInput.trim()} onClick={connectSpotify}><Icon name="music" size={18}/>Connect Spotify</button>
                <div className="help">Register a free app at developer.spotify.com/dashboard and set this exact Redirect URI: <b>{getRedirectUri()}</b></div>
              </React.Fragment>
            ) : (
              <button className="btn btn-danger" onClick={()=>{ setSpotifyTokens(null); setToast('Spotify disconnected'); }}>Disconnect Spotify</button>
            )}
          </div>
        </div>

        <div className="sec">
          <div className="sec-h"><h3>Your data</h3></div>
          <div className="card set-block">
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={onExport}><Icon name="download" size={18}/>Export</button>
              <button className="btn btn-ghost" onClick={()=>fileRef.current && fileRef.current.click()}><Icon name="upload" size={18}/>Import</button>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" style={{display:'none'}} onChange={e=>{ const f=e.target.files[0]; if(f) onImport(f); e.target.value=''; }}/>
            <div className="help">Everything lives on this phone only. Export a backup now and then.</div>
          </div>
        </div>
        <div className="help" style={{textAlign:'center', marginTop:28, letterSpacing:'.14em', fontWeight:600}}>DBS PPLX</div>
      </div>
    </div>
  );
}

/* ================= BODY STATS ================= */
function BodyStatsView({stats, setStats, height, setHeight, unit, onBack}){
  const sref = useRef(null);
  useSwipe(sref, {onBack});
  const [showModal, setShowModal] = useState(false);
  const sorted = useMemo(()=>[...stats].sort((a,b)=> new Date(a.date)-new Date(b.date)), [stats]);
  const latest = sorted[sorted.length-1];
  const first = sorted[0];
  const bmi = latest ? computeBMI(latest.weight, height) : null;
  const change = latest && first && sorted.length>1 ? kgToUnit(latest.weight - first.weight, unit) : null;
  return (
    <div className="screen detail anim-push" ref={sref}>
      <TopBar left={<BackBtn onClick={onBack}/>} title="Body stats" fadeTitle/>
      <div className="detail-head"><div className="eyebrow">{plural(sorted.length,'check-in')}</div><h1>Body stats</h1></div>
      <div className="card pad" style={{marginTop:16}}>
        <div className="stats c3">
          <Stat value={latest ? kgToUnit(latest.weight,unit).toFixed(1) : '—'} unit={unit} label="Weight"/>
          <Stat value={latest && latest.bodyFat!=null ? latest.bodyFat : '—'} unit="%" label="Body fat"/>
          <Stat value={bmi ? bmi.toFixed(1) : '—'} label="BMI"/>
        </div>
        {sorted.length>1 && (
          <React.Fragment>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'18px 2px 6px'}}>
              <span className="flabel" style={{margin:0}}>Weight trend</span>
              {change!=null && <span className={`pill ${change<=0?'green':'orange'}`}>{fmtSigned(change)} {unit}</span>}
            </div>
            <LineChart labels={sorted.map(s=> fmtDate(s.date))} data={sorted.map(s=> Number(kgToUnit(s.weight,unit).toFixed(1)))} unit={` ${unit}`}/>
          </React.Fragment>
        )}
        <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setShowModal(true)}><Icon name="plus" size={18} stroke={2.4}/>Log body stats</button>
      </div>
      <div className="sec">
        <div className="sec-h"><h3>History</h3></div>
        <div className="card list">
          {sorted.length===0 && <Empty icon="scale" title="No check-ins yet" text="Log your weight to start your trend."/>}
          {[...sorted].reverse().map((s,i)=>(
            <div className="row" key={i}>
              <div className="grow"><div className="t" style={{fontSize:15}}>{fmtDate(s.date, {weekday:'short', day:'numeric', month:'short'})}</div></div>
              <span className="num" style={{fontSize:16, fontWeight:600}}>{kgToUnit(s.weight,unit).toFixed(1)}<span className="t3" style={{fontSize:12, marginLeft:2}}>{unit}</span></span>
              {s.bodyFat!=null && <span className="num t2" style={{fontSize:15, minWidth:54, textAlign:'right'}}>{s.bodyFat}%</span>}
            </div>
          ))}
        </div>
      </div>
      {showModal && <LogStatsModal onClose={()=>setShowModal(false)} height={height} setHeight={setHeight} unit={unit}
        onSave={(entry)=>{ setStats(prev=>[...prev, entry]); setShowModal(false); }} />}
    </div>
  );
}
function LogStatsModal({onClose, onSave, height, setHeight, unit}){
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [h, setH] = useState(height || '');
  const canSave = weight!=='' && !isNaN(parseFloat(weight));
  const handleSave = () => {
    if(!canSave) return;
    if(h && parseFloat(h)!==height) setHeight(parseFloat(h));
    onSave({date:new Date().toISOString(), weight:unitToKg(parseFloat(weight), unit), bodyFat: bodyFat!=='' ? parseFloat(bodyFat) : null});
  };
  return (
    <Sheet title="Log body stats" onClose={onClose} actions={(close)=><React.Fragment>
      <button className="btn btn-ghost" onClick={close}>Cancel</button>
      <button className="btn btn-primary" disabled={!canSave} onClick={handleSave}>Save</button>
    </React.Fragment>}>
      {!height && (
        <div className="field"><label>Height (cm) — for BMI</label>
          <input className="input" type="number" inputMode="decimal" placeholder="e.g. 178" value={h} onChange={e=>setH(e.target.value)} /></div>
      )}
      <div className="field"><label>Weight ({unit})</label>
        <input className="input" type="number" inputMode="decimal" placeholder={unit==='kg'?'e.g. 82.4':'e.g. 181.7'} value={weight} onChange={e=>setWeight(e.target.value)} autoFocus/></div>
      <div className="field"><label>Body fat % (optional)</label>
        <input className="input" type="number" inputMode="decimal" placeholder="e.g. 15.2" value={bodyFat} onChange={e=>setBodyFat(e.target.value)} /></div>
    </Sheet>
  );
}

/* ================= FASTING ================= */
function EditFastModal({start, end, onSave, onClose}){
  const [s, setS] = useState(toDatetimeLocalValue(start));
  const [e, setE] = useState(end ? toDatetimeLocalValue(end) : '');
  const hasEnd = end != null;
  const canSave = s!=='' && (!hasEnd || e!=='');
  return (
    <Sheet title="Edit fast times" onClose={onClose} actions={(close)=><React.Fragment>
      <button className="btn btn-ghost" onClick={close}>Cancel</button>
      <button className="btn btn-primary" disabled={!canSave} onClick={()=> canSave && onSave(fromDatetimeLocalValue(s), hasEnd ? fromDatetimeLocalValue(e) : null)}>Save</button>
    </React.Fragment>}>
      <div className="field"><label>Start</label><input className="input" type="datetime-local" value={s} onChange={ev=>setS(ev.target.value)} /></div>
      {hasEnd && <div className="field"><label>End</label><input className="input" type="datetime-local" value={e} onChange={ev=>setE(ev.target.value)} /></div>}
    </Sheet>
  );
}
function FastingView({fast, setFast, fastHistory, setFastHistory, onBack}){
  const sref = useRef(null);
  useSwipe(sref, {onBack});
  const now = useNow(!!fast);
  const [goalPick, setGoalPick] = useState(16);
  const [custom, setCustom] = useState(false);
  const [customHours, setCustomHours] = useState('');
  const [displayMode, setDisplayMode] = useState('elapsed');
  const [editingActive, setEditingActive] = useState(false);
  const [editingHistoryIdx, setEditingHistoryIdx] = useState(null);
  const notifiedRef = useRef(false);
  const elapsedSec = fast ? Math.max(0, Math.floor((now - new Date(fast.startTime).getTime())/1000)) : 0;
  const goalHours = fast ? fast.goalHours : goalPick;
  const goalSec = goalHours*3600;
  const remainingSec = Math.max(0, goalSec - elapsedSec);
  const overSec = Math.max(0, elapsedSec - goalSec);
  const goalReached = !!fast && elapsedSec >= goalSec;
  const pct = fast ? elapsedSec/goalSec : 0;
  useEffect(()=>{
    if(fast && goalReached && !notifiedRef.current){ notifiedRef.current = true; notify('Fast complete', `You hit your ${fast.goalHours}h goal.`); vibrate([120,80,120,80,120]); }
    if(!fast) notifiedRef.current = false;
  }, [goalReached, fast]);
  const customVal = parseFloat(customHours);
  const chosenGoal = custom ? customVal : goalPick;
  const canStart = isFinite(chosenGoal) && chosenGoal > 0;
  const startFast = () => { if(!canStart) return; vibrate(20); setFast({startTime:new Date().toISOString(), goalHours:chosenGoal}); notifiedRef.current=false; };
  const endFast = () => {
    if(!fast) return;
    setFastHistory(prev=>[...prev, {start:fast.startTime, end:new Date().toISOString(), hours:Number((elapsedSec/3600).toFixed(2)), goalHours:fast.goalHours, completed:goalReached}]);
    setFast(null);
  };
  const mainSec = displayMode==='elapsed' ? elapsedSec : (goalReached ? overSec : remainingSec);
  const mainLabel = displayMode==='elapsed' ? 'Elapsed' : (goalReached ? 'Over goal' : 'Remaining');
  const hit = fastHistory.filter(f=>f.completed).length;
  const longest = fastHistory.reduce((m,f)=> Math.max(m, f.hours||0), 0);
  const endsAt = fast ? new Date(new Date(fast.startTime).getTime()+goalSec*1000) : null;
  return (
    <div className="screen detail anim-push" ref={sref}>
      <TopBar left={<BackBtn onClick={onBack}/>} title="Fasting" fadeTitle/>
      <div className="detail-head"><div className="eyebrow">{fast ? `Goal ${fast.goalHours}h · ends ${endsAt.toLocaleString('en-GB',{weekday:'short', hour:'2-digit', minute:'2-digit'})}` : 'Not fasting'}</div><h1>Fasting</h1></div>

      {!fast ? (
        <div className="card pad" style={{marginTop:16}}>
          <div className="flabel">Choose a goal</div>
          <div className="presets">
            {FAST_PRESETS.map(h=>(
              <button key={h} className={`preset press ${!custom && goalPick===h?'on':''}`} onClick={()=>{ vibrate(8); setCustom(false); setGoalPick(h); }}><b>{h}</b><small>hours</small></button>
            ))}
            <button className={`preset press ${custom?'on':''}`} style={{gridColumn:'span 2'}} onClick={()=>setCustom(true)}><b style={{fontSize:17}}>Custom</b><small>set hours</small></button>
          </div>
          {custom && <div className="field" style={{marginTop:12, marginBottom:0}}><input className="input" type="number" inputMode="decimal" placeholder="Goal in hours, e.g. 20" value={customHours} onChange={e=>setCustomHours(e.target.value)} autoFocus/></div>}
          <button className="btn btn-primary" style={{marginTop:16}} disabled={!canStart} onClick={startFast}><Icon name="play" size={15}/>Start {canStart ? `${chosenGoal}h ` : ''}fast</button>
        </div>
      ) : (
        <div className="card pad" style={{marginTop:16}}>
          <Segmented value={displayMode} onChange={setDisplayMode} options={[{value:'elapsed', label:'Elapsed'},{value:'remaining', label: goalReached ? 'Over goal' : 'Remaining'}]}/>
          <div style={{display:'flex', justifyContent:'center', marginTop:22}}>
            <Ring size={250} stroke={16} pct={Math.min(1,pct)} gradient={!goalReached} color="var(--green)">
              <div className="eyebrow">{mainLabel}</div>
              <div className="big-time num" style={{marginTop:8}}>{fmtHMS(mainSec)}</div>
              <div style={{fontSize:13.5, fontWeight:600, marginTop:8, color: goalReached ? 'var(--green)' : 'var(--t2)'}}>{goalReached ? 'Goal reached' : `${Math.floor(Math.min(1,pct)*100)}% of ${fast.goalHours}h`}</div>
            </Ring>
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:16, fontSize:13.5, color:'var(--t2)'}}>
            <span>Started {new Date(fast.startTime).toLocaleString('en-GB',{weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</span>
            <button className="cbtn sm" onClick={()=>setEditingActive(true)} aria-label="Edit start time"><Icon name="edit" size={15}/></button>
          </div>
          <button className="btn btn-ghost" style={{marginTop:16}} onClick={endFast}>End fast</button>
        </div>
      )}

      <div className="sec">
        <div className="sec-h"><h3>History</h3><span className="meta">{fastHistory.length ? `${hit}/${fastHistory.length} hit · best ${longest}h` : ''}</span></div>
        <div className="card list">
          {fastHistory.length===0 && <Empty icon="timer" title="No fasts yet" text="Finished fasts show up here."/>}
          {fastHistory.map((f,idx)=>idx).reverse().map((origIdx)=>{
            const f = fastHistory[origIdx];
            return (
              <div className="row" key={origIdx}>
                <div className="grow"><div className="t" style={{fontSize:15}}>{fmtDate(f.start, {weekday:'short', day:'numeric', month:'short'})}</div><div className="s">Goal {f.goalHours}h</div></div>
                <span className="num" style={{fontSize:16, fontWeight:600}}>{f.hours}h</span>
                {f.completed ? <span className="pill green"><Icon name="check" size={11} stroke={3}/></span> : <span className="pill">—</span>}
                <button className="cbtn sm" onClick={()=>setEditingHistoryIdx(origIdx)} aria-label="Edit fast"><Icon name="edit" size={15}/></button>
              </div>
            );
          })}
        </div>
      </div>

      {editingActive && fast && (
        <EditFastModal start={fast.startTime} end={null} onClose={()=>setEditingActive(false)} onSave={(ns)=>{ setFast({...fast, startTime:ns}); setEditingActive(false); }} />
      )}
      {editingHistoryIdx!=null && fastHistory[editingHistoryIdx] && (
        <EditFastModal start={fastHistory[editingHistoryIdx].start} end={fastHistory[editingHistoryIdx].end} onClose={()=>setEditingHistoryIdx(null)}
          onSave={(ns, ne)=>{
            setFastHistory(prev=> prev.map((f,i)=>{ if(i!==editingHistoryIdx) return f; const hours = Number(((new Date(ne) - new Date(ns))/3600000).toFixed(2)); return {...f, start:ns, end:ne, hours, completed: hours >= f.goalHours}; }));
            setEditingHistoryIdx(null);
          }} />
      )}
    </div>
  );
}

/* ================= CARDIO + STRETCHING ================= */
function CardioLogModal({onClose, onSave}){
  const [type, setType] = useState(CARDIO_TYPES[0]);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const canSave = duration!=='' && !isNaN(parseFloat(duration));
  const handleSave = () => { if(!canSave) return; onSave({date:new Date().toISOString(), type, duration:parseFloat(duration), distance: distance!=='' ? parseFloat(distance) : null, calories: calories!=='' ? parseFloat(calories) : null, notes: notes || ''}); };
  return (
    <Sheet title="Log cardio" onClose={onClose} actions={(close)=><React.Fragment>
      <button className="btn btn-ghost" onClick={close}>Cancel</button>
      <button className="btn btn-primary" disabled={!canSave} onClick={handleSave}>Save</button>
    </React.Fragment>}>
      <div className="field"><label>Type</label>
        <div className="chips" style={{marginBottom:0}}>
          {CARDIO_TYPES.map(t=> <button key={t} className="press" onClick={()=>setType(t)} style={{fontSize:13.5, padding:'8px 12px', borderRadius:11, background: type===t ? 'var(--accent-soft)' : 'var(--s2)', color: type===t ? 'var(--accent-2)' : 'var(--t2)', fontWeight:600, boxShadow: type===t ? 'inset 0 0 0 1px rgba(var(--accent-rgb),.5)' : 'none'}}>{t}</button>)}
        </div>
      </div>
      <div className="field" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div><label className="flabel">Minutes</label><input className="input" type="number" inputMode="decimal" placeholder="30" value={duration} onChange={e=>setDuration(e.target.value)}/></div>
        <div><label className="flabel">Distance (km)</label><input className="input" type="number" inputMode="decimal" placeholder="Optional" value={distance} onChange={e=>setDistance(e.target.value)} /></div>
      </div>
      <div className="field"><label>Calories (optional)</label><input className="input" type="number" inputMode="decimal" placeholder="e.g. 300" value={calories} onChange={e=>setCalories(e.target.value)} /></div>
      <div className="field"><label>Notes (optional)</label><input className="input" type="text" placeholder="How did it feel?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
    </Sheet>
  );
}
function StretchLogModal({onClose, onSave}){
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const canSave = duration!=='' && !isNaN(parseFloat(duration));
  return (
    <Sheet title="Log stretching" onClose={onClose} actions={(close)=><React.Fragment>
      <button className="btn btn-ghost" onClick={close}>Cancel</button>
      <button className="btn btn-primary" disabled={!canSave} onClick={()=> canSave && onSave({date:new Date().toISOString(), duration:parseFloat(duration), notes: notes || ''})}>Save</button>
    </React.Fragment>}>
      <div className="field"><label>Minutes</label><input className="input" type="number" inputMode="decimal" placeholder="e.g. 15" value={duration} onChange={e=>setDuration(e.target.value)} autoFocus/></div>
      <div className="field"><label>Notes (optional)</label><input className="input" type="text" placeholder="e.g. Hips + hamstrings" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
    </Sheet>
  );
}
function ActivityLogView({kind, entries, setEntries, onBack}){
  const sref = useRef(null);
  useSwipe(sref, {onBack});
  const [showModal, setShowModal] = useState(false);
  const isCardio = kind==='cardio';
  const totalMin = entries.reduce((sum,e)=> sum + (Number(e.duration)||0), 0);
  const totalKm = entries.reduce((sum,e)=> sum + (Number(e.distance)||0), 0);
  const weekAgo = Date.now() - 7*864e5;
  const last7 = entries.filter(e=> new Date(e.date).getTime() >= weekAgo).reduce((s,e)=> s + (Number(e.duration)||0), 0);
  const title = isCardio ? 'Cardio' : 'Stretching';
  return (
    <div className="screen detail anim-push" ref={sref}>
      <TopBar left={<BackBtn onClick={onBack}/>} title={title} fadeTitle/>
      <div className="detail-head"><div className="eyebrow">{plural(entries.length,'session')}</div><h1>{title}</h1></div>
      <div className="card pad" style={{marginTop:16}}>
        <div className="stats c3">
          <Stat value={entries.length} label="Sessions"/>
          <Stat value={totalMin} unit="min" label="Total"/>
          {isCardio ? <Stat value={Number(totalKm.toFixed(1))} unit="km" label="Distance"/> : <Stat value={last7} unit="min" label="Last 7 days"/>}
        </div>
        <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setShowModal(true)}><Icon name="plus" size={18} stroke={2.4}/>Log {isCardio ? 'cardio' : 'stretching'}</button>
      </div>
      <div className="sec">
        <div className="sec-h"><h3>History</h3></div>
        <div className="card list">
          {entries.length===0 && <Empty icon={isCardio ? 'heart' : 'stretch'} title="Nothing logged yet" text={`Your ${isCardio?'cardio':'stretching'} sessions appear here.`}/>}
          {[...entries].reverse().map((e,i)=>(
            <div className="row" key={i}>
              <div className="grow"><div className="t" style={{fontSize:15}}>{isCardio ? e.type : fmtDate(e.date, {weekday:'short', day:'numeric', month:'short'})}</div><div className="s">{isCardio ? fmtDate(e.date, {weekday:'short', day:'numeric', month:'short'}) : (e.notes || 'Stretch session')}{isCardio && e.notes ? ` · ${e.notes}` : ''}</div></div>
              <span className="num" style={{fontSize:16, fontWeight:600}}>{e.duration}<span className="t3" style={{fontSize:12, marginLeft:2}}>min</span></span>
              {isCardio && e.distance!=null && <span className="num t2" style={{fontSize:15}}>{e.distance} km</span>}
            </div>
          ))}
        </div>
      </div>
      {showModal && (isCardio
        ? <CardioLogModal onClose={()=>setShowModal(false)} onSave={(entry)=>{ setEntries(prev=>[...prev, entry]); setShowModal(false); }}/>
        : <StretchLogModal onClose={()=>setShowModal(false)} onSave={(entry)=>{ setEntries(prev=>[...prev, entry]); setShowModal(false); }}/>
      )}
    </div>
  );
}

/* ================= SPOTIFY TICKER ================= */
function SpotifyTicker({clientId, tokens, setTokens, low}){
  const [track, setTrack] = useState(null);
  useEffect(()=>{
    if(!tokens || !clientId){ setTrack(null); return; }
    let stopped = false;
    const poll = async () => {
      if(document.visibilityState==='hidden') return;
      const token = await getValidSpotifyToken(clientId, tokens, setTokens);
      if(!token || stopped) return;
      try{
        const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {headers:{Authorization:`Bearer ${token}`}});
        if(res.status===204){ if(!stopped) setTrack(null); return; }
        if(!res.ok) return;
        const data = await res.json();
        if(!data || !data.item){ if(!stopped) setTrack(null); return; }
        if(stopped) return;
        const imgs = (data.item.album && data.item.album.images) || [];
        setTrack({name:data.item.name, artists:(data.item.artists||[]).map(a=>a.name).join(', '), image: imgs.length ? (imgs[2] || imgs[0]).url : null, isPlaying:data.is_playing, progressMs:data.progress_ms || 0, durationMs:data.item.duration_ms || 0});
      }catch(e){}
    };
    poll();
    const iv = setInterval(poll, 6000);
    const onVis = () => { if(document.visibilityState==='visible') poll(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { stopped=true; clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [tokens, clientId]);
  const control = async (action) => {
    const token = await getValidSpotifyToken(clientId, tokens, setTokens);
    if(!token) return;
    try{
      if(action==='toggle'){
        const url = track && track.isPlaying ? 'https://api.spotify.com/v1/me/player/pause' : 'https://api.spotify.com/v1/me/player/play';
        await fetch(url, {method:'PUT', headers:{Authorization:`Bearer ${token}`}});
        setTrack(t=> t ? {...t, isPlaying:!t.isPlaying} : t);
      } else if(action==='next'){
        await fetch('https://api.spotify.com/v1/me/player/next', {method:'POST', headers:{Authorization:`Bearer ${token}`}});
      }
    }catch(e){}
  };
  if(!tokens || !track) return null;
  const pct = track.durationMs ? Math.min(100, (track.progressMs/track.durationMs)*100) : 0;
  return (
    <div className={`ticker ${low?'low':''}`}>
      <div className="ticker-prog"><i style={{width:pct+'%'}}></i></div>
      <div className="ticker-row">
        {track.image ? <img src={track.image} className="ticker-art" alt=""/> : <div className="ticker-art"></div>}
        <div className="ticker-meta"><div className="ticker-name">{track.name}</div><div className="ticker-artist">{track.artists}</div></div>
        <button className="cbtn" onClick={()=>control('toggle')} aria-label={track.isPlaying?'Pause':'Play'}><Icon name={track.isPlaying ? 'pause' : 'play'} size={15}/></button>
        <button className="cbtn" onClick={()=>control('next')} aria-label="Next track"><Icon name="next" size={15}/></button>
      </div>
    </div>
  );
}


/* =========================================================
   GYM SESSION — coach + overview
   ========================================================= */
function targetLine(ex){ return ex.sets ? `${ex.sets} × ${ex.reps}` : ex.reps; }
function groupKindLabel(g){
  switch(g.type){
    case 'straight': return 'Straight sets';
    case 'superset': return 'Superset';
    case 'triset': return 'Tri-set';
    case 'finisher': return 'Finisher';
    case 'circuit': return 'Circuit';
    default: return g.title;
  }
}
function exBadge(g, i){
  if(g.type==='superset'){ const m = /Superset\s+([A-Z])/i.exec(g.title||''); return `${m ? m[1].toUpperCase() : 'S'}${i+1}`; }
  if(g.type==='triset') return `T${i+1}`;
  return String(i+1);
}

// Docked rest pill used by gym and calisthenics screens
function RestPill({rest, now, onSkip, label}){
  if(!rest) return null;
  const total = (rest.endAt - rest.startAt)/1000;
  const left = Math.max(0, Math.ceil((rest.endAt - now)/1000));
  const done = now >= rest.endAt;
  const pct = Math.min(1, (now - rest.startAt)/(rest.endAt - rest.startAt));
  return (
    <div className={`rest-pill ${done?'go':''}`} aria-live="polite">
      <LiveRing size={44} stroke={4} pct={done ? 1 : pct} color={done ? 'var(--green)' : 'var(--accent)'}>
        {done ? <Icon name="check" size={16} stroke={3} color="var(--green)"/> : null}
      </LiveRing>
      <div className="rt">
        <b className="num">{done ? 'Go' : fmtMS(left)}</b>
        <span>{done ? 'Rest done — next set' : (label || `Rest · ${Math.round(total)}s`)}</span>
      </div>
      <button className="skip" onClick={onSkip}>{done ? 'Dismiss' : 'Skip'}</button>
    </div>
  );
}

function ExerciseHistoryModal({name, sessionId, stepIndex, exIdx, logs, pr, onClose}){
  const weekly = [];
  for(let w=1; w<=TOTAL_WEEKS; w++){
    const top = entryVolume(logs[`w${w}_${sessionId}_${stepIndex}_${exIdx}`], {reps:''}).top;
    if(top!=null) weekly.push({week:w, weight:top});
  }
  return (
    <Sheet title={name} onClose={onClose} actions={(close)=><button className="btn btn-ghost" onClick={close}>Close</button>}>
      {pr && (
        <div className="card pad" style={{boxShadow:'none', background:'var(--s2)', border:'none'}}>
          <div className="stats c2">
            <Stat value={Math.round(pr.est1RM)} unit="kg" label="Estimated 1RM"/>
            <Stat value={`${pr.weight}×${pr.reps}`} label="Best set"/>
          </div>
        </div>
      )}
      {weekly.length>0 ? (
        <React.Fragment>
          <div className="flabel" style={{marginTop:16}}>Top set by week</div>
          <LineChart labels={weekly.map(w=>`Wk ${w.week}`)} data={weekly.map(w=>w.weight)} height={170} unit=" kg"/>
        </React.Fragment>
      ) : (
        <Empty icon="chart" title="No history yet" text="Tick off sets with a weight logged and your progress shows here."/>
      )}
    </Sheet>
  );
}


function StepCard({group, sessionId, week, stepIndex, logs, setLogs, prs, setPrs, swaps, setSwaps, setToast, onRest, onPR}){
  const isRoundsBased = !!group.rounds;
  const nSets = isRoundsBased ? group.rounds : null;
  const logKey = `w${week}_${sessionId}_${stepIndex}`;
  const prevLogKey = week>1 ? `w${week-1}_${sessionId}_${stepIndex}` : null;
  const getExRest = (exIdx) => {
    if(isRoundsBased) return exIdx===group.exercises.length-1 ? (group.restBetweenRounds||0) : 0;
    if(group.type==='straight') return group.exercises[exIdx].rest || 60;
    return exIdx===group.exercises.length-1 ? (group.restAfter||60) : 0;
  };
  const [editingIdx, setEditingIdx] = useState(null);
  const [historyIdx, setHistoryIdx] = useState(null);
  const [formIdx, setFormIdx] = useState(null);
  const seeded = useRef(false);
  const blank = {weight:'', reps:'', rpe:'', done:[], sets:[]};
  const getEntry = (exIdx) => logs[`${logKey}_${exIdx}`] || blank;
  const updateEntry = (exIdx, patch) => {
    const k = `${logKey}_${exIdx}`;
    setLogs(prev=> ({...prev, [k]: {...blank, ...(prev[k]||{}), ...(typeof patch==='function' ? patch({...blank, ...(prev[k]||{})}) : patch)}}));
  };
  const setRow = (exIdx, i, field, val) => updateEntry(exIdx, (e)=>{ const sets = [...(e.sets||[])]; sets[i] = {...(sets[i]||{}), [field]:val}; return {sets}; });
  // Progressive overload prefill from last week (+2.5 kg if every set was completed)
  useEffect(()=>{
    if(seeded.current || !prevLogKey || isRoundsBased) return;
    seeded.current = true;
    group.exercises.forEach((ex, exIdx)=>{
      if(logs[`${logKey}_${exIdx}`]) return;
      const prevEntry = logs[`${prevLogKey}_${exIdx}`];
      if(!prevEntry || !prevEntry.weight) return;
      const count = ex.sets || 0;
      const allDone = count>0 && (prevEntry.done||[]).filter(Boolean).length >= count;
      const prevW = parseFloat(prevEntry.weight);
      if(!isFinite(prevW)) return;
      const suggested = allDone ? roundTo(prevW+2.5, 2.5) : prevW;
      updateEntry(exIdx, {weight:String(suggested), reps: prevEntry.reps || ''});
    });
    // eslint-disable-next-line
  }, []);
  const slotKey = (exIdx) => `${sessionId}_${stepIndex}_${exIdx}`;
  const toggleSet = (exIdx, setIdx) => {
    const exRest = getExRest(exIdx);
    const entry = getEntry(exIdx);
    const done = [...(entry.done||[])];
    const willComplete = !done[setIdx];
    done[setIdx] = willComplete;
    const wv = setVal(entry, setIdx, 'weight'), rv = setVal(entry, setIdx, 'reps');
    if(willComplete && !isRoundsBased){
      const sets = [...(entry.sets||[])];
      sets[setIdx] = {w: wv, r: rv};   // freeze what was actually lifted
      updateEntry(exIdx, {done, sets});
    } else updateEntry(exIdx, {done});
    vibrate(willComplete ? 18 : 8);
    if(willComplete){
      const w = parseFloat(wv);
      const r = firstNumber(rv) || firstNumber(group.exercises[exIdx].reps);
      if(isFinite(w) && w>0 && r){
        const est = estimate1RM(w, r);
        const key = slotKey(exIdx);
        const prevPR = prs[key];
        if(!prevPR || est > prevPR.est1RM + 0.01){
          const name = swaps[key] || group.exercises[exIdx].name;
          setPrs(p=>({...p, [key]: {est1RM:est, weight:w, reps:r, date:new Date().toISOString(), name}}));
          if(prevPR && onPR) onPR({name, weight:w, reps:r});
          if(setToast) setToast(`New record · ${name} ${w} kg × ${r}`, 'trophy');
        }
      }
      if(exRest>0) onRest(exRest);
    }
  };
  const setCountFor = (exIdx) => isRoundsBased ? nSets : group.exercises[exIdx].sets;
  const linked = group.type==='superset' || group.type==='triset';

  return (
    <div>
      {group.exercises.map((ex, exIdx)=>{
        const entry = getEntry(exIdx);
        const count = setCountFor(exIdx) || 0;
        const key = slotKey(exIdx);
        const displayName = swaps[key] || ex.name;
        const weightNum = parseFloat(entry.weight);
        const showWarmup = !isRoundsBased && isFinite(weightNum) && weightNum>0 && count>=3;
        const showPlates = !isRoundsBased && isFinite(weightNum) && weightNum>=20 && displayName.toLowerCase().includes('barbell');
        const plateInfo = showPlates ? (computePlates(weightNum)||[]) : [];
        const pr = prs[key];
        const prev = prevLogKey ? logs[`${prevLogKey}_${exIdx}`] : null;
        const prevW = prev ? parseFloat(prev.weight) : NaN;
        const bumped = prev && isFinite(prevW) && isFinite(weightNum) && weightNum > prevW;
        const doneArr = entry.done || [];
        const curIdx = Array.from({length:count}).findIndex((_,i)=>!doneArr[i]);
        const restTxt = !isRoundsBased && group.type==='straight' ? `Rest ${ex.rest||60}s` : null;
        const repsPh = String(firstNumber(ex.reps) || ex.reps);
        return (
          <React.Fragment key={exIdx}>
            {linked && exIdx>0 && <div className="link-down"><Icon name="pull" size={13} stroke={2.2}/>Straight into</div>}
            <div className="card exc">
              <div className="exc-head">
                <div className="badge">{exBadge(group, exIdx)}</div>
                {editingIdx===exIdx ? (
                  <input className="exc-edit" autoFocus defaultValue={displayName}
                    onBlur={e=>{ const v=e.target.value.trim(); setSwaps(s=>({...s, [key]: v||ex.name})); setEditingIdx(null); }}
                    onKeyDown={e=>{ if(e.key==='Enter') e.target.blur(); }} />
                ) : (
                  <button className="exc-name" onClick={()=> isRoundsBased ? setFormIdx(exIdx) : setHistoryIdx(exIdx)}>
                    <b>{displayName}</b>
                    <span className="num">{targetLine(ex)}{restTxt ? ` · ${restTxt}` : ''}{ex.note ? ` · ${ex.note}` : ''}</span>
                  </button>
                )}
                <FormBtn onClick={()=>setFormIdx(exIdx)}/>
                <button className="cbtn sm" onClick={()=>setEditingIdx(editingIdx===exIdx?null:exIdx)} aria-label="Rename or swap exercise"><Icon name="edit" size={15}/></button>
              </div>
              {!isRoundsBased && (prev || pr) && (
                <div className="prev">
                  <span>{prev && prev.weight ? <React.Fragment>Last week <b className="num">{prev.weight} kg{prev.reps ? ` × ${prev.reps}` : ''}</b></React.Fragment> : pr ? <React.Fragment>Best <b className="num">{pr.weight} kg × {pr.reps}</b></React.Fragment> : null}</span>
                  {bumped ? <span className="pill accent">+{Math.round((weightNum-prevW)*10)/10} kg</span>
                    : pr ? <span className="pill orange"><Icon name="trophy" size={11}/>{Math.round(pr.est1RM)} kg 1RM</span> : null}
                </div>
              )}
              {!isRoundsBased && (
                <React.Fragment>
                  <div className="nfs">
                    <NumField label="kg · all sets" value={entry.weight} step={2.5} max={500} decimals onChange={v=>updateEntry(exIdx, {weight:v})}/>
                    <NumField label="reps" value={entry.reps} step={1} max={100} placeholder={repsPh} onChange={v=>updateEntry(exIdx, {reps:v})}/>
                  </div>
                  {(showWarmup || showPlates) && (
                    <div className="hints">
                      {showWarmup && <div className="hint"><b>Warm-up</b><span className="num">{computeWarmup(weightNum).map(s=>`${s.w} kg × ${s.reps}`).join('  ·  ')}</span></div>}
                      {showPlates && <div className="hint"><b>Per side</b><span className="num">{plateInfo.length ? plateInfo.join(' + ')+' kg' : 'Bar only'}</span></div>}
                    </div>
                  )}
                  <div className="stable">
                    <div className="sth"><span>Set</span><span>Last week</span><span>kg</span><span>Reps</span><span></span></div>
                    {Array.from({length:count}).map((_,i)=>{
                      const on = !!doneArr[i];
                      const sv = (entry.sets||[])[i] || {};
                      const pTxt = prev && (prev.done||[])[i] ? `${setVal(prev,i,'weight') || '—'} × ${setVal(prev,i,'reps') || '—'}` : '—';
                      return (
                        <div key={i} className={`str ${on?'done':''} ${!on && i===curIdx?'cur':''}`}>
                          <span className="sn num">{i+1}</span>
                          <span className="sp num">{pTxt}</span>
                          <input className="si num" type="text" inputMode="decimal" value={sv.w!==undefined && sv.w!=='' ? sv.w : ''} placeholder={entry.weight || 'kg'}
                            onChange={e=>setRow(exIdx, i, 'w', e.target.value.replace(/[^0-9.,]/g,'').replace(',','.'))} onFocus={e=>e.target.select()} aria-label={`Set ${i+1} weight`}/>
                          <input className="si num" type="text" inputMode="numeric" value={sv.r!==undefined && sv.r!=='' ? sv.r : ''} placeholder={entry.reps || repsPh}
                            onChange={e=>setRow(exIdx, i, 'r', e.target.value.replace(/[^0-9]/g,''))} onFocus={e=>e.target.select()} aria-label={`Set ${i+1} reps`}/>
                          <button className="sck" onClick={()=>toggleSet(exIdx, i)} aria-pressed={on} aria-label={`Complete set ${i+1}`}><Icon name="check" size={17} stroke={3}/></button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rpe">
                    <span className="k">RPE</span>
                    {[6,7,8,9,10].map(n=>(
                      <button key={n} className={String(entry.rpe)===String(n)?'on':''} onClick={()=>{ vibrate(8); updateEntry(exIdx, {rpe: String(entry.rpe)===String(n) ? '' : String(n)}); }}>{n}</button>
                    ))}
                  </div>
                </React.Fragment>
              )}
              {isRoundsBased && (
                <div className="sets-row">
                  <span className="k">ROUNDS</span>
                  {Array.from({length:count}).map((_,si)=>{
                    const on = !!doneArr[si];
                    return (
                      <button key={si} className={`set ${on?'on':''} ${!on && si===curIdx?'cur':''}`} onClick={()=>toggleSet(exIdx, si)} aria-pressed={on} aria-label={`Round ${si+1}`}>
                        {on ? <Icon name="check" size={18} stroke={3} color="#fff"/> : si+1}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {historyIdx!=null && (
        <ExerciseHistoryModal name={swaps[slotKey(historyIdx)] || group.exercises[historyIdx].name}
          sessionId={sessionId} stepIndex={stepIndex} exIdx={historyIdx} logs={logs}
          pr={prs[slotKey(historyIdx)]} onClose={()=>setHistoryIdx(null)} />
      )}
      {formIdx!=null && (
        <FormSheet name={swaps[slotKey(formIdx)] || group.exercises[formIdx].name} target={targetLine(group.exercises[formIdx])} onClose={()=>setFormIdx(null)}/>
      )}
    </div>
  );
}

function SessionView({session, week, logs, setLogs, prs, setPrs, swaps, setSwaps, setToast, onBack, onFinish}){
  const [mode, setMode] = useState('coach');
  const [stepIndex, setStepIndex] = useState(0);
  const [rest, setRest] = useState(null);
  const startedAt = useRef(Date.now());
  const sessionPRs = useRef([]);
  const screenRef = useRef(null);
  const total = session.groups.length;
  const group = session.groups[stepIndex];
  const now = useNow(!!rest, 200);
  const fired = useRef(null);
  useCountdownTicks(rest && rest.endAt, now, !!rest);
  useEffect(()=>{
    if(!rest) return;
    if(now >= rest.endAt && fired.current !== rest.endAt){
      fired.current = rest.endAt;
      playTick(true); setTimeout(playBeep, 120); vibrate([120,80,120]); notify('Rest complete', 'Time for your next set.');
    }
    if(now >= rest.endAt + 4000) setRest(null);
  }, [now, rest]);
  const startRest = (secs) => { const n = Date.now(); setRest({startAt:n, endAt:n+secs*1000}); };
  const jump = (idx) => { setStepIndex(idx); setMode('coach'); window.scrollTo({top:0, behavior:'smooth'}); };
  const go = (d) => { vibrate(10); setStepIndex(i=>Math.max(0, Math.min(total-1, i+d))); window.scrollTo({top:0, behavior:'smooth'}); };
  useSwipe(screenRef, {onBack, onLeft: mode==='coach' ? ()=>{ if(stepIndex<total-1) go(1); } : null, onRight: mode==='coach' ? ()=>{ if(stepIndex>0) go(-1); } : null});
  const isDone = (gi) => {
    const g = session.groups[gi];
    return g.exercises.every((ex,ei)=>{ const e = logs[`w${week}_${session.id}_${gi}_${ei}`]; const n = g.rounds || ex.sets || 0; return e && (e.done||[]).filter(Boolean).length >= n; });
  };
  const restAfter = group.rounds ? (group.restBetweenRounds ? `${plural(group.rounds,'round')} · rest ${group.restBetweenRounds}s between` : plural(group.rounds,'round'))
    : group.restAfter ? `Rest ${group.restAfter}s after each round` : null;
  const finish = () => onFinish({durationSec: Math.round((Date.now()-startedAt.current)/1000), prs: sessionPRs.current});

  return (
    <div className="screen detail anim-push" ref={screenRef} style={{'--c':session.color}}>
      <TopBar left={<BackBtn onClick={onBack} icon="close" label="Close"/>} title={`${session.name} · Week ${week}`} sub={mode==='coach' ? `Block ${stepIndex+1} of ${total}` : 'Overview'}
        right={<button className={`cbtn ${mode==='overview'?'on':''}`} onClick={()=>{ vibrate(8); setMode(m=>m==='coach'?'overview':'coach'); }} aria-label="Overview"><Icon name="list" size={18}/></button>}/>
      <div className="wsegs" style={{gridTemplateColumns:`repeat(${total},1fr)`}}>
        {session.groups.map((_,i)=>(<button key={i} className={i===stepIndex?'now':isDone(i)?'done':''} onClick={()=>jump(i)} aria-label={`Block ${i+1}`}></button>))}
      </div>

      {mode==='coach' ? (
        <div key={stepIndex} className="anim-tab">
          <div className="detail-head" style={{marginTop:20}}>
            <div className="eyebrow" style={{display:'flex', alignItems:'center', gap:7}}><span className="dot"></span>{groupKindLabel(group)}</div>
            <h1>{group.title}</h1>
            {(group.note || restAfter) && <div className="sub">{[group.note, restAfter].filter(Boolean).join(' · ')}</div>}
          </div>
          <StepCard group={group} sessionId={session.id} week={week} stepIndex={stepIndex}
            logs={logs} setLogs={setLogs} prs={prs} setPrs={setPrs} swaps={swaps} setSwaps={setSwaps}
            setToast={setToast} onRest={startRest} onPR={(p)=>{ if(!sessionPRs.current.some(x=>x.name===p.name)) sessionPRs.current.push(p); else sessionPRs.current = sessionPRs.current.map(x=>x.name===p.name ? p : x); }}
            key={`${session.id}_w${week}_${stepIndex}`}/>
          <div className="swipe-hint"><Icon name="swap" size={13}/>Swipe left or right to change block</div>
        </div>
      ) : (
        <div className="stagger" style={{marginTop:8}}>
          {session.groups.map((g, i)=>(
            <button className={`card ov-item press ${i===stepIndex?'cur':''}`} key={i} onClick={()=>jump(i)}>
              <div className="ov-top">
                <span className="eyebrow">{groupKindLabel(g)}{g.rounds ? ` · ${plural(g.rounds,'round')}` : ''}</span>
                {isDone(i) ? <span className="pill green"><Icon name="check" size={11} stroke={3}/>Done</span>
                  : (g.restAfter || g.restBetweenRounds) ? <span className="pill"><Icon name="timer" size={12}/>{g.restAfter||g.restBetweenRounds}s</span> : null}
              </div>
              <div className="ov-title">{g.title}</div>
              <div style={{marginTop:6}}>
                {g.exercises.map((ex,j)=>{
                  const nm = (swaps && swaps[`${session.id}_${i}_${j}`]) || ex.name;
                  return <div className="ov-ex" key={j}><span>{nm}</span><b>{targetLine(ex)}</b></div>;
                })}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="dock">
        <RestPill rest={rest} now={now} onSkip={()=>setRest(null)}/>
        {mode==='coach' && (
          <div className="btn-row">
            <button className="cbtn" disabled={stepIndex===0} onClick={()=>go(-1)} aria-label="Previous block"><Icon name="chevronLeft" size={22} stroke={2.2}/></button>
            {stepIndex<total-1
              ? <button className="btn btn-primary" onClick={()=>go(1)}>Next block<Icon name="chevronRight" size={18} stroke={2.4}/></button>
              : <button className="btn btn-primary" onClick={finish}><Icon name="check" size={18} stroke={2.6}/>Finish workout</button>}
          </div>
        )}
      </div>
    </div>
  );
}


/* =========================================================
   DAILY CALISTHENICS
   ========================================================= */
function newCali(focusId, vi, plan){
  const {focus, v} = caliSession(focusId, vi);
  return {
    v:3, date:dayKey(new Date()), startedAt:null, focusId:focus.id, vi,
    level:((plan && plan.levels) || {})[focus.id] || 0, step:0,
    warm: focus.warmup.map(()=>false),
    rounds: v.main.format==='circuit' ? Array.from({length:v.main.rounds}, ()=>({})) : [],
    emom:null, fin:{value:null, sw:null, timeUp:false},
    cool: focus.cooldown.map(()=>false),
    restStartedAt:null, restEndsAt:null, timer:null,
  };
}
// Untouched sessions follow today's slot (or a swap chosen today) and the current level.
function resolveCali(active, plan){
  const today = dayKey(new Date());
  if(isCali(active) && active.startedAt) return active;
  if(isCali(active) && active.date===today && active.chosen){
    return {...newCali(active.focusId, active.vi, plan), step:active.step||0, chosen:true};
  }
  const {focus, vi} = caliFor(new Date());
  const fresh = newCali(focus.id, vi, plan);
  if(isCali(active) && active.date===today) fresh.step = active.step||0;
  return fresh;
}
function caliSteps(s){
  const {v} = caliSession(s.focusId, s.vi);
  const st = [{k:'warm', label:'W', name:'Warm-up'}];
  if(v.main.format==='circuit') s.rounds.forEach((_,i)=> st.push({k:'round', i, label:String(i+1), name:`Round ${i+1}`}));
  else st.push({k:'emom', label:'EMOM', name:'EMOM'});
  if(v.finisher) st.push({k:'fin', label:'F', name:'Finisher'});
  st.push({k:'cool', label:'C', name:'Cool-down'});
  return st;
}
function caliRoundDone(s, ri){
  const {v} = caliSession(s.focusId, s.vi);
  const r = s.rounds[ri] || {};
  return v.main.exercises.every((_,ei)=> !!r[ei]);
}
function emomElapsed(e, now){ return e ? ((e.endedAt || e.pausedAt || now) - e.startAt - (e.pausedMs||0)) : 0; }
function caliProgress(s, now){
  const {v} = caliSession(s.focusId, s.vi);
  const exs = v.main.exercises.map(ex=>caliScale(ex, s.level));
  let reps = 0, roundsDone = 0, minutesDone = 0;
  if(v.main.format==='circuit'){
    s.rounds.forEach((r,ri)=>{
      exs.forEach((ex,ei)=>{ if(r && r[ei] && ex.reps!=null) reps += ex.reps*(ex.each?2:1); });
      if(caliRoundDone(s, ri)) roundsDone++;
    });
  } else if(s.emom){
    minutesDone = Math.max(0, Math.min(v.main.minutes, Math.floor(emomElapsed(s.emom, now)/60000)));
    for(let m=0;m<minutesDone;m++){ const ex = exs[m % exs.length]; if(ex.reps!=null) reps += ex.reps*(ex.each?2:1); }
  }
  return {reps, roundsDone, minutesDone, exs, v};
}
function stepDone(s, st, now){
  if(st.k==='warm') return s.warm.every(Boolean);
  if(st.k==='round') return caliRoundDone(s, st.i);
  if(st.k==='emom') return !!(s.emom && s.emom.endedAt);
  if(st.k==='fin') return s.fin && s.fin.value!=null;
  if(st.k==='cool') return s.cool.every(Boolean);
  return false;
}


function HoldRing({timer, now, secs}){
  const lead = now < timer.startsAt;
  const t = Math.max(now, timer.startsAt);
  let segStart = timer.startsAt, segEnd = timer.endsAt, side = null;
  if(timer.half){
    const firstSide = (t - timer.startsAt) < timer.half;
    side = lead ? null : (firstSide ? 'L' : 'R');
    if(firstSide) segEnd = timer.startsAt + timer.half; else segStart = timer.startsAt + timer.half;
  }
  const left = Math.max(0, Math.ceil((segEnd - t)/1000));
  const pct = lead ? 0 : Math.min(1, (t - segStart)/(segEnd - segStart));
  return (
    <LiveRing size={46} stroke={4} pct={pct} color="var(--accent)">
      <span className="tabnum" style={{fontWeight:800, fontSize: lead ? 10 : 13, lineHeight:1}}>{lead ? 'SET' : left}</span>
      {side && <span style={{fontSize:8.5, fontWeight:800, color:'var(--text-3)'}}>{side}</span>}
    </LiveRing>
  );
}


function CaliFinishSheet({s, log, prog, elapsed, onClose, onSave}){
  const {focus, v} = caliSession(s.focusId, s.vi);
  const [feel, setFeel] = useState('solid');
  const mainComplete = v.main.format==='circuit' ? prog.roundsDone >= v.main.rounds : prog.minutesDone >= v.main.minutes;
  const fin = v.finisher;
  const prevPB = fin ? caliPB(log, fin.id) : null;
  const newPB = fin && s.fin.value!=null && s.fin.value>0 && (prevPB==null || s.fin.value > prevPB);
  const suggestions = [];
  if(feel==='easy' && mainComplete){
    suggestions.push({id:'up', label:`${focus.name} felt easy`, detail:`Level ${s.level} → ${s.level+1}: +10% reps and +5s holds on ${focus.name} days`, apply:p=>({...p, levels:{...p.levels, [focus.id]:(p.levels[focus.id]||0)+1}})});
  }
  if(feel==='hard' && s.level>0){
    suggestions.push({id:'down', label:`${focus.name} felt hard`, detail:`Drop to level ${s.level-1} next time`, apply:p=>({...p, levels:{...p.levels, [focus.id]:Math.max(0,(p.levels[focus.id]||0)-1)}})});
  }
  const [off, setOff] = useState({});
  const chosen = suggestions.filter(x=>!off[x.id]);
  return (
    <Sheet title={`Finish ${focus.name}`} onClose={onClose} actions={(close)=><React.Fragment>
      <button className="btn btn-ghost" onClick={close}>Back</button>
      <button className="btn btn-primary" onClick={()=>onSave(feel, chosen)}><Icon name="check" size={17} stroke={2.6}/>Save session</button>
    </React.Fragment>}>
      <div className="card pad" style={{background:'var(--s2)', boxShadow:'none', border:'none'}}>
        <div className="stats c3">
          {v.main.format==='circuit'
            ? <Stat value={`${prog.roundsDone}/${v.main.rounds}`} label="Rounds"/>
            : <Stat value={`${prog.minutesDone}/${v.main.minutes}`} label="Minutes"/>}
          <Stat value={prog.reps} label="Reps"/>
          <Stat value={elapsed ? fmtMS(elapsed) : '—'} label="Time"/>
        </div>
      </div>
      {fin && (
        <div className="fin-result">
          <span>{fin.name}</span>
          <b>{s.fin.value!=null ? `${s.fin.value}${fin.unit==='secs'?'s':''}` : '—'}{newPB && <span className="pill orange"><Icon name="trophy" size={11}/>PB</span>}</b>
        </div>
      )}
      <div className="field" style={{marginTop:18}}>
        <label>How did it feel?</label>
        <Segmented value={feel} onChange={setFeel} options={FEELS}/>
      </div>
      {suggestions.length>0 ? (
        <div className="field">
          <label>Progression</label>
          {suggestions.map(x=>(
            <button key={x.id} className={`prog-opt ${off[x.id]?'':'on'}`} onClick={()=>setOff(o=>({...o, [x.id]:!o[x.id]}))}>
              <span className="tick"><Icon name="check" size={14} stroke={3}/></span>
              <span style={{flex:1}}><b>{x.label}</b><small>{x.detail}</small></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="help">{mainComplete ? 'Mark it Easy to level up this focus, or Hard to ease off.' : 'Finish the full main block to unlock a level-up.'}</div>
      )}
    </Sheet>
  );
}

function CaliSessionPreview({focus, vi, level}){
  const v = focus.variants[vi];
  const exs = v.main.exercises.map(ex=>caliScale(ex, level));
  const Block = ({title, items}) => (
    <div style={{marginTop:12}}>
      <div className="eyebrow">{title}</div>
      <div style={{marginTop:4}}>{items.map((it,i)=> <div className="ov-ex" key={i}><span>{it[0]}</span><b>{it[1]}</b></div>)}</div>
    </div>
  );
  return (
    <div>
      <Block title="Warm-up" items={focus.warmup.map(w=>[w.name, w.detail])}/>
      <Block title={v.main.format==='emom' ? `EMOM · ${v.main.minutes} min` : `Circuit · ${plural(v.main.rounds,'round')} · rest ${v.main.rest}s`} items={exs.map(ex=>[ex.name, exTarget(ex)])}/>
      {v.finisher && <Block title="Finisher" items={[[v.finisher.name, 'log it']]}/>}
      <Block title="Cool-down" items={focus.cooldown.map(c=>[`${c.name}${c.side?` (${c.side})`:''}`, `${c.secs}s`])}/>
    </div>
  );
}

function CaliOverview({s, plan, setPlan, log, legacy, canSwap, onSwap}){
  const week = caliWeekDates(new Date());
  const today = dayKey(new Date());
  const vi = caliWeekIndex(new Date());
  const doneDays = new Set(log.filter(isCali).map(e=>dayKey(e.date)));
  const [open, setOpen] = useState(null);
  const all = [...log, ...(legacy||[])];
  const streak = morningStreak(all);
  const pbs = [];
  CALI_FOCUS.forEach(f=> f.variants.forEach(v=>{ if(v.finisher && !pbs.some(p=>p.id===v.finisher.id)){ const b = caliPB(log, v.finisher.id); if(b!=null) pbs.push({id:v.finisher.id, name:v.finisher.name, unit:v.finisher.unit, best:b, color:f.color}); } }));
  return (
    <div className="stagger">
      <div className="sec" style={{marginTop:18}}>
        <div className="sec-h"><h3>This week · {CALI_VARIANTS[vi]}</h3><span className="meta">A → B → C</span></div>
        <div className="card list" style={{'--indent':'62px'}}>
          {week.map((d,i)=>{
            const f = CALI_FOCUS[i];
            const v = f.variants[vi];
            const k = dayKey(d);
            const isToday = k===today;
            const current = s.focusId===f.id && s.vi===vi;
            return (
              <React.Fragment key={i}>
                <button className="row" style={{'--c':f.color, background: isToday ? 'var(--accent-soft)' : undefined}} onClick={()=>setOpen(open===i?null:i)}>
                  <span className="ico tint"><Icon name={f.icon} size={17}/></span>
                  <div className="grow"><div className="t" style={{fontSize:15}}>{CALI_DAY_NAMES[i].slice(0,3)} · {f.name}</div><div className="s">{v.title} · {mainLine(v)}</div></div>
                  {doneDays.has(k) ? <span className="pill green"><Icon name="check" size={11} stroke={3}/></span> : isToday ? <span className="pill accent">Today</span> : null}
                  <Icon name={open===i ? 'chevronDown' : 'chevronRight'} size={15} color="var(--t3)" stroke={2.2}/>
                </button>
                {open===i && (
                  <div style={{padding:'0 16px 16px 62px', '--c':f.color}} className="anim-tab">
                    <CaliSessionPreview focus={f} vi={vi} level={(plan.levels||{})[f.id]||0}/>
                    {!current && (
                      <button className="btn btn-tint" style={{marginTop:14}} disabled={!canSwap} onClick={()=>onSwap(f.id, vi)}>
                        <Icon name="swap" size={17}/>{canSwap ? `Do ${f.name} today instead` : 'Finish or reset today first'}
                      </button>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="sec">
        <div className="sec-h"><h3>Levels</h3><span className="meta">+10% reps · +5s holds</span></div>
        <div className="card list">
          {CALI_FOCUS.map(f=>(
            <div className="row" key={f.id} style={{'--c':f.color, paddingTop:9, paddingBottom:9}}>
              <span className="dot"></span>
              <div className="grow"><div className="t" style={{fontSize:15}}>{f.name}</div></div>
              <Stepper value={(plan.levels||{})[f.id]||0} min={0} max={10} onChange={val=>setPlan(p=>({...p, levels:{...CALI_PLAN_DEFAULT.levels, ...(p.levels||{}), [f.id]:val}}))}/>
            </div>
          ))}
        </div>
        <div className="help" style={{margin:'8px 6px 0'}}>Mark a session Easy when you finish and you'll be offered the next level for that focus. Hard offers a step back.</div>
      </div>

      <div className="sec">
        <div className="sec-h"><h3>Benchmarks</h3><span className="meta">{streak ? `${plural(streak,'day')} streak` : ''}</span></div>
        <div className="card list">
          {pbs.length===0 && <Empty icon="trophy" title="No benchmarks yet" text="Finisher results and PBs show up here."/>}
          {pbs.map(p=>(
            <div className="row" key={p.id} style={{'--c':p.color}}>
              <span className="dot"></span>
              <div className="grow"><div className="t" style={{fontSize:15}}>{p.name}</div></div>
              <span className="num" style={{fontSize:17, fontWeight:600}}>{p.best}{p.unit==='secs'?'s':''}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sec">
        <div className="sec-h"><h3>History</h3><span className="meta">{plural(log.filter(isCali).length,'session')}</span></div>
        <div className="card list">
          {all.length===0 && <Empty icon="calendar" title="No sessions yet" text="Your daily sessions appear here."/>}
          {[...all].sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,40).map((e,i)=>{
            if(isCali(e)){
              const f = CALI_FOCUS.find(x=>x.id===e.focusId) || CALI_FOCUS[0];
              return (
                <div className="row" key={i} style={{'--c':f.color}}>
                  <span className="dot"></span>
                  <div className="grow"><div className="t" style={{fontSize:15}}>{f.name} · {e.title}</div><div className="s">{fmtDate(e.date, {weekday:'short', day:'numeric', month:'short'})} · {e.format==='emom' ? `${e.minutesDone}/${e.minutesTarget} min` : `${e.roundsDone}/${e.roundsTarget} rounds`} · {e.totalReps} reps</div></div>
                  {e.finisher && e.finisher.value!=null && <span className="num" style={{fontSize:16, fontWeight:600}}>{e.finisher.value}{e.finisher.unit==='secs'?'s':''}</span>}
                </div>
              );
            }
            return (
              <div className="row" key={i}>
                <span className="dot" style={{'--c':'var(--t3)'}}></span>
                <div className="grow"><div className="t" style={{fontSize:15}}>{isMorningV2(e) ? 'Old Morning' : 'Old 100s'}</div><div className="s">{fmtDate(e.date, {weekday:'short', day:'numeric', month:'short'})}</div></div>
                <span className="num t2" style={{fontSize:15}}>{e.rounds} rounds</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CaliView({active, setActive, log, setLog, legacy, plan, setPlan, onBack, onLogged, setToast, initialMode}){
  const today = dayKey(new Date());
  const s = resolveCali(active, plan);
  const {focus, v} = caliSession(s.focusId, s.vi);
  const steps = caliSteps(s);
  const lastStep = steps.length - 1;
  const step = Math.min(s.step||0, lastStep);
  const st = steps[step];
  const stale = !!s.startedAt && s.date !== today;
  const [mode, setMode] = useState(initialMode || 'coach');
  const [showFinish, setShowFinish] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [formName, setFormName] = useState(null);
  const screenRef = useRef(null);

  const emomRunning = !!(s.emom && !s.emom.endedAt && !s.emom.pausedAt);
  const swRunning = !!(s.fin && s.fin.sw && !s.fin.sw.stopAt);
  const timersOn = !!s.restEndsAt || !!s.timer || emomRunning || swRunning;
  const clockOn = !!s.startedAt;
  const now = useNow(timersOn || clockOn, timersOn ? 250 : 1000);
  const elapsed = s.startedAt ? (now - new Date(s.startedAt).getTime())/1000 : 0;
  const prog = caliProgress(s, now);
  const exs = prog.exs;

  const update = (fn, start=true) => setActive(prev=>{
    const base = resolveCali(prev, plan);
    const next = fn({...base});
    if(start && !next.startedAt) next.startedAt = new Date().toISOString();
    return next;
  });
  const goStep = (i) => { update(x=>({...x, step:Math.max(0, Math.min(lastStep, i))}), false); window.scrollTo({top:0, behavior:'smooth'}); };
  useEffect(()=>{ if(!confirmReset) return; const t = setTimeout(()=>setConfirmReset(false), 3000); return ()=>clearTimeout(t); }, [confirmReset]);

  /* ---- round ticking (shared by taps and hold timers) ---- */
  const tickEx = (ri, ei, val) => {
    const wasDone = caliRoundDone(s, ri);
    const nextRound = {...(s.rounds[ri]||{}), [ei]:val};
    const nowDone = exs.every((_,j)=> !!nextRound[j]);
    const R = s.rounds.length;
    update(x=>{
      const rounds = x.rounds.map((r,i)=> i===ri ? {...(r||{}), [ei]:val} : r);
      let extra = {};
      if(nowDone && !wasDone && ri < R-1 && v.main.rest>0){
        const n = new Date();
        extra = {restStartedAt:n.toISOString(), restEndsAt:new Date(n.getTime()+v.main.rest*1000).toISOString()};
      }
      const timer = x.timer && x.timer.key===`h:${ri}:${ei}` ? null : x.timer;
      return {...x, rounds, timer, ...extra};
    });
    if(nowDone && !wasDone){
      vibrate([30,40,60]);
      const roundStep = steps.findIndex(z=>z.k==='round' && z.i===ri);
      if(ri < R-1){ setToast(`Round ${ri+1} done${v.main.rest ? ` — rest ${v.main.rest}s` : ''}`); setTimeout(()=>goStep(roundStep+1), 500); }
      else { setToast('Main block done'); setTimeout(()=>goStep(roundStep+1), 600); }
    } else vibrate(12);
  };
  const startHold = (ri, ei) => update(x=>{
    const key = `h:${ri}:${ei}`;
    if(x.timer && x.timer.key===key) return {...x, timer:null};
    const ex = exs[ei];
    const n = Date.now();
    const dur = ex.secs*1000*(ex.each?2:1);
    return {...x, timer:{key, startsAt:n+CALI_REST_LEAD, endsAt:n+CALI_REST_LEAD+dur, half: ex.each ? ex.secs*1000 : null}};
  });

  /* ---- rest timer ---- */
  const restFired = useRef({});
  useEffect(()=>{
    if(!s.restEndsAt) return;
    if(now >= new Date(s.restEndsAt).getTime() && !restFired.current[s.restEndsAt]){
      restFired.current[s.restEndsAt] = true;
      playBeep(); vibrate([120,80,120]); notify('Rest over', 'Next round.');
      update(x=>({...x, restEndsAt:null, restStartedAt:null}), false);
    }
    // eslint-disable-next-line
  }, [now, s.restEndsAt]);

  /* ---- shared hold / stretch / finisher timer ---- */
  const timerFired = useRef({});
  useEffect(()=>{
    const t = s.timer;
    if(!t) return;
    const f = timerFired.current[t.endsAt] || (timerFired.current[t.endsAt] = {});
    if(t.half && now >= t.startsAt + t.half && !f.half){ f.half = true; vibrate([60,40,60]); playBeep(); }
    if(now < t.endsAt || f.end) return;
    f.end = true;
    playBeep(); vibrate([80,60,80]);
    if(t.key.startsWith('h:')){
      const [, ri, ei] = t.key.split(':').map(Number);
      tickEx(ri, ei, true);
    } else if(t.key.startsWith('c:')){
      const idx = Number(t.key.slice(2));
      update(x=>{
        const cool = [...x.cool]; cool[idx] = true;
        const nextIdx = cool.findIndex((d,i)=> !d && i>idx);
        const n = Date.now();
        return {...x, cool, timer: nextIdx>=0 ? {key:`c:${nextIdx}`, startsAt:n+CALI_REST_LEAD, endsAt:n+CALI_REST_LEAD+focus.cooldown[nextIdx].secs*1000} : null};
      });
    } else if(t.key==='fin'){
      notify('Time!', 'Log your finisher result.');
      update(x=>({...x, timer:null, fin:{...x.fin, timeUp:true}}));
    }
    // eslint-disable-next-line
  }, [now, s.timer]);

  /* ---- 3-2-1 countdown ticks ---- */
  useCountdownTicks(s.timer && s.timer.endsAt, now, !!s.timer);
  useCountdownTicks(s.timer && s.timer.half ? s.timer.startsAt + s.timer.half : null, now, !!(s.timer && s.timer.half));
  useCountdownTicks(s.restEndsAt ? new Date(s.restEndsAt).getTime() : null, now, !!s.restEndsAt);
  const emomMinEnd = (s.emom && !s.emom.endedAt && !s.emom.pausedAt) ? (()=>{ const el = emomElapsed(s.emom, now); const m = Math.floor(Math.max(0,el)/60000); return el < 0 ? s.emom.startAt : s.emom.startAt + (s.emom.pausedMs||0) + (m+1)*60000; })() : null;
  useCountdownTicks(emomMinEnd, now, !!emomMinEnd);

  /* ---- EMOM engine ---- */
  const lastMin = useRef(null);
  useEffect(()=>{
    const e = s.emom;
    if(!e || e.endedAt || e.pausedAt) return;
    const el = emomElapsed(e, now);
    if(el < 0) return;
    const m = Math.floor(el/60000);
    if(m >= v.main.minutes){
      playBeep(); vibrate([120,80,120,80,120]);
      update(x=>({...x, emom:{...x.emom, endedAt: x.emom.startAt + (x.emom.pausedMs||0) + v.main.minutes*60000}}), false);
      setToast(`EMOM done — ${v.main.minutes} minutes`);
      const emStep = steps.findIndex(z=>z.k==='emom');
      setTimeout(()=>goStep(emStep+1), 700);
      return;
    }
    if(lastMin.current !== m){
      if(lastMin.current !== null || m===0){ playBeep(); vibrate(80); }
      lastMin.current = m;
    }
    // eslint-disable-next-line
  }, [now, s.emom]);
  const emomStart = () => { lastMin.current = null; update(x=>({...x, emom:{startAt:Date.now()+5000, pausedAt:null, pausedMs:0, endedAt:null}})); };
  const emomPause = () => update(x=>({...x, emom:{...x.emom, pausedAt:Date.now()}}), false);
  const emomResume = () => update(x=>({...x, emom:{...x.emom, pausedMs:(x.emom.pausedMs||0) + (Date.now() - x.emom.pausedAt), pausedAt:null}}), false);
  const emomEnd = () => update(x=>{ const n = Date.now(); const e = x.emom; const pm = (e.pausedMs||0) + (e.pausedAt ? n - e.pausedAt : 0); return {...x, emom:{...e, pausedMs:pm, pausedAt:null, endedAt:Math.max(n, e.startAt + pm)}}; }, false);

  /* ---- finisher ---- */
  const fin = v.finisher;
  const finPB = fin ? caliPB(log, fin.id) : null;
  const setFinValue = (val) => update(x=>({...x, fin:{...x.fin, value:val}}));
  const finStartWindow = () => update(x=>{ const n = Date.now(); return {...x, fin:{...x.fin, timeUp:false}, timer:{key:'fin', startsAt:n+CALI_REST_LEAD, endsAt:n+CALI_REST_LEAD+fin.window*1000}}; });
  const swStart = () => update(x=>({...x, fin:{...x.fin, sw:{startAt:Date.now()+CALI_REST_LEAD, stopAt:null}}}));
  const swStop = () => update(x=>{
    const sw = x.fin.sw; const n = Date.now();
    const secs = Math.max(0, Math.round((n - sw.startAt)/1000));
    return {...x, fin:{...x.fin, sw:{...sw, stopAt:n}, value:secs}};
  });

  /* ---- cool-down ---- */
  const startCool = (idx) => update(x=>{
    const key = `c:${idx}`;
    if(x.timer && x.timer.key===key) return {...x, timer:null};
    const n = Date.now();
    return {...x, timer:{key, startsAt:n, endsAt:n+focus.cooldown[idx].secs*1000}};
  });
  const toggleCool = (idx) => update(x=>{ const cool=[...x.cool]; cool[idx]=!cool[idx]; return {...x, cool, timer: x.timer && x.timer.key===`c:${idx}` ? null : x.timer}; });
  const toggleWarm = (i) => update(x=>{ const warm=[...x.warm]; warm[i]=!warm[i]; return {...x, warm}; });
  const tickAllWarm = () => update(x=>({...x, warm: x.warm.every(Boolean) ? x.warm.map(()=>false) : x.warm.map(()=>true)}));

  const saveSession = (feel, chosen) => {
    const entry = {
      v:3, date: s.startedAt || new Date().toISOString(),
      focusId:s.focusId, vi:s.vi, title:v.title, level:s.level, format:v.main.format,
      roundsDone:prog.roundsDone, roundsTarget: v.main.format==='circuit' ? v.main.rounds : null,
      minutesDone:prog.minutesDone, minutesTarget: v.main.format==='emom' ? v.main.minutes : null,
      totalReps:prog.reps,
      finisher: fin ? {id:fin.id, name:fin.name, unit:fin.unit, value:s.fin.value} : null,
      durationSec: stale ? null : Math.round(elapsed),
      feel,
    };
    const pb = fin && entry.finisher.value!=null && entry.finisher.value>0 && (finPB==null || entry.finisher.value>finPB);
    setLog(prev=>[...prev, entry]);
    if(chosen.length) setPlan(p=> chosen.reduce((acc,x)=> x.apply(acc), {...p, levels:{...CALI_PLAN_DEFAULT.levels, ...(p.levels||{})}}));
    setActive(null);
    setShowFinish(false);
    onLogged(entry, pb, chosen);
  };
  const reset = () => { if(!confirmReset){ setConfirmReset(true); return; } setActive(null); setConfirmReset(false); };
  const swap = (focusId, vi) => { setActive({...newCali(focusId, vi, plan), chosen:true}); setMode('coach'); window.scrollTo({top:0}); setToast(`Swapped to ${caliSession(focusId, vi).focus.name}`); };

  const emomRunningNow = st.k==='emom' && s.emom && !s.emom.endedAt;
  useSwipe(screenRef, {onBack, onLeft: mode==='coach' && !emomRunningNow ? ()=>{ if(step<lastStep) goStep(step+1); } : null, onRight: mode==='coach' && !emomRunningNow ? ()=>{ if(step>0) goStep(step-1); } : null});
  /* ---------- step bodies ---------- */
  const lvlTxt = s.level ? ` · Level ${s.level}` : '';
  let body = null;
  if(st.k==='warm'){
    const allWarm = s.warm.every(Boolean);
    body = (
      <div className="card list">
        <div className="block-head">
          <div><div className="eyebrow">{focus.name} · easy pace</div><h2>Warm-up</h2></div>
          <button className="btn btn-tint sm" onClick={tickAllWarm}>{allWarm ? 'Untick all' : <React.Fragment><Icon name="check" size={15} stroke={2.6}/>All done</React.Fragment>}</button>
        </div>
        {focus.warmup.map((w,i)=>(
          <button key={i} className={`chk ${s.warm[i]?'on':''}`} onClick={()=>{ vibrate(10); toggleWarm(i); }} aria-pressed={!!s.warm[i]}>
            <span className="tick"><Icon name="check" size={15} stroke={3}/></span>
            <span className="nm">{w.name}</span>
            <span className="det">{w.detail}</span>
          </button>
        ))}
      </div>
    );
  } else if(st.k==='round'){
    const ri = st.i;
    const r = s.rounds[ri] || {};
    body = (
      <div className="card list">
        <div className="block-head">
          <div><div className="eyebrow" style={{display:'flex', alignItems:'center', gap:7}}><span className="dot"></span>{v.title}{lvlTxt}</div><h2 className="num">Round {ri+1} <span>/ {s.rounds.length}</span></h2></div>
        </div>
        {exs.map((ex,ei)=>{
          const on = !!r[ei];
          if(ex.secs!=null){
            const running = s.timer && s.timer.key===`h:${ri}:${ei}`;
            return (
              <div key={ei} className={`chk ${on?'on':''} ${running?'running':''}`} onClick={()=> on ? tickEx(ri, ei, false) : startHold(ri, ei)} role="button" aria-pressed={on}>
                <button className="tick" onClick={e=>{ e.stopPropagation(); tickEx(ri, ei, !on); }} aria-label="Mark done"><Icon name="check" size={15} stroke={3}/></button>
                <span className="nm">{ex.name}<small>{on ? 'Done' : running ? 'Tap to stop' : `Tap to start the ${ex.secs}s timer${ex.each?' · each side':''}`}</small></span>
                {running ? <HoldRing timer={s.timer} now={now}/> : <span className="val num">{ex.secs}<small>s{ex.each?' ×2':''}</small></span>}
                <FormBtn onClick={()=>setFormName(ex.name)}/>
              </div>
            );
          }
          return (
            <div key={ei} className={`chk ${on?'on':''}`} onClick={()=>tickEx(ri, ei, !on)} role="button" aria-pressed={on}>
              <span className="tick"><Icon name="check" size={15} stroke={3}/></span>
              <span className="nm">{ex.name}{ex.each && <small>each side</small>}</span>
              <span className="val num"><small>× </small>{ex.reps}</span>
              <FormBtn onClick={()=>setFormName(ex.name)}/>
            </div>
          );
        })}
      </div>
    );
  } else if(st.k==='emom'){
    const e = s.emom;
    const M = v.main.minutes;
    const el = emomElapsed(e, now);
    const lead = e && el < 0;
    const m = e ? Math.max(0, Math.floor(el/60000)) : 0;
    const secLeft = e ? Math.ceil((60000 - (Math.max(0,el) % 60000))/1000) : 60;
    const cur = exs[m % exs.length];
    const nxt = exs[(m+1) % exs.length];
    const finished = e && e.endedAt;
    if(!e){
      body = (
        <div className="card list">
          <div className="block-head"><div><div className="eyebrow" style={{display:'flex', alignItems:'center', gap:7}}><span className="dot"></span>{v.title}{lvlTxt}</div><h2>EMOM <span>· {M} min</span></h2></div></div>
          <div className="help" style={{margin:'0 16px 6px'}}>Every minute on the minute: do the reps, then rest for whatever's left of that minute. The exercise changes each minute.</div>
          {exs.map((ex,i)=>(
            <div key={i} className="chk static">
              <span className="badge num">{i+1}</span>
              <span className="nm">{ex.name}<small>Minutes {Array.from({length:Math.ceil(M/exs.length)},(_,k)=>i+1+k*exs.length).filter(x=>x<=M).join(', ')}</small></span>
              <span className="val num">{ex.reps!=null ? <React.Fragment><small>× </small>{ex.reps}</React.Fragment> : <React.Fragment>{ex.secs}<small>s</small></React.Fragment>}</span>
              <FormBtn onClick={()=>setFormName(ex.name)}/>
            </div>
          ))}
          <div style={{padding:'6px 16px 16px'}}><button className="btn btn-primary" onClick={emomStart}><Icon name="play" size={15}/>Start EMOM</button></div>
        </div>
      );
    } else if(!finished){
      body = (
        <div>
          <div className="emom-ring">
            <LiveRing size={270} stroke={16} pct={lead ? 0 : 1 - secLeft/60} gradient>
              {lead ? (
                <React.Fragment><div className="eyebrow">Get ready</div><div className="emom-big num">{Math.ceil(-el/1000)}</div><div className="emom-cap">first up: {cur.name}</div></React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="eyebrow">Minute {m+1} of {M}</div>
                  <div className="emom-big num" style={{marginTop:4}}>{`0:${pad2(secLeft===60?0:secLeft)}`.replace('0:00','1:00')}</div>
                  <div className="emom-cap">{e.pausedAt ? 'Paused' : 'left this minute'}</div>
                </React.Fragment>
              )}
            </LiveRing>
          </div>
          <div className="card now-card">
            <div style={{flex:1, minWidth:0}}><div className="eyebrow accent-txt">{lead ? 'First up' : 'Now'}</div><h3>{cur.name}</h3></div>
            <div className="reps num">{cur.reps!=null ? cur.reps : `${cur.secs}s`}<small>{cur.each ? 'EACH SIDE' : cur.reps!=null ? 'REPS' : 'HOLD'}</small></div>
            <FormBtn onClick={()=>setFormName(cur.name)}/>
          </div>
          <div className="card up-next"><span>Up next</span><span><b>{nxt.name}</b> · <span className="num">{exTarget(nxt)}</span></span></div>
          <div className="mins" style={{gridTemplateColumns:`repeat(${M},1fr)`}}>
            {Array.from({length:M}).map((_,i)=><i key={i} className={i<m && !lead ? 'done' : i===m && !lead ? 'now' : ''}></i>)}
          </div>
          <div className="meta-row" style={{marginTop:7}}><span>{prog.minutesDone} done · {prog.reps} reps</span><span>{M} min</span></div>
        </div>
      );
    } else {
      body = (
        <div className="card">
          <Empty icon="check" title={`EMOM done · ${prog.minutesDone}/${M} minutes`} text={`${prog.reps} reps. On to the ${v.finisher ? 'finisher' : 'cool-down'}.`}/>
        </div>
      );
    }
  } else if(st.k==='fin'){
    const t = s.timer && s.timer.key==='fin' ? s.timer : null;
    const sw = s.fin.sw;
    const swEl = sw ? Math.max(0, ((sw.stopAt || now) - sw.startAt)/1000) : 0;
    const swLead = sw && !sw.stopAt && now < sw.startAt;
    const val = s.fin.value;
    const tLead = t && now < t.startsAt;
    const tLeft = t ? Math.max(0, Math.ceil((t.endsAt - Math.max(now, t.startsAt))/1000)) : fin.window;
    body = (
      <div className="card list">
        <div className="block-head"><div><div className="eyebrow">Finisher · benchmark</div><h2>{fin.name}</h2></div></div>
        <div className="meta-row" style={{margin:'4px 16px 0'}}>
          <span><Icon name="trophy" size={14} color="var(--orange)"/>Best <b>{finPB!=null ? `${finPB}${fin.unit==='secs'?'s':''}` : '—'}</b></span>
          <span>{fin.unit==='secs' ? 'Seconds' : 'Reps'}</span>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'18px 16px 6px'}}>
          {fin.window ? (
            <React.Fragment>
              <LiveRing size={180} stroke={12} pct={t && !tLead ? 1 - tLeft/fin.window : (s.fin.timeUp ? 1 : 0)} gradient>
                <div className="eyebrow">{t ? (tLead ? 'Get set' : 'Go!') : s.fin.timeUp ? 'Time' : 'Timer'}</div>
                <div className="big-time num" style={{marginTop:6}}>{t ? (tLead ? Math.ceil((t.startsAt-now)/1000) : fmtMS(tLeft)) : fmtMS(s.fin.timeUp ? 0 : fin.window)}</div>
              </LiveRing>
              {!t && <button className="btn btn-tint" onClick={finStartWindow}><Icon name="play" size={14}/>{s.fin.timeUp ? `Restart ${fin.window}s` : `Start ${fin.window}s timer`}</button>}
            </React.Fragment>
          ) : fin.unit==='secs' ? (
            <React.Fragment>
              <div className="big-time num" style={{fontSize:56}}>{swLead ? Math.ceil((sw.startAt-now)/1000) : fmtMS(swEl)}</div>
              {sw && !sw.stopAt
                ? <button className="btn btn-primary" onClick={swStop}><Icon name="pause" size={15}/>Stop</button>
                : <button className="btn btn-tint" onClick={swStart}><Icon name="play" size={14}/>{sw ? 'Go again' : 'Start stopwatch'}</button>}
            </React.Fragment>
          ) : (
            <div className="help" style={{marginTop:0, textAlign:'center'}}>One all-out set with good form. Log what you got.</div>
          )}
        </div>
        <div className="row" style={{marginTop:6}}>
          <div className="grow"><div className="t" style={{fontSize:15}}>Your result</div><div className="s">{val==null ? 'Set it with − / + or the timer' : fin.unit==='secs' ? 'Seconds held' : 'Total reps'}</div></div>
          <Stepper value={val!=null ? val : 0} min={0} max={600} onChange={setFinValue}/>
        </div>
      </div>
    );
  } else if(st.k==='cool'){
    const t = s.timer && s.timer.key.startsWith('c:') ? s.timer : null;
    const allCool = s.cool.every(Boolean);
    const firstOpen = s.cool.findIndex(d=>!d);
    body = (
      <div className="card list">
        <div className="block-head">
          <div><div className="eyebrow">{focus.name} · timed stretches</div><h2>Cool-down</h2></div>
          {!allCool && !t && <button className="btn btn-tint sm" onClick={()=>startCool(firstOpen)}><Icon name="play" size={13}/>Start</button>}
        </div>
        {focus.cooldown.map((c,i)=>{
          const running = t && t.key===`c:${i}`;
          return (
            <div key={i} className={`chk ${s.cool[i]?'on':''} ${running?'running':''}`} onClick={()=>!s.cool[i] && startCool(i)} role="button">
              <button className="tick" onClick={e=>{ e.stopPropagation(); toggleCool(i); }} aria-label="Mark done"><Icon name="check" size={15} stroke={3}/></button>
              <span className="nm">{c.name}{c.side && <small>{c.side}</small>}</span>
              {running ? <HoldRing timer={t} now={now}/> : <span className="det">{s.cool[i] ? 'Done' : `${c.secs}s`}</span>}
            </div>
          );
        })}
        <div className="help" style={{margin:'4px 16px 16px'}}>Tap a stretch to start its timer — it rolls straight into the next one.</div>
      </div>
    );
  }

  const nextLabel = () => {
    const nx = steps[step+1];
    if(!nx) return '';
    if(st.k==='warm') return v.main.format==='emom' ? 'To the EMOM' : 'Round 1';
    if(nx.k==='round') return 'Next round';
    if(nx.k==='fin') return 'Finisher';
    if(nx.k==='cool') return 'Cool-down';
    return nx.name;
  };
  const rest = s.restEndsAt ? {startAt:new Date(s.restStartedAt).getTime(), endAt:new Date(s.restEndsAt).getTime()} : null;
  const emomLive = st.k==='emom' && s.emom && !s.emom.endedAt;

  return (
    <div className="screen detail anim-push" ref={screenRef} style={{'--c':focus.color}}>
      <TopBar left={<BackBtn onClick={onBack} icon="close" label="Close"/>} title={focus.name} sub={`${v.title} · Week ${CALI_VARIANTS[s.vi]}`}
        right={<button className={`cbtn ${mode==='overview'?'on':''}`} onClick={()=>{ vibrate(8); setMode(m=>m==='coach'?'overview':'coach'); }} aria-label="Week and levels"><Icon name="calendar" size={18}/></button>}/>

      {mode==='overview' ? (
        <CaliOverview s={s} plan={plan} setPlan={setPlan} log={log} legacy={legacy} canSwap={!s.startedAt} onSwap={swap}/>
      ) : (
        <React.Fragment>
          {stale && (
            <div className="banner">
              <Icon name="clock" size={20} color="var(--orange)"/>
              <div style={{flex:1}}>
                <div className="t">Unfinished {focus.name} from {fmtDate(s.startedAt, {weekday:'long', day:'numeric', month:'short'})}</div>
                <div className="s">Log what you did, or clear it to start today's session.</div>
                <div className="btn-row" style={{marginTop:10}}>
                  <button className="btn btn-tint sm" style={{width:'100%'}} onClick={()=>setShowFinish(true)}>Log it</button>
                  <button className="btn btn-ghost sm" style={{width:'100%'}} onClick={()=>setActive(null)}>Clear</button>
                </div>
              </div>
            </div>
          )}
          <div className="steps" style={{gridTemplateColumns: steps.map(z=> z.k==='emom' ? '2.4fr' : '1fr').join(' ')}}>
            {steps.map((z,i)=>{
              const done = stepDone(s, z, now);
              return (
                <button key={i} className={`step ${done?'done':''} ${i===step?'now':''}`} onClick={()=>goStep(i)} aria-label={z.name}>
                  {done && i!==step ? <Icon name="check" size={14} stroke={3}/> : z.label}
                </button>
              );
            })}
          </div>
          <div className="meta-row">
            <span><Icon name="timer" size={14}/><b>{fmtMS(elapsed)}</b>{s.startedAt ? '' : ' · starts on first tick'}</span>
            <span>{v.main.format==='circuit' ? <React.Fragment><b>{prog.roundsDone}/{v.main.rounds}</b> rounds</React.Fragment> : <React.Fragment><b>{prog.minutesDone}/{v.main.minutes}</b> min</React.Fragment>} · <b>{prog.reps}</b> reps</span>
          </div>

          <div key={step} className="anim-tab">{body}</div>

          {!!s.startedAt && !stale && (
            <button className="btn btn-ghost" style={{marginTop:14, color:'var(--red)'}} onClick={reset}><Icon name="reset" size={17}/>{confirmReset ? 'Tap again to clear this session' : 'Reset session'}</button>
          )}
          {!s.startedAt && step===0 && (
            <button className="btn btn-ghost" style={{marginTop:14}} onClick={()=>setMode('overview')}><Icon name="swap" size={17}/>See the week or swap today</button>
          )}

          <div className="dock">
            <RestPill rest={rest} now={now} label={`Rest between rounds · ${v.main.rest}s`} onSkip={()=>update(x=>({...x, restEndsAt:null, restStartedAt:null}), false)}/>
            {emomLive ? (
              <div className="btn-row">
                {s.emom.pausedAt
                  ? <button className="btn btn-primary" onClick={emomResume}><Icon name="play" size={15}/>Resume</button>
                  : <button className="btn btn-ghost" onClick={emomPause}><Icon name="pause" size={15}/>Pause</button>}
                <button className="btn btn-ghost" style={{color:'var(--red)'}} onClick={emomEnd}>End early</button>
              </div>
            ) : (
              <div className="btn-row">
                <button className="cbtn" disabled={step===0} onClick={()=>goStep(step-1)} aria-label="Previous"><Icon name="chevronLeft" size={22} stroke={2.2}/></button>
                {step<lastStep
                  ? <button className="btn btn-primary" onClick={()=>{ vibrate(10); goStep(step+1); }}>{nextLabel()}<Icon name="chevronRight" size={18} stroke={2.4}/></button>
                  : <button className="btn btn-primary" disabled={!s.startedAt} onClick={()=>setShowFinish(true)}><Icon name="check" size={18} stroke={2.6}/>Finish</button>}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {formName && <FormSheet name={formName} onClose={()=>setFormName(null)}/>}
      {showFinish && (
        <CaliFinishSheet s={s} log={log} prog={prog} elapsed={stale ? 0 : elapsed} onClose={()=>setShowFinish(false)} onSave={saveSession}/>
      )}
    </div>
  );
}


/* =========================================================
   APP — tabs + pushed detail screens
   ========================================================= */
const BACKUP_KEYS = ['week','logs','stats','height','unit','prs','swaps','completions','fast','fastHistory','cardioLog','stretchLog','spotifyClientId','morningLog','caliLog','caliActive','caliPlan','themePref'];
const TABS = [
  {id:'today', label:'Today', icon:'home', iconOff:'homeO'},
  {id:'train', label:'Train', icon:'dumbbell'},
  {id:'progress', label:'Progress', icon:'chart'},
  {id:'you', label:'You', icon:'user'},
];

function App(){
  const [week, setWeek] = usePersisted('ftx_week', 1);
  const [logs, setLogs] = usePersisted('ftx_logs', {});
  const [stats, setStats] = usePersisted('ftx_bodystats', []);
  const [height, setHeight] = usePersisted('ftx_height', null);
  const [unit, setUnit] = usePersisted('ftx_unit', 'kg');
  const [prs, setPrs] = usePersisted('ftx_prs', {});
  const [swaps, setSwaps] = usePersisted('ftx_swaps', {});
  const [completions, setCompletions] = usePersisted('ftx_completions', []);
  const [fast, setFast] = usePersisted('ftx_fast', null);
  const [fastHistory, setFastHistory] = usePersisted('ftx_fastHistory', []);
  const [cardioLog, setCardioLog] = usePersisted('ftx_cardioLog', []);
  const [stretchLog, setStretchLog] = usePersisted('ftx_stretchLog', []);
  const [morningLog, setMorningLog] = usePersisted('ftx_morningLog', []);
  const [caliLog, setCaliLog] = usePersisted('ftx_caliLog', []);
  const [caliActive, setCaliActive] = usePersisted('ftx_caliActive', null);
  const [caliPlan, setCaliPlan] = usePersisted('ftx_caliPlan', CALI_PLAN_DEFAULT);
  const [spotifyClientId, setSpotifyClientId] = usePersisted('ftx_spotify_client_id', '');
  const [spotifyTokens, setSpotifyTokens] = usePersisted('ftx_spotify_tokens', null);
  const [themePref, setThemePref] = usePersisted('ftx_theme', 'system');

  const [tab, setTab] = useState('today');
  const [detail, setDetail] = useState(null);       // null | 'session' | 'cali' | 'fasting' | 'bodystats' | 'cardio' | 'stretch'
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [caliMode, setCaliMode] = useState('coach');
  const [toast, setToastState] = useState(null);
  const [summary, setSummary] = useState(null);
  const setToast = (msg, icon='check') => setToastState(msg ? {msg, icon, id:Date.now()} : null);

  const sysDark = useSystemDark();
  const resolvedTheme = themePref==='system' ? (sysDark ? 'dark' : 'light') : themePref;
  applyTheme(resolvedTheme);

  // Launch splash
  useEffect(()=>{
    const el = document.getElementById('splash');
    if(!el) return;
    const t1 = setTimeout(()=> el.classList.add('hide'), 450);
    const t2 = setTimeout(()=> el.remove(), 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  // Offline support: service worker (only on https, e.g. GitHub Pages)
  useEffect(()=>{ try{ if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')) navigator.serviceWorker.register('./sw.js').catch(()=>{}); }catch(e){} }, []);
  useEffect(()=>{ if(!toast) return; const t = setTimeout(()=>setToastState(null), 3600); return ()=>clearTimeout(t); }, [toast]);
  useEffect(()=>{ const unlock = () => { getAudioCtx(); }; document.addEventListener('pointerdown', unlock, {once:true}); return () => document.removeEventListener('pointerdown', unlock); }, []);
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if(code && spotifyClientId){
      exchangeSpotifyCode(spotifyClientId, code).then(data=>{
        setSpotifyTokens({access_token:data.access_token, refresh_token:data.refresh_token, expires_at:Date.now()+data.expires_in*1000});
        setToast('Spotify connected', 'music');
      }).catch(()=> setToast('Spotify connection failed', 'close'))
        .finally(()=> window.history.replaceState({}, '', window.location.pathname));
    } else if(code){ window.history.replaceState({}, '', window.location.pathname); }
    // eslint-disable-next-line
  }, []);

  const scrollTop = () => window.scrollTo({top:0});
  const goTab = (t) => { vibrate(8); if(t===tab && !detail){ window.scrollTo({top:0, behavior:'smooth'}); return; } setDetail(null); setTab(t); scrollTop(); };
  const push = (d) => { setDetail(d); scrollTop(); };
  const back = () => { setDetail(null); setActiveSessionId(null); scrollTop(); };
  const openSession = (id) => {
    if(id==='cardio' || id==='stretch'){ push(id); return; }
    setActiveSessionId(id); push('session');
  };
  const openCali = (mode='coach') => { setCaliMode(mode); push('cali'); };
  const activeSession = SESSIONS.find(s=>s.id===activeSessionId);

  const finishWorkout = (meta={}) => {
    if(!activeSession){ back(); return; }
    const volume = computeSessionVolume(activeSession, week, logs);
    const sc = sessionSetCounts(activeSession, week, logs);
    const prevSame = [...completions].reverse().find(c=>c.sessionId===activeSession.id);
    const n = completions.filter(c=>c.week===week).length + 1;
    const durationSec = meta.durationSec || null;
    setCompletions(prev=>[...prev, {date:new Date().toISOString(), week, sessionId:activeSession.id, volume, durationSec, sets:sc.done}]);
    const pct = prevSame && prevSame.volume>0 ? Math.round((volume/prevSame.volume - 1)*100) : null;
    const prsHit = meta.prs || [];
    setSummary({
      color: activeSession.color, eyebrow:`${activeSession.name} · Week ${week}`, title:'Workout complete', subtitle: activeSession.subtitle,
      date: new Date().toLocaleDateString('en-GB',{weekday:'short', day:'numeric', month:'short'}),
      stats:[
        {v: durationSec ? fmtMS(durationSec) : '—', l:'Time'},
        {v: volume>=1000 ? (volume/1000).toFixed(2) : Math.round(volume), u: volume>=1000 ? 't' : 'kg', l:'Volume'},
        {v:`${sc.done}/${sc.total}`, l:'Sets done'},
        {v: prsHit.length, l: prsHit.length===1 ? 'New record' : 'New records'},
      ],
      compare: pct!=null ? {text:`${fmtSigned(pct,0)}% volume vs your last ${activeSession.name} (${fmtDate(prevSame.date)})`, tone: pct>=0 ? 'up' : 'down'} : null,
      highlights: [
        ...prsHit.map(p=>({icon:'trophy', tone:'gold', text:`New record · ${p.name} ${p.weight} kg × ${p.reps}`})),
        {icon:'calendar', text:`${plural(n,'gym session')} logged in week ${week}`},
      ],
    });
    back();
  };
  const caliSummary = (e, pb, lvl) => {
    const {focus} = caliSession(e.focusId, e.vi);
    const prevSame = [...caliLog].reverse().find(x=>isCali(x) && x.focusId===e.focusId && x!==e);
    const pct = prevSame && prevSame.totalReps>0 ? Math.round((e.totalReps/prevSame.totalReps - 1)*100) : null;
    const fin = e.finisher;
    setSummary({
      color: focus.color, eyebrow:`${focus.name} · Week ${CALI_VARIANTS[e.vi]}`, title: e.title, subtitle:'Daily calisthenics',
      date: new Date().toLocaleDateString('en-GB',{weekday:'short', day:'numeric', month:'short'}),
      stats:[
        {v: e.durationSec ? fmtMS(e.durationSec) : '—', l:'Time'},
        {v: e.totalReps, l:'Reps'},
        e.format==='emom' ? {v:`${e.minutesDone}/${e.minutesTarget}`, l:'Minutes'} : {v:`${e.roundsDone}/${e.roundsTarget}`, l:'Rounds'},
        fin ? {v: fin.value!=null ? fin.value : '—', u: fin.value!=null && fin.unit==='secs' ? 's' : '', l:'Finisher'} : {v: e.level, l:'Level'},
      ],
      compare: pct!=null ? {text:`${fmtSigned(pct,0)}% reps vs your last ${focus.name} day`, tone: pct>=0 ? 'up' : 'down'} : null,
      highlights: [
        ...(pb && fin ? [{icon:'trophy', tone:'gold', text:`New PB · ${fin.name} ${fin.value}${fin.unit==='secs'?'s':''}`}] : []),
        ...lvl.map(x=>({icon:'push', text:x.id==='up' ? `Level up saved for ${focus.name}` : `${focus.name} eased back a level`})),
        {icon:'heart', text:`Felt ${e.feel}`},
      ],
    });
  };

  const exportData = () => {
    const payload = {app:APP_NAME, week, logs, stats, height, unit, prs, swaps, completions, fast, fastHistory, cardioLog, stretchLog,
      spotifyClientId, morningLog, caliLog, caliActive, caliPlan, themePref, exportedAt:new Date().toISOString()};
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dbs-pplx-backup-${dayKey(new Date())}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
    setToast('Backup downloaded', 'download');
  };
  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try{
        const data = JSON.parse(e.target.result);
        if(!data || typeof data!=='object' || !BACKUP_KEYS.some(k=> k in data)) throw new Error('not a backup');
        const arr = v => Array.isArray(v);
        const obj = v => v && typeof v==='object' && !Array.isArray(v);
        if(typeof data.week==='number') setWeek(Math.min(TOTAL_WEEKS, Math.max(1, data.week)));
        if(obj(data.logs)) setLogs(data.logs);
        if(arr(data.stats)) setStats(data.stats);
        if(data.height!=null) setHeight(data.height);
        if(data.unit==='kg' || data.unit==='lb') setUnit(data.unit);
        if(obj(data.prs)) setPrs(data.prs);
        if(obj(data.swaps)) setSwaps(data.swaps);
        if(arr(data.completions)) setCompletions(data.completions);
        if(data.fast!==undefined) setFast(data.fast);
        if(arr(data.fastHistory)) setFastHistory(data.fastHistory);
        if(arr(data.cardioLog)) setCardioLog(data.cardioLog);
        if(arr(data.stretchLog)) setStretchLog(data.stretchLog);
        if(arr(data.morningLog)) setMorningLog(data.morningLog);
        if(arr(data.caliLog)) setCaliLog(data.caliLog);
        if(data.caliActive!==undefined) setCaliActive(data.caliActive);
        if(obj(data.caliPlan) && obj(data.caliPlan.levels)) setCaliPlan({levels:{...CALI_PLAN_DEFAULT.levels, ...data.caliPlan.levels}});
        if(['light','dark','system'].includes(data.themePref)) setThemePref(data.themePref);
        if(data.spotifyClientId) setSpotifyClientId(data.spotifyClientId);
        setToast('Data imported', 'upload');
      }catch(err){ setToast('Import failed — not a valid backup file', 'close'); }
    };
    reader.readAsText(file);
  };

  const shared = {week, setWeek, completions, caliActive, caliLog, caliPlan, morningLog, cardioLog, stretchLog, stats, height, unit, fast, fastHistory, prs, logs, swaps};

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div className={spotifyTokens ? 'has-ticker' : ''}>
        {!detail && tab==='today' && (
          <Today key="today" {...shared} onOpenCali={()=>openCali('coach')} onOpenSession={openSession} onTab={goTab}
            onOpenBodyStats={()=>push('bodystats')} onOpenFasting={()=>push('fasting')}/>
        )}
        {!detail && tab==='train' && (
          <Train key="train" {...shared} onOpenSession={openSession} onOpenCali={()=>openCali('coach')} onOpenCaliWeek={()=>openCali('overview')}
            onOpenFasting={()=>push('fasting')} onOpenBodyStats={()=>push('bodystats')}/>
        )}
        {!detail && tab==='progress' && (
          <Progress key="progress" {...shared} onOpenBodyStats={()=>push('bodystats')}/>
        )}
        {!detail && tab==='you' && (
          <You key="you" week={week} themePref={themePref} setThemePref={setThemePref} unit={unit} setUnit={setUnit}
            onExport={exportData} onImport={importData}
            spotifyClientId={spotifyClientId} setSpotifyClientId={setSpotifyClientId}
            spotifyTokens={spotifyTokens} setSpotifyTokens={setSpotifyTokens} setToast={setToast}/>
        )}

        {detail==='session' && activeSession && (
          <SessionView session={activeSession} week={week} logs={logs} setLogs={setLogs}
            prs={prs} setPrs={setPrs} swaps={swaps} setSwaps={setSwaps} setToast={setToast}
            onBack={back} onFinish={finishWorkout}/>
        )}
        {detail==='cali' && (
          <CaliView active={caliActive} setActive={setCaliActive} log={caliLog} setLog={setCaliLog} legacy={morningLog}
            plan={caliPlan} setPlan={setCaliPlan} setToast={setToast} onBack={back} initialMode={caliMode}
            onLogged={(e, pb, lvl)=>{ caliSummary(e, pb, lvl); back(); }}/>
        )}
        {detail==='fasting' && <FastingView fast={fast} setFast={setFast} fastHistory={fastHistory} setFastHistory={setFastHistory} onBack={back}/>}
        {detail==='bodystats' && <BodyStatsView stats={stats} setStats={setStats} height={height} setHeight={setHeight} unit={unit} onBack={back}/>}
        {detail==='cardio' && <ActivityLogView kind="cardio" entries={cardioLog} setEntries={setCardioLog} onBack={back}/>}
        {detail==='stretch' && <ActivityLogView kind="stretch" entries={stretchLog} setEntries={setStretchLog} onBack={back}/>}

        {!detail && (
          <nav className="tabbar">
            {TABS.map(t=>(
              <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>goTab(t.id)} aria-label={t.label} aria-current={tab===t.id ? 'page' : undefined}>
                <Icon name={tab===t.id || !t.iconOff ? t.icon : t.iconOff} size={25} stroke={tab===t.id ? 2.1 : 1.8}/>{t.label}
              </button>
            ))}
          </nav>
        )}
        {summary && <SummaryOverlay data={summary} setToast={setToast} onClose={()=>setSummary(null)}/>}
        {toast && <div className="toast" key={toast.id} role="status"><span className="ti"><Icon name={toast.icon} size={14} stroke={2.6} color="#fff"/></span>{toast.msg}</div>}
        <SpotifyTicker clientId={spotifyClientId} tokens={spotifyTokens} setTokens={setSpotifyTokens} low={!!detail}/>
      </div>
    </ThemeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);


