"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

type ContactResponse = {
  ok: boolean;
  message: string;
};

type SkillItem = {
  name: string;
  logo: string;
};

type SkillGroup = {
  title: string;
  accent: string;
  items: SkillItem[];
};

type Project = {
  title: string;
  subtitle: string;
  image: string;
  stack: string;
  architecture: string;
  highlights: string[];
  repoUrl: string;
  demoUrl?: string;
};

const navItems = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "trust", label: "Trust" },
  { id: "contact", label: "Contact" }
];

const skillGroups: SkillGroup[] = [
  {
    accent: "#49c6ff",
    title: "Systems",
    items: [
      { name: "Microservices", logo: "https://cdn.simpleicons.org/apachekafka/1eb0ff" },
      { name: "Event-Driven Architecture", logo: "https://cdn.simpleicons.org/rabbitmq/ff8d3b" },
      { name: "NATS", logo: "https://cdn.simpleicons.org/natsdotio/27aaea" }
    ]
  },
  {
    accent: "#82e68f",
    title: "Backend",
    items: [
      { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178c6" },
      { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/f7df1e" },
      { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/5fa04e" },
      { name: "Express", logo: "https://cdn.simpleicons.org/express/ffffff" },
      { name: "MongoDB", logo: "https://cdn.simpleicons.org/mongodb/47a248" },
      { name: "Redis", logo: "https://cdn.simpleicons.org/redis/dc382d" }
    ]
  },
  {
    accent: "#6da8ff",
    title: "DevOps",
    items: [
      { name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ed" },
      { name: "Kubernetes", logo: "https://cdn.simpleicons.org/kubernetes/326ce5" },
      { name: "Jenkins", logo: "https://cdn.simpleicons.org/jenkins/d24939" }
    ]
  },
  {
    accent: "#8deeff",
    title: "Frontend",
    items: [
      { name: "React", logo: "https://cdn.simpleicons.org/react/61dafb" },
      { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff" }
    ]
  },
  {
    accent: "#ffba66",
    title: "Tools",
    items: [
      { name: "Git", logo: "https://cdn.simpleicons.org/git/f05032" },
      { name: "GitHub", logo: "https://cdn.simpleicons.org/github/ffffff" },
      { name: "Postman", logo: "https://cdn.simpleicons.org/postman/ff6c37" }
    ]
  }
];

const projects: Project[] = [
  {
    title: "Ticket Booking Platform",
    subtitle: "Microservices Architecture",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    stack:
      "TypeScript, Node.js, MongoDB, NATS Streaming, Redis, Kubernetes, Docker, Next.js",
    architecture:
      "Event-driven services publish ticket/order events over NATS and use Redis reservation expiry to prevent overselling.",
    highlights: [
      "Designed for concurrent reservation handling.",
      "Implemented reservation expiration workflow with Redis TTL.",
      "Instrumented services for operational visibility in containerized deployment."
    ],
    repoUrl: "https://github.com/ansifar88/ticketing-Microservices"
  },
  {
    title: "Virtual Hospital Platform",
    subtitle: "Realtime Consultations",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    stack: "React, Node.js, Express, MongoDB, Socket.IO, Stripe, ZegoCloud",
    architecture:
      "Real-time messaging and consultation events are delivered over Socket.IO with secure booking and payment flows.",
    highlights: [
      "Built live chat and video consultation modules.",
      "Integrated secure authentication and Stripe payment flow.",
      "Implemented patient-friendly dashboard and appointment journey."
    ],
    repoUrl: "https://github.com/ansifar88/VirtualCare"
  },
  {
    title: "PH TIMES",
    subtitle: "Watch Ecommerce Platform",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    stack: "Node.js, Express, EJS, MongoDB, Mongoose, Razorpay, Express Session, Multer",
    architecture:
      "Session-based ecommerce app with admin/user modules, secure checkout, coupon and offer flows, and payment verification.",
    highlights: [
      "Built complete shopping flow: catalog, cart, wishlist, checkout, orders.",
      "Added OTP and forgot-password based account security flows.",
      "Implemented admin controls: products, categories, banners, coupons, reports."
    ],
    repoUrl: "https://github.com/ansifar88/phfinal"
  },
  {
    title: "Supabase Bookmarks",
    subtitle: "Realtime Private Bookmark Manager",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    stack: "Next.js, Supabase Auth, PostgreSQL (RLS), Supabase Realtime, Tailwind CSS",
    architecture:
      "Google OAuth authentication with row-level security enforces per-user data access; realtime channels sync changes instantly.",
    highlights: [
      "Implemented RLS policies so users access only their own bookmarks.",
      "Added live bookmark updates across tabs/devices without refresh.",
      "Deployed to Vercel with Supabase backend services."
    ],
    repoUrl: "https://github.com/ansifar88/supabase-bookmarks",
    demoUrl: "https://supabase-bookmarks-pearl.vercel.app"
  }
];

const stats = [
  { value: "100+", label: "Live Domains Supported" },
  { value: "7+", label: "End-to-End Projects" },
  { value: "2 Years", label: "Professional Backend Experience" }
];

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const imageFallback =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600'><rect width='100%25' height='100%25' fill='%230b2030'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b9d4e6' font-family='Arial' font-size='34'>Image unavailable</text></svg>";

  const skillTicker = useMemo(
    () => [...skillGroups.flatMap((group) => group.items), ...skillGroups.flatMap((group) => group.items)],
    []
  );

  useEffect(() => {
    function updateActiveSection() {
      const offset = 120;
      const scrollY = window.scrollY + offset;

      let current = navItems[0]?.id ?? "profile";
      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        if (section.offsetTop <= scrollY) {
          current = item.id;
        }
      }

      setActiveSection(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? "")
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as ContactResponse;
      setStatus(data.message);
      if (data.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setStatus("Unable to send right now. Please email me directly at ansifar88@gmail.com.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="top-nav">
        <nav className="top-nav-inner" aria-label="Section navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${activeSection === item.id ? "is-active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="page-shell">
        <div className="noise-layer" />

        <section id="profile" className="hero reveal section-anchor">
          <div className="hero-content glass-card">
            <div>
              <p className="eyebrow">Backend-Focused MERN Stack Developer</p>
              <h1>Muhammed Ansif A</h1>
              <p className="lead">
                Backend developer specializing in Node.js and TypeScript, with hands-on experience
                in microservices, CI/CD pipelines, and event-driven systems running in production.
              </p>

              <div className="hero-actions">
                <a className="pill" href="mailto:ansifar88@gmail.com">
                  ansifar88@gmail.com
                </a>
                <a className="pill" href="tel:+919539103332">
                  +91 9539103332
                </a>
                <a className="pill" href="https://github.com/ansifar88" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a
                  className="pill"
                  href="https://www.linkedin.com/in/ansifar"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a className="pill" href="https://leetcode.com/u/ansifar/" target="_blank" rel="noreferrer">
                  LeetCode
                </a>
                <a className="pill resume-pill" href="/muhammed-ansif-resume.pdf" download>
                  Download Resume
                </a>
              </div>
            </div>
          </div>

          <aside className="hero-photo glass-card">
            <img
              src="https://avatars.githubusercontent.com/u/125662944?v=4"
              alt="Muhammed Ansif A profile photo"
              onError={(event) => {
                event.currentTarget.src = imageFallback;
              }}
            />
          </aside>
        </section>

        <section className="stats-grid reveal">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card glass-card">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </article>
          ))}
        </section>

        <section id="experience" className="card reveal section-anchor">
          <h2>Experience Timeline</h2>
          <article className="timeline-item">
            <div className="timeline-head">
              <h3>Backend Developer (Node.js) - FPLE Technology Pvt Ltd</h3>
              <p className="muted">April 2024 - Present</p>
            </div>
            <div className="tech-chips">
              <span>Node.js</span>
              <span>TypeScript</span>
              <span>Jenkins</span>
              <span>Production Support</span>
              <span>Incident Debugging</span>
            </div>
            <ul>
              <li>
                Diagnosed and resolved production issues in Node.js and PHP services supporting
                100+ live domains using root-cause analysis.
              </li>
              <li>
                Debugged API failures, memory leaks, and deployment regressions through structured
                logs and request tracing.
              </li>
              <li>
                Operated CI/CD pipelines in Jenkins with safe deployment and rollback workflows
                across environments.
              </li>
            </ul>
          </article>
        </section>

        <section id="projects" className="grid split reveal section-anchor">
          {projects.map((project) => (
            <article className="card project-card" key={project.title}>
              <div className="project-image-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(event) => {
                    event.currentTarget.src = imageFallback;
                  }}
                />
              </div>
              <div className="project-content">
                <h2>{project.title}</h2>
                <p className="muted">{project.subtitle}</p>
                <p>{project.stack}</p>
                <p className="architecture-note">Architecture: {project.architecture}</p>
                <ul>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="project-cta-row">
                  <a className="project-btn" href={project.repoUrl} target="_blank" rel="noreferrer">
                    GitHub Repo
                  </a>
                  {project.demoUrl ? (
                    <a className="project-btn secondary" href={project.demoUrl} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  ) : (
                    <span className="project-btn secondary disabled">Demo On Request</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section id="skills" className="card skills-showcase reveal section-anchor">
          <div className="skills-header">
            <h2>Skills</h2>
            <p className="muted">
              Production-focused stack for scalable backend systems, microservices, and deployment
              pipelines.
            </p>
          </div>

          <div className="skill-grid">
            {skillGroups.map((group) => (
              <article
                key={group.title}
                className="skill-group"
                style={{ "--group-accent": group.accent } as CSSProperties}
              >
                <div className="skill-group-top">
                  <span className="skill-dot" />
                  <h3>{group.title}</h3>
                </div>

                <ul className="skill-logo-list">
                  {group.items.map((item) => (
                    <li key={item.name} className="skill-logo-item">
                      <span className="skill-logo-icon">
                        <img src={item.logo} alt={`${item.name} logo`} loading="lazy" />
                      </span>
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="skills-ticker" aria-hidden="true">
            <div className="skills-ticker-track">
              {skillTicker.map((item, index) => (
                <div key={`${item.name}-${index}`} className="ticker-pill">
                  <img src={item.logo} alt="" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="grid split reveal section-anchor">
          <article className="card">
            <h2>Trust Signals</h2>
            <ul>
              <li>
                Production support ownership for live domains with direct incident investigation
                and rollout responsibility.
              </li>
              <li>
                Built and maintained multiple complete products from backend APIs to deployment.
              </li>
              <li>
                Practical problem-solving track record through LeetCode and hands-on shipping.
              </li>
            </ul>
          </article>
          <article className="card">
            <h2>Profiles</h2>
            <div className="profile-links-grid">
              <a className="profile-link" href="https://github.com/ansifar88" target="_blank" rel="noreferrer">
                GitHub /ansifar88
              </a>
              <a
                className="profile-link"
                href="https://www.linkedin.com/in/ansifar"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn /in/ansifar
              </a>
              <a
                className="profile-link"
                href="https://leetcode.com/u/ansifar/"
                target="_blank"
                rel="noreferrer"
              >
                LeetCode /u/ansifar
              </a>
            </div>
          </article>
        </section>

        <section id="contact" className="grid split reveal section-anchor">
          <article className="card">
            <h2>Education</h2>
            <p>
              <strong>MERN Stack Development Bootcamp</strong>
              <br />
              2023
            </p>
            <p>
              <strong>Higher Secondary (Commerce with Computer Application)</strong>
              <br />
              Directorate of Higher Secondary Education, Kerala
              <br />
              2015 - 2017
            </p>
          </article>

          <article className="card">
            <h2>Contact</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" minLength={2} maxLength={80} required />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} minLength={10} maxLength={2000} required />

              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="honeypot-field"
                name="company"
                type="text"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status && <p className="status-msg">{status}</p>}
            </form>
          </article>
        </section>
      </main>
    </>
  );
}
