// ------------------ القائمة الرئيسية ------------------
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
let menuOpen = false;

// فتح/غلق القائمة عند الضغط على زر ☰
menuBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    menuOpen = !menuOpen;
    navMenu.classList.toggle("show", menuOpen);
});

// إغلاق القائمة عند الضغط خارجها
document.addEventListener("click", function(e){
    if(menuOpen && !navMenu.contains(e.target) && e.target !== menuBtn){
        navMenu.classList.remove("show");
        menuOpen = false;
    }
});

// إغلاق القائمة عند السكروول
window.addEventListener("scroll", function(){
    if(menuOpen){
        navMenu.classList.remove("show");
        menuOpen = false;
    }
});

// ------------------ الـ Dropdowns ------------------
const dropdowns = document.querySelectorAll('.dropdown, .dropdown2');

dropdowns.forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation(); // لمنع إغلاق القائمة الرئيسية
        // أغلق أي dropdown مفتوح آخر
        dropdowns.forEach(d => {
            if(d !== item) d.classList.remove('open');
        });
        // افتح/أغلق الـ dropdown الحالي
        item.classList.toggle('open');
    });
});

// إغلاق جميع الـ dropdowns عند الضغط خارجها
document.addEventListener('click', function() {
    dropdowns.forEach(d => d.classList.remove('open'));
});
