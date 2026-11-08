document.addEventListener("DOMContentLoaded", function () {

  const WORKERS_URL = "https://blogcard.desert-bucketman.workers.dev/"; 
  const FALLBACK_URL = "https://www.beishiryoku.org/";
  const DEFAULT_THUMB = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJqiN__nZ2YlnK5k719tGAokvB9T_bAoQ1xu9NxhVcCpnoAfpGpgqyY4TB9R53IXu89Ytmlu3ie03zfypHn_UAx-cmCcMXrufuCibcN7ZfHZqReM6Y7yHySRdvl5J9LsOxGshoj3ezjAzkji0vxGcuGtRqIDlrD4UQSqk9sN8e2PEt2Dx6ZthJG0y0p2PC/s420-rw-e99/thumbnail.png";

  const allCards = document.querySelectorAll(".link-card[data-url]");
  if (allCards.length === 0) return;

  const currentUrl = window.location.href.split("#")[0].replace(/\/$/, "");

  let cachedRandomHTML = null;
  let isFetchingRandom = false;

  function injectHtml(card, html) {
    card.innerHTML = html;
    card.setAttribute("data-loaded", "true");
  }

  async function fetchCardHtml(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "text/html");
      const title = doc.querySelector("meta[property='og:title']")?.content || doc.title;
      const desc = (doc.querySelector("meta[property='og:description']")?.content || doc.querySelector("meta[name='description']")?.content || "").replace(/\u3002(?!$)/g, "。<br>");
      let image = doc.querySelector("meta[property='og:image']")?.content || DEFAULT_THUMB;

      if (image.includes("blogger.googleusercontent.com")) {
        image = image.replace(/\/w\d+-h\d+.*?\//, "/w856/");
      }

      return `
        <a href="${url}">
          <figure>
            <figcaption class="title-s f12 g3 m10">
              ${title}
            </figcaption>
            <img src="${image}" alt="ブログカード" class="pic-blogcard">
          </figure>
          <p>${desc}</p>
        </a>
      `;
    } catch (e) {
      return null;
    }
  }

  async function processCard(card) {
    if (card.getAttribute("data-loaded") === "true") return;

    const specificUrl = card.getAttribute("data-url");

    if (specificUrl === "") {
      if (cachedRandomHTML) {
        injectHtml(card, cachedRandomHTML);
      } else if (!isFetchingRandom) {
        isFetchingRandom = true;
        const randomUrl = await fetch(`${WORKERS_URL}?currentUrl=${encodeURIComponent(currentUrl)}`)
                            .then(res => res.json())
                            .then(data => data.selectedUrl)
                            .catch(() => FALLBACK_URL);
        
        const html = await fetchCardHtml(randomUrl) || await fetchCardHtml(FALLBACK_URL);
        cachedRandomHTML = html;
        document.querySelectorAll(".link-card[data-url='']").forEach(el => injectHtml(el, html));
      }
    } else {
      if (specificUrl === currentUrl) return;
      const html = await fetchCardHtml(specificUrl);
      if (html) injectHtml(card, html);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        processCard(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });

  allCards.forEach(card => observer.observe(card));
});