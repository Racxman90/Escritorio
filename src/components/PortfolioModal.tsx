import React, { useState, useEffect } from 'react';
import { ProjectItem, ProjectCategory, ProjectStatus } from '../types';
import { DEFAULT_PROJECTS, XP_ICONS } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: (modal: any) => void;
  onRestoreCV: () => void;
}

const STORAGE_KEY = 'xp_portfolio_projects_v1';

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onOpenModal,
  onRestoreCV,
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROJECTS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('Todos');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tiles' | 'details'>('tiles');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals inside Portfolio
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectingProject, setInspectingProject] = useState<ProjectItem | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Automatización & Scripts');
  const [newStatus, setNewStatus] = useState<ProjectStatus>('En desarrollo');
  const [newDescription, setNewDescription] = useState('');
  const [newTechnologies, setNewTechnologies] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newDate, setNewDate] = useState('2024 / En curso');
  const [newIconType, setNewIconType] = useState<ProjectItem['iconType']>('code');

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  if (!isOpen) return null;

  const handleResetToDefault = () => {
    soundManager.playClick();
    if (window.confirm('¿Desea restablecer el catálogo de proyectos a su estado predeterminado?')) {
      setProjects(DEFAULT_PROJECTS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playClick();
    const newProj: ProjectItem = {
      id: `proj-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      description:
        newDescription.trim() ||
        'Proyecto registrado en el portafolio. Funcionalidades y módulos en desarrollo continuo.',
      technologies: newTechnologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      iconType: newIconType,
      link: newLink.trim() || undefined,
      completionDate: newDate.trim() || 'Próximamente',
      isCustom: true,
    };

    setProjects((prev) => [newProj, ...prev]);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewTechnologies('');
    setNewLink('');
    setNewDate('2024 / En curso');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    if (window.confirm('¿Está seguro de que desea eliminar este proyecto del portafolio?')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (inspectingProject?.id === id) {
        setInspectingProject(null);
      }
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((item) => {
    if (activeCategory !== 'Todos' && item.category !== activeCategory) {
      return false;
    }
    if (activeStatusFilter === 'Terminado' && item.status !== 'Terminado') {
      return false;
    }
    if (
      activeStatusFilter === 'En desarrollo / Próximamente' &&
      item.status === 'Terminado'
    ) {
      return false;
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTech = item.technologies.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTech) return false;
    }
    return true;
  });

  const countTotal = projects.length;
  const countDone = projects.filter((p) => p.status === 'Terminado').length;
  const countInProgress = projects.filter((p) => p.status === 'En desarrollo').length;
  const countUpcoming = projects.filter((p) => p.status === 'Próximamente').length;

  return (
    <div
      id="modal-portfolio"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/45 select-none font-sans"
      onClick={onClose}
    >
      <div
        className="w-[940px] max-w-full h-[620px] max-h-[92vh] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl flex flex-col overflow-hidden xp-window-shadow text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Classic Windows XP Window Titlebar */}
        <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between font-bold text-[12px] shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[16px] text-yellow-300">
              folder_special
            </span>
            <span className="drop-shadow">
              Portafolio de Proyectos y Programas — C:\Raul_Ayala\Portafolio
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="w-5 h-5 bg-[#0055ea] hover:bg-[#2070ff] text-white flex items-center justify-center rounded-xs text-[11px] font-bold border border-white/60 cursor-pointer"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              title="Minimizar"
            >
              _
            </button>
            <button
              type="button"
              className="w-5 h-5 bg-[#0055ea] hover:bg-[#2070ff] text-white flex items-center justify-center rounded-xs text-[11px] font-bold border border-white/60 cursor-pointer"
              title="Maximizar"
              onClick={() => soundManager.playClick()}
            >
              □
            </button>
            <button
              type="button"
              className="w-5 h-5 bg-[#c21b30] hover:bg-[#e03040] text-white flex items-center justify-center rounded-xs text-[13px] font-bold border border-white/60 cursor-pointer"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              title="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* 2. Menu Bar */}
        <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-[#c3c5d8] flex items-center space-x-3 text-[#1c1c12] text-[11px] shrink-0">
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
            Archivo
          </span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
            Edición
          </span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
            Ver
          </span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
            Favoritos
          </span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">
            Herramientas
          </span>
          <span
            className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            onClick={() => {
              soundManager.playClick();
              alert(
                'Portafolio de Aplicaciones y Programas de Raúl Ayala.\nPermite gestionar programas terminados y registrar nuevos proyectos en desarrollo o planificados.'
              );
            }}
          >
            Ayuda
          </span>
        </div>

        {/* 3. Standard Toolbar with XP Buttons */}
        <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#c3c5d8] flex flex-wrap items-center justify-between gap-1 text-[#1c1c12] text-[11px] shrink-0">
          <div className="flex items-center space-x-1">
            {/* Back / Forward / Up */}
            <button
              type="button"
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-[#e6e3d2] cursor-pointer"
              onClick={() => soundManager.playClick()}
            >
              <div className="w-5 h-5 rounded-full bg-[#106d20] text-white flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[13px]">arrow_back</span>
              </div>
              <span>Atrás</span>
            </button>

            <button
              type="button"
              className="flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-[#e6e3d2] cursor-pointer"
              onClick={() => soundManager.playClick()}
            >
              <div className="w-5 h-5 rounded-full bg-[#0040b5] text-white flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </div>
            </button>

            <button
              type="button"
              className="flex items-center px-1.5 py-0.5 rounded hover:bg-[#e6e3d2] cursor-pointer"
              onClick={() => {
                soundManager.playClick();
                onRestoreCV();
              }}
              title="Ir al Currículum Vitae"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">
                folder_open
              </span>
              <span className="ml-1">Subir</span>
            </button>

            <div className="h-5 w-px bg-[#c3c5d8] mx-1"></div>

            {/* "Agregar Nuevo Proyecto" Action */}
            <button
              type="button"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-b from-[#f9f9f9] to-[#dcd8c8] hover:from-[#ffffff] hover:to-[#e8e4d4] active:bg-[#c8c4b4] border border-[#7f9db9] rounded-xs shadow-xs text-[#0040b5] font-bold cursor-pointer"
              onClick={() => {
                soundManager.playClick();
                setIsAddModalOpen(true);
              }}
            >
              <span className="material-symbols-outlined text-[16px] text-[#106d20]">
                add_circle
              </span>
              <span>Nuevo Proyecto...</span>
            </button>

            {/* Toggle View Mode */}
            <div className="flex items-center bg-white border border-[#7f9db9] rounded-xs p-0.5 ml-2">
              <button
                type="button"
                className={`px-1.5 py-0.5 rounded-xs ${
                  viewMode === 'tiles' ? 'bg-[#316ac5] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('tiles');
                }}
                title="Vista Mosaicos"
              >
                <span className="material-symbols-outlined text-[14px] align-middle">
                  grid_view
                </span>
              </button>
              <button
                type="button"
                className={`px-1.5 py-0.5 rounded-xs ${
                  viewMode === 'details' ? 'bg-[#316ac5] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('details');
                }}
                title="Vista Detalles"
              >
                <span className="material-symbols-outlined text-[14px] align-middle">
                  view_list
                </span>
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-1.5 bg-white border border-[#7f9db9] px-2 py-0.5 rounded-xs shadow-inner">
            <span className="material-symbols-outlined text-[#106d20] text-[14px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent text-[11px] outline-none text-[#1c1c12] w-32 sm:w-44"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="text-gray-400 hover:text-red-600 text-[10px]"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 4. Filter / Status Breadcrumb Strip */}
        <div className="bg-[#f0ede0] px-3 py-1 border-b border-[#c3c5d8] flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
          <span className="font-bold text-gray-700 whitespace-nowrap">Mostrar:</span>

          {/* Status Filters */}
          {[
            { id: 'Todos', label: `Todos (${countTotal})` },
            { id: 'Terminado', label: `Terminados (${countDone})` },
            {
              id: 'En desarrollo / Próximamente',
              label: `En curso / Próximamente (${countInProgress + countUpcoming})`,
            },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`px-2 py-0.5 rounded-xs whitespace-nowrap transition-colors cursor-pointer border ${
                activeStatusFilter === f.id
                  ? 'bg-[#316ac5] text-white border-[#1e4c91] font-semibold shadow-xs'
                  : 'bg-white text-gray-700 border-[#c3c5d8] hover:bg-[#e2eaf5]'
              }`}
              onClick={() => {
                soundManager.playClick();
                setActiveStatusFilter(f.id);
              }}
            >
              {f.label}
            </button>
          ))}

          <span className="text-gray-400 mx-1">|</span>

          {/* Category Dropdown/Pills */}
          {['Todos', 'Logística & Operaciones', 'Automatización & Scripts', 'Bases de Datos & BI', 'Software & Web'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                className={`px-1.5 py-0.5 rounded-xs text-[10px] whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#106d20] text-white font-bold'
                    : 'text-gray-600 hover:text-black hover:underline'
                }`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat);
                }}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* 5. Dual-Pane Content Body */}
        <div className="flex-1 flex overflow-hidden bg-white">
          {/* Left Sidebar (XP Task Pane) */}
          <div className="w-56 bg-[#f7f4e3] border-r border-[#c3c5d8] p-2 overflow-y-auto space-y-3 shrink-0 hidden sm:block select-none">
            {/* Folder Header Badge */}
            <div className="bg-[#e6e3d2] p-2 rounded border border-[#c3c5d8] text-center shadow-xs">
              <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
                <img
                  src={XP_ICONS.folder}
                  alt="Carpeta"
                  className="w-10 h-10 object-contain drop-shadow"
                />
              </div>
              <div className="font-bold text-[12px] text-[#0040b5]">
                Catálogo de Programas
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">
                {countDone} listos • {countInProgress + countUpcoming} en preparación
              </div>
            </div>

            {/* Task Pane Section 1: Tareas de Proyectos */}
            <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white">
              <div className="xp-sidebar-header text-white px-2 py-1 text-[11px] font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">build</span>
                  <span>Tareas de proyectos</span>
                </span>
              </div>
              <div className="p-2 space-y-1.5 text-[11px]">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={() => {
                    soundManager.playClick();
                    setIsAddModalOpen(true);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px] text-[#106d20]">
                    add_box
                  </span>
                  <span>Agregar nuevo programa</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveStatusFilter('En desarrollo / Próximamente');
                  }}
                >
                  <span className="material-symbols-outlined text-[14px] text-[#e06d10]">
                    pending_actions
                  </span>
                  <span>Ver programas en curso</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={handleResetToDefault}
                >
                  <span className="material-symbols-outlined text-[14px] text-gray-500">
                    restart_alt
                  </span>
                  <span>Restablecer predeterminados</span>
                </button>
              </div>
            </div>

            {/* Task Pane Section 2: Otros Sitios */}
            <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white">
              <div className="xp-sidebar-header text-white px-2 py-1 text-[11px] font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">folder</span>
                  <span>Otros sitios</span>
                </span>
              </div>
              <div className="p-2 space-y-1.5 text-[11px]">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={() => {
                    soundManager.playClick();
                    onRestoreCV();
                    onClose();
                  }}
                >
                  <img src={XP_ICONS.file} alt="CV" className="w-3.5 h-3.5 object-contain" />
                  <span>Currículum Vitae</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenModal('sap');
                    onClose();
                  }}
                >
                  <img src={XP_ICONS.sap} alt="SAP" className="w-3.5 h-3.5 object-contain" />
                  <span>SAP Logon 7.40</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenModal('mis-docs');
                    onClose();
                  }}
                >
                  <img src={XP_ICONS.documents} alt="Docs" className="w-3.5 h-3.5 object-contain" />
                  <span>Mis Documentos</span>
                </button>
              </div>
            </div>

            {/* Task Pane Section 3: Detalles y Ayuda */}
            <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white p-2 text-[10px] text-gray-600 space-y-1">
              <div className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#0040b5]">
                  info
                </span>
                <span>Nota de desarrollo</span>
              </div>
              <p className="leading-snug">
                Los programas marcados como <strong>En desarrollo</strong> o{' '}
                <strong>Próximamente</strong> permiten documentar tus proyectos en curso y añadir
                nuevas herramientas a medida que las completes.
              </p>
            </div>
          </div>

          {/* Right Main Area: Projects Grid or List */}
          <div className="flex-1 bg-white p-3 overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">
                  folder_off
                </span>
                <p className="text-[13px] font-bold text-gray-700">
                  No se encontraron proyectos con los filtros seleccionados
                </p>
                <p className="text-[11px] text-gray-500 mt-1 max-w-sm">
                  Prueba restableciendo los filtros o haz clic en "Nuevo Proyecto" para agregar una
                  nueva aplicación.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-1.5 xp-btn-classic font-bold"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveStatusFilter('Todos');
                    setActiveCategory('Todos');
                    setSearchFilter('');
                  }}
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'tiles' ? (
              /* Tiles Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
                {filteredProjects.map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  const isDone = project.status === 'Terminado';
                  const isInProgress = project.status === 'En desarrollo';

                  return (
                    <div
                      key={project.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedProjectId(project.id);
                      }}
                      onDoubleClick={() => {
                        soundManager.playClick();
                        setInspectingProject(project);
                      }}
                      className={`group relative p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#dce8ff] border-[#0055ea] shadow-md ring-1 ring-[#0055ea]'
                          : 'bg-[#fafafa] hover:bg-[#edf4ff] border-[#c3c5d8] hover:border-[#7f9db9]'
                      }`}
                    >
                      {/* Top Header: Icon + Title + Status Tag */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            {/* Project Icon */}
                            <div className="w-8 h-8 rounded bg-white border border-[#c3c5d8] shadow-xs flex items-center justify-center p-1 shrink-0">
                              {project.iconType === 'sap' ? (
                                <img
                                  src={XP_ICONS.sap}
                                  alt="SAP"
                                  className="w-5 h-5 object-contain"
                                />
                              ) : project.iconType === 'excel' ? (
                                <span className="material-symbols-outlined text-[20px] text-[#106d20]">
                                  table_view
                                </span>
                              ) : project.iconType === 'bot' ? (
                                <span className="material-symbols-outlined text-[20px] text-[#0055ea]">
                                  smart_toy
                                </span>
                              ) : project.iconType === 'code' ? (
                                <span className="material-symbols-outlined text-[20px] text-purple-600">
                                  code
                                </span>
                              ) : project.iconType === 'package' ? (
                                <span className="material-symbols-outlined text-[20px] text-orange-600">
                                  inventory_2
                                </span>
                              ) : (
                                <img
                                  src={XP_ICONS.folder}
                                  alt="Folder"
                                  className="w-5 h-5 object-contain"
                                />
                              )}
                            </div>

                            <div>
                              <h3 className="font-bold text-[12px] text-[#0040b5] leading-tight group-hover:underline">
                                {project.title}
                              </h3>
                              <span className="text-[10px] text-gray-500">{project.category}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-tight whitespace-nowrap shadow-xs border ${
                              isDone
                                ? 'bg-[#e6f4ea] text-[#137333] border-[#a8dab5]'
                                : isInProgress
                                ? 'bg-[#fef7e0] text-[#b06000] border-[#fcd34d] animate-pulse'
                                : 'bg-[#e8f0fe] text-[#1a73e8] border-[#aecbfa]'
                            }`}
                          >
                            {isDone && '✓ '}
                            {isInProgress && '⚙ '}
                            {!isDone && !isInProgress && '⏱ '}
                            {project.status}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-[#333333] leading-relaxed my-2 line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Bottom Footer: Technologies and Actions */}
                      <div className="pt-2 border-t border-[#e2e2e2] mt-2">
                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 bg-[#ece9d8] text-gray-700 border border-[#c3c5d8] rounded-xs text-[9.5px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-500 italic">
                            {project.completionDate || 'En preparación'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {project.isCustom && (
                              <button
                                type="button"
                                className="text-red-600 hover:underline px-1 cursor-pointer"
                                onClick={(e) => handleDeleteProject(project.id, e)}
                                title="Eliminar proyecto personalizado"
                              >
                                Eliminar
                              </button>
                            )}

                            <button
                              type="button"
                              className="px-2 py-0.5 bg-[#ece9d8] hover:bg-[#dcd8c8] border border-[#7f9db9] rounded-xs text-[#1c1c12] font-semibold cursor-pointer shadow-xs active:translate-y-px"
                              onClick={(e) => {
                                e.stopPropagation();
                                soundManager.playClick();
                                setInspectingProject(project);
                              }}
                            >
                              Propiedades
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* "Agregar Próximo Programa" Placeholder Card */}
                <div
                  onClick={() => {
                    soundManager.playClick();
                    setIsAddModalOpen(true);
                  }}
                  className="p-4 rounded border-2 border-dashed border-[#7f9db9] hover:border-[#0055ea] bg-[#f9fbfd] hover:bg-[#eef4ff] text-center flex flex-col items-center justify-center cursor-pointer transition-all min-h-[160px] group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e6edfa] text-[#0055ea] group-hover:scale-110 transition-transform flex items-center justify-center mb-2 shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">add</span>
                  </div>
                  <div className="font-bold text-[12px] text-[#0040b5]">
                    ¿Tienes otro programa o idea en mente?
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                    Haz clic aquí para agregar un programa en desarrollo, prototipo o proyecto planificado a tu portafolio.
                  </p>
                </div>
              </div>
            ) : (
              /* Details List View */
              <div className="border border-[#7f9db9] rounded-xs overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-[#ece9d8] border-b border-[#7f9db9] text-gray-800">
                    <tr>
                      <th className="p-1.5 border-r border-[#c3c5d8]">Nombre</th>
                      <th className="p-1.5 border-r border-[#c3c5d8]">Categoría</th>
                      <th className="p-1.5 border-r border-[#c3c5d8]">Estado</th>
                      <th className="p-1.5 border-r border-[#c3c5d8]">Tecnologías</th>
                      <th className="p-1.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-[#316ac5] hover:text-white border-b border-gray-200 cursor-pointer group"
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedProjectId(project.id);
                        }}
                        onDoubleClick={() => {
                          soundManager.playClick();
                          setInspectingProject(project);
                        }}
                      >
                        <td className="p-1.5 flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[14px]">
                            {project.iconType === 'sap'
                              ? 'view_in_ar'
                              : project.iconType === 'excel'
                              ? 'table_view'
                              : 'code'}
                          </span>
                          <span>{project.title}</span>
                        </td>
                        <td className="p-1.5 text-gray-600 group-hover:text-white">
                          {project.category}
                        </td>
                        <td className="p-1.5">
                          <span
                            className={`px-1 rounded text-[10px] font-bold ${
                              project.status === 'Terminado'
                                ? 'bg-green-100 text-green-800 group-hover:bg-white group-hover:text-green-800'
                                : 'bg-yellow-100 text-yellow-800 group-hover:bg-white group-hover:text-yellow-800'
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="p-1.5 text-gray-500 group-hover:text-white/90">
                          {project.technologies.slice(0, 3).join(', ')}
                        </td>
                        <td className="p-1.5 text-right">
                          <button
                            type="button"
                            className="px-2 py-0.5 bg-[#ece9d8] text-black rounded-xs border border-gray-400 group-hover:bg-white font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundManager.playClick();
                              setInspectingProject(project);
                            }}
                          >
                            Propiedades
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 6. Authentic XP Status Bar */}
        <div className="bg-[#ece9d8] px-3 py-1 border-t border-[#c3c5d8] text-[11px] text-[#1c1c12] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span>{filteredProjects.length} objetos mostrados</span>
            <span>•</span>
            <span className="text-gray-600">
              {countDone} Terminados / {countInProgress + countUpcoming} En desarrollo o planificados
            </span>
          </div>
          <div className="text-gray-500">Mi PC (Local)</div>
        </div>
      </div>

      {/* SUB-MODAL 1: Asistente para Agregar Proyecto */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/50"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-[480px] max-w-full bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titlebar */}
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  post_add
                </span>
                <span>Asistente de Windows para Agregar Nuevo Proyecto</span>
              </span>
              <button
                type="button"
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold cursor-pointer"
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProject} className="p-4 space-y-3 bg-[#ece9d8]">
              <div className="flex gap-3 items-start bg-white p-2.5 rounded border border-[#7f9db9] shadow-inner">
                <span className="material-symbols-outlined text-[32px] text-[#0055ea] shrink-0">
                  rocket_launch
                </span>
                <p className="text-[11px] text-[#1c1c12] leading-snug">
                  Registre aquí cualquier programa, macro, script o aplicativo que haya desarrollado
                  o que tenga en fase de preparación. Se guardará directamente en su portafolio.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-[11px] mb-1">
                  Nombre del programa / proyecto: *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Bot de Monitoreo de Despachos en Python"
                  className="w-full bg-white border border-[#7f9db9] px-2 py-1 text-[11px] rounded-xs focus:outline-none focus:border-[#0055ea]"
                  autoFocus
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[11px] mb-1">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
                    className="w-full bg-white border border-[#7f9db9] px-1.5 py-1 text-[11px] rounded-xs focus:outline-none"
                  >
                    <option value="Logística & Operaciones">Logística & Operaciones</option>
                    <option value="Automatización & Scripts">Automatización & Scripts</option>
                    <option value="Bases de Datos & BI">Bases de Datos & BI</option>
                    <option value="Software & Web">Software & Web</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[11px] mb-1">Estado actual:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-white border border-[#7f9db9] px-1.5 py-1 text-[11px] rounded-xs focus:outline-none"
                  >
                    <option value="En desarrollo">En desarrollo (en curso)</option>
                    <option value="Próximamente">Próximamente (planificado)</option>
                    <option value="Terminado">Terminado (completado)</option>
                  </select>
                </div>
              </div>

              {/* Icon Type & Progress Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[11px] mb-1">Tipo de Icono:</label>
                  <select
                    value={newIconType}
                    onChange={(e) => setNewIconType(e.target.value as ProjectItem['iconType'])}
                    className="w-full bg-white border border-[#7f9db9] px-1.5 py-1 text-[11px] rounded-xs focus:outline-none"
                  >
                    <option value="code">Código / Script (Python, JS)</option>
                    <option value="excel">Planilla / Macro Excel</option>
                    <option value="sap">SAP GUI / ERP</option>
                    <option value="bot">Bot / Automatización</option>
                    <option value="package">Módulo / Paquete Logístico</option>
                    <option value="folder">Carpeta de Proyecto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[11px] mb-1">Fecha o Fase:</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="ej. En desarrollo (50%) o 2024"
                    className="w-full bg-white border border-[#7f9db9] px-2 py-1 text-[11px] rounded-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block font-bold text-[11px] mb-1">
                  Tecnologías y herramientas (separadas por coma):
                </label>
                <input
                  type="text"
                  value={newTechnologies}
                  onChange={(e) => setNewTechnologies(e.target.value)}
                  placeholder="ej. Python, Pandas, Webhooks, FastAPI"
                  className="w-full bg-white border border-[#7f9db9] px-2 py-1 text-[11px] rounded-xs focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[11px] mb-1">
                  Descripción o propósito del programa:
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explique el problema logístico u operativo que resuelve, o las funciones que tendrá..."
                  className="w-full bg-white border border-[#7f9db9] p-1.5 text-[11px] rounded-xs focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#c3c5d8]">
                <button
                  type="submit"
                  className="px-4 py-1 text-[11px] xp-btn-classic font-bold"
                >
                  Guardar en Portafolio
                </button>
                <button
                  type="button"
                  className="px-4 py-1 text-[11px] xp-btn-classic"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: Propiedades del Proyecto (Windows XP Properties Sheet) */}
      {inspectingProject && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/50"
          onClick={() => setInspectingProject(null)}
        >
          <div
            className="w-[430px] max-w-full bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Titlebar */}
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between font-bold text-[11px]">
              <span>Propiedades de: {inspectingProject.title}</span>
              <button
                type="button"
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold cursor-pointer"
                onClick={() => setInspectingProject(null)}
              >
                ×
              </button>
            </div>

            {/* Properties Sheet */}
            <div className="p-4 space-y-3">
              {/* Top Item Summary */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#c3c5d8]">
                <div className="w-10 h-10 rounded bg-white border border-[#7f9db9] flex items-center justify-center p-1 shrink-0 shadow-xs">
                  {inspectingProject.iconType === 'sap' ? (
                    <img src={XP_ICONS.sap} alt="SAP" className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-[24px] text-[#0055ea]">
                      terminal
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    readOnly
                    value={inspectingProject.title}
                    className="w-full bg-white border border-[#7f9db9] px-2 py-0.5 font-bold text-[11px]"
                  />
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Categoría: {inspectingProject.category}
                  </div>
                </div>
              </div>

              {/* Metadata rows */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex">
                  <span className="w-28 text-gray-600 font-semibold">Estado de entrega:</span>
                  <span
                    className={`font-bold ${
                      inspectingProject.status === 'Terminado'
                        ? 'text-green-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {inspectingProject.status}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-28 text-gray-600 font-semibold">Fecha / Avance:</span>
                  <span className="text-[#1c1c12]">
                    {inspectingProject.completionDate || 'En fase preliminar'}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-28 text-gray-600 font-semibold">Desarrollador:</span>
                  <span className="text-[#1c1c12]">Raúl Ayala Covarrubias</span>
                </div>

                <div className="flex">
                  <span className="w-28 text-gray-600 font-semibold">Tecnologías:</span>
                  <span className="text-[#1c1c12] flex-1">
                    {inspectingProject.technologies.join(', ')}
                  </span>
                </div>
              </div>

              {/* Description Box */}
              <div className="pt-2 border-t border-[#c3c5d8]">
                <span className="block text-gray-600 font-semibold mb-1">
                  Descripción y alcance funcional:
                </span>
                <div className="bg-white border border-[#7f9db9] p-2 rounded-xs text-[11px] text-[#1c1c12] leading-relaxed max-h-32 overflow-y-auto">
                  {inspectingProject.description}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#c3c5d8]">
                <button
                  type="button"
                  className="px-4 py-1 text-[11px] xp-btn-classic font-bold"
                  onClick={() => setInspectingProject(null)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
