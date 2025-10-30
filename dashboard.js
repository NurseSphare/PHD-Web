/* =========================================================
   📊 PHDU Dashboard — dashboard.js
   يحتوي على: تحميل البيانات من Google Script + عرض الرسوم
   ========================================================= */

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwq_GgpEJgRg-Fb3R6AotmOVmBnQz5136tsaKuzXLWQnMl7U6I1pq3gAGYsh0iMbCkB/exec";

const yearSel = document.getElementById('yearSel');
const monthSel = document.getElementById('monthSel');
const cardsWrap = document.getElementById('cardsWrap');
const ttlYear = document.getElementById('ttl-year');
const ttlMonth = document.getElementById('ttl-month');
const spinner = document.getElementById('spinnerOverlay');

// 🔹 إظهار / إخفاء السبينر
function showSpinner(show = true) {
  spinner.classList.toggle('active', show);
}

// 🔹 دالة fetch بدون كاش
const fetchNoCache = (url) => fetch(url + `&t=${Date.now()}`, { cache: "no-store" });

// =============================
// 1️⃣ تحميل السنوات
// =============================
async function loadYears() {
  showSpinner(true);
  try {
    const res = await fetchNoCache(WEBAPP_URL + "?action=years");
    const data = await res.json();
    yearSel.innerHTML = `<option value="">Choose year</option>` +
      data.years.map(y => `<option value="${y}">${y}</option>`).join('');
  } catch (err) {
    console.error("⚠️ Error loading years:", err);
  } finally {
    showSpinner(false);
  }
}

// =============================
// 2️⃣ تحميل الأشهر بعد اختيار سنة
// =============================
async function loadMonths(year) {
  showSpinner(true);
  try {
    const res = await fetchNoCache(`${WEBAPP_URL}?action=months&year=${year}`);
    const data = await res.json();
    monthSel.innerHTML = data.months && data.months.length
      ? `<option value="">Choose month</option>` + data.months.map(m => `<option value="${m}">${m}</option>`).join('')
      : `<option value="">No months found</option>`;
  } catch (err) {
    console.error("⚠️ Error loading months:", err);
  } finally {
    showSpinner(false);
  }
}

// =============================
// 3️⃣ تحميل البيانات حسب السنة والشهر
// =============================
async function loadData() {
  const year = yearSel.value;
  const month = monthSel.value;
  if (!year || !month) return;

  ttlYear.textContent = year;
  ttlMonth.textContent = month;

  // 🧹 تنظيف البطاقات القديمة قبل التحميل الجديد
  cardsWrap.innerHTML = `
    <div class="card-dash" style="grid-column:1/-1;text-align:center;color:var(--muted);">
      Loading data for ${month} ${year}...
    </div>`;

  showSpinner(true);

  try {
    const res = await fetchNoCache(`${WEBAPP_URL}?action=data&year=${year}&month=${month}`);
    const json = await res.json();

    cardsWrap.innerHTML = "";

    if (!json.success || !json.data || Object.keys(json.data).length === 0) {
      cardsWrap.innerHTML = `
        <div class="card-dash" style="grid-column:1/-1;text-align:center;padding:40px;font-weight:600;color:var(--muted);">
          🚫 No data found for ${month} ${year}
        </div>`;
      return;
    }

    const data = json.data;

    // ✅ ترتيب الكروت (KPI/Statistic دائماً في النهاية)
    let cardsHTML = Object.entries(data)
      .sort(([a], [b]) => (a === "KPI/Statistic" ? 1 : b === "KPI/Statistic" ? -1 : 0))
      .map(([sectionName, section]) => {
        const total = section.total || 0;
        const subs = section.breakdown || {};

        const entries = Object.entries(subs)
          .filter(([_, val]) => {
            if (val === "" || val == null) return false;
            const num = parseFloat(val);
            const zeroPct = typeof val === "string" && val.trim().startsWith("0") && val.includes("%");
            return !(num === 0 || (isNaN(num) && zeroPct));
          })
          .map(([key, val]) => renderSubRow(sectionName, key, val, subs, total))
          .filter(Boolean)
          .join('');

        if (!entries.trim()) return "";

        return `
        <div class="card-dash ${sectionName === "KPI/Statistic" ? "xwide" : sectionName === "Patient Outcome" ? "x2" : ""}"
             onclick='openDetails("${sectionName}", ${JSON.stringify(section)})'>
          <div style="padding-bottom:10px;border-bottom:1px solid #e5e7eb;margin-bottom:10px;">
            <h3 style="font-size:1.05rem;font-weight:700;color:#0f172a;margin:0;letter-spacing:0.3px;">
              ${sectionName}
            </h3>
            ${renderTotal(sectionName, total)}
          </div>
          <div class="subs">${entries}</div>
        </div>`;
      })
      .filter(Boolean)
      .join('');

    cardsWrap.innerHTML = cardsHTML || `
      <div class="card-dash" style="grid-column:1/-1;text-align:center;padding:60px;font-weight:600;color:var(--muted);
      border:2px dashed #e5e7eb;border-radius:16px;background:#f9fafb;font-size:1.1rem;">
        🚫 No Data Available for ${month} ${year}
      </div>`;

  } catch (err) {
    console.error("⚠️ Error loading data:", err);
    cardsWrap.innerHTML = `<div class="card-dash" style="grid-column:1/-1;text-align:center;">Error loading data</div>`;
  } finally {
    showSpinner(false);
  }
}

// 🔹 رسم الصف الفرعي لكل بند داخل الكارت
function renderSubRow(sectionName, key, val, subs, total) {
  let numericVal = parseFloat(val);
  if (!val || val === "0" || val === "0%" || numericVal === 0) return "";

  let pct = 0, displayValue = "";
  const isPercent = typeof val === "string" && val.includes("%");
  const isDecimal = !isNaN(numericVal) && numericVal > 0 && numericVal < 1;
  const isNumber = !isNaN(numericVal) && numericVal >= 1;

  if (isPercent) {
    pct = parseFloat(val);
    displayValue = val;
  } else if (isDecimal) {
    pct = numericVal * 100;
    displayValue = `${pct.toFixed(1)}%`;
  } else if (isNumber) {
    pct = total && numericVal ? ((numericVal / total) * 100) : 0;
    displayValue = `${numericVal} (${pct.toFixed(1)}%)`;
  }

  return `
    <div class="sub-row" style="margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
        <span style="font-weight:500;font-size:0.85rem;">${key}</span>
        <span style="font-weight:700;color:var(--ink);font-size:0.85rem;">${displayValue}</span>
      </div>
      <div class="bar" style="height:3px;background:#eef1f6;border-radius:999px;overflow:hidden;">
        <i style="display:block;height:100%;width:${isNaN(pct) ? 0 : pct}%;
        background:linear-gradient(90deg, var(--primary), #38bdf8);
        border-radius:inherit;box-shadow:0 0 4px rgba(14,165,233,0.25);
        transition:width 0.8s ease;"></i>
      </div>
    </div>`;
}

// 🔹 عرض القيمة الإجمالية في الكارت
function renderTotal(sectionName, total) {
  if (!total || total === 0 || total === "0") return "";
  return `
    <div style="font-size:1.4rem;font-weight:800;color:var(--primary);margin-top:4px;">
      ${isNaN(total) ? total : total}
    </div>`;
}

// =============================
// 4️⃣ الأحداث (اختيار السنة والشهر + زر الرجوع)
// =============================
const backBtn = document.createElement('button');
backBtn.textContent = "← Back to selection";
Object.assign(backBtn.style, {
  display: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: "600",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  transition: "all 0.3s ease"
});
backBtn.addEventListener('mouseover', () => backBtn.style.opacity = "0.9");
backBtn.addEventListener('mouseout', () => backBtn.style.opacity = "1");
document.querySelector('.filters').appendChild(backBtn);

yearSel.addEventListener('change', () => {
  const y = yearSel.value;
  ttlYear.textContent = y;
  if (y) loadMonths(y);
});

monthSel.addEventListener('change', async () => {
  ttlMonth.textContent = monthSel.value;
  await loadData();
  if (yearSel.value && monthSel.value) {
    yearSel.style.display = "none";
    monthSel.style.display = "none";
    backBtn.style.display = "inline-block";
  }
});

backBtn.addEventListener('click', () => {
  showSpinner(true);
  setTimeout(() => {
    cardsWrap.innerHTML = `
      <div class="card-dash" style="grid-column:1/-1;text-align:center;color:var(--muted);">
        Please select a year and month to view statistics.
      </div>`;
    yearSel.value = "";
    monthSel.innerHTML = `<option value="">Choose month</option>`;
    yearSel.style.display = "inline-block";
    monthSel.style.display = "inline-block";
    backBtn.style.display = "none";
    ttlYear.textContent = "";
    ttlMonth.textContent = "";
    showSpinner(false);
  }, 400);
});

// =============================
// 5️⃣ عند تحميل الصفحة
// =============================
loadYears();
