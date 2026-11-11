const WORKERS_URL = "https://ai-ponkichi-bridge.desert-bucketman.workers.dev/";

const scriptPromises = {};

function loadScript(src) {
  if (scriptPromises[src]) return scriptPromises[src];
  scriptPromises[src] = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = (err) => { scriptPromises[src] = null; reject(err); };
    document.head.appendChild(script);
  });
  return scriptPromises[src];
}

const menuCheck = document.getElementById("burger-btn-check");
const menuBtn = document.querySelector(".burger-btn");
let isLive2DInitialized = false;
let isChatInitialized = false;
let isSending = false;
let lastSendTime = 0;
const SEND_COOLDOWN = 5000;

function loadLive2DDependencies() {
  return loadScript("https://cdnjs.cloudflare.com/ajax/libs/pixi.js/6.5.8/browser/pixi.min.js")
    .then(() => loadScript("https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"))
    .then(() => loadScript("https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/cubism4.min.js"));
}

function prefetchLive2D() {
  if (!isLive2DInitialized) {
    loadLive2DDependencies().catch(console.error);
  }
}

['pointerenter', 'touchstart'].forEach(eventType => {
  menuBtn.addEventListener(eventType, prefetchLive2D, { passive: true });
});

menuCheck.addEventListener('change', async () => {
  if (menuCheck.checked) {
    if (!isChatInitialized) {
      initChatUI();
    }

    if (!isLive2DInitialized) {
      isLive2DInitialized = true;
      try {
        await loadLive2DDependencies();
        startLive2D();
      } catch (error) {
        console.error("Live2Dの読み込みに失敗しました:", error);
        isLive2DInitialized = false;
      }
    }
  }
});

function initChatUI() {
  const burger = document.getElementById("burger2");
  const chatContainer = document.createElement("div");
  chatContainer.id = "chat-container";
  chatContainer.innerHTML = `
    <div id="chat-history">
      <div class="chat-message pcome">どしたの？</div>
    </div>
    <form id="chat-form">
      <input type="text" id="chat-input" placeholder="メッセージを入力..." required autocomplete="off" />
      <button type="submit" id="chat-submit">送信</button>
    </form>
  `;
  burger.appendChild(chatContainer);
  isChatInitialized = true;

  document.getElementById("chat-form").addEventListener("submit", handleChatSubmit);
}

async function handleChatSubmit(e) {
  e.preventDefault();

  if (isSending) return;

  const now = Date.now();
  if (now - lastSendTime < SEND_COOLDOWN) {
    return;
  }

  lastSendTime = now;
  isSending = true;

  const inputEl = document.getElementById("chat-input");
  const submitBtn = document.getElementById("chat-submit");
  const historyEl = document.getElementById("chat-history");

  submitBtn.disabled = true;
  inputEl.disabled = true;

  const message = inputEl.value.trim();

  if (!message) {
    submitBtn.disabled = false;
    inputEl.disabled = false;
    isSending = false;
    return;
  }

  const userDiv = document.createElement("div");
  userDiv.className = "chat-message user-msg";
  userDiv.textContent = message;
  historyEl.appendChild(userDiv);

  inputEl.value = "";
  historyEl.scrollTop = historyEl.scrollHeight;

  const botDiv = document.createElement("div");
  botDiv.className = "chat-message pcome";
  botDiv.textContent = "\u2026かんがえ中\u2026";
  historyEl.appendChild(botDiv);

  try {

    const response = await fetch(WORKERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    if (!response.ok) {
      throw new Error("通信エラー");
    }

    const data = await response.json();

    let answer = data.answer ? data.answer.trim() : "";

    if (!answer) {
      botDiv.innerHTML = "今日はもうつかれちゃった\u2026<br>またあしたにしない？";
    } else {

      answer = answer.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank">$1</a>'
      );

      botDiv.innerHTML = answer;
    }

  } catch (err) {

    console.error(err);
    botDiv.innerHTML = "うーん\u2026、もっかいお願い！";

  } finally {

    historyEl.scrollTop = historyEl.scrollHeight;

    submitBtn.disabled = false;
    inputEl.disabled = false;
    inputEl.focus();

    isSending = false;
  }
}

// --- Live2D ---
async function startLive2D() {
  const container = document.getElementById("live2d-widget");
  if (!container) {
    throw new Error("live2d-widgetコンテナが見つかりません。");
  }

  // コンテナの幅・高さが0の場合は強制的にフォールバックするかログを出す
  console.log("Container rect:", container.getBoundingClientRect());

  const app = new PIXI.Application({
    transparent: true,
    resizeTo: container,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true
  });

  container.appendChild(app.view);

  try {
    const model = await PIXI.live2d.Live2DModel.from(
      "https://bucketman-jpn.github.io/live2d-assets/11/11.model3.json"
    );

    app.stage.addChild(model);

    model.anchor.set(0.5, 0.5);
    model.scale.set(0.15);

    model.x = app.screen.width / 2;
    model.y = app.screen.height / 2;

    model.motion("Idle");

    window.addEventListener('pointermove', (event) => {
      const rect = app.view.getBoundingClientRect();
      const scaleX = app.screen.width / rect.width;
      const scaleY = app.screen.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      model.focus(x, y);
    });

    const resetGaze = () => {
      if (model && model.internalModel && model.internalModel.focusController) {
        model.internalModel.focusController.focus(0, 0);
      }
    };

    window.addEventListener('pointerleave', resetGaze);
    window.addEventListener('pointerup', resetGaze);

  } catch (modelErr) {
    console.error("Live2Dモデルのロードに失敗しました（CORSやパスの可能性があります）:", modelErr);
    throw modelErr;
  }
}