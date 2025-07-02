document.addEventListener("DOMContentLoaded", () => {
    // EN копчиња
    document.querySelectorAll(".show-join-form-en").forEach(btn =>
      btn.addEventListener("click", () => {
        document.getElementById("main-content").classList.add("blur");
        document.getElementById("join-form-en").classList.remove("hidden");
        document.getElementById("form-overlay").style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
    );
  
    // MK копчиња
    document.querySelectorAll(".show-join-form-mk").forEach(btn =>
      btn.addEventListener("click", () => {
        document.getElementById("main-content").classList.add("blur");
        document.getElementById("join-form-mk").classList.remove("hidden");
        document.getElementById("form-overlay").style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
    );
  });
  
  function goBackToSite(lang) {
    document.getElementById("main-content").classList.remove("blur");
    document.getElementById("join-form-en").classList.add("hidden");
    document.getElementById("join-form-mk").classList.add("hidden");
    document.getElementById("form-overlay").style.display = "none";
  }