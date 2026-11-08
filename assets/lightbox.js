document.addEventListener("DOMContentLoaded", () => {

  const links = document.querySelectorAll('a[data-lightbox]');

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";

  const img = document.createElement("img");
  const caption = document.createElement("div");
  caption.id = "lightbox-caption";

  overlay.appendChild(img);
  overlay.appendChild(caption);

  document.body.appendChild(overlay);

  links.forEach(link => {

    const thumb = link.querySelector("img");

    link.addEventListener("click", e => {
      e.preventDefault();

      img.src = link.href;
      caption.textContent = thumb?.alt || "";

      overlay.classList.add("show");
    });

  });

  overlay.addEventListener("click", () => {

    overlay.classList.remove("show");
    img.src = "";
    caption.textContent = "";

  });

});