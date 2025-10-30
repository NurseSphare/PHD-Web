/* =========================================================
   🎨 Theme Controller — theme.js
   يحتوي على: تبديل الوضع الليلي وتخزين التفضيل
   ========================================================= */

// ✅ ننتظر تحميل الصفحة بالكامل قبل تنفيذ أي شيء
document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector('.icon-btn');
  if (!settingsBtn) return; // تأكد أن الزر موجود في الصفحة

  // 🌙 عند الضغط على الزر يتم التبديل بين الوضعين
  settingsBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');

    // 🎞️ حركة دوران لطيفة
    settingsBtn.style.transform = "rotate(180deg)";
    setTimeout(() => settingsBtn.style.transform = "rotate(0deg)", 400);

    // 🎨 تغيير الألوان مؤقتًا حسب الوضع
    if (isDark) {
      settingsBtn.style.background = "var(--brand)";
      settingsBtn.style.color = "#111";
    } else {
      settingsBtn.style.background = "#fff";
      settingsBtn.style.color = "#111";
    }

    // 💾 حفظ التفضيل في Local Storage
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // 🌗 تطبيق الوضع المحفوظ عند تحميل الصفحة
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    settingsBtn.style.background = "var(--brand)";
    settingsBtn.style.color = "#111";
  }
});
