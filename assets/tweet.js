document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector("#tweet-container");

  if (!container) return;

  const API = "https://tweet.desert-bucketman.workers.dev/";

  let triggered = false;

  async function loadTweet() {

    if (triggered) return;

    triggered = true;

    window.removeEventListener("scroll", triggerInitialLoad);

    io.disconnect();

    try {

      const scriptPromise = new Promise(resolve => {

        if (window.twttr && window.twttr.widgets) {
          return resolve();
        }

        const s = document.createElement("script");

        s.src = "https://platform.x.com/widgets.js";

        s.async = true;

        s.onload = resolve;

        document.body.appendChild(s);
      });

      const dataPromise =
        fetch(API).then(r => r.json());

      const [_, data] =
        await Promise.all([scriptPromise, dataPromise]);

      if (!data.tweetId) return;

      container.innerHTML = `
        <blockquote class="twitter-tweet" data-lang="ja">
          <a href="https://twitter.com/beishiryoku_Exp/status/${data.tweetId}"></a>
        </blockquote>
      `;

      if (window.twttr?.widgets) {
        window.twttr.widgets.load(container);
      }

    } catch (e) {

      console.error("X読み込みエラー:", e);

    }
  }

  function triggerInitialLoad() {
    loadTweet();
  }

  window.addEventListener(
    "scroll",
    triggerInitialLoad,
    {
      passive: true,
      once: true
    }
  );

  const io = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting) {
      loadTweet();
    }

  }, {

    rootMargin: "200px 0px"

  });

  io.observe(container);

});