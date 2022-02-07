function isIE() {
  if (typeof window === "undefined") return false;
  return /MSIE|Trident/.test(window.navigator.userAgent);
}

window.addEventListener("load", function () {
  if (isIE())
    window.alert("Sivustomme ei toimi oikein vanhoilla selaimilla (kuten Internet Explorer). Käytä modernia selainta");
});
