document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".article-dot-nav a"));
  const sections = Array.from(document.querySelectorAll("[data-article-section]"));

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

  document.querySelectorAll(".article-comment").forEach((comment) => {
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
  });
});
