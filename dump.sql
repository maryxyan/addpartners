--
-- PostgreSQL database dump
--

\restrict fKO26xyIb3iyC9zJ7LmpePaGA6MoNVLIzQHmyTeJvJ2KrTB1Vj57s9sOuKGkKHT

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inquiries (
    id integer NOT NULL,
    kind text NOT NULL,
    name text NOT NULL,
    contact text NOT NULL,
    location text,
    property_slug text,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'nou'::text NOT NULL
);


ALTER TABLE public.inquiries OWNER TO postgres;

--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquiries_id_seq OWNER TO postgres;

--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    location text NOT NULL,
    size text NOT NULL,
    category text NOT NULL,
    zone text NOT NULL,
    area text NOT NULL,
    status text NOT NULL,
    type text NOT NULL,
    price text NOT NULL,
    image text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: property_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.property_categories OWNER TO postgres;

--
-- Name: property_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_categories_id_seq OWNER TO postgres;

--
-- Name: property_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_categories_id_seq OWNED BY public.property_categories.id;


--
-- Name: property_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_statuses (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.property_statuses OWNER TO postgres;

--
-- Name: property_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.property_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_statuses_id_seq OWNER TO postgres;

--
-- Name: property_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.property_statuses_id_seq OWNED BY public.property_statuses.id;


--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: property_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_categories ALTER COLUMN id SET DEFAULT nextval('public.property_categories_id_seq'::regclass);


--
-- Name: property_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_statuses ALTER COLUMN id SET DEFAULT nextval('public.property_statuses_id_seq'::regclass);


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inquiries (id, kind, name, contact, location, property_slug, message, created_at, status) FROM stdin;
3	land	Elena Marinescu	elena.marinescu@example.com · +40 744 555 222	Ilfov	\N	Am un teren de aproximativ 18.000 mp și doresc să discut o posibilă achiziție.	2026-08-25 13:07:32.210352+00	in_lucru
4	contact	Radu Ionescu	radu.ionescu@example.com · +40 733 987 654	Brașov	valea-verde	Vă rog să reveniți cu detalii despre proprietatea Valea Verde și condițiile de vizionare.	2026-08-25 13:07:32.210352+00	finalizat
2	contact	Andrei Popescu	andrei.popescu@example.com · +40 721 123 456	București		Doresc mai multe informații despre oportunitățile comerciale disponibile.	2026-08-25 13:07:32.210352+00	nou
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (id, slug, title, location, size, category, zone, area, status, type, price, image, description, created_at) FROM stdin;
2	atelierul-42	Atelierul 42	Cluj-Napoca · Iris	3.240 mp	Comercial	Cluj-Napoca	1.000 – 5.000 mp	Oportunitate	Clădire comercială	500k – 1M €	https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85	Activ comercial într-o zonă în transformare, potrivit pentru reconversie și utilizare mixtă.	2026-08-21 15:26:03.814528+00
3	valea-verde	Valea Verde	Brașov · Sânpetru	8.900 mp	Rezidențial	Brașov	5.000 – 10.000 mp	În analiză	Teren pentru dezvoltare	500k – 1M €	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85	Oportunitate rezidențială într-un context local cu acces rapid la Brașov.	2026-08-21 15:26:03.814528+00
4	platforma-vest	Platforma Vest	Ploiești · Ariceștii Rahtivani	31.600 mp	Logistic / Industrial	Ploiești	Peste 10.000 mp	Disponibil	Platformă logistică	Peste 1M €	https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1000&q=85	Platformă pentru dezvoltări logistice și industriale, cu acces bun către principalele coridoare de transport.	2026-08-21 15:26:03.814528+00
1	coridorul-de-nord	Coridorul de Nord	București · Ștefăneștii de Jos	14.800 mp	Terenuri	București	Peste 10.000 mp	Disponibil	Teren intravilan	Peste 1M €	https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1300&q=85	Teren cu acces strategic și potențial pentru dezvoltare mixtă în nordul Bucureștiului.	2026-08-21 15:26:03.814528+00
\.


--
-- Data for Name: property_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_categories (id, name, slug, created_at) FROM stdin;
1	Terenuri	terenuri	2026-08-25 12:47:36.723344+00
2	Comercial	comercial	2026-08-25 12:47:36.723344+00
3	Rezidențial	rezidential	2026-08-25 12:47:36.723344+00
4	Logistic / Industrial	logistic-industrial	2026-08-25 12:47:36.723344+00
\.


--
-- Data for Name: property_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_statuses (id, name, slug, created_at) FROM stdin;
1	Disponibil	disponibil	2026-08-25 12:47:36.723344+00
2	Oportunitate	oportunitate	2026-08-25 12:47:36.723344+00
3	În analiză	in-analiza	2026-08-25 12:47:36.723344+00
4	Rezervat	rezervat	2026-08-25 12:47:36.723344+00
\.


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 4, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_id_seq', 5, true);


--
-- Name: property_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_categories_id_seq', 4, true);


--
-- Name: property_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_statuses_id_seq', 4, true);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: properties properties_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_slug_unique UNIQUE (slug);


--
-- Name: property_categories property_categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_categories
    ADD CONSTRAINT property_categories_name_unique UNIQUE (name);


--
-- Name: property_categories property_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_categories
    ADD CONSTRAINT property_categories_pkey PRIMARY KEY (id);


--
-- Name: property_categories property_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_categories
    ADD CONSTRAINT property_categories_slug_unique UNIQUE (slug);


--
-- Name: property_statuses property_statuses_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_statuses
    ADD CONSTRAINT property_statuses_name_unique UNIQUE (name);


--
-- Name: property_statuses property_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_statuses
    ADD CONSTRAINT property_statuses_pkey PRIMARY KEY (id);


--
-- Name: property_statuses property_statuses_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_statuses
    ADD CONSTRAINT property_statuses_slug_unique UNIQUE (slug);


--
-- PostgreSQL database dump complete
--

\unrestrict fKO26xyIb3iyC9zJ7LmpePaGA6MoNVLIzQHmyTeJvJ2KrTB1Vj57s9sOuKGkKHT

