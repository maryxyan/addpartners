import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Seo } from '@/components/seo';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Admin from '@/pages/admin';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Menu,
  MapPin,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  useRoute,
  Router as WouterRouter,
} from 'wouter';
import {
  useCreateInquiry,
  useGetProperty,
  useListProperties,
} from '@workspace/api-client-react';

const queryClient = new QueryClient();

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState('Toate');
  const [zoneFilter, setZoneFilter] = useState('Toate zonele');
  const [areaFilter, setAreaFilter] = useState('Orice suprafață');
  const [priceFilter, setPriceFilter] = useState('Orice preț');
  const [statusFilter, setStatusFilter] = useState('Toate statusurile');
  const [typeFilter, setTypeFilter] = useState('Toate tipurile');
  const [modal, setModal] = useState<'contact' | 'land' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openService, setOpenService] = useState<string | null>(null);
  const createInquiry = useCreateInquiry();

  const navItems = [
    ['Proprietăți', 'proprietati'],
    ['Servicii', 'servicii'],
    ['Achiziții terenuri', 'achizitii'],
    ['Dezvoltări', 'dezvoltari'],
    ['Proiecte', 'proiecte'],
    ['Investiții / Parteneriate', 'parteneriate'],
    ['Despre noi', 'despre-noi'],
  ];

  const {
    data: propertiesResponse,
    isLoading: propertiesLoading,
    isError: propertiesError,
  } = useListProperties();
  // Without an API proxy Vite can return its HTML fallback for this request.
  // Do not let an unexpected response shape crash the entire page.
  const properties = Array.isArray(propertiesResponse) ? propertiesResponse : [];
  const featuredProjects = properties.slice(0, 3);

  const filteredProperties =
    filter === 'Toate'
      ? properties
      : properties.filter((property) => property.category === filter);
  const visibleProperties = filteredProperties.filter((property) => (
    (zoneFilter === 'Toate zonele' || property.zone === zoneFilter)
    && (areaFilter === 'Orice suprafață' || property.area === areaFilter)
    && (priceFilter === 'Orice preț' || property.price === priceFilter)
    && (statusFilter === 'Toate statusurile' || property.status === statusFilter)
    && (typeFilter === 'Toate tipurile' || property.type === typeFilter)
  ));

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
    const form = new FormData(event.currentTarget);
    createInquiry.mutate({
      data: {
        name: String(form.get('name') ?? ''),
        contact: String(form.get('contact') ?? ''),
        message: String(form.get('message') ?? ''),
        location: modal === 'land' ? String(form.get('location') ?? '') : undefined,
        kind: modal === 'land' ? 'land' : 'contact',
      },
    }, {
      onSuccess: () => setSubmitted(true),
    });
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
      <Seo
        title="ADD Partners | Proprietăți și dezvoltări imobiliare"
        description="ADD Partners identifică, structurează și dezvoltă oportunități imobiliare în București și în România pentru proprietari, investitori și parteneri."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: 'ADD Partners',
          url: 'https://addpartners.ro/',
          logo: 'https://addpartners.ro/logo-home.png',
          email: 'contact@addpartners.ro',
          telephone: '+40 21 314 00 00',
          address: { '@type': 'PostalAddress', streetAddress: 'Str. Plantelor 27', addressLocality: 'București', addressCountry: 'RO' },
          areaServed: 'România',
        }}
      />
      <header className="header">
        <div className="container-wide header-inner">
          <a href="#acasa" className="brand" onClick={() => setMobileOpen(false)} data-testid="link-brand">
            <img className="brand-logo" src={`${import.meta.env.BASE_URL}logo-home.png`} alt="ADD Partners" />
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
          <img
            className="hero-background"
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&fm=webp&w=1440&q=78"
            srcSet="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&fm=webp&w=640&q=74 640w, https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&fm=webp&w=960&q=76 960w, https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&fm=webp&w=1440&q=78 1440w, https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&fm=webp&w=2200&q=80 2200w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
          />
          <div className="container-wide">
            <div className="hero-copy">
              <div className="eyebrow reveal">ADD Partners · București / România</div>
              <h1 className="display reveal reveal-delay-1">Vedem ce<br />încă <em>nu se vede.</em></h1>
              <p className="hero-description reveal reveal-delay-2">
                Identificăm, structurăm și dezvoltăm locuri cu potențial real.
                Pentru proprietari, investitori și parteneri care preferă claritatea înaintea angajamentului.
              </p>
              <div className="hero-actions reveal reveal-delay-3">
                <a className="button button-primary" href="#proprietati" onClick={() => scrollTo('proprietati')} data-testid="button-view-properties">
                  Vezi proprietățile <ArrowUpRight size={15} />
                </a>
                <button className="button button-land-cta" onClick={() => openModal('land')} data-testid="button-propose-land">
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
                {['Toate', 'Terenuri', 'Rezidențial', 'Comercial', 'Logistic / Industrial'].map((item) => (
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
              <div className="property-select-filters">
                <select className="filter-select" value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)} aria-label="Filtrează după localitate">
                  <option>Toate zonele</option>
                  <option>București</option>
                  <option>Cluj-Napoca</option>
                  <option>Brașov</option>
                  <option>Ploiești</option>
                </select>
                <select className="filter-select" value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)} aria-label="Filtrează după suprafață">
                  <option>Orice suprafață</option>
                  <option>1.000 – 5.000 mp</option>
                  <option>5.000 – 10.000 mp</option>
                  <option>Peste 10.000 mp</option>
                </select>
                <select className="filter-select" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} aria-label="Filtrează după preț">
                  <option>Orice preț</option>
                  <option>Sub 500k €</option>
                  <option>500k – 1M €</option>
                  <option>Peste 1M €</option>
                </select>
                <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrează după status">
                  <option>Toate statusurile</option>
                  <option>Disponibil</option>
                  <option>Oportunitate</option>
                  <option>În analiză</option>
                </select>
                <select className="filter-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filtrează după tipul proprietății">
                  <option>Toate tipurile</option>
                  <option>Teren intravilan</option>
                  <option>Clădire comercială</option>
                  <option>Teren pentru dezvoltare</option>
                  <option>Platformă logistică</option>
                </select>
              </div>
              <div className="filter-count" data-testid="text-property-count">{visibleProperties.length} oportunități selectate</div>
            </div>
            {propertiesLoading ? (
              <div className="empty-state">Se încarcă oportunitățile disponibile…</div>
            ) : propertiesError || !Array.isArray(propertiesResponse) ? (
              <div className="empty-state">Oportunitățile nu au putut fi încărcate. Porniți serviciul API și reîncercați.</div>
            ) : visibleProperties.length > 0 ? (
              <div className="property-grid">
                {visibleProperties.map((property) => (
                  <a className="property-card" key={property.id} href={`${import.meta.env.BASE_URL}proprietati/${property.slug}`} data-testid={`card-property-${property.id}`}>
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
                  </a>
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
                  ['01', 'Tranzacții imobiliare', 'Facilităm tranzacții pentru terenuri și proprietăți rezidențiale, comerciale și logistice.'],
                  ['02', 'Achiziții terenuri', 'Căutăm terenuri cu potențial și analizăm locația, accesul și contextul urbanistic.'],
                  ['03', 'Structurare proiecte', 'Transformăm o oportunitate imobiliară într-un proiect viabil și investibil.'],
                  ['04', 'Dezvoltare imobiliară', 'De la concept și autorizare până la un proiect care funcționează.'],
                ].map(([number, title, description]) => (
                  <div className={`service-row ${openService === number ? 'is-open' : ''}`} key={number}>
                    <span>{number}</span>
                    <div>
                      <strong>{title}</strong>
                      <div className="service-description" id={`service-description-${number}`} aria-hidden={openService !== number}>{description}</div>
                    </div>
                    <button
                      type="button"
                      className="service-toggle"
                      aria-label={`${openService === number ? 'Închide' : 'Deschide'} detalii pentru ${title}`}
                      aria-expanded={openService === number}
                      aria-controls={`service-description-${number}`}
                      onClick={() => setOpenService(openService === number ? null : number)}
                    >
                      {openService === number ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                ))}
              </div>
              <a className="button button-primary" href="#proprietati" onClick={() => scrollTo('proprietati')} data-testid="button-discuss-services">
                Vezi proprietățile disponibile <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="section acquisition-section" id="achizitii">
          <div className="container-wide acquisition-inner">
            <div>
              <div className="eyebrow">Achiziții terenuri</div>
              <h2 className="display">Un teren bun<br /><em>începe cu întrebările potrivite.</em></h2>
            </div>
            <div>
              <p className="acquisition-copy">Căutăm terenuri pentru dezvoltări rezidențiale, comerciale și logistice. Analizăm locația, suprafața, accesul, infrastructura, caracteristicile urbanistice și potențialul de dezvoltare.</p>
              <p className="acquisition-copy">Suntem interesați atât de terenuri disponibile pentru achiziție, cât și de oportunități care pot fi dezvoltate împreună cu proprietarii sau partenerii locali.</p>
              <button className="button button-primary" onClick={() => openModal('land')} data-testid="button-acquisition-land">Propune un teren <ArrowUpRight size={15} /></button>
            </div>
          </div>
        </section>

        <section className="section development-section" id="dezvoltari">
          <div className="container-wide">
            <div className="section-header">
              <div>
                <div className="eyebrow">Dezvoltări</div>
                <h2 className="display">Locuri care<br /><em>prind formă.</em></h2>
              </div>
              <p>Construim direcții de dezvoltare în jurul unor nevoi reale, de la primele ipoteze până la proiecte care pot rămâne relevante.</p>
            </div>
            <div className="development-grid">
              {[
                ['01', 'Rezidențial', 'Cartiere, case și locuințe gândite în raport cu ritmul și contextul locului.'],
                ['02', 'Comercial', 'Spații comerciale și clădiri care conectează oameni, servicii și comunități.'],
                ['03', 'Centre comerciale', 'Proiecte cu mix potrivit de funcțiuni, acces și experiență.'],
                ['04', 'Logistic', 'Platforme și infrastructură pentru fluxuri care susțin economia reală.'],
              ].map(([number, title, text]) => (
                <article className="development-card" key={number}>
                  <span className="process-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <ArrowUpRight size={18} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="proces">
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
            {featuredProjects.length > 0 ? (
              <div className="project-grid">
                <a
                  className="project-card"
                  href={`${import.meta.env.BASE_URL}proprietati/${featuredProjects[0].slug}`}
                  aria-label={`Vezi proiectul ${featuredProjects[0].title}`}
                  data-testid={`card-project-${featuredProjects[0].id}`}
                >
                  <div className="project-card-image" style={{ backgroundImage: `url(${featuredProjects[0].image})` }} />
                  <div className="project-card-copy">
                    <div className="mono">{featuredProjects[0].status} · {featuredProjects[0].zone}</div>
                    <h3>{featuredProjects[0].title}</h3>
                    <p>{featuredProjects[0].type} · {featuredProjects[0].size}</p>
                  </div>
                </a>
                <div className="project-stack">
                  {featuredProjects.slice(1).map((project) => (
                    <a
                      className="project-card small"
                      href={`${import.meta.env.BASE_URL}proprietati/${project.slug}`}
                      aria-label={`Vezi proiectul ${project.title}`}
                      data-testid={`card-project-${project.id}`}
                      key={project.id}
                    >
                      <div className="project-card-image" style={{ backgroundImage: `url(${project.image})` }} />
                      <div className="project-card-copy">
                        <div className="mono">{project.status} · {project.zone}</div>
                        <h3>{project.title}</h3>
                        <p>{project.type} · {project.size}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : !propertiesLoading && (
              <div className="empty-state">Proiectele vor apărea aici după ce sunt adăugate din administrare.</div>
            )}
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
              ADD Partners este o echipă boutique de real-estate cu rădăcini locale și gândire de investitor.
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
              <a href="#acasa" className="brand" data-testid="link-footer-brand"><img className="brand-logo brand-logo-footer" src={`${import.meta.env.BASE_URL}logo-home.png`} alt="ADD Partners" /></a>
              <p className="footer-blurb">Identificăm potențialul. Îl transformăm în locuri care contează.</p>
            </div>
            <div><h3>Explorați</h3><a href="#proprietati" data-testid="link-footer-properties">Proprietăți</a><a href="#servicii" data-testid="link-footer-services">Servicii</a><a href="#achizitii">Achiziții terenuri</a><a href="#dezvoltari">Dezvoltări</a><a href="#proiecte" data-testid="link-footer-projects">Proiecte</a></div>
            <div><h3>Conectare</h3><a href="mailto:contact@addpartners.ro" data-testid="link-footer-email">contact@addpartners.ro</a><a href="tel:+40213140000" data-testid="link-footer-phone">+40 21 314 00 00</a><a href="#contact" onClick={() => openModal('contact')} data-testid="link-footer-form">Formular contact</a></div>
            <div><h3>Ne găsiți</h3><p>Str. Plantelor 27<br />București, România<br /><br />Luni — Vineri<br />09:00 — 18:00</p></div>
          </div>
          <div className="footer-bottom"><span>© 2026 ADD Partners</span><span>Claritate înainte de angajament</span></div>
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

function PropertyDetail() {
  const [, params] = useRoute('/proprietati/:slug');
  const { data: property, isLoading, isError } = useGetProperty(params?.slug ?? '');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const createInquiry = useCreateInquiry();

  const openInquiry = () => {
    setSubmitted(false);
    setInquiryOpen(true);
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property) return;

    const form = new FormData(event.currentTarget);
    createInquiry.mutate({
      data: {
        name: String(form.get('name') ?? ''),
        contact: String(form.get('contact') ?? ''),
        message: String(form.get('message') ?? ''),
        location: property.location,
        propertySlug: property.slug,
        kind: 'contact',
      },
    }, {
      onSuccess: () => setSubmitted(true),
    });
  };

  useEffect(() => {
    if (!inquiryOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setInquiryOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inquiryOpen]);

  useEffect(() => {
    if (!property || property.galleryImages.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveGalleryImage((current) => (current + 1) % property.galleryImages.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [property]);

  if (isLoading) return <div className="site-shell"><main className="container-wide empty-state">Se încarcă proprietatea…</main></div>;
  if (isError || !property) return <NotFound />;

  return (
    <div className="site-shell">
      <Seo
        title={`${property.title} | ADD Partners`}
        description={`${property.description} ${property.location} · ${property.size}`.slice(0, 160)}
        path={`/proprietati/${property.slug}`}
        image={property.image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: property.title,
          description: property.description,
          url: `https://addpartners.ro/proprietati/${property.slug}`,
          image: property.image,
        }}
      />
      <header className="header detail-header">
        <div className="container-wide header-inner">
          <a href={import.meta.env.BASE_URL} className="brand" data-testid="link-detail-brand">
            <img className="brand-logo" src={`${import.meta.env.BASE_URL}logo-home.png`} alt="ADD Partners" />
          </a>
          <button className="header-contact" type="button" onClick={openInquiry}>Discutăm o oportunitate <ArrowUpRight size={15} /></button>
        </div>
      </header>
      <main>
        <section className="detail-hero">
          <div className="container-wide detail-hero-grid">
            <div>
              <a className="eyebrow detail-back" href={`${import.meta.env.BASE_URL}#proprietati`}>← Înapoi la proprietăți</a>
              <span className="property-type">{property.category}</span>
              <h1 className="display">{property.title}</h1>
              <p className="detail-location"><MapPin size={15} /> {property.location}</p>
              <p className="detail-description">{property.description}</p>
              <button className="button button-primary" onClick={openInquiry}>Solicită detalii <ArrowUpRight size={15} /></button>
            </div>
            <div className="detail-image" style={{ backgroundImage: `url(${property.image})` }} />
          </div>
        </section>
        <section className="section detail-facts">
          <div className="container-wide">
            <div className="eyebrow">Date esențiale</div>
            <div className="detail-facts-grid">
              <div><span>Suprafață</span><strong>{property.size}</strong></div>
              <div><span>Zonă</span><strong>{property.zone}</strong></div>
              <div><span>Status</span><strong>{property.status}</strong></div>
              <div><span>Tip</span><strong>{property.type}</strong></div>
              <div><span>Preț indicativ</span><strong>{property.price}</strong></div>
            </div>
          </div>
        </section>
        {property.galleryImages.length > 0 && (
          <section className="property-gallery" aria-label={`Galerie foto pentru ${property.title}`}>
            <div className="container-wide">
              <div className="property-gallery-frame">
                {property.galleryImages.map((image, index) => (
                  <img key={`${image}-${index}`} className={index === activeGalleryImage ? 'active' : ''} src={image} alt={`${property.title} — imaginea ${index + 1}`} />
                ))}
                {property.galleryImages.length > 1 && (
                  <>
                    <button type="button" className="property-gallery-arrow previous" onClick={() => setActiveGalleryImage((activeGalleryImage - 1 + property.galleryImages.length) % property.galleryImages.length)} aria-label="Imaginea precedentă"><ChevronLeft size={24} /></button>
                    <button type="button" className="property-gallery-arrow next" onClick={() => setActiveGalleryImage((activeGalleryImage + 1) % property.galleryImages.length)} aria-label="Imaginea următoare"><ChevronRight size={24} /></button>
                  </>
                )}
                <div className="property-gallery-footer">
                  <span>{String(activeGalleryImage + 1).padStart(2, '0')} / {String(property.galleryImages.length).padStart(2, '0')}</span>
                  <div className="property-gallery-dots">
                    {property.galleryImages.map((_, index) => <button key={index} type="button" className={index === activeGalleryImage ? 'active' : ''} onClick={() => setActiveGalleryImage(index)} aria-label={`Vezi imaginea ${index + 1}`} />)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {property.workflowSteps.length > 0 && (
          <section className="section property-workflow" aria-labelledby="property-workflow-title">
            <div className="container-wide">
              <div className="property-workflow-heading">
                <div>
                  <div className="eyebrow">Proces pas cu pas</div>
                  <h2 id="property-workflow-title" className="display">Parcursul proprietății.</h2>
                </div>
                <span>{String(activeWorkflowStep + 1).padStart(2, '0')} / {String(property.workflowSteps.length).padStart(2, '0')}</span>
              </div>
              <div className="property-workflow-grid">
                <div className="property-workflow-nav" role="tablist" aria-label="Etapele proprietății">
                  {property.workflowSteps.map((step, index) => (
                    <button
                      key={`${step.title}-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={activeWorkflowStep === index}
                      aria-controls={`workflow-panel-${index}`}
                      className={activeWorkflowStep === index ? 'active' : ''}
                      onClick={() => setActiveWorkflowStep(index)}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {step.title}
                    </button>
                  ))}
                </div>
                <article id={`workflow-panel-${activeWorkflowStep}`} className="property-workflow-panel" role="tabpanel">
                  <span className="property-workflow-kicker">Etapa {String(activeWorkflowStep + 1).padStart(2, '0')}</span>
                  <h3>{property.workflowSteps[activeWorkflowStep]?.title}</h3>
                  <p>{property.workflowSteps[activeWorkflowStep]?.description}</p>
                  <div className="property-workflow-progress" aria-hidden="true">
                    {property.workflowSteps.map((_, index) => <span key={index} className={index <= activeWorkflowStep ? 'active' : ''} />)}
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}
      </main>
      {inquiryOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInquiryOpen(false); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="property-inquiry-title">
            <div className="modal-head">
              <div>
                <div className="eyebrow">Solicită detalii</div>
                <h2 id="property-inquiry-title" className="display">Despre {property.title}</h2>
              </div>
              <button className="close-button" onClick={() => setInquiryOpen(false)} aria-label="Închide formularul" data-testid="button-close-property-inquiry"><X size={22} /></button>
            </div>
            {submitted ? (
              <div className="form-success" data-testid="status-property-inquiry-success"><Check size={22} style={{ color: '#a96b48', marginBottom: 12 }} /><br />Mulțumim. Am primit solicitarea și revenim în cel mai scurt timp cu detalii.</div>
            ) : (
              <form className="form-grid" onSubmit={submitInquiry}>
                <label className="form-label">Nume complet<input className="form-input" required name="name" placeholder="Cum vă putem numi?" data-testid="input-property-inquiry-name" /></label>
                <label className="form-label">Email / Telefon<input className="form-input" required name="contact" placeholder="Unde vă găsim?" data-testid="input-property-inquiry-contact" /></label>
                <label className="form-label">Mesaj<textarea className="form-input" required name="message" defaultValue={`Doresc mai multe detalii despre ${property.title}.`} data-testid="input-property-inquiry-message" /></label>
                <button className="button button-primary" type="submit" disabled={createInquiry.isPending} data-testid="button-submit-property-inquiry">{createInquiry.isPending ? 'Se trimite…' : 'Trimite solicitarea'} <ArrowUpRight size={15} /></button>
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
        <Route path="/proprietati/:slug" component={PropertyDetail} />
        <Route path="/admin" component={Admin} />
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
