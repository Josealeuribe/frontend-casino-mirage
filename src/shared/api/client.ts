// Cliente HTTP hacia el backend real (Casino-arauca/backend). En Docker,
// nginx.conf hace proxy de "/api/" hacia el contenedor `api`, asi que en
// produccion el navegador nunca ve un host distinto (mismo origen, sin CORS).
// En local (`pnpm dev`, fuera de Docker) VITE_API_URL puede apuntar a
// http://localhost:4002/api directamente.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "/api";

const TOKEN_KEY = "ccm_token";
const VISITANTE_KEY = "ccm_visitante_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getVisitanteToken(): string | null {
  return localStorage.getItem(VISITANTE_KEY);
}
export function setVisitanteToken(token: string | null) {
  if (token) localStorage.setItem(VISITANTE_KEY, token);
  else localStorage.removeItem(VISITANTE_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const visitante = getVisitanteToken();
  if (visitante) headers.set("X-Visitante", visitante);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : `Error ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  return body as T;
}

const get = <T,>(path: string) => request<T>(path);
const post = <T,>(path: string, data?: unknown) =>
  request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined });
const patch = <T,>(path: string, data?: unknown) =>
  request<T>(path, { method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined });

// --- Tipos compartidos -------------------------------------------------

export interface SafeStaff {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "cajero";
  sede: { clave: string; nombre: string; direccion: string } | null;
  debeCambiarPassword: boolean;
}

export interface SafeCliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  docNumero: string;
  telefono: string;
  departamento: string;
  ciudad: string;
}

export interface SafeBono {
  codigo: string;
  estado: "pendiente" | "reclamado";
  creadoEn: string;
  canjeadoEn: string | null;
  vigenciaHasta: string;
  premio: { clave: string; nombre: string; detalle: string; monto: number };
  sede: string | null;
  canjeadoPor: string | null;
}

export type LoginResult =
  | { tipo: "staff"; token: string; staff: SafeStaff }
  | { tipo: "cliente"; token: string; cliente: SafeCliente; bono: SafeBono | null; yaParticipo: boolean; bonoCanjeado: boolean };

export type MeResult =
  | { tipo: "staff"; staff: SafeStaff }
  | { tipo: "cliente"; cliente: SafeCliente; bono: SafeBono | null; yaParticipo: boolean; bonoCanjeado: boolean };

// --- Auth ----------------------------------------------------------------

export function loginUsuario(identifier: string, password: string) {
  return post<LoginResult>("/auth/login", { identifier, password });
}

export function fetchMe() {
  return get<MeResult>("/auth/me");
}

export function cerrarSesion() {
  return post<{ ok: true }>("/auth/salir");
}

export function registrarActividad() {
  return post<{ ok: true }>("/auth/actividad");
}

export function cambiarPassword(payload: { actual: string; nueva: string; confirmar: string }) {
  return post<{ ok: true }>("/auth/cambiar-password", payload);
}

export function checkDisponibilidad(params: { email?: string; docNum?: string }) {
  const q = new URLSearchParams();
  if (params.email) q.set("email", params.email);
  if (params.docNum) q.set("docNum", params.docNum);
  return get<{ emailDisponible?: boolean; docNumDisponible?: boolean }>(`/auth/disponibilidad?${q.toString()}`);
}

export interface Ubicacion {
  nombre: string;
  municipios: string[];
}

// Publico, sin autenticacion: el formulario de registro lo necesita antes de
// que exista cualquier sesion. Trae el catalogo entero de una sola vez (es
// pequeño) para armar los dos <select> en cascada de departamento/ciudad.
export function fetchUbicaciones() {
  return get<{ departamentos: Ubicacion[] }>("/ubicaciones");
}

export interface RegistroPayload {
  nombres: string;
  apellidos: string;
  docType: "Cédula de Ciudadanía" | "Pasaporte" | "Tarjeta de Extranjería";
  docNum: string;
  birth: string;
  phone: string;
  dept: string;
  city: string;
  email: string;
  pass: string;
  passConfirm: string;
  // El backend exige literalmente `true` (Zod `z.literal(true)`) y rechaza
  // la petición si no lo son -- aqui se tipan como boolean porque nacen de
  // checkboxes controlados por estado (mutables), y es el formulario quien
  // valida que esten en true ANTES de enviar (ver RegistrationPage.tsx).
  terminos: boolean;
  datos: boolean;
  edad: boolean;
  promo: boolean;
  comms: boolean;
  ticket?: string;
}

export interface RegistroResult {
  token: string;
  tipo: "cliente";
  cliente: SafeCliente;
  bono: SafeBono | null;
  yaParticipo: boolean;
  bonoCanjeado: boolean;
  bonoError: string | null;
}

export function registerCliente(payload: RegistroPayload) {
  return post<RegistroResult>("/auth/register", payload);
}

// --- Ruleta ----------------------------------------------------------------

export interface GirosRestantes {
  usados: number;
  maximo: number;
  restantes: number;
  visitanteToken: string;
}

export function fetchGirosRestantes() {
  return get<GirosRestantes>("/ruleta/giros-restantes");
}

export function fetchVigenciaPromocion() {
  return get<{ vigenciaHasta: string | null }>("/ruleta/vigencia");
}

export interface GiroResultado {
  premio: { clave: string; nombre: string; detalle: string; monto: number };
  ticket: string;
  usados: number;
  maximo: number;
  restantes: number;
  visitanteToken: string;
}

export function girarRuleta() {
  return post<GiroResultado>("/ruleta/girar-anonimo");
}

// --- Admin -------------------------------------------------------------

export interface VistaGeneralResult {
  vigenciaProxima: string | null;
  stats: { clientesRegistrados: number; bonosPendientes: number; bonosCanjeados: number; sinBono: number };
  valorTotalEntregado: number;
  repartoPorCasino: { sede: string; count: number; pct: number }[];
  bonosPorPremio: { premio: string; monto: number; count: number }[];
  ultimosRegistros: { nombre: string; fecha: string; bono: { nombre: string; monto: number } | null }[];
}

export function adminFetchVistaGeneral() {
  return get<VistaGeneralResult>("/admin/vista-general");
}

export interface DashboardResult {
  kpisHoy: { girosHoy: number; canjesHoy: number; tasaCanje: number; valorEntregadoHoy: number };
  semanal: { dia: string; giros: number; canjes: number }[];
  porSede: { sede: string; canjes: number; valor: number }[];
  clientesRegistrados: number;
}

export function adminFetchDashboard() {
  return get<DashboardResult>("/admin/dashboard");
}

export interface AdminCliente {
  id: number;
  nombres: string;
  apellidos: string;
  docTipo: string;
  docNumero: string;
  nacimiento: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  email: string;
  createdAt: string;
  bono: {
    codigo: string;
    estado: "pendiente" | "reclamado";
    creadoEn: string;
    canjeadoEn: string | null;
    sede: string | null;
    premio: { nombre: string; monto: number };
  } | null;
}

export function adminFetchClientes() {
  return get<{ clientes: AdminCliente[] }>("/admin/clientes");
}

export interface AdminPremio {
  id: number;
  clave: string;
  nombre: string;
  detalle: string;
  monto: number;
  weight: number;
  activo: boolean;
  vigenciaHasta: string;
  entregados: number;
  canjeados: number;
}

export function adminFetchPremios() {
  return get<{ premios: AdminPremio[] }>("/admin/premios");
}

export function adminActualizarVigencia(id: number, payload: { nueva: string; motivo: string }) {
  return post<{ ok: true }>(`/admin/premios/${id}/vigencia`, payload);
}

export interface CambioVigencia {
  id: number;
  anterior: string;
  nueva: string;
  motivo: string;
  bonosAfectados: number;
  registradoPor: string;
  creadoEn: string;
}

export function adminFetchVigenciaHistorial(id: number) {
  return get<{ historial: CambioVigencia[] }>(`/admin/premios/${id}/vigencia-historial`);
}

export interface AdminUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "cajero";
  activo: boolean;
  sede: string | null;
  sedeClave: string | null;
  debeCambiarPassword: boolean;
  canjes: number;
  createdAt: string;
  ultimaActividad: string | null;
  sesionCerradaEn: string | null;
  enLinea: boolean;
}

export function adminFetchUsuarios() {
  return get<{ usuarios: AdminUsuario[]; ventanaEnLineaSegundos: number }>("/admin/usuarios");
}

export function adminCrearUsuario(payload: { nombre: string; email: string; rol: "admin" | "cajero"; sedeClave?: string }) {
  return post<{ ok: true; usuario: { id: number; nombre: string; email: string; rol: string }; temporal: string }>(
    "/admin/usuarios",
    payload,
  );
}

export function adminActualizarUsuario(id: number, payload: { activo: boolean }) {
  return patch<{ ok: true; usuario: { id: number; activo: boolean } }>(`/admin/usuarios/${id}`, payload);
}

export function adminRestablecerPassword(id: number) {
  return post<{ ok: true; usuario: { id: number; nombre: string; email: string }; temporal: string }>(
    `/admin/usuarios/${id}/restablecer-password`,
  );
}

export interface AdminCanje {
  codigo: string;
  creadoEn: string;
  canjeadoEn: string | null;
  sede: string | null;
  canjeadoPor: string | null;
  canjeadoPorEmail: string | null;
  premio: { nombre: string; monto: number };
  cliente: { nombres: string; apellidos: string; docTipo: string; docNumero: string; email: string; telefono: string };
}

export function adminFetchCanjes() {
  return get<{ kpis: { totalCanjeados: number; valorTotal: number; tasaCanje: number }; canjes: AdminCanje[] }>(
    "/admin/canjes",
  );
}

// --- Cajero ------------------------------------------------------------

export function cajeroFetchSedes() {
  return get<{ sedes: { clave: string; nombre: string; direccion: string }[] }>("/cajero/sedes");
}

export interface CanjePreview {
  codigo: string;
  estado: "pendiente" | "reclamado";
  vigenciaHasta: string;
  vencido: boolean;
  premio: { nombre: string; detalle: string; monto: number };
  cliente: {
    nombres: string;
    apellidos: string;
    docTipo: string;
    docNumero: string;
    email: string;
    telefono: string;
    departamento: string;
    ciudad: string;
    registradoEn: string;
  };
  sedeCanje: string | null;
  canjeadoPor: string | null;
}

export function cajeroBuscarPorCodigo(codigo: string) {
  return get<CanjePreview>(`/cajero/codigo/${encodeURIComponent(codigo)}`);
}

export interface ClienteConBono {
  cliente: {
    nombres: string;
    apellidos: string;
    docTipo: string;
    docNumero: string;
    email: string;
    telefono: string;
    departamento: string;
    ciudad: string;
    registradoEn: string;
  };
  bono: {
    codigo: string;
    estado: "pendiente" | "reclamado";
    creadoEn: string;
    canjeadoEn: string | null;
    vigenciaHasta: string;
    vencido: boolean;
    canjeadoPor: string | null;
    sede: string | null;
    premio: { nombre: string; detalle: string; monto: number };
  } | null;
}

export function cajeroBuscarPorDocumento(docNumero: string) {
  return get<ClienteConBono>(`/cajero/cliente/${encodeURIComponent(docNumero)}`);
}

export function cajeroConfirmarCanje(codigo: string) {
  return post<{ ok: true } & CanjePreview>(`/cajero/codigo/${encodeURIComponent(codigo)}/canjear`);
}

export interface CajeroHistorialItem {
  codigo: string;
  canjeadoEn: string | null;
  canjeadoPor: string | null;
  sede: string | null;
  premio: { nombre: string; monto: number };
  cliente: { nombres: string; apellidos: string; docNumero: string };
}

export function cajeroFetchHistorial() {
  return get<{ soloPropios: boolean; canjes: CajeroHistorialItem[] }>("/cajero/historial");
}

export interface VigenciaPremio {
  clave: string;
  nombre: string;
  monto: number;
  vigenciaHasta: string;
}

export function cajeroFetchVigencias() {
  return get<{ premios: VigenciaPremio[] }>("/cajero/vigencias");
}
