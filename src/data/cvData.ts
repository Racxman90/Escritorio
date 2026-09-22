import { WorkExperience, EducationItem, CertificationItem, SkillItem, ProjectItem } from '../types';

export const BLISS_WALLPAPER_URL =
  'https://img.asmedia.epimg.net/resizer/v2/FTQC54VKVZETPOVRR3QYMJQZYA.jpg?auth=dd9037b2cad56adcef68b9769243b0df93440c5130a9f95e943690e049857f97&width=956&height=538&smart=true';

const ICON_BASE = `${import.meta.env.BASE_URL}icons/`;

export const XP_ICONS = {
  computer: `${ICON_BASE}xp-computer.png`,
  documents: `${ICON_BASE}xp-documents.png`,
  network: `${ICON_BASE}xp-network.png`,
  recycle: `${ICON_BASE}xp-recycle.png`,
  file: `${ICON_BASE}xp-file.png`,
  folder: `${ICON_BASE}xp-folder.png`,
  notepad: `${ICON_BASE}xp-notepad.png`,
  ie: `${ICON_BASE}xp-ie.png`,
  sap: `${ICON_BASE}sap-logo.svg`,
  phone: `${ICON_BASE}xp-phone.svg`,
};

export const PROFILE_AVATAR_SIDEBAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDNVXrVaoaFfgpErqKFzZlSjig6mg4zIp9HtvqAzrdL3mhziB19TwlZCsDJVa6jpRRIDX9YHWN4xOifCxbgOu-I6zQRULuLzHEDJNoaP4TAyKmDXYlFysRcyQy-GAb6A_vzPGhej9ezCc4Ov4u3EoDUzRGYGeSyy9OaZlKD6FWLXHtZ3Rj6tzRVx_sQDUk5me2YE9w1AKAVpVe7OoxZ0SQPHXFMHIZii0tuS9bhbitCzcFh145DU3k1poVliuDGWbovik5LUjhJqRQ';

export const PROFILE_AVATAR_HEADER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCT-Y0EK_d-vvWzPRfBseipYuGaYQlCoHT85oPNts9DU2akC09rhllNpMmPIpXEL2TGm2BI0Nw_9BHftAnvLcG2thL_yVjj0niGJsJ2wxLGRJKbN_vvs02nTrJdjPh-R96HiSgZbICSS7k37Z7L6K8ZkFOcyr35Yz7C_CM-wjqSPwwLWs9fQL3B4HWDu4xZ5dju2RFJZbtJQW7D3foSuD9uYRIUP0YJuqg9Mw9ImQhyU5bDXgqrAfYVusUH-N8yLOQqKQO63dmw3kw';

export const CV_DATA = {
  fullName: 'Raúl Alejandro Ayala Covarrubias',
  role: 'Técnico en Logística y Gestión de Operaciones',
  location: 'Santiago, Chile',
  email: 'raul.ayala.contacto@gmail.com',
  phone: '+56 9 8765 4321',
  linkedin: 'https://linkedin.com/in/raul-ayala-logistica',
  linkedinDisplay: 'linkedin.com/in/raul-ayala-logistica',
  summary:
    'Técnico en Logística de Nivel Superior con sólida experiencia en control de inventarios, administración de bodegas, supervisión de despachos y aseguramiento de la trazabilidad en centros de distribución de alta exigencia. Especializado en el apalancamiento de tecnologías de información para optimizar operaciones: dominio operativo de módulos ERP SAP R/3 (MM/SD), construcción de tableros de control en Power BI, análisis y automatización mediante Python y flujos inteligentes. Capacidad probada para coordinar equipos humanos, mitigar desviaciones en la cadena de suministro y garantizar KPIs de entrega on-time in-full (OTIF).',
  experiences: [
    {
      id: 'expro',
      role: 'Supervisor de Bodega & Control de Despachos',
      company: 'Expro Servicios Logísticos y RRHH — Santiago',
      period: '2022 - Actualidad',
      achievements: [
        'Supervisión integral de operaciones de recepción, almacenamiento, picking y despacho en centro de distribución principal.',
        'Gestión directa de entradas, salidas y regularización de stocks mediante SAP R/3 (Módulos MM/SD), alcanzando una exactitud de inventario (IRA) superior al 98.7%.',
        'Liderazgo de turnos rotativos de hasta 25 operadores de bodega y conductores de grúa horquilla, asegurando cumplimiento de normas de seguridad laboral.',
        'Implementación de paneles de reportería semanal en Power BI para seguimiento de rotación de SKU y productividad horaria.',
      ],
    },
    {
      id: 'chilexpress',
      role: 'Operador y Analista de Envíos Express',
      company: 'Chilexpress S.A. — Hub Logístico Aeropuerto / Región Metropolitana',
      period: '2019 - 2022',
      achievements: [
        'Control, clasificación y ruteo dinámico de paquetería de alta velocidad con lectura y pistoleo por radiofrecuencia (RF).',
        'Auditoría continua de trazabilidad y resolución de discrepancias en envíos observados, reduciendo las tasas de extravío en un 14%.',
        'Coordinación directa con transportistas de última milla y despacho a sucursales regionales para cumplimiento de ventanas horarias estrictas.',
      ],
    },
  ] as WorkExperience[],
  education: [
    {
      id: 'aiep',
      title: 'Técnico de Nivel Superior en Logística',
      institution: 'Instituto Profesional AIEP',
      status: 'Titulado',
      details:
        'Titulado con Distinción — Mención en Gestión de Operaciones, Distribución y Cadena de Suministro.',
    },
  ] as EducationItem[],
  certifications: [
    {
      id: 'python',
      name: 'Programación y Análisis de Datos con Python',
      description: 'Pandas, NumPy, scripts de automatización para inventario.',
    },
    {
      id: 'excel',
      name: 'Excel Financiero y Avanzado para Operaciones',
      description: 'Macros VBA, Power Query, modelos de previsión de stock.',
    },
    {
      id: 'n8n',
      name: 'Automatización de Procesos (n8n & Webhooks)',
      description: 'Integración de alertas de quiebre de stock y reportes automáticos.',
    },
    {
      id: 'seguridad',
      name: 'Normativas de Seguridad en Bodega & Almacenamiento',
      description: 'Ley 16.744, prevención de riesgos y manejo de cargas.',
    },
  ] as CertificationItem[],
  skills: [
    {
      name: 'SAP R/3 (MM / SD)',
      percentage: 90,
      description: 'Dominio Avanzado: Módulos de gestión de materiales y comercial',
      gradient: 'from-[#0040b5] to-[#0055ea]',
    },
    {
      name: 'MS Excel (Macros, Power Query)',
      percentage: 95,
      description: 'Dominio Avanzado: Fórmulas complejas, Macros y modelado Power Query',
      gradient: 'from-[#106d20] to-[#5ab843]',
    },
    {
      name: 'Power BI (Dashboards Logísticos)',
      percentage: 85,
      description: 'Diseño y publicación de Dashboards Logísticos, DAX y KPIs de despacho',
      gradient: 'from-[#0040b5] to-[#0055ea]',
    },
    {
      name: 'Python & Scripts de Automatización',
      percentage: 75,
      description: 'Automatización de rutinas de inventario, consumo de APIs y pandas',
      gradient: 'from-[#0051e0] to-[#b5c4ff]',
    },
    {
      name: 'SQL / Consultas a Bases de Datos',
      percentage: 70,
      description: 'Consultas relacionales, vistas y extracción de datos operacionales',
      gradient: 'from-[#0040b5] to-[#0055ea]',
    },
  ] as SkillItem[],
  competencies: [
    'Gestión de Inventarios (ABC / IRA)',
    'Control de Despachos OTIF',
    'Radiofrecuencia (WMS / RF)',
    'Picking & Packing',
    'Trazabilidad de Envíos',
    'Consumo de APIs & Webhooks',
    'IA aplicada a Supply Chain',
    'Prevención y Seguridad Bodega',
  ],
  languages: [
    { lang: 'Español', level: 'Nativo' },
    { lang: 'Inglés', level: 'Técnico / Intermedio (lectura técnica y software)' },
  ],
  driverLicense: 'Clase B vigente',
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-sap-regularizacion',
    title: 'Sistema de Regularización de Stocks en SAP MM/SD',
    category: 'Logística & Operaciones',
    status: 'Terminado',
    description:
      'Metodología y procedimiento operativo para conciliación de discrepancias de inventario en almacén central, optimizando la precisión de existencias (IRA) al 98.7% mediante transacciones MIGO y MI04.',
    technologies: ['SAP R/3', 'SAP GUI', 'Módulos MM/SD', 'Excel VBA'],
    iconType: 'sap',
    completionDate: '2023',
    link: '#',
  },
  {
    id: 'proj-excel-otif',
    title: 'Generador de Métricas OTIF y Cubicación de Pallets',
    category: 'Automatización & Scripts',
    status: 'Terminado',
    description:
      'Planilla automatizada con macros VBA y Power Query para el cálculo automático de cubicaje según dimensiones estándar y emisión de reportes diarios de cumplimiento de entregas a clientes.',
    technologies: ['Excel VBA', 'Power Query', 'Cálculo Logístico', 'Modelado de Datos'],
    iconType: 'excel',
    completionDate: '2023',
    link: '#',
  },
  {
    id: 'proj-wms-powerbi',
    title: 'Dashboard de Rendimiento de Bodega & Picking',
    category: 'Bases de Datos & BI',
    status: 'Terminado',
    description:
      'Tablero de control interactivo en Power BI para visualización de tiempos de preparación por operario, rotación de SKU de alta demanda (clasificación ABC) y volumen de despachos por turno.',
    technologies: ['Power BI', 'DAX', 'SQL Server', 'Excel'],
    iconType: 'folder',
    completionDate: '2024',
    link: '#',
  },
  {
    id: 'proj-python-stock-bot',
    title: 'Bot de Alerta Automática de Quiebres de Stock',
    category: 'Automatización & Scripts',
    status: 'En desarrollo',
    description:
      'Script en Python que monitorea las diferencias de stock y emite alertas instantáneas vía Webhook cuando un producto crítico se encuentra por debajo del stock de seguridad.',
    technologies: ['Python', 'Pandas', 'Webhooks / n8n', 'APIs REST'],
    iconType: 'bot',
    completionDate: 'En desarrollo activo (70%)',
    link: '#',
  },
  {
    id: 'proj-ruteo-express',
    title: 'Optimizador de Trazabilidad y Ruteo Dinámico',
    category: 'Software & Web',
    status: 'Próximamente',
    description:
      'Aplicativo en fase de diseño para clasificación rápida de códigos de barra por zonas de entrega y reducción de ventanas de espera en despachos de última milla.',
    technologies: ['Python', 'Algoritmos de Ruteo', 'Radiofrecuencia (RF)', 'FastAPI'],
    iconType: 'code',
    completionDate: 'Próximamente / Fase de documentación',
    link: '#',
  },
  {
    id: 'proj-portal-proveedores',
    title: 'Portal de Confirmación de Citas de Proveedores',
    category: 'Software & Web',
    status: 'Próximamente',
    description:
      'Módulo web planificado para reserva de andenes de descarga en bodega y validación previa de facturas/órdenes de compra para recepción sin cuellos de botella.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'SQL'],
    iconType: 'package',
    completionDate: 'Planificado para Q4',
    link: '#',
  },
];

