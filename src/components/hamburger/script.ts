import $ from "jquery";

const hamburger = $(".hamburger");
hamburger.on("click", () => {
    $(".nav-links")[0].classList.toggle("expanded");
});
