export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  status: string;
  details: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  description: string;
}

export interface SkillItem {
  name: string;
  percentage: number;
  description: string;
  gradient: string;
}

export type ProjectStatus = 'Terminado' | 'En desarrollo' | 'Próximamente';

export type ProjectCategory =
  | 'Logística & Operaciones'
  | 'Automatización & Scripts'
  | 'Software & Web'
  | 'Bases de Datos & BI';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  technologies: string[];
  iconType: 'folder' | 'code' | 'excel' | 'sap' | 'package' | 'bot';
  link?: string;
  completionDate?: string;
  isCustom?: boolean;
}

export type ActiveModal =
  | 'mipc'
  | 'mis-docs'
  | 'red'
  | 'papelera'
  | 'sap'
  | 'control-panel'
  | 'acerca'
  | 'shutdown'
  | 'close-warning'
  | 'display-properties'
  | 'run'
  | 'logoff'
  | 'portafolio'
  | 'telefono'
  | null;

