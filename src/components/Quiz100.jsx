import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import './Quiz100.css';
import dogIntroImg from '../assets/opening.png';
import dogResultsImg from '../assets/result-message.png';

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    text: 'מהי טמפרטורת הגוף התקינה של כלב בריא?',
    options: {
      A: '35.5–36.5°C',
      B: '37.5–39.2°C',
      C: '40.0–41.5°C',
      D: '36.0–37.0°C',
    },
    correct: 'B',
    hint: 'טמפרטורת הגוף של כלב גבוהה מעט מזו של בני אדם.',
    explanation:
      'טמפרטורת הגוף התקינה של כלב היא 37.5–39.2°C. חום מעל 39.5°C נחשב לחום גבוה הדורש בדיקה וטרינרית.',
  },
  {
    id: 2,
    text: 'מהו החיסון הבסיסי הניתן לגורי כלבים בגיל 8 שבועות?',
    options: {
      A: 'חיסון לכלבת בלבד',
      B: 'חיסון DHPP משולב',
      C: 'חיסון ללפטוספירוזה',
      D: 'חיסון לבורדטלה',
    },
    correct: 'B',
    hint: 'החיסון הבסיסי מגן מפני מספר מחלות בו-זמנית — ראשי התיבות שלו כוללים Distemper ו-Parvovirus.',
    explanation:
      'חיסון DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus) הוא החיסון הבסיסי הניתן לגורים בגיל 8 שבועות.',
  },
  {
    id: 3,
    text: 'איזה טפיל אחראי למחלת הלישמניה בכלבים?',
    options: {
      A: 'Toxoplasma gondii',
      B: 'Dirofilaria immitis',
      C: 'Leishmania infantum',
      D: 'Babesia canis',
    },
    correct: 'C',
    hint: 'הטפיל מועבר על ידי יתושים, ושמו זהה לשם המחלה עצמה.',
    explanation:
      'Leishmania infantum הוא הטפיל החד-תאי האחראי למחלת הלישמניה בכלבים, המועבר על ידי יתוש הפלבוטומוס.',
  },
  {
    id: 4,
    text: 'מהו הסימן הקליני האופייני ביותר לפניאומוניה בכלב?',
    options: {
      A: 'שלשול כרוני ואובדן משקל',
      B: 'שיעול ועלייה בקצב הנשימה',
      C: 'צהבת ואנמיה',
      D: 'תסמיני עצבים ופרכוסים',
    },
    correct: 'B',
    hint: 'פניאומוניה פוגעת בריאות — חשוב על תסמינים הקשורים לנשימה.',
    explanation:
      'פניאומוניה בכלב מאופיינת בשיעול, עלייה בקצב הנשימה (טכיפנאה), קשיי נשימה וחום.',
  },
  {
    id: 5,
    text: 'מהו הטיפול הראשוני המועדף לכלב עם הרעלת אורגנופוספטים?',
    options: {
      A: 'אטרופין ופרלידוקסים',
      B: 'פניצילין ופרדניזון',
      C: 'פואורוסמיד ותיאמין',
      D: 'גלוקוז תוך-ורידי',
    },
    correct: 'A',
    hint: 'הרעלת אורגנופוספטים גורמת לעודף אצטילכולין — הטיפול צריך לחסום פעילות זו.',
    explanation:
      'הטיפול בהרעלת אורגנופוספטים כולל אטרופין (לחסום אצטילכולין) ופרלידוקסים (להחיות את האצטילכולינאסטראז).',
  },
  {
    id: 6,
    text: 'מהו מנגנון הפעולה של תרופת האיברמקטין בכלבים?',
    options: {
      A: 'מעכב סינתזת חלבון בחיידקים',
      B: 'מגביר חדירות ממברנה לכלוריד בחסרי חוליות',
      C: 'חוסם קולטני בטא-אדרנרגי',
      D: 'מעכב אנזים ה-ACE',
    },
    correct: 'B',
    hint: 'איברמקטין אינו אנטיביוטיקה — הוא פועל על מערכת העצבים של טפילים, לא של חיידקים.',
    explanation:
      'איברמקטין פועל על ידי הגברת חדירות ממברנת העצב לכלוריד בחסרי חוליות, מה שגורם לשיתוק ומוות של הטפיל.',
  },
  {
    id: 7,
    text: 'איזו מחלה מועברת על ידי קרציות וגורמת לאנמיה המוליטית חמורה בכלבים?',
    options: {
      A: 'Ehrlichia canis',
      B: 'Babesia canis',
      C: 'Borrelia burgdorferi',
      D: 'Anaplasma platys',
    },
    correct: 'B',
    hint: 'המחלה נגרמת על ידי טפיל שפוגע ישירות בתוך כדוריות הדם האדומות.',
    explanation:
      'Babesia canis היא טפיל תוך-כדורית דם הגורם להרס כדוריות דם אדומות ואנמיה המוליטית חמורה.',
  },
  {
    id: 8,
    text: 'מה משמעות ערך BUN גבוה בבדיקת דם של כלב?',
    options: {
      A: 'בעיה בתפקוד הכבד',
      B: 'בעיה בתפקוד הכליות',
      C: 'חסר ברזל',
      D: 'זיהום חיידקי פעיל',
    },
    correct: 'B',
    hint: 'BUN הוא תוצר פירוק חלבון — האיבר שאמור להפריש אותו הוא גם האיבר המסנן.',
    explanation:
      'BUN (Blood Urea Nitrogen) הוא תוצר פירוק חלבון המופרש על ידי הכליות. ערך גבוה מעיד על ירידה בסינון הגלומרולרי ואי-ספיקת כליות.',
  },
  {
    id: 9,
    text: 'מהו גיל הגמילה המומלץ לגורי כלבים מהאם?',
    options: {
      A: '3–4 שבועות',
      B: '6–8 שבועות',
      C: '10–12 שבועות',
      D: '4–5 שבועות',
    },
    correct: 'B',
    hint: 'גמילה מוקדמת מדי פוגעת בהתפתחות — הגור צריך לפחות חודשיים עם האם.',
    explanation:
      'גיל הגמילה המומלץ הוא 6–8 שבועות. גמילה מוקדמת מדי עלולה לגרום לבעיות התנהגות ועיכוב בפיתוח מערכת החיסון.',
  },
  {
    id: 10,
    text: 'מהו הוירוס הגורם לפרבוווירוס בכלבים?',
    options: {
      A: 'Canine Coronavirus',
      B: 'Canine Parvovirus type 2 (CPV-2)',
      C: 'Canine Distemper Virus',
      D: 'Canine Adenovirus',
    },
    correct: 'B',
    hint: 'שם הוירוס זהה לשם המחלה — חפש את האפשרות שמכילה את המילה "Parvovirus".',
    explanation:
      'פרבוווירוס בכלבים נגרם על ידי Canine Parvovirus type 2 (CPV-2), וירוס הפוגע במעיים ובמח העצם ומסכן חיים ללא טיפול.',
  },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const MAX_ATTEMPTS = 3;
const QUESTION_TIME = 60;
const MAX_HINTS = 4;

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const IconLock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" fill="#C8956C" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#C8956C" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="white" />
  </svg>
);

const IconTimer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M12 9v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconLightbulb = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 21h6M12 3a6 6 0 0 1 4.243 10.243C15.12 14.364 15 15.172 15 16H9c0-.828-.12-1.636-1.243-2.757A6 6 0 0 1 12 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDog = () => (
  <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Body */}
    <ellipse cx="60" cy="90" rx="30" ry="28" fill="#B8835A" />
    {/* Head */}
    <ellipse cx="60" cy="52" rx="26" ry="24" fill="#C4956A" />
    {/* Ears */}
    <ellipse cx="38" cy="38" rx="11" ry="16" rx="10" ry="15" fill="#8B5E3C" transform="rotate(-15 38 38)" />
    <ellipse cx="82" cy="38" rx="10" ry="15" fill="#8B5E3C" transform="rotate(15 82 38)" />
    {/* Snout */}
    <ellipse cx="60" cy="62" rx="13" ry="9" fill="#D4A574" />
    {/* Nose */}
    <ellipse cx="60" cy="57" rx="5" ry="3.5" fill="#3A2010" />
    {/* Eyes */}
    <circle cx="50" cy="48" r="4" fill="white" />
    <circle cx="70" cy="48" r="4" fill="white" />
    <circle cx="51" cy="48" r="2.5" fill="#3A2010" />
    <circle cx="71" cy="48" r="2.5" fill="#3A2010" />
    <circle cx="52" cy="47" r="1" fill="white" />
    <circle cx="72" cy="47" r="1" fill="white" />
    {/* Mouth */}
    <path d="M54 66 Q60 71 66 66" stroke="#3A2010" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Tail */}
    <path d="M88 85 Q105 70 100 58" stroke="#B8835A" strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* Legs */}
    <rect x="42" y="108" width="10" height="18" rx="5" fill="#B8835A" />
    <rect x="58" y="108" width="10" height="18" rx="5" fill="#B8835A" />
    <rect x="34" y="105" width="10" height="16" rx="5" fill="#A07040" />
    <rect x="76" y="105" width="10" height="16" rx="5" fill="#A07040" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Quiz100() {
  // Screen state
  const [screen, setScreen] = useState('intro'); // intro | confidentiality | quiz | results
  const [serialNumber, setSerialNumber] = useState('');
  const [agreedConfidentiality, setAgreedConfidentiality] = useState(false);

  // Attempt / quiz progress
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [activeQuestions, setActiveQuestions] = useState([...QUESTIONS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerState, setAnswerState] = useState(null); // null | 'correct' | 'wrong' | 'timeout'

  // Answers across all attempts
  const [currentAttemptAnswers, setCurrentAttemptAnswers] = useState({});
  const [allAnswers, setAllAnswers] = useState({}); // accumulated best results
  const [prevWrongAnswers, setPrevWrongAnswers] = useState({}); // { questionId: selectedKey } to show red border

  // Timer
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef(null);

  // Hints
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = activeQuestions[currentIndex] || null;
  const isLastQuestion = currentIndex === activeQuestions.length - 1;

  // ── Scroll to top on every screen / question change ────────────────────
  const screenRef = useRef(null);
  useLayoutEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = 0;
  }, [screen, currentIndex]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start/reset timer whenever question changes (and we're on quiz screen, unanswered)
  useEffect(() => {
    if (screen !== 'quiz') return;
    setTimeLeft(QUESTION_TIME);
    return stopTimer;
  }, [screen, currentIndex, stopTimer]);

  // Tick
  useEffect(() => {
    if (screen !== 'quiz' || answerState !== null) {
      stopTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return stopTimer;
  }, [screen, currentIndex, answerState, stopTimer]);

  // Timeout handler
  useEffect(() => {
    if (timeLeft === 0 && screen === 'quiz' && answerState === null && currentQuestion) {
      stopTimer();
      setAnswerState('timeout');
      setCurrentAttemptAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { selected: null, correct: false, timedOut: true },
      }));
    }
  }, [timeLeft, screen, answerState, currentQuestion, stopTimer]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectOption = (key) => {
    if (answerState !== null || !currentQuestion) return;
    stopTimer();
    const correct = key === currentQuestion.correct;
    setSelectedOption(key);
    setAnswerState(correct ? 'correct' : 'wrong');
    setCurrentAttemptAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: key, correct, timedOut: false },
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const merged = { ...allAnswers, ...currentAttemptAnswers };
      setAllAnswers(merged);
      setScreen('results');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState(null);
      setShowHint(false);
    }
  };

  const calcScore = (answers) => {
    const correct = Object.values(answers).filter((a) => a.correct).length;
    return Math.round((correct / QUESTIONS.length) * 100);
  };

  const finalScore = calcScore(allAnswers);
  const passed = finalScore === 100;
  const noMoreAttempts = attemptNumber >= MAX_ATTEMPTS && !passed;

  const handleRetry = () => {
    const failedQIds = Object.entries(allAnswers)
      .filter(([, a]) => !a.correct)
      .map(([id]) => parseInt(id, 10));

    const failedQs = QUESTIONS.filter((q) => failedQIds.includes(q.id));

    const wrongMap = {};
    failedQIds.forEach((id) => {
      const a = allAnswers[id];
      if (a && !a.timedOut && a.selected) wrongMap[id] = a.selected;
    });

    setPrevWrongAnswers(wrongMap);
    setAttemptNumber((n) => n + 1);
    setActiveQuestions(shuffle(failedQs));
    setCurrentIndex(0);
    setCurrentAttemptAnswers({});
    setSelectedOption(null);
    setAnswerState(null);
    setShowHint(false);
    setTimeLeft(QUESTION_TIME);
    setHintsLeft(MAX_HINTS);
    setScreen('quiz');
  };

  const handleUseHint = () => {
    if (hintsLeft <= 0 || answerState !== null || !currentQuestion || showHint) return;
    setShowHint(true);
    setHintsLeft((h) => h - 1);
  };

  const startQuiz = () => {
    setActiveQuestions(shuffle(QUESTIONS));
    setCurrentIndex(0);
    setCurrentAttemptAnswers({});
    setAllAnswers({});
    setPrevWrongAnswers({});
    setSelectedOption(null);
    setAnswerState(null);
    setAttemptNumber(1);
    setShowHint(false);
    setHintsLeft(MAX_HINTS);
    setScreen('confidentiality');
  };

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const timerColor =
    timeLeft > 30 ? '#2D6A4F' : timeLeft > 15 ? '#E8913A' : '#C0435A';
  const timerPercent = Math.round((timeLeft / QUESTION_TIME) * 100);

  // ── Option style helper ────────────────────────────────────────────────────
  const getOptionClass = (key) => {
    const isSelected = selectedOption === key;
    const isCorrect = currentQuestion && key === currentQuestion.correct;
    const isPrevWrong = prevWrongAnswers[currentQuestion?.id] === key;

    if (answerState === null) {
      // Unanswered state — highlight prev wrong answer with red border
      if (isPrevWrong) return 'option option--prev-wrong';
      return 'option';
    }

    // After answer / timeout
    if (answerState === 'timeout') {
      if (isCorrect) return 'option option--correct-reveal';
      return 'option option--dimmed';
    }

    if (isSelected && isCorrect) return 'option option--correct';
    if (isSelected && !isCorrect) return 'option option--wrong';
    if (!isSelected && isCorrect) return 'option option--correct-reveal';
    return 'option option--dimmed';
  };

  const getOptionIcon = (key) => {
    if (answerState === null) return null;
    const isSelected = selectedOption === key;
    const isCorrect = currentQuestion && key === currentQuestion.correct;
    if (answerState === 'timeout') {
      if (isCorrect) return <span className="option__icon option__icon--green"><IconCheck /></span>;
      return null;
    }
    if (isSelected && isCorrect) return <span className="option__icon option__icon--green"><IconCheck /></span>;
    if (isSelected && !isCorrect) return <span className="option__icon option__icon--red"><IconX /></span>;
    if (!isSelected && isCorrect) return <span className="option__icon option__icon--green"><IconCheck /></span>;
    return null;
  };

  // ── SCREEN: Intro ──────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="app-shell">
        <div key="intro" ref={screenRef} className="screen screen--intro anim-fade-up" style={{ paddingTop: '17.5vh' }}>
          <div className="intro__dog-wrap">
            <img src={dogIntroImg} alt="בוחן זיהומים" className="intro__dog-img" />
          </div>

          <div className="intro__stats">
            <div className="intro__stat">
              <span className="intro__stat-icon">💡</span>
              <div className="intro__stat-num">{MAX_HINTS}</div>
              <div className="intro__stat-label">רמזים</div>
            </div>
            <div className="intro__stat">
              <span className="intro__stat-icon"><IconTimer /></span>
              <div className="intro__stat-num">1</div>
              <div className="intro__stat-label">דקה לשאלה</div>
            </div>
            <div className="intro__stat">
              <span className="intro__stat-icon">📋</span>
              <div className="intro__stat-num">{QUESTIONS.length}</div>
              <div className="intro__stat-label">שאלות</div>
            </div>
          </div>

          <div className="intro__serial-group">
            <div className="intro__serial-label">הזן פרטים:</div>
            <input
              className="intro__serial-input"
              type="text"
              placeholder="מספר סידורי..."
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value.replace(/\D/g, ''))}
              dir="rtl"
            />
          </div>

          <button className="btn btn--green btn--full" onClick={startQuiz}>
            ← התחל בוחן
          </button>
        </div>
      </div>
    );
  }

  // ── SCREEN: Confidentiality overlay ───────────────────────────────────────
  if (screen === 'confidentiality') {
    return (
      <div className="app-shell">
        <div key="confidentiality" ref={screenRef} className="screen screen--overlay anim-fade-scale">
          <div className="confidentiality__card">
            <div className="confidentiality__lock-wrap">
              <div className="confidentiality__lock-circle">
                <IconLock />
              </div>
            </div>

            <h2 className="confidentiality__title">הצהרת סודיות</h2>
            <p className="confidentiality__subtitle">לפני שתתחיל, אנא קרא ואשר</p>

            <div className="confidentiality__rules-card">
              <div className="confidentiality__rules-header">
                📋 חומר הבוחן הינו <strong>סודי לחלוטין</strong> ומוגן.
              </div>
              <ul className="confidentiality__rules-list">
                <li>אסור להעביר, לשתף או לפרסם את תוכן השאלות</li>
                <li>אסור לצלם מסך או להקליט את הבוחן</li>
                <li>אסור לשתף תשובות עם נבחנים אחרים</li>
                <li>הפרת הסודיות עשויה לגרור השלכות משמעותיות</li>
              </ul>
            </div>

            <label className="confidentiality__checkbox-row">
              <span className="confidentiality__checkbox-text">
                קראתי, הבנתי, ואני מתחייב לשמור על סודיות החומר
              </span>
              <div
                className={`confidentiality__checkbox ${agreedConfidentiality ? 'confidentiality__checkbox--checked' : ''}`}
                onClick={() => setAgreedConfidentiality((v) => !v)}
              >
                {agreedConfidentiality && <IconCheck />}
              </div>
            </label>

            <button
              className={`btn btn--full ${agreedConfidentiality ? 'btn--green' : 'btn--disabled'}`}
              onClick={() => agreedConfidentiality && setScreen('quiz')}
              disabled={!agreedConfidentiality}
            >
              {agreedConfidentiality ? '← אני מאשר – התחל בוחן' : 'יש לאשר את ההצהרה תחילה'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN: Quiz ──────────────────────────────────────────────────────────
  if (screen === 'quiz' && currentQuestion) {
    const questionNumberLabel = `שאלה ${currentQuestion.id} מתוך ${QUESTIONS.length}`;
    const progressLabel = `${currentIndex + 1} / ${activeQuestions.length}`;

    // Progress dots for attempt tracking
    const attemptDots = Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
      <span
        key={i}
        className={`attempt-dot ${i < attemptNumber ? 'attempt-dot--active' : ''}`}
      />
    ));

    const explanationBoxClass =
      answerState === 'correct'
        ? 'explanation-box explanation-box--correct'
        : answerState === 'wrong'
        ? 'explanation-box explanation-box--wrong'
        : answerState === 'timeout'
        ? 'explanation-box explanation-box--timeout'
        : '';

    const explanationBadge =
      answerState === 'correct'
        ? '✅ תשובה נכונה!'
        : answerState === 'wrong'
        ? '✕ תשובה שגויה'
        : answerState === 'timeout'
        ? '⏱ נגמר הזמן'
        : '';

    return (
      <div className="app-shell">
        <div key={`quiz-${currentIndex}`} ref={screenRef} className="screen screen--quiz anim-slide-right">
          {/* Header row: progress pill + attempt dots */}
          <div className="quiz__header">
            <div className="quiz__progress-pill">{progressLabel}</div>
            <div className="quiz__attempt-dots">{attemptDots}</div>
          </div>

          {/* Timer bar */}
          <div className="quiz__timer-row">
            <span className="quiz__timer-label" style={{ color: timerColor }}>
              {timeLeft}s
            </span>
            <div className="quiz__timer-track">
              <div
                className="quiz__timer-bar"
                style={{
                  width: `${timerPercent}%`,
                  backgroundColor: timerColor,
                  transition: 'width 1s linear, background-color 0.5s',
                }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="quiz__question-card">
            <span className="quiz__question-badge">{questionNumberLabel}</span>
            <p className="quiz__question-text">{currentQuestion.text}</p>
          </div>

          {/* Options */}
          <div className="quiz__options">
            {Object.entries(currentQuestion.options).map(([key, text]) => (
              <button
                key={key}
                className={getOptionClass(key)}
                onClick={() => handleSelectOption(key)}
                disabled={answerState !== null}
              >
                <span className="option__letter">{key}</span>
                <span className="option__text">{text}</span>
                {getOptionIcon(key)}
              </button>
            ))}
          </div>

          {/* Hint box — visible once revealed, stays until next question */}
          {showHint && answerState === null && (
            <div className="hint-box">
              <span className="hint-box__badge">
                <IconLightbulb /> רמז
              </span>
              <p className="hint-box__text">{currentQuestion.hint}</p>
            </div>
          )}

          {/* Hints button (only before answering) */}
          {answerState === null && (
            <button
              className="hint-btn"
              onClick={handleUseHint}
              disabled={hintsLeft <= 0 || showHint}
            >
              <IconLightbulb />
              <span>{showHint ? 'רמז מוצג' : `רמז (${hintsLeft} נותרו)`}</span>
            </button>
          )}

          {/* Explanation box (after answering) */}
          {answerState !== null && (
            <div className={explanationBoxClass}>
              <span className="explanation-box__badge">{explanationBadge}</span>
              <p className="explanation-box__text">{currentQuestion.explanation}</p>
              <button className="btn btn--green btn--full" onClick={handleNext}>
                {isLastQuestion
                  ? 'סיים בוחן ←'
                  : `← המשך לשאלה ${currentIndex + 2}`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── SCREEN: Results ───────────────────────────────────────────────────────
  if (screen === 'results') {
    const correctCount = Object.values(allAnswers).filter((a) => a.correct).length;
    const isHighScore = finalScore >= 60;
    const scoreColor = isHighScore ? '#2D6A4F' : '#C0435A';
    const scoreBgClass = isHighScore ? 'score-box score-box--pass' : 'score-box score-box--fail';

    const getQuestionStatus = (qId) => {
      const a = allAnswers[qId];
      if (!a) return 'pending';
      if (a.timedOut) return 'timeout';
      if (a.correct) return 'correct';
      return 'wrong';
    };

    const failedCount = QUESTIONS.filter((q) => !allAnswers[q.id]?.correct).length;
    const canRetry = !passed && attemptNumber < MAX_ATTEMPTS;

    return (
      <div className="app-shell">
        <div key={`results-${attemptNumber}`} ref={screenRef} className="screen screen--results anim-fade-up">
          {/* Dog image */}
          <div className="results__dog-wrap">
            <img src={dogResultsImg} alt="כלב" className="results__dog-img" />
          </div>

          {/* Score box */}
          <div className={scoreBgClass}>
            <div className="score-box__percent" style={{ color: scoreColor }}>
              {finalScore}%
            </div>
            <div className="score-box__sub">
              {correctCount} מתוך {QUESTIONS.length} נכונות
            </div>
          </div>

          {/* Attempt indicator */}
          <div className="results__attempt-row">
            <div className="results__attempt-dots">
              {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
                <span
                  key={i}
                  className={`attempt-dot attempt-dot--lg ${i < attemptNumber ? 'attempt-dot--red' : ''}`}
                />
              ))}
            </div>
            <span className="results__attempt-label">ניסיון {attemptNumber} מתוך {MAX_ATTEMPTS}</span>
          </div>

          {/* Question grid */}
          <div className="results__grid">
            {QUESTIONS.map((q) => {
              const status = getQuestionStatus(q.id);
              return (
                <div
                  key={q.id}
                  className={`results__grid-item results__grid-item--${status}`}
                >
                  {status === 'correct' && <span className="results__grid-icon">✓</span>}
                  {status === 'wrong' && <span className="results__grid-icon">✕</span>}
                  {status === 'timeout' && <span className="results__grid-icon">⏱</span>}
                  {status === 'pending' && <span className="results__grid-icon">—</span>}
                  <span className="results__grid-label">שאלה {q.id}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom box */}
          {passed ? (
            <div className="results__info-box results__info-box--pass">
              <strong>כל הכבוד! 🎉</strong>
              <br />
              עברת את הבוחן בהצלחה עם ציון מושלם!
            </div>
          ) : noMoreAttempts ? (
            <div className="results__info-box results__info-box--no-attempts">
              <div className="results__info-box__header">
                🚫 הגעת לניסיון השלישי שלך
              </div>
              לא ייתכנו עוד ניסיונות בבוחן זה.
              <br />
              מומלץ לעבור על החומר שנית.
            </div>
          ) : (
            <>
              <div className="results__info-box results__info-box--retry">
                <div className="results__info-box__header">
                  ← הסיבוב הבא – רק השגיאות
                </div>
                יש לך {failedCount} שגיאות. הבוחן ימשיך עם שאלות אלו בלבד, עד שתענה על כולן נכון.
              </div>
              <button className="btn btn--pink btn--full" onClick={handleRetry}>
                ↺ לחץ להמשך
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
