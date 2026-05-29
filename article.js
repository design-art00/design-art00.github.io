document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".article-dot-nav a"));
  const sections = Array.from(document.querySelectorAll("[data-article-section]"));

  const initCommentReactions = (comment) => {
    const reactions = Array.from(comment.querySelectorAll(".comment-reaction"));

    reactions.forEach((button) => {
      button.addEventListener("click", () => {
        const count = button.querySelector("span");
        const wasActive = button.classList.contains("is-active");

        reactions.forEach((reaction) => {
          if (reaction.classList.contains("is-active")) {
            const reactionCount = reaction.querySelector("span");
            reaction.classList.remove("is-active");
            reaction.setAttribute("aria-pressed", "false");
            if (reactionCount) reactionCount.textContent = Math.max(0, Number(reactionCount.textContent) - 1);
          }
        });

        if (!wasActive) {
          button.classList.add("is-active");
          button.setAttribute("aria-pressed", "true");
          if (count) count.textContent = Number(count.textContent) + 1;
        }
      });
    });
  };

  if (navLinks.length && sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(visible.target.id);
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.08, 0.18, 0.35]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll(".article-comment").forEach(initCommentReactions);

  const syncCommentAuthState = () => {
    const isLoggedIn = localStorage.getItem("lecollectif-user") === "Анна Воронина";

    document.querySelectorAll("[data-comment-guest]").forEach((block) => {
      block.hidden = isLoggedIn;
    });

    document.querySelectorAll("[data-comment-auth]").forEach((block) => {
      block.hidden = !isLoggedIn;
    });
  };

  syncCommentAuthState();
  window.addEventListener("storage", syncCommentAuthState);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-auth-logout]")) {
      setTimeout(syncCommentAuthState, 0);
    }
  });

  document.querySelectorAll("[data-article-comment-form]").forEach((form) => {
    const list = form.closest(".article-comments")?.querySelector(".article-comments__list");
    const textarea = form.querySelector("textarea[name='comment']");
    const status = form.querySelector(".article-comment-form__status");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = textarea?.value.trim();

      if (!text) {
        status.textContent = "Введите текст комментария";
        textarea?.focus();
        return;
      }

      const comment = document.createElement("article");
      comment.className = "article-comment article-comment--current";
      comment.innerHTML = `
        <img class="article-comment__avatar" src="assets/expert-anna.jpg" alt="Анна Воронина">
        <div class="article-comment__body">
          <div class="article-comment__meta">
            <strong>Анна Воронина</strong>
            <span>только что</span>
          </div>
          <p></p>
          <div class="article-comment__actions" aria-label="Действия с комментарием">
            <button class="comment-reply" type="button">Редактировать</button>
            <button class="comment-reaction" type="button" aria-label="Люблю комментарий" aria-pressed="false">♡ <span>0</span></button>
            <button class="comment-reaction" type="button" aria-label="Понравился комментарий" aria-pressed="false">👍 <span>0</span></button>
            <button class="comment-reaction" type="button" aria-label="Не понравился комментарий" aria-pressed="false">👎 <span>0</span></button>
          </div>
        </div>
      `;

      comment.querySelector("p").textContent = text;
      list?.prepend(comment);
      initCommentReactions(comment);
      form.reset();
      status.textContent = "Комментарий опубликован";
      comment.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
});
