import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import {
  type Property,
  type PropertyInput,
  type CatalogItem,
  type Inquiry,
  getListPropertiesQueryKey,
  getListCatalogItemsQueryKey,
  getListInquiriesQueryKey,
  useCreateProperty,
  useCreateCatalogItem,
  useCreateInquiry,
  useDeleteInquiry,
  useListInquiries,
  useUpdateInquiry,
  useDeleteProperty,
  useDeleteCatalogItem,
  useListCatalogItems,
  useListProperties,
  useUpdateCatalogItem,
  useRequestUploadUrl,
  useUpdateProperty,
} from '@workspace/api-client-react';
import { Link } from 'wouter';

function DeleteConfirmModal({
  label,
  onCancel,
  onConfirm,
  isDeleting,
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="delete-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onCancel(); }}>
      <div className="delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <div className="delete-modal-icon"><Trash2 size={20} /></div>
        <div>
          <div className="eyebrow">Confirmare</div>
          <h2 id="delete-modal-title">Ștergi acest element?</h2>
          <p>Elementul <strong>„{label}”</strong> va fi eliminat definitiv. Această acțiune nu poate fi anulată.</p>
        </div>
        <div className="delete-modal-actions">
          <button type="button" className="button button-ghost" onClick={onCancel} disabled={isDeleting}>Anulează</button>
          <button type="button" className="button button-danger" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Se șterge…' : <><Trash2 size={15} /> Șterge definitiv</>}</button>
        </div>
      </div>
    </div>
  );
}

const emptyForm: PropertyInput = {
  slug: '',
  title: '',
  location: '',
  size: '',
  category: 'Terenuri',
  zone: '',
  area: '',
  status: 'Disponibil',
  type: '',
  price: '',
  image: '',
  description: '',
};

const fields: Array<{ key: keyof PropertyInput; label: string; placeholder: string }> = [
  { key: 'title', label: 'Titlu', placeholder: 'Ex. Coridorul de Nord' },
  { key: 'slug', label: 'Slug URL', placeholder: 'ex. coridorul-de-nord' },
  { key: 'location', label: 'Localizare', placeholder: 'Oraș · zonă' },
  { key: 'size', label: 'Suprafață', placeholder: '14.800 mp' },
  { key: 'zone', label: 'Zonă', placeholder: 'București' },
  { key: 'area', label: 'Filtru suprafață', placeholder: 'Peste 10.000 mp' },
  { key: 'type', label: 'Tip', placeholder: 'Teren intravilan' },
  { key: 'price', label: 'Preț', placeholder: 'Peste 1M €' },
];

function PropertyForm({
  editing,
  onCancel,
  onSaved,
}: {
  editing: Property | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<PropertyInput>(editing ? { ...editing } : emptyForm);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const requestUploadUrl = useRequestUploadUrl();
  const { data: categories = [] } = useListCatalogItems('categories');
  const { data: statuses = [] } = useListCatalogItems('statuses');
  const queryClient = useQueryClient();
  const isSaving = createProperty.isPending || updateProperty.isPending;

  useEffect(() => {
    setForm(editing ? { ...editing } : { ...emptyForm });
    setError('');
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [editing]);

  const updateField = (key: keyof PropertyInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selectează un fișier imagine.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Imaginea trebuie să fie mai mică de 10 MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const { uploadURL, objectPath } = await requestUploadUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type },
      });
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'Authorization': `Bearer ${sessionStorage.getItem('admin_token') ?? ''}`,
        },
        body: file,
      });
      if (!uploadResponse.ok) throw new Error('Încărcarea imaginii a eșuat.');
      updateField('image', `${import.meta.env.VITE_API_URL || ''}/api/storage${objectPath}`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Încărcarea imaginii a eșuat.');
    } finally {
      setUploading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const mutationOptions = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPropertiesQueryKey() });
        onSaved();
      },
      onError: () => setError('Nu am putut salva proprietatea. Verifică datele și încearcă din nou.'),
    };

    if (editing) {
      updateProperty.mutate({ slug: editing.slug, data: form }, mutationOptions);
    } else {
      createProperty.mutate({ data: form }, mutationOptions);
    }
  };

  return (
    <form ref={formRef} className="admin-form property-edit-form" onSubmit={submit}>
      <div className="admin-form-head">
        <div>
          <div className="eyebrow">{editing ? 'Editare proprietate' : 'Proprietate nouă'}</div>
          <h2 className="display">{editing ? editing.title : 'Adaugă o oportunitate.'}</h2>
        </div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Închide formularul"><X size={18} /></button>
      </div>
      <div className="admin-form-grid">
        {fields.map(({ key, label, placeholder }) => (
          <label className="admin-field" key={key}>
            {label}
            <input required className="form-input" value={form[key]} placeholder={placeholder} onChange={(event) => updateField(key, event.target.value)} />
          </label>
        ))}
        <label className="admin-field">
          Categorie
          <select required className="form-input" value={form.category} onChange={(event) => updateField('category', event.target.value)}>
            {categories.length === 0 && <option value="">Se încarcă…</option>}
            {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label className="admin-field admin-field-wide">
          Imagine proprietate
          <input className="form-input admin-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} />
          <span className="admin-upload-hint">{uploading ? 'Se încarcă imaginea în storage…' : 'JPG, PNG sau WebP · maximum 10 MB'}</span>
          {form.image && <img className="admin-image-preview" src={form.image} alt="Previzualizare proprietate" />}
          <input required className="form-input" value={form.image} placeholder="/api/storage/objects/..." onChange={(event) => updateField('image', event.target.value)} aria-label="Calea imaginii salvate" />
        </label>
        <label className="admin-field">
          Status
          <select required className="form-input" value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            {statuses.length === 0 && <option value="">Se încarcă…</option>}
            {statuses.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label className="admin-field admin-field-wide">
          Descriere
          <textarea required className="form-input" value={form.description} placeholder="Descrierea oportunității" onChange={(event) => updateField('description', event.target.value)} />
        </label>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="button button-ghost" onClick={onCancel}>Anulează</button>
        <button type="submit" className="button button-primary" disabled={isSaving}>
          {isSaving ? 'Se salvează…' : <><Save size={15} /> Salvează proprietatea</>}
        </button>
      </div>
    </form>
  );
}

function CatalogManager({ kind, title }: { kind: 'categories' | 'statuses'; title: string }) {
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { data: items = [], isLoading } = useListCatalogItems(kind);
  const createItem = useCreateCatalogItem();
  const updateItem = useUpdateCatalogItem();
  const deleteItem = useDeleteCatalogItem();
  const queryClient = useQueryClient();

  const reset = () => {
    setEditing(null);
    setName('');
    setError('');
  };
  const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const data = { name: name.trim(), slug: slugify(name) };
    const options = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCatalogItemsQueryKey(kind) }); reset(); },
      onError: () => setError('Nu am putut salva elementul. Verifică dacă numele există deja.'),
    };
    if (editing) updateItem.mutate({ kind, id: editing.id, data }, options);
    else createItem.mutate({ kind, data }, options);
  };
  const remove = (item: CatalogItem) => {
    deleteItem.mutate({ kind, id: item.id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCatalogItemsQueryKey(kind) }); setDeleteTarget(null); },
      onError: () => setError('Elementul nu a putut fi șters.'),
    });
  };

  return (
    <section className="catalog-card">
      <div className="catalog-card-head">
        <div><div className="eyebrow">Nomenclator</div><h2>{title}</h2></div>
        {!editing && <button className="admin-icon-button" onClick={() => setEditing({ id: 0, name: '', slug: '' })} aria-label={`Adaugă ${title}`}><Plus size={17} /></button>}
      </div>
      {editing && (
        <form className="catalog-form" onSubmit={submit}>
          <input required autoFocus className="form-input" value={name} placeholder={`Nume ${title.toLowerCase()}`} onChange={(event) => setName(event.target.value)} />
          <button className="admin-icon-button" type="submit" aria-label="Salvează"><Save size={15} /></button>
          <button className="admin-icon-button" type="button" onClick={reset} aria-label="Anulează"><X size={15} /></button>
        </form>
      )}
      {error && <p className="admin-error">{error}</p>}
      <div className="catalog-items">
        {isLoading && <span className="admin-upload-hint">Se încarcă…</span>}
        {items.map((item) => (
          <div className="catalog-item" key={item.id}>
            {editing?.id === item.id ? (
              <span className="catalog-editing">Editează mai sus</span>
            ) : <><span>{item.name}</span><small>{item.slug}</small></>}
            <div className="catalog-item-actions">
              <button className="admin-icon-button" onClick={() => { setEditing(item); setName(item.name); }} aria-label={`Editează ${item.name}`}><Pencil size={13} /></button>
              <button className="admin-icon-button danger" onClick={() => setDeleteTarget(item)} aria-label={`Șterge ${item.name}`}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
      {deleteTarget && <DeleteConfirmModal label={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={() => remove(deleteTarget)} isDeleting={deleteItem.isPending} />}
    </section>
  );
}

type InquiryForm = {
  kind: 'contact' | 'land';
  name: string;
  contact: string;
  location: string;
  propertySlug: string;
  message: string;
  status: 'nou' | 'in_lucru' | 'finalizat' | 'arhivat';
};
const emptyInquiry: InquiryForm = { kind: 'contact', name: '', contact: '', location: '', propertySlug: '', message: '', status: 'nou' };
const inquiryStatuses = [
  { value: 'nou', label: 'Nouă' },
  { value: 'in_lucru', label: 'În lucru' },
  { value: 'finalizat', label: 'Finalizată' },
  { value: 'arhivat', label: 'Arhivată' },
] as const;

function InquiryManager() {
  const [editing, setEditing] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [form, setForm] = useState<InquiryForm>({ ...emptyInquiry });
  const [error, setError] = useState('');
  const { data: inquiries = [], isLoading } = useListInquiries();
  const createInquiry = useCreateInquiry();
  const updateInquiry = useUpdateInquiry();
  const deleteInquiry = useDeleteInquiry();
  const queryClient = useQueryClient();
  const close = () => { setEditing(null); setForm({ ...emptyInquiry }); setError(''); };
  const startEdit = (inquiry: Inquiry) => {
    setEditing(inquiry);
    setForm({
      kind: inquiry.kind === 'land' ? 'land' : 'contact',
      name: inquiry.name,
      contact: inquiry.contact,
      location: inquiry.location ?? '',
      propertySlug: inquiry.propertySlug ?? '',
      message: inquiry.message,
      status: inquiry.status as InquiryForm['status'],
    });
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const options = {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() }); close(); },
      onError: () => setError('Cererea nu a putut fi salvată.'),
    };
    if (editing?.id) updateInquiry.mutate({ id: editing.id, data: form }, options);
    else createInquiry.mutate({ data: form }, options);
  };
  const remove = (inquiry: Inquiry) => {
    deleteInquiry.mutate({ id: inquiry.id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() }); setDeleteTarget(null); },
      onError: () => setError('Cererea nu a putut fi ștearsă.'),
    });
  };
  const setField = (key: keyof InquiryForm, value: string) => setForm((current) => ({ ...current, [key]: value } as InquiryForm));

  return (
    <section className="admin-inquiries">
      <div className="admin-section-title">
        <div><div className="eyebrow">CRM intern</div><h2 className="display">Cereri.</h2><p>Gestionează solicitările primite de la proprietari, investitori și cumpărători.</p></div>
        {!editing && <button className="button button-primary" onClick={() => { setForm({ ...emptyInquiry }); setEditing({ id: 0, ...emptyInquiry, createdAt: new Date().toISOString() }); }}><Plus size={15} /> Cerere nouă</button>}
      </div>
      {editing && (
        <form className="admin-form inquiry-form" onSubmit={submit}>
          <div className="admin-form-head"><div><div className="eyebrow">{editing.id ? 'Editare cerere' : 'Cerere nouă'}</div><h2 className="display">{editing.id ? editing.name : 'Adaugă un lead.'}</h2></div><button type="button" className="admin-icon-button" onClick={close}><X size={18} /></button></div>
          <div className="admin-form-grid">
            <label className="admin-field">Tip<select className="form-input" value={form.kind} onChange={(e) => setField('kind', e.target.value)}><option value="contact">Contact</option><option value="land">Achiziție teren</option></select></label>
            <label className="admin-field">Status<select className="form-input" value={form.status} onChange={(e) => setField('status', e.target.value)}>{inquiryStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="admin-field">Nume<input required className="form-input" value={form.name} onChange={(e) => setField('name', e.target.value)} /></label>
            <label className="admin-field">Contact<input required className="form-input" value={form.contact} onChange={(e) => setField('contact', e.target.value)} /></label>
            <label className="admin-field">Localizare<input className="form-input" value={form.location} onChange={(e) => setField('location', e.target.value)} /></label>
            <label className="admin-field">Proprietate asociată<input className="form-input" value={form.propertySlug} onChange={(e) => setField('propertySlug', e.target.value)} /></label>
            <label className="admin-field admin-field-wide">Mesaj<textarea required className="form-input" value={form.message} onChange={(e) => setField('message', e.target.value)} /></label>
          </div>
          {error && <p className="admin-error">{error}</p>}
          <div className="admin-actions"><button type="button" className="button button-ghost" onClick={close}>Anulează</button><button type="submit" className="button button-primary"><Save size={15} /> Salvează cererea</button></div>
        </form>
      )}
      <section className="admin-list inquiry-list">
        <div className="admin-list-head"><span>{inquiries.length} cereri</span><span>Status</span></div>
        {isLoading && <div className="admin-empty">Se încarcă cererile…</div>}
        {!isLoading && inquiries.map((inquiry) => (
          <div className="admin-row inquiry-row" key={inquiry.id}>
            <div className="inquiry-kind">{inquiry.kind === 'land' ? 'Teren' : 'Contact'}</div>
            <div className="admin-row-info"><strong>{inquiry.name}</strong><span>{inquiry.contact}{inquiry.location ? ` · ${inquiry.location}` : ''}</span><small>{inquiry.message}</small></div>
            <span className={`admin-status inquiry-status-${inquiry.status}`}>{inquiryStatuses.find((item) => item.value === inquiry.status)?.label ?? inquiry.status}</span>
            <div className="admin-row-actions"><button className="admin-icon-button" onClick={() => startEdit(inquiry)} aria-label={`Editează cererea de la ${inquiry.name}`}><Pencil size={16} /></button><button className="admin-icon-button danger" onClick={() => setDeleteTarget(inquiry)} aria-label={`Șterge cererea de la ${inquiry.name}`}><Trash2 size={16} /></button></div>
          </div>
        ))}
        {!isLoading && inquiries.length === 0 && <div className="admin-empty">Nu există cereri încă.</div>}
      </section>
      {deleteTarget && <DeleteConfirmModal label={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={() => remove(deleteTarget)} isDeleting={deleteInquiry.isPending} />}
    </section>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState('');
  const { data: propertiesResponse, isLoading, isError } = useListProperties();
  const properties = Array.isArray(propertiesResponse) ? propertiesResponse : [];
  const hasInvalidResponse = !isLoading && !Array.isArray(propertiesResponse);
  const deleteProperty = useDeleteProperty();
  const queryClient = useQueryClient();

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const handleSaved = () => {
    closeForm();
    setNotice('Proprietatea a fost salvată.');
    window.setTimeout(() => setNotice(''), 3000);
  };

  const handleDelete = (property: Property) => {
    deleteProperty.mutate({ slug: property.slug }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPropertiesQueryKey() });
        setNotice('Proprietatea a fost ștearsă.');
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container-wide admin-header-inner">
          <Link href="/" className="brand">
            <img className="brand-logo" src={`${import.meta.env.BASE_URL}logo-home.png`} alt="ADD Partners" />
          </Link>
          <div className="admin-header-actions"><Link href="/" className="admin-back"><ArrowLeft size={15} /> Vezi website-ul</Link><button type="button" className="admin-back" onClick={onLogout}>Ieșire</button></div>
        </div>
      </header>
      <main className="container-wide admin-main">
        <div className="admin-title-row">
          <div>
            <div className="eyebrow">Administrare</div>
            <h1 className="display">Proprietăți.</h1>
            <p>Gestionează oportunitățile afișate pe website.</p>
          </div>
          {!creating && !editing && <button className="button button-primary" onClick={() => setCreating(true)}><Plus size={16} /> Proprietate nouă</button>}
        </div>
        {notice && <div className="admin-notice"><Check size={16} /> {notice}</div>}
        {(creating || editing) && <PropertyForm key={editing?.id ?? 'new'} editing={editing} onCancel={closeForm} onSaved={handleSaved} />}
        <InquiryManager />
        <div className="catalog-grid">
          <CatalogManager kind="categories" title="Categorii" />
          <CatalogManager kind="statuses" title="Statusuri" />
        </div>
        <section className="admin-list">
          <div className="admin-list-head"><span>{properties.length} proprietăți</span><span>Status publicare</span></div>
          {isLoading && <div className="admin-empty">Se încarcă proprietățile…</div>}
          {(isError || hasInvalidResponse) && <div className="admin-empty admin-error">Lista nu a putut fi încărcată.</div>}
          {!isLoading && !isError && !hasInvalidResponse && properties.map((property) => (
            <div className="admin-row" key={property.id}>
              <div className="admin-row-image" style={{ backgroundImage: `url(${property.image})` }} />
              <div className="admin-row-info">
                <strong>{property.title}</strong>
                <span>{property.location} · {property.size}</span>
                <small>{property.slug}</small>
              </div>
              <span className="admin-status">{property.status}</span>
              <div className="admin-row-actions">
                <button type="button" className="admin-icon-button" onClick={() => { setCreating(false); setEditing(property); }} aria-label={`Editează ${property.title}`}><Pencil size={16} /></button>
                <button type="button" className="admin-icon-button danger" onClick={() => setDeleteTarget(property)} aria-label={`Șterge ${property.title}`}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {!isLoading && !isError && !hasInvalidResponse && properties.length === 0 && <div className="admin-empty">Nu există proprietăți. Adaugă prima oportunitate.</div>}
        </section>
        {deleteTarget && <DeleteConfirmModal label={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} isDeleting={deleteProperty.isPending} />}
      </main>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <AdminDashboard onLogout={() => { sessionStorage.removeItem('admin_token'); setToken(null); }} />;
  }

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('Parolă incorectă.');
      const data = await response.json() as { token: string };
      sessionStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Autentificarea a eșuat.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-shell admin-login-shell">
      <form className="admin-form admin-login" onSubmit={login}>
        <img className="brand-logo" src={`${import.meta.env.BASE_URL}logo-home.png`} alt="ADD Partners" />
        <div><div className="eyebrow">Administrare</div><h1 className="display">Autentificare.</h1></div>
        <label className="admin-field">Parolă<input autoFocus required type="password" className="form-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="admin-error">{error}</p>}
        <button className="button button-primary" disabled={submitting}>{submitting ? 'Se verifică…' : 'Intră în administrare'}</button>
      </form>
    </div>
  );
}
