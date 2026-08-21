import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  MapPin,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState('Toate');
  const [modal, setModal] = useState<'contact' | 'land' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const navItems = [
    ['Proprietăți', 'proprietati'],
    ['Servicii', 'servicii'],
    ['Dezvoltări', 'dezvoltari'],
    ['Proiecte', 'proiecte'],
    ['Investiții / Parteneriate', 'parteneriate'],
    ['Despre noi', 'despre-noi'],
  ];

  const properties = [
    {
      id: '01',
      title: 'Coridorul de Nord',
      location: 'București · Ștefăneștii de Jos',
      size: '14.800 mp',
      category: 'Terenuri',
      image:
        'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1300&q=85',
    },
    {
      id: '02',
      title: 'Atelierul 42',
      location: 'Cluj-Napoca · Iris',
      size: '3.240 mp',
      category: 'Comercial',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85',
    },
    {
      id: '03',
      title: 'Valea Verde',
      location: 'Brașov · Sânpetru',
      size: '8.900 mp',
      category: 'Rezidențial',
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85',
    },
  ];

  const filteredProperties =
    filter === 'Toate'
      ? properties
      : properties.filter((property) => property.category === filter);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const openModal = (type: 'contact' | 'land') => {
    setSubmitted(false);
    setModal(type);
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="site-shell">
      <header className="header">
        <div className="container-wide header-inner">
          <a href="#acasa" className="brand" onClick={() => setMobileOpen(false)} data-testid="link-brand">
            <span className="brand-mark"><span>TI</span></span>
            <span className="brand-name">Terenuri<br /><small>Imobiliare</small></span>
          </a>
          <nav className="nav-links" aria-label="Navigație principală">
            {navItems.map(([label, id]) => (
              <a href={`#${id}`} key={id} onClick={() => scrollTo(id)} data-testid={`link-nav-${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="header-contact" onClick={() => scrollTo('contact')} data-testid="link-header-contact">
            Contact <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Închide meniul' : 'Deschide meniul'}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
          {mobileOpen && (
            <nav className="mobile-panel" aria-label="Navigație mobilă">
              {navItems.map(([label, id]) => (
                <a href={`#${id}`} key={id} onClick={() => scrollTo(id)} data-testid={`link-mobile-${id}`}>
                  {label}
                </a>
              ))}
              <a href="#contact" onClick={() => scrollTo('contact')} data-testid="link-mobile-contact">Contact</a>
            </nav>
          )}
        </div>
      </header>

      <main>
        <section className="hero" id="acasa">
          <div className="container-wide">
            <div className="hero-copy">
              <div className="eyebrow reveal">Terenuri Imobiliare · București / România</div>
              <h1 className="display reveal reveal-delay-1">Vedem ce<br />încă <em>nu se vede.</em></h1>
              <p className="hero-description reveal reveal-delay-2">
                Identificăm, structurăm și dezvoltăm locuri cu potențial real.
                Pentru proprietari, investitori și parteneri care preferă claritatea înaintea angajamentului.
              </p>
              <div className="hero-actions reveal reveal-delay-3">
                <a className="button button-primary" href="#proprietati" onClick={() => scrollTo('proprietati')} data-testid="button-view-properties">
                  Vezi proprietățile <ArrowUpRight size={15} />
                </a>
                <button className="button button-ghost" onClick={() => openModal('land')} data-testid="button-propose-land">
                  Propune un teren <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="hero-meta">
              <div className="hero-stat"><strong>12+</strong>ani de perspectivă</div>
              <div className="hero-stat"><strong>380k</strong>mp analizați</div>
              <div className="hero-index">01 / 06</div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-label="Domenii de activitate">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="marquee-item" key={group}>
                <span>◆</span> terenuri cu potențial <span>◆</span> parteneriate care contează <span>◆</span> proiecte care rămân <span>◆</span> claritate înainte de angajament
              </div>
            ))}
          </div>
        </div>

        <section className="section properties-section" id="proprietati">
          <div className="container-wide">
            <div className="section-header">
              <div>
                <div className="eyebrow">Selecție curentă</div>
                <h2 className="display">Locuri<br /><em>cu direcție.</em></h2>
              </div>
              <p>
                Nu publicăm tot ce vedem. Publicăm ceea ce merită o conversație —
                active selectate, verificate și prezentate cu contextul care le face investibile.
              </p>
            </div>
            <div className="filter-bar">
              <div className="filter-tabs" role="tablist" aria-label="Filtre proprietăți">
                {['Toate', 'Terenuri', 'Rezidențial', 'Comercial'].map((item) => (
                  <button
                    className={`filter-tab ${filter === item ? 'active' : ''}`}
                    onClick={() => setFilter(item)}
                    key={item}
                    role="tab"
                    aria-selected={filter === item}
                    data-testid={`button-filter-${item.toLowerCase()}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="filter-count" data-testid="text-property-count">{filteredProperties.length} oportunități selectate</div>
            </div>
            {filteredProperties.length > 0 ? (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <article className="property-card" key={property.id} data-testid={`card-property-${property.id}`}>
                    <div className="property-image" style={{ backgroundImage: `url(${property.image})` }} />
                    <div className="property-arrow"><ArrowUpRight size={18} /></div>
                    <div className="property-content">
                      <span className="property-type">{property.category}</span>
                      <h3 className="display">{property.title}</h3>
                      <div className="property-info">
                        <span><MapPin size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />{property.location}</span>
                        <span>{property.size}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" data-testid="empty-property-results">
                Nu avem oportunități publice în această categorie momentan. <button className="button button-primary" style={{ marginTop: 18 }} onClick={() => openModal('contact')} data-testid="button-empty-inquiry">Solicită o selecție privată</button>
              </div>
            )}
          </div>
        </section>

        <section className="section" id="servicii">
          <div className="container-wide split-feature">
            <div className="feature-visual">
              <div className="feature-stamp">Cunoaștem<br />terenul.<br />Construim<br />încredere.</div>
            </div>
            <div className="feature-copy">
              <div className="eyebrow">Ce facem diferit</div>
              <h2 className="display">De la prima<br /><em>întrebare.</em></h2>
              <p>
                Oportunitățile bune nu apar întâmplător. Se găsesc prin întrebări corecte,
                date verificate și o înțelegere intimă a locului. Apoi se transformă în decizii simple.
              </p>
              <div className="service-list">
                {[
                  ['01', 'Identificare & achiziție', 'Căutăm activ terenuri și proprietăți aliniate cu teza dumneavoastră.'],
                  ['02', 'Structurare tranzacții', 'Facem vizibil ce contează: parametri, riscuri și scenarii.'],
                  ['03', 'Dezvoltare imobiliară', 'De la concept și autorizare până la un proiect care funcționează.'],
                ].map(([number, title, description]) => (
                  <div className="service-row" key={number}>
                    <span>{number}</span>
                    <div><strong>{title}</strong><div style={{ color: '#657773', fontSize: 12, marginTop: 5 }}>{description}</div></div>
                    <ChevronDown size={15} />
                  </div>
                ))}
              </div>
              <button className="button button-primary" onClick={() => openModal('contact')} data-testid="button-discuss-services">
                Discută o oportunitate <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="section process-section" id="dezvoltari">
          <div className="container-wide">
            <div className="section-header">
              <div>
                <div className="eyebrow">Metoda noastră</div>
                <h2 className="display">Fără pași<br /><em>în ceață.</em></h2>
              </div>
              <p>O abordare disciplinată, transparentă, construită pentru momente în care miza este prea mare pentru presupuneri.</p>
            </div>
            <div className="process-grid">
              {[
                ['01', 'Descoperim', 'Citind piața, hărțile și poveștile locului pentru a găsi direcția potrivită.'],
                ['02', 'Verificăm', 'Punem fiecare ipoteză la test: juridic, urbanistic, financiar și operațional.'],
                ['03', 'Structurăm', 'Aducem la aceeași masă capitalul, expertiza și un plan care poate fi executat.'],
                ['04', 'Dezvoltăm', 'Rămânem implicați până când potențialul devine un loc care produce valoare.'],
              ].map(([number, title, text]) => (
                <div className="process-item" key={number} data-testid={`process-step-${number}`}>
                  <div className="process-number">{number} —————————</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section projects-section" id="proiecte">
          <div className="container-wide">
            <div className="section-header">
              <div>
                <div className="eyebrow">Proiecte & direcții</div>
                <h2 className="display">Ce rămâne<br /><em>după noi.</em></h2>
              </div>
              <p>O selecție de proiecte finalizate, în lucru și oportunități pe care le pregătim cu atenție pentru următorul partener.</p>
            </div>
            <div className="project-grid">
              <article className="project-card" data-testid="card-project-nord">
                <div className="project-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1300&q=85')" }} />
                <div className="project-card-copy"><div className="mono">În dezvoltare · București</div><h3>Nord Logistics Campus</h3><p>Clădiri industriale · 24.000 mp</p></div>
              </article>
              <div className="project-stack">
                <article className="project-card small" data-testid="card-project-verde">
                  <div className="project-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85')" }} />
                  <div className="project-card-copy"><div className="mono">Finalizat · Brașov</div><h3>Valea Verde</h3><p>Rezidențial · 46 unități</p></div>
                </article>
                <article className="project-card small" data-testid="card-project-atelier">
                  <div className="project-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85')" }} />
                  <div className="project-card-copy"><div className="mono">Oportunitate · Cluj</div><h3>Atelierul 42</h3><p>Conversie comercială · 3.240 mp</p></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section partnership-section" id="parteneriate">
          <div className="container-wide partnership-inner">
            <div>
              <div className="eyebrow">Investiții / Parteneriate</div>
              <h2 className="display">Capitalul bun începe cu un loc <em>bun.</em></h2>
            </div>
            <div>
              <p className="partnership-copy">Căutăm parteneri care văd dincolo de randamentul unei tranzacții. Dacă aveți capital, expertiză sau un teren cu o poveste încă nescrisă, să vorbim.</p>
              <button className="button button-primary" onClick={() => openModal('contact')} data-testid="button-discuss-opportunity">
                Discută o oportunitate <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="section" id="despre-noi">
          <div className="container-wide section-header">
            <div>
              <div className="eyebrow">Despre noi</div>
              <h2 className="display">Partenerul<br /><em>de lângă hartă.</em></h2>
            </div>
            <p>
              Terenuri Imobiliare este o echipă boutique de real-estate cu rădăcini locale și gândire de investitor.
              Nu alergăm după volum. Ne concentrăm pe active cu sens, relații care durează și proiecte care îmbunătățesc locul în care apar.
              <br /><br />Ne place să fim primii care pun întrebarea potrivită.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container-wide">
          <div className="footer-top">
            <div>
              <a href="#acasa" className="brand" data-testid="link-footer-brand"><span className="brand-mark"><span>TI</span></span><span className="brand-name">Terenuri<br /><small>Imobiliare</small></span></a>
              <p className="footer-blurb">Identificăm potențialul. Îl transformăm în locuri care contează.</p>
            </div>
            <div><h3>Explorați</h3><a href="#proprietati" data-testid="link-footer-properties">Proprietăți</a><a href="#servicii" data-testid="link-footer-services">Servicii</a><a href="#proiecte" data-testid="link-footer-projects">Proiecte</a></div>
            <div><h3>Conectare</h3><a href="mailto:salut@terenuri-imobiliare.ro" data-testid="link-footer-email">salut@terenuri-imobiliare.ro</a><a href="tel:+40213140000" data-testid="link-footer-phone">+40 21 314 00 00</a><a href="#contact" onClick={() => openModal('contact')} data-testid="link-footer-form">Formular contact</a></div>
            <div><h3>Ne găsiți</h3><p>Str. Plantelor 27<br />București, România<br /><br />Luni — Vineri<br />09:00 — 18:00</p></div>
          </div>
          <div className="footer-bottom"><span>© 2024 Terenuri Imobiliare</span><span>Claritate înainte de angajament</span></div>
        </div>
      </footer>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <div className="modal-head">
              <div><div className="eyebrow">{modal === 'land' ? 'Propune un activ' : 'Primul pas'}</div><h2 id="contact-modal-title" className="display">{modal === 'land' ? 'Spune-ne despre teren.' : 'Să vorbim despre loc.'}</h2></div>
              <button className="close-button" onClick={() => setModal(null)} aria-label="Închide formularul" data-testid="button-close-modal"><X size={22} /></button>
            </div>
            {submitted ? (
              <div className="form-success" data-testid="status-form-success"><Check size={22} style={{ color: '#a96b48', marginBottom: 12 }} /><br />Mulțumim. Am primit mesajul și revenim în cel mai scurt timp cu un prim răspuns.</div>
            ) : (
              <form className="form-grid" onSubmit={submitForm}>
                <label className="form-label">Nume complet<input className="form-input" required name="name" placeholder="Cum vă putem numi?" data-testid="input-contact-name" /></label>
                <label className="form-label">Email / Telefon<input className="form-input" required name="contact" placeholder="Unde vă găsim?" data-testid="input-contact-contact" /></label>
                {modal === 'land' && <label className="form-label">Localizarea terenului<input className="form-input" required name="location" placeholder="Oraș, comună, județ" data-testid="input-land-location" /></label>}
                <label className="form-label">Mesaj<textarea className="form-input" required name="message" placeholder={modal === 'land' ? 'Suprafață, acces, context — orice considerați relevant.' : 'Ce oportunitate aveți în minte?'} data-testid="input-contact-message" /></label>
                <button className="button button-primary" type="submit" data-testid="button-submit-contact">Trimite mesajul <ArrowUpRight size={15} /></button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
