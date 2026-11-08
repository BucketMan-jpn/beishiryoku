document.addEventListener("DOMContentLoaded", () => {

  const API = "https://carousel.desert-bucketman.workers.dev/";

  // --------------------------------
  // カルーセルの取得
  // --------------------------------

  const sliders = [...document.querySelectorAll(
    '.dmm-slider[data-genre]'
  )].map(root => {
    const track = root.querySelector(".dmm-track");

    if (!track) return null;

    const items = [...track.querySelectorAll("a")];

    if (items.length !== 5) {
      console.warn("DMMカルーセルの商品枠は5個必要です。", root);
      return null;
    }

    function updateData(dataList) {
      items.forEach((a, i) => {
        const item = dataList[i];
        const img = a.querySelector("img");
        const caption = a.querySelector("figcaption");

        if (!item || !img) return;

        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener sponsored";

        img.src = item.image;
        img.alt = item.title;
        caption.textContent = item.title;
      });
    }

    // --------------------------------
    // 6秒ごとのスライド
    // --------------------------------

    function next() {
      const first = track.firstElementChild;

      if (!first) return;

      const moveWidth = first.getBoundingClientRect().width;

      track.style.transition = "transform 0.9s ease-in-out";
      track.style.transform = `translateX(-${moveWidth}px)`;

      track.addEventListener("transitionend", function handler() {

        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        track.appendChild(first);

        track.removeEventListener("transitionend", handler);

      }, { once: true });
    }

    return {
      root,
      track,
      genre: root.dataset.genre,
      updateData,
      next
    };
  }).filter(Boolean);


  if (sliders.length === 0) return;


  // --------------------------------
  // Workerからのデータ取得
  // --------------------------------

  let loaded = false;

  async function loadSlider() {

    if (loaded) return;

    loaded = true;

    io.disconnect();

    try {

      const res = await fetch(API);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.status !== "success" || !data.genres) {
        throw new Error("Workerから正常なデータを取得できませんでした。");
      }

      // --------------------------------
      // 各カルーセルに商品を設定
      // --------------------------------

      sliders.forEach(slider => {

        const genreData = data.genres[slider.genre];

        if (!genreData || !Array.isArray(genreData.items)) {
          console.warn("該当ジャンルのデータがありません:", slider.genre);
          return;
        }

        slider.updateData(genreData.items);

      });


      // --------------------------------
      // 6秒ごとに各カルーセルを動かす
      // --------------------------------

      setInterval(() => {

        sliders.forEach(slider => {
          if (slider.track.children.length === 5) {
            slider.next();
          }
        });

      }, 6000);

    } catch (e) {

      console.error("DMMカルーセルのデータ取得エラー:", e);

    }
  }


  // --------------------------------
  // 画面に近づいたら読み込み
  // --------------------------------

  const io = new IntersectionObserver(entries => {

    if (entries.some(entry => entry.isIntersecting)) {
      loadSlider();
    }

  }, {
    rootMargin: "100px 0px"
  });


  sliders.forEach(slider => {
    io.observe(slider.root);
  });

});