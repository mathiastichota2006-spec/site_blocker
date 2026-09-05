(function () {
  const params = new URLSearchParams(window.location.search);
  const blockedUrl = params.get("url") || "This page";
  const messageEl = document.getElementById("message");
  messageEl.textContent = `${blockedUrl} was blocked!`;
})();
