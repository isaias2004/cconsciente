(function () {
  "use strict";

  const CONFIG = window.CONFIG || {};
  const PROFESIONALES = window.PROFESIONALES || [];
  const ACTIVIDADES = window.ACTIVIDADES || {};
  const PUBLICACIONES = window.PUBLICACIONES || [];

  // ELEMENTOS Y UTILIDADES

  function get(id) {
    return document.getElementById(id);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = text;
    }

    return element;
  }

  function whatsappUrl(number, message) {
    const cleanNumber = String(number || "").replace(/\D/g, "");

    if (!cleanNumber) return "#";

    return (
      "https://wa.me/" +
      cleanNumber +
      "?text=" +
      encodeURIComponent(message || "Hola, quisiera realizar una consulta.")
    );
  }

  function safeUrl(url) {
    try {
      const parsed = new URL(url, window.location.href);

      if (["http:", "https:", "mailto:"].includes(parsed.protocol)) {
        return parsed.href;
      }
    } catch (error) {
      return "#";
    }

    return "#";
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    // Interpretamos la fecha como una fecha local para evitar
    // que se muestre el día anterior por diferencias horarias.
    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function setExternalLink(element, url) {
    if (!element) return;

    const validUrl = safeUrl(url);

    if (validUrl === "#") {
      element.hidden = true;
      return;
    }

    element.href = validUrl;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }

  // PERFIL PRINCIPAL

  function renderProfile() {
    const name = get("profileName");
    const description = get("profileDescription");
    const image = get("profileImage");
    const credentials = get("credentials");
    const social = get("profileSocial");

    if (name) name.textContent = CONFIG.nombre || "Cuidar Consciente";

    if (description) {
      description.textContent = CONFIG.descripcion || "";
    }

    if (image && CONFIG.foto) {
      image.src = CONFIG.foto;
      image.alt = "Foto de " + (CONFIG.nombre || "la profesional");
    }

    if (credentials) {
      credentials.replaceChildren();

      (CONFIG.formacion || []).forEach(function (item) {
        credentials.appendChild(
          createElement("span", "credential", item)
        );
      });
    }

    if (social) {
      social.replaceChildren();

      if (CONFIG.instagram) {
        const instagram = createElement("a", "", "Instagram");
        setExternalLink(instagram, CONFIG.instagram);
        social.appendChild(instagram);
      }
    }
  }

  // PROFESIONALES

  function renderProfessionals() {
    const container = get("professionalsGrid");

    if (!container) return;

    container.replaceChildren();

    if (!PROFESIONALES.length) {
      container.appendChild(
        createElement(
          "p",
          "empty-state",
          "Próximamente conocerás a nuestro equipo profesional."
        )
      );
      return;
    }

    PROFESIONALES.forEach(function (person) {
      const card = createElement("article", "professional-card");

      const image = createElement("img", "professional-card__image");
      image.src = person.foto || "";
      image.alt = "Foto de " + person.nombre;
      image.loading = "lazy";

      image.addEventListener("error", function () {
        image.hidden = true;
      });

      card.appendChild(image);

      card.appendChild(
        createElement("h3", "", person.nombre)
      );

      const specialties = createElement(
        "p",
        "professional-card__specialties",
        (person.especialidades || []).join(" · ")
      );

      card.appendChild(specialties);

      card.appendChild(
        createElement(
          "p",
          "professional-card__description",
          person.descripcion || ""
        )
      );

      const number = person.whatsapp || CONFIG.whatsapp;

      const button = createElement(
        "a",
        "button button--primary",
        "Consultar por WhatsApp"
      );

      button.href = whatsappUrl(
        number,
        "Hola, quisiera consultar por los servicios de " + person.nombre + "."
      );

      button.target = "_blank";
      button.rel = "noopener noreferrer";

      card.appendChild(button);

      container.appendChild(card);
    });
  }

  // ACTIVIDADES

  function renderActivities(items, containerId, emptyMessage) {
    const container = get(containerId);

    if (!container) return;

    container.replaceChildren();

    if (!items || !items.length) {
      container.appendChild(
        createElement("p", "empty-state", emptyMessage)
      );
      return;
    }

    items.forEach(function (activity) {
      const card = createElement("article", "activity-card");

      const dateText = [
        formatDate(activity.fecha),
        activity.hora ? " · " + activity.hora + " hs" : ""
      ].join("");

      card.appendChild(
        createElement("span", "activity-card__date", dateText)
      );

      card.appendChild(
        createElement("h4", "", activity.titulo)
      );

      card.appendChild(
        createElement("p", "", activity.descripcion)
      );

      const details = [
        activity.modalidad,
        activity.precio
      ].filter(Boolean).join(" · ");

      if (details) {
        card.appendChild(
          createElement("div", "activity-card__details", details)
        );
      }

      if (activity.enlace) {
        const button = createElement(
          "a",
          "button button--primary",
          activity.boton || "Más información"
        );

        setExternalLink(button, activity.enlace);

        if (!button.hidden) {
          card.appendChild(button);
        }
      }

      container.appendChild(card);
    });
  }

  function renderAllActivities() {
    renderActivities(
      ACTIVIDADES.gratuitos,
      "freeActivities",
      "Próximamente anunciaremos nuevos vivos gratuitos."
    );

    renderActivities(
      ACTIVIDADES.pagos,
      "paidActivities",
      "Próximamente compartiremos nuevos encuentros y talleres."
    );
  }

  // PUBLICACIONES

  function renderPublications() {
    const container = get("publicationsGrid");

    if (!container) return;

    container.replaceChildren();

    if (!PUBLICACIONES.length) {
      container.appendChild(
        createElement(
          "p",
          "empty-state",
          "Próximamente compartiremos nuevos escritos y publicaciones."
        )
      );
      return;
    }

    PUBLICACIONES.forEach(function (publication) {
      const card = createElement("article", "publication-card");

      if (publication.imagen) {
        const image = createElement(
          "img",
          "publication-card__image"
        );

        image.src = publication.imagen;
        image.alt = publication.titulo || "Imagen de publicación";
        image.loading = "lazy";

        image.addEventListener("error", function () {
          image.hidden = true;
        });

        card.appendChild(image);
      }

      const content = createElement(
        "div",
        "publication-card__content"
      );

      content.appendChild(
        createElement(
          "span",
          "publication-card__category",
          publication.categoria || "Publicación"
        )
      );

      content.appendChild(
        createElement("h3", "", publication.titulo)
      );

      content.appendChild(
        createElement("p", "", publication.descripcion || "")
      );

      if (publication.fecha) {
        content.appendChild(
          createElement(
            "p",
            "publication-card__category",
            formatDate(publication.fecha)
          )
        );
      }

      if (publication.enlace) {
        const link = createElement(
          "a",
          "text-link",
          "Leer publicación ↗"
        );

        setExternalLink(link, publication.enlace);

        if (!link.hidden) {
          content.appendChild(link);
        }
      }

      card.appendChild(content);
      container.appendChild(card);
    });
  }

  // CONTACTO Y REDES

  function renderContact() {
    const mainWhatsapp = get("mainWhatsapp");
    const communityLink = get("communityLink");
    const instagramLink = get("instagramLink");
    const collaborationButton = get("collaborationButton");

    setExternalLink(
      mainWhatsapp,
      whatsappUrl(CONFIG.whatsapp, CONFIG.mensajeWhatsapp)
    );

    setExternalLink(
      communityLink,
      CONFIG.grupoComunidad
    );

    setExternalLink(
      instagramLink,
      CONFIG.instagram
    );

    if (collaborationButton) {
      const collaborationNumber =
        CONFIG.colaboracionesWhatsapp || CONFIG.whatsapp;

      if (CONFIG.colaboracionesEmail) {
        collaborationButton.href =
          "mailto:" + CONFIG.colaboracionesEmail +
          "?subject=" + encodeURIComponent("Propuesta de colaboración");
      } else {
        collaborationButton.href = whatsappUrl(
          collaborationNumber,
          "Hola, quisiera acercarte una propuesta de colaboración."
        );
      }

      collaborationButton.target = "_blank";
      collaborationButton.rel = "noopener noreferrer";
    }
  }

  // MENÚ MÓVIL

  function setupMenu() {
    const toggle = get("menuToggle");
    const nav = get("nav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  // PIE DE PÁGINA

  function renderFooter() {
    const year = get("currentYear");
    const footerText = get("footerText");

    if (year) {
      year.textContent = new Date().getFullYear();
    }

    if (footerText) {
      footerText.textContent =
        CONFIG.textoFooter || "Un espacio para compartir.";
    }
  }

  // INICIALIZACIÓN

  function init() {
    renderProfile();
    renderProfessionals();
    renderAllActivities();
    renderPublications();
    renderContact();
    renderFooter();
    setupMenu();
  }

  document.addEventListener("DOMContentLoaded", init);

})();