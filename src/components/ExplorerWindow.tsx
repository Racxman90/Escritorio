import React, { useState, useRef } from 'react';
import { ActiveModal } from '../types';
import {
  PROFILE_AVATAR_HEADER,
  PROFILE_AVATAR_SIDEBAR,
  CV_DATA,
  XP_ICONS,
} from '../data/cvData';

interface ExplorerWindowProps {
  isMinimized: boolean;
  isMaximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onCloseWarning: () => void;
  onOpenModal: (modal: ActiveModal) => void;
  onDownloadCV: () => void;
  activeMenu: string | null;
  onToggleSubMenu: (menuName: string) => void;
  onCloseSubMenus: () => void;
}

export const ExplorerWindow: React.FC<ExplorerWindowProps> = ({
  isMinimized,
  isMaximized,
  onMinimize,
  onToggleMaximize,
  onCloseWarning,
  onOpenModal,
  onDownloadCV,
  activeMenu,
  onToggleSubMenu,
  onCloseSubMenus,
}) => {
  const [addressValue, setAddressValue] = useState(
    'C:\\Documentos\\CV_Raul_Ayala_2024.html'
  );
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Collapsible panels
  const [openPanels, setOpenPanels] = useState<{ [key: string]: boolean }>({
    tareas: true,
    sitios: true,
    detalles: true,
  });

  const [statusText, setStatusText] = useState(
    '1 objeto seleccionado (Currículum Vitae)'
  );

  const cvScrollRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panelId: string) => {
    setOpenPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.remove('highlight-flash');
      void el.offsetWidth;
      el.classList.add('highlight-flash');
    }
  };

  const scrollToTop = () => {
    if (cvScrollRef.current) {
      cvScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddressSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = addressValue.toLowerCase();
    if (val.includes('contacto')) {
      scrollToSection('contacto');
    } else if (val.includes('experiencia')) {
      scrollToSection('experiencia');
    } else if (val.includes('habilidades')) {
      scrollToSection('habilidades');
    } else if (val.includes('educacion')) {
      scrollToSection('educacion');
    } else if (val.includes('portafolio') || val.includes('proyectos')) {
      scrollToSection('portafolio');
    } else if (val.includes('sap')) {
      onOpenModal('sap');
    } else {
      scrollToTop();
    }
  };

  const copyPath = () => {
    navigator.clipboard.writeText(addressValue).then(() => {
      setStatusText('Ruta copiada al portapapeles.');
      setTimeout(() => {
        setStatusText('1 objeto seleccionado (Currículum Vitae)');
      }, 2500);
    });
  };

  const selectAllCV = () => {
    if (cvScrollRef.current) {
      const range = document.createRange();
      range.selectNodeContents(cvScrollRef.current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setStatusText('Todo el contenido del CV ha sido seleccionado.');
    }
  };

  const refreshView = () => {
    setStatusText('Actualizando vista...');
    setTimeout(() => {
      setStatusText('1 objeto seleccionado (Currículum Vitae)');
    }, 600);
  };

  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  if (isMinimized) {
    return null;
  }

  return (
    <main
      id="main-window"
      className={`relative z-20 flex flex-col border-2 border-[#0055ea] xp-window-shadow overflow-hidden bg-[#ece9d8] transition-all duration-150 ${
        isMaximized
          ? 'fixed inset-0 bottom-8 z-30 ml-0 mr-0 mt-0 rounded-none h-[calc(100vh-2rem)]'
          : 'flex-1 ml-24 mr-4 mt-2 mb-10 rounded-t-lg'
      }`}
    >
      {/* 1. Window Title Bar */}
      <header className="xp-titlebar text-white flex justify-between items-center w-full px-2 py-1 select-none cursor-default">
        <div className="flex items-center space-x-2 truncate">
          <img
            src={XP_ICONS.file}
            alt="CV"
            className="w-4 h-4 object-contain shrink-0 drop-shadow"
            draggable={false}
          />
          <h1 className="text-[11px] font-bold tracking-tight text-white drop-shadow-sm truncate">
            {CV_DATA.fullName} - Currículum Vitae
          </h1>
        </div>

        {/* Trailing Action Icons (Minimize, Maximize, Close) */}
        <div className="flex items-center space-x-1 shrink-0 ml-2">
          {/* Minimize */}
          <button
            className="w-5 h-5 rounded-xs bg-[#0055ea] hover:brightness-110 active:brightness-90 xp-btn-ctrl flex items-center justify-center text-white text-xs cursor-pointer"
            onClick={onMinimize}
            title="Minimizar"
          >
            <span className="material-symbols-outlined text-[13px] leading-none">
              minimize
            </span>
          </button>

          {/* Maximize / Restore */}
          <button
            className="w-5 h-5 rounded-xs bg-[#0055ea] hover:brightness-110 active:brightness-90 xp-btn-ctrl flex items-center justify-center text-white text-xs cursor-pointer"
            onClick={onToggleMaximize}
            title={isMaximized ? 'Restaurar tamaño' : 'Maximizar'}
          >
            <span className="material-symbols-outlined text-[13px] leading-none">
              {isMaximized ? 'filter_none' : 'crop_square'}
            </span>
          </button>

          {/* Close (Ruby Red) */}
          <button
            className="w-5 h-5 rounded-xs xp-btn-close hover:brightness-110 active:brightness-90 flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            onClick={onCloseWarning}
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-[14px] leading-none font-bold">
              close
            </span>
          </button>
        </div>
      </header>

      {/* 2. Explorer Menu Bar */}
      <nav className="relative bg-[#ece9d8] px-2 py-0.5 border-b border-[#c3c5d8] flex items-center space-x-3 text-[11px] text-[#1c1c12] select-none">
        {/* Archivo */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'archivo' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('archivo');
            }}
          >
            Archivo
          </span>
          {activeMenu === 'archivo' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-48 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  window.print();
                }}
              >
                <span>Imprimir...</span>
                <span className="text-[10px] text-gray-500">Ctrl+P</span>
              </button>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  onDownloadCV();
                }}
              >
                <span>Guardar como...</span>
                <span className="text-[10px] text-gray-500">Ctrl+S</span>
              </button>
              <div className="h-px bg-gray-200 my-1"></div>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  onCloseWarning();
                }}
              >
                <span>Cerrar</span>
              </button>
            </div>
          )}
        </div>

        {/* Edición */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'edicion' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('edicion');
            }}
          >
            Edición
          </span>
          {activeMenu === 'edicion' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-44 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  copyPath();
                }}
              >
                <span>Copiar ruta</span>
                <span className="text-[10px] text-gray-500">Ctrl+C</span>
              </button>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  selectAllCV();
                }}
              >
                <span>Seleccionar todo</span>
                <span className="text-[10px] text-gray-500">Ctrl+A</span>
              </button>
            </div>
          )}
        </div>

        {/* Ver */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'ver' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('ver');
            }}
          >
            Ver
          </span>
          {activeMenu === 'ver' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-44 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  refreshView();
                }}
              >
                <span>Actualizar</span>
                <span className="text-[10px] text-gray-500">F5</span>
              </button>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  onToggleMaximize();
                }}
              >
                <span>Pantalla completa</span>
                <span className="text-[10px] text-gray-500">F11</span>
              </button>
            </div>
          )}
        </div>

        {/* Favoritos */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'favoritos' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('favoritos');
            }}
          >
            Favoritos
          </span>
          {activeMenu === 'favoritos' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-52 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={CV_DATA.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center gap-1.5 cursor-pointer block"
                onClick={onCloseSubMenus}
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>LinkedIn de Raúl</span>
              </a>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  alert('★ Se ha agregado a Favoritos: CV de Raúl Ayala Covarrubias');
                }}
              >
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span>Agregar a Favoritos...</span>
              </button>
            </div>
          )}
        </div>

        {/* Herramientas */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'herramientas' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('herramientas');
            }}
          >
            Herramientas
          </span>
          {activeMenu === 'herramientas' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-52 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  onOpenModal('sap');
                }}
              >
                <span className="material-symbols-outlined text-[14px]">dns</span>
                <span>Conectar a SAP GUI...</span>
              </button>
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  setIsSearchBarOpen(true);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">search</span>
                <span>Opciones de búsqueda...</span>
              </button>
            </div>
          )}
        </div>

        {/* Ayuda */}
        <div className="relative">
          <span
            className={`cursor-pointer px-1.5 py-0.5 rounded-xs block ${
              activeMenu === 'ayuda' ? 'bg-[#0055ea] text-white' : 'hover:bg-[#0055ea] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSubMenu('ayuda');
            }}
          >
            Ayuda
          </span>
          {activeMenu === 'ayuda' && (
            <div
              className="absolute top-full left-0 mt-0.5 w-56 bg-white border border-[#737687] shadow-xl z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-3 py-1 hover:bg-[#0055ea] hover:text-white flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  onCloseSubMenus();
                  onOpenModal('acerca');
                }}
              >
                <span className="material-symbols-outlined text-[14px]">help</span>
                <span>Acerca de Raúl Ayala CV...</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Explorer Standard Toolbar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-[#c3c5d8] flex items-center space-x-1 text-[#1c1c12] select-none text-[11px]">
        {/* Atrás */}
        <button
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-[#e6e3d2] active:border active:border-[#737687] cursor-pointer"
          onClick={() => window.history.back()}
          title="Atrás"
        >
          <span className="w-5 h-5 rounded-full bg-[#106d20] text-white flex items-center justify-center text-xs">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          </span>
          <span>Atrás</span>
          <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
        </button>

        {/* Adelante */}
        <button
          className="flex items-center space-x-1 px-1 py-0.5 rounded hover:bg-[#e6e3d2] cursor-pointer"
          onClick={() => window.history.forward()}
          title="Adelante"
        >
          <span className="w-5 h-5 rounded-full bg-[#0040b5] text-white flex items-center justify-center text-xs">
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
          <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
        </button>

        <div className="h-5 w-px bg-[#c3c5d8] mx-1"></div>

        {/* Arriba */}
        <button
          className="flex items-center px-1.5 py-0.5 rounded hover:bg-[#e6e3d2] active:bg-[#d8dfff] cursor-pointer"
          onClick={scrollToTop}
          title="Subir al inicio del documento"
        >
          <span className="material-symbols-outlined text-[18px] text-[#0040b5]">
            arrow_upward
          </span>
        </button>

        <div className="h-5 w-px bg-[#c3c5d8] mx-1"></div>

        {/* Búsqueda */}
        <button
          className={`flex items-center space-x-1 px-2 py-0.5 rounded cursor-pointer ${
            isSearchBarOpen ? 'bg-[#d8dfff] border border-[#0055ea]' : 'hover:bg-[#e6e3d2]'
          }`}
          onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
          title="Buscar en currículum"
        >
          <span className="material-symbols-outlined text-[18px] text-[#106d20]">
            search
          </span>
          <span>Búsqueda</span>
        </button>

        {/* Carpetas */}
        <button
          className={`flex items-center space-x-1 px-2 py-0.5 rounded cursor-pointer ${
            isSidebarOpen ? 'bg-[#d8dfff] border border-[#0055ea]' : 'hover:bg-[#e6e3d2]'
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Mostrar u ocultar panel de tareas"
        >
          <span className="material-symbols-outlined text-[18px] text-[#0051e0]">
            folder
          </span>
          <span>Carpetas</span>
        </button>

        <div className="h-5 w-px bg-[#c3c5d8] mx-1"></div>

        {/* Imprimir */}
        <button
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-[#e6e3d2] cursor-pointer"
          onClick={() => window.print()}
          title="Imprimir Currículum Vitae"
        >
          <span className="material-symbols-outlined text-[18px] text-[#0040b5]">
            print
          </span>
          <span>Imprimir</span>
        </button>
      </div>

      {/* 4. Explorer Address Bar */}
      <form
        onSubmit={handleAddressSubmit}
        className="bg-[#ece9d8] px-2 py-1 border-b border-[#c3c5d8] flex items-center space-x-2 text-[11px]"
      >
        <span className="text-gray-600 font-bold shrink-0">Dirección:</span>
        <div className="flex-1 flex items-center bg-white border border-[#737687] px-1.5 py-0.5 rounded-xs xp-inset-border">
          <img
            src={XP_ICONS.file}
            alt="Doc"
            className="w-3.5 h-3.5 object-contain mr-1.5 shrink-0"
            draggable={false}
          />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-normal text-[#1c1c12] p-0 focus:ring-0 text-[11px]"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="flex items-center space-x-1 px-2 py-0.5 bg-[#ece9d8] border border-[#737687] hover:brightness-105 active:brightness-95 rounded-xs xp-outset-border cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[#106d20] text-[16px] font-bold">
            play_arrow
          </span>
          <span className="font-bold">Ir</span>
        </button>
      </form>

      {/* Search Sub-Bar (Toggleable) */}
      {isSearchBarOpen && (
        <div
          id="search-bar"
          className="bg-[#f7f4e3] px-3 py-1.5 border-b border-[#c3c5d8] flex items-center gap-2 text-[11px]"
        >
          <span className="material-symbols-outlined text-[#106d20] text-[16px]">
            search
          </span>
          <span className="font-bold text-[#1c1c12]">Buscar en currículum:</span>
          <input
            type="text"
            className="flex-1 max-w-sm px-2 py-0.5 bg-white border border-[#737687] text-[11px] rounded-xs xp-inset-border outline-none focus:ring-1 focus:ring-[#0055ea]"
            placeholder="Escriba SAP, Excel, Bodega, AIEP, Despachos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              className="text-gray-500 hover:text-black px-1 cursor-pointer"
              onClick={() => setSearchQuery('')}
            >
              Borrar
            </button>
          )}
          <button
            className="text-gray-500 hover:text-[#c21b30] px-1 cursor-pointer"
            onClick={() => {
              setIsSearchBarOpen(false);
              setSearchQuery('');
            }}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* 5. Split-Pane Inner Workspace */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Left Side: XP Task Pane */}
        {isSidebarOpen && (
          <aside
            id="xp-sidebar"
            className="w-56 h-full bg-[#f7f4e3] border-r border-[#c3c5d8] flex flex-col justify-between p-2 overflow-y-auto select-none shrink-0"
          >
            <div className="space-y-3">
              {/* Profile Badge in Sidebar */}
              <div className="bg-[#e6e3d2] p-2 rounded border border-[#c3c5d8] shadow-xs text-center">
                <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-[#0055ea] shadow">
                  <img
                    src={PROFILE_AVATAR_SIDEBAR}
                    alt="Foto de perfil de Raúl Ayala Covarrubias"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-[12px] text-[#0040b5] font-bold">
                  Raúl Ayala Covarrubias
                </h2>
                <p className="text-[10px] text-gray-600">Técnico en Logística</p>
                <div className="mt-1.5 flex justify-center items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#106d20] inline-block animate-pulse"></span>
                  <span className="text-[10px] text-[#106d20] font-bold">
                    Disponible Inmediato
                  </span>
                </div>
              </div>

              {/* Section 1: Tareas del sistema */}
              <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white">
                <div
                  className="xp-sidebar-header text-white px-2 py-1 text-[11px] font-bold flex justify-between items-center cursor-pointer hover:brightness-105"
                  onClick={() => togglePanel('tareas')}
                >
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px]">
                      folder_shared
                    </span>
                    <span>Tareas del sistema</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    {openPanels.tareas ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                {openPanels.tareas && (
                  <div className="p-2 space-y-1.5 text-[11px] text-[#1c1c12]">
                    <button
                      className="flex items-center space-x-1.5 text-[#0040b5] hover:underline hover:text-[#0055ea] cursor-pointer w-full text-left"
                      onClick={() => scrollToSection('contacto')}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        contacts
                      </span>
                      <span>Ver información de contacto</span>
                    </button>
                    <button
                      className="flex items-center space-x-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                      onClick={() => scrollToSection('experiencia')}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        history
                      </span>
                      <span>Experiencia profesional</span>
                    </button>
                    <button
                      className="flex items-center space-x-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                      onClick={() => scrollToSection('habilidades')}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        analytics
                      </span>
                      <span>Habilidades clave</span>
                    </button>
                    <button
                      className="flex items-center space-x-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left font-bold"
                      onClick={() => onOpenModal('portafolio')}
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#f59e0b]">
                        folder_special
                      </span>
                      <span>Portafolio de Proyectos</span>
                    </button>
                    <button
                      className="flex items-center space-x-1.5 text-[#0040b5] hover:underline cursor-pointer w-full text-left"
                      onClick={onDownloadCV}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        download
                      </span>
                      <span>Descargar CV (.doc)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section 2: Otros sitios */}
              <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white">
                <div
                  className="xp-sidebar-header text-white px-2 py-1 text-[11px] font-bold flex justify-between items-center cursor-pointer hover:brightness-105"
                  onClick={() => togglePanel('sitios')}
                >
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px]">
                      computer
                    </span>
                    <span>Otros sitios</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    {openPanels.sitios ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                {openPanels.sitios && (
                  <div className="p-2 space-y-1 text-[11px]">
                    <div
                      className="flex items-center space-x-1.5 text-gray-600 hover:text-[#0040b5] cursor-pointer px-1 py-0.5 rounded hover:bg-[#ece9d8]"
                      onClick={() => onOpenModal('portafolio')}
                    >
                      <img
                        src={XP_ICONS.folder}
                        alt="Portafolio"
                        className="w-4 h-4 object-contain"
                        draggable={false}
                      />
                      <span className="font-semibold text-[#0040b5]">Mis proyectos</span>
                    </div>
                    <div
                      className="flex items-center space-x-1.5 text-gray-600 hover:text-[#0040b5] cursor-pointer px-1 py-0.5 rounded hover:bg-[#ece9d8]"
                      onClick={() => onOpenModal('mis-docs')}
                    >
                      <img
                        src={XP_ICONS.documents}
                        alt="Mis documentos"
                        className="w-4 h-4 object-contain"
                        draggable={false}
                      />
                      <span>Mis documentos</span>
                    </div>
                    <div
                      className="flex items-center space-x-1.5 text-gray-600 hover:text-[#0040b5] cursor-pointer px-1 py-0.5 rounded hover:bg-[#ece9d8]"
                      onClick={() => onOpenModal('red')}
                    >
                      <img
                        src={XP_ICONS.network}
                        alt="Sitios de red"
                        className="w-4 h-4 object-contain"
                        draggable={false}
                      />
                      <span>Documentos compartidos</span>
                    </div>
                    <div
                      className="flex items-center space-x-1.5 text-gray-600 hover:text-[#0040b5] cursor-pointer px-1 py-0.5 rounded hover:bg-[#ece9d8]"
                      onClick={() => onOpenModal('mipc')}
                    >
                      <img
                        src={XP_ICONS.computer}
                        alt="Mi PC"
                        className="w-4 h-4 object-contain"
                        draggable={false}
                      />
                      <span>Disco Local (C:)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Detalles del perfil */}
              <div className="rounded overflow-hidden border border-[#c3c5d8] shadow-xs bg-white">
                <div
                  className="xp-sidebar-header text-white px-2 py-1 text-[11px] font-bold flex justify-between items-center cursor-pointer hover:brightness-105"
                  onClick={() => togglePanel('detalles')}
                >
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px]">
                      badge
                    </span>
                    <span>Detalles del perfil</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    {openPanels.detalles ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                {openPanels.detalles && (
                  <div className="p-2 text-[10px] text-gray-600 space-y-1">
                    <div>
                      <strong className="text-[#1c1c12]">Tipo:</strong> Currículum Vitae
                    </div>
                    <div>
                      <strong className="text-[#1c1c12]">Estado:</strong> Actualizado 2024
                    </div>
                    <div>
                      <strong className="text-[#1c1c12]">Ubicación:</strong> Santiago, Chile
                    </div>
                    <div>
                      <strong className="text-[#1c1c12]">Disponibilidad:</strong> Turnos / Jornada Completa
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar bottom shortcuts */}
            <div className="pt-2 border-t border-[#c3c5d8] space-y-1 text-[11px] text-gray-600">
              <div
                className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-[#e6e3d2] cursor-pointer"
                onClick={() => onOpenModal('papelera')}
              >
                <img
                  src={XP_ICONS.recycle}
                  alt="Papelera"
                  className="w-4 h-4 object-contain"
                  draggable={false}
                />
                <span>Papelera de reciclaje</span>
              </div>
              <div
                className="flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-[#e6e3d2] cursor-pointer"
                onClick={() => onOpenModal('control-panel')}
              >
                <span className="material-symbols-outlined text-[16px]">
                  settings
                </span>
                <span>Panel de control</span>
              </div>
            </div>
          </aside>
        )}

        {/* Right Side: CV Content Area */}
        <section
          id="cv-content-scroll"
          ref={cvScrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-white text-[#1c1c12] select-text scroll-smooth"
        >
          {/* Header Banner / Profile Card */}
          <div
            id="perfil-card"
            className={`border border-[#c3c5d8] rounded-lg p-5 bg-gradient-to-r from-[#f7f4e3] to-[#fdfae8] shadow-xs mb-6 flex flex-col md:flex-row gap-5 items-start transition-opacity duration-200 ${
              matchesSearch(CV_DATA.fullName + CV_DATA.summary + CV_DATA.role)
                ? 'opacity-100'
                : 'opacity-25'
            }`}
          >
            <div className="w-24 h-24 rounded-lg border-2 border-[#0055ea] overflow-hidden shadow shrink-0">
              <img
                src={PROFILE_AVATAR_HEADER}
                alt="Foto de perfil de Raúl Alejandro Ayala Covarrubias"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-[18px] md:text-[20px] font-bold text-[#0040b5] tracking-tight">
                    {CV_DATA.fullName}
                  </h2>
                  <p className="text-[14px] text-gray-600 font-bold">
                    {CV_DATA.role}
                  </p>
                </div>
                {/* Verification Badges */}
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center gap-1 bg-[#9df898] text-[#1a7425] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    Perfil Verificado
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#dbe1ff] text-[#00164d] px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    Disponibilidad Inmediata
                  </span>
                </div>
              </div>

              {/* Professional Summary */}
              <p className="text-[13px] text-[#1c1c12] leading-relaxed">
                Técnico en Logística de Nivel Superior con sólida experiencia en
                control de inventarios, administración de bodegas, supervisión
                de despachos y aseguramiento de la trazabilidad en centros de
                distribución de alta exigencia. Especializado en el apalancamiento
                de tecnologías de información para optimizar operaciones:
                dominio operativo de módulos ERP{' '}
                <strong>SAP R/3 (MM/SD)</strong>, construcción de tableros de
                control en <strong>Power BI</strong>, análisis y automatización
                mediante <strong>Python</strong> y flujos inteligentes.
                Capacidad probada para coordinar equipos humanos, mitigar
                desviaciones en la cadena de suministro y garantizar KPIs de
                entrega on-time in-full (OTIF).
              </p>

              {/* Contact Quick-Bar */}
              <div
                id="contacto"
                className="pt-2 flex flex-wrap gap-4 border-t border-[#c3c5d8] text-[11px] text-gray-700"
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0040b5]">
                    location_on
                  </span>
                  {CV_DATA.location}
                </span>
                <a
                  href={`mailto:${CV_DATA.email}`}
                  className="flex items-center gap-1 text-[#0040b5] hover:underline hover:text-[#0055ea]"
                  title="Enviar correo a Raúl"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#0040b5]">
                    mail
                  </span>
                  {CV_DATA.email}
                </a>
                <a
                  href={`tel:${CV_DATA.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1 text-[#0040b5] hover:underline hover:text-[#0055ea]"
                  title="Llamar a Raúl"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#0040b5]">
                    call
                  </span>
                  {CV_DATA.phone}
                </a>
                <a
                  href={CV_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#0040b5] hover:underline hover:text-[#0055ea]"
                  title="Visitar LinkedIn de Raúl"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#0040b5]">
                    link
                  </span>
                  {CV_DATA.linkedinDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* 2-Column Bento-like layout for Experience & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Experience & Education & Certifications */}
            <div className="lg:col-span-2 space-y-6">
              {/* Experiencia Laboral */}
              <div
                id="experiencia"
                className={`border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs transition-opacity duration-200 ${
                  matchesSearch(
                    CV_DATA.experiences
                      .map((e) => e.role + e.company + e.achievements.join(' '))
                      .join(' ')
                  )
                    ? 'opacity-100'
                    : 'opacity-25'
                }`}
              >
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-4">
                  <span className="material-symbols-outlined text-[#0040b5] text-[22px]">
                    work
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Experiencia Laboral
                  </h3>
                </div>

                {/* Timeline Items */}
                <div className="space-y-5">
                  {/* Role 1: Expro */}
                  <div className="relative pl-4 border-l-2 border-[#0055ea]">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#0055ea]"></div>
                    <div className="flex flex-wrap justify-between items-baseline mb-1">
                      <h4 className="text-[13px] font-bold text-[#1c1c12]">
                        Supervisor de Bodega & Control de Despachos
                      </h4>
                      <span className="text-[10px] font-bold bg-[#e6e3d2] px-2 py-0.5 rounded text-gray-700">
                        2022 - Actualidad
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#0040b5] mb-2">
                      Expro Servicios Logísticos y RRHH — Santiago
                    </p>
                    <ul className="list-disc list-inside text-[11px] space-y-1.5 text-[#1c1c12] leading-relaxed">
                      <li>
                        Supervisión integral de operaciones de recepción,
                        almacenamiento, picking y despacho en centro de
                        distribución principal.
                      </li>
                      <li>
                        Gestión directa de entradas, salidas y regularización de
                        stocks mediante{' '}
                        <strong>SAP R/3 (Módulos MM/SD)</strong>, alcanzando una
                        exactitud de inventario (IRA) superior al 98.7%.
                      </li>
                      <li>
                        Liderazgo de turnos rotativos de hasta 25 operadores de
                        bodega y conductores de grúa horquilla, asegurando
                        cumplimiento de normas de seguridad laboral.
                      </li>
                      <li>
                        Implementación de paneles de reportería semanal en{' '}
                        <strong>Power BI</strong> para seguimiento de rotación de
                        SKU y productividad horaria.
                      </li>
                    </ul>
                  </div>

                  {/* Role 2: Chilexpress */}
                  <div className="relative pl-4 border-l-2 border-[#c3c5d8]">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#737687]"></div>
                    <div className="flex flex-wrap justify-between items-baseline mb-1">
                      <h4 className="text-[13px] font-bold text-[#1c1c12]">
                        Operador y Analista de Envíos Express
                      </h4>
                      <span className="text-[10px] font-bold bg-[#e6e3d2] px-2 py-0.5 rounded text-gray-700">
                        2019 - 2022
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#0040b5] mb-2">
                      Chilexpress S.A. — Hub Logístico Aeropuerto / Región Metropolitana
                    </p>
                    <ul className="list-disc list-inside text-[11px] space-y-1.5 text-[#1c1c12] leading-relaxed">
                      <li>
                        Control, clasificación y ruteo dinámico de paquetería de
                        alta velocidad con lectura y pistoleo por
                        radiofrecuencia (RF).
                      </li>
                      <li>
                        Auditoría continua de trazabilidad y resolución de
                        discrepancias en envíos observados, reduciendo las tasas
                        de extravío en un 14%.
                      </li>
                      <li>
                        Coordinación directa con transportistas de última milla y
                        despacho a sucursales regionales para cumplimiento de
                        ventanas horarias estrictas.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Educación */}
              <div
                id="educacion"
                className={`border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs transition-opacity duration-200 ${
                  matchesSearch('AIEP Técnico Superior Logística Educación')
                    ? 'opacity-100'
                    : 'opacity-25'
                }`}
              >
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-4">
                  <span className="material-symbols-outlined text-[#0040b5] text-[22px]">
                    school
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Educación
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1c1c12]">
                        Técnico de Nivel Superior en Logística
                      </h4>
                      <p className="text-[11px] text-[#0040b5] font-bold">
                        Instituto Profesional AIEP
                      </p>
                      <p className="text-[10px] text-gray-600">
                        Titulado con Distinción — Mención en Gestión de
                        Operaciones, Distribución y Cadena de Suministro.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#9df898] text-[#1a7425] px-2 py-0.5 rounded">
                      Titulado
                    </span>
                  </div>
                </div>
              </div>

              {/* Cursos y Certificaciones */}
              <div
                id="certificaciones"
                className={`border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs transition-opacity duration-200 ${
                  matchesSearch(
                    CV_DATA.certifications
                      .map((c) => c.name + c.description)
                      .join(' ')
                  )
                    ? 'opacity-100'
                    : 'opacity-25'
                }`}
              >
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-3">
                  <span className="material-symbols-outlined text-[#0040b5] text-[22px]">
                    verified_user
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Cursos y Certificaciones Continuas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  {CV_DATA.certifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border border-[#c3c5d8] rounded bg-[#f7f4e3] hover:bg-[#ece9d8] transition-colors"
                    >
                      <div className="font-bold text-[#1c1c12]">{item.name}</div>
                      <div className="text-[10px] text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Skills & Software */}
            <div className="space-y-6" id="habilidades">
              {/* Software y Herramientas ERP */}
              <div
                className={`border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs transition-opacity duration-200 ${
                  matchesSearch(
                    CV_DATA.skills.map((s) => s.name + s.description).join(' ')
                  )
                    ? 'opacity-100'
                    : 'opacity-25'
                }`}
              >
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-3">
                  <span className="material-symbols-outlined text-[#0040b5] text-[20px]">
                    dns
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Software y Herramientas
                  </h3>
                </div>

                {/* Skill Progress Bars (Authentic Windows XP style) */}
                <div className="space-y-3 text-[11px]">
                  {CV_DATA.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group cursor-help"
                      title={skill.description}
                    >
                      <div className="flex justify-between text-[10px] mb-1 font-bold">
                        <span>{skill.name}</span>
                        <span className="text-[#0040b5] font-bold">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-[#e6e3d2] h-3.5 rounded-xs p-0.5 border border-[#737687] xp-inset-border">
                        <div
                          className={`bg-gradient-to-r ${skill.gradient} h-full rounded-xs transition-all duration-500 group-hover:brightness-125`}
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competencias Clave */}
              <div
                className={`border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs transition-opacity duration-200 ${
                  matchesSearch(CV_DATA.competencies.join(' '))
                    ? 'opacity-100'
                    : 'opacity-25'
                }`}
              >
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-3">
                  <span className="material-symbols-outlined text-[#0040b5] text-[20px]">
                    inventory_2
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Competencias Clave
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CV_DATA.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="bg-[#ece9d8] border border-[#c3c5d8] px-2 py-1 rounded text-[10px] font-bold text-[#1c1c12] hover:bg-[#d8dfff] transition-colors cursor-default"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Idiomas y Licencia */}
              <div className="border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs">
                <div className="flex items-center space-x-2 border-b border-[#c3c5d8] pb-2 mb-2">
                  <span className="material-symbols-outlined text-[#0040b5] text-[20px]">
                    translate
                  </span>
                  <h3 className="text-[15px] text-[#0040b5] font-bold">
                    Idiomas y Licencia
                  </h3>
                </div>
                <ul className="text-[11px] space-y-1.5 text-[#1c1c12]">
                  {CV_DATA.languages.map((l) => (
                    <li key={l.lang}>
                      <strong>{l.lang}:</strong> {l.level}
                    </li>
                  ))}
                  <li>
                    <strong>Licencia de Conducir:</strong> {CV_DATA.driverLicense}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dedicated Section: Portafolio de Proyectos y Programas */}
          <div
            id="portafolio"
            className="border border-[#c3c5d8] rounded-lg p-4 bg-white shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c3c5d8] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-[#eef4ff] border border-[#7f9db9] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0055ea] text-[20px]">
                    folder_special
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] text-[#0040b5] font-bold leading-tight">
                    Portafolio de Proyectos y Aplicaciones
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Sistemas en producción, automatizaciones y programas en curso
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-gradient-to-b from-[#f9f9f9] to-[#dcd8c8] hover:from-[#ffffff] hover:to-[#e8e4d4] border border-[#7f9db9] rounded-xs text-[#0040b5] font-bold text-[11px] cursor-pointer shadow-xs flex items-center gap-1"
                  onClick={() => onOpenModal('portafolio')}
                >
                  <span className="material-symbols-outlined text-[15px] text-[#106d20]">
                    open_in_new
                  </span>
                  <span>Abrir Catálogo Completo (XP)</span>
                </button>
              </div>
            </div>

            {/* Note banner explaining the development status */}
            <div className="bg-[#fffde7] border border-[#fbc02d] p-2.5 rounded-xs flex items-start gap-2 text-[11px] text-[#554a00]">
              <span className="material-symbols-outlined text-[#f57f17] text-[18px] shrink-0 mt-0.5">
                engineering
              </span>
              <div>
                <strong>Nota sobre el estado de desarrollo:</strong> Aquí se exhiben herramientas operativas ya finalizadas, así como scripts y aplicativos actualmente <em>en desarrollo</em> o en fase de diseño documental. Puedes registrar más proyectos en cualquier momento desde el catálogo.
              </div>
            </div>

            {/* 4 Spotlight Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Card 1: SAP Regularización */}
              <div className="p-3 bg-[#fafafa] border border-[#c3c5d8] rounded hover:border-[#0055ea] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-[12px] text-[#0040b5]">
                      Regularización de Stocks SAP MM/SD
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#a8dab5] shrink-0">
                      ✓ Terminado
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                    Conciliación de discrepancias físicas vs sistémicas con MIGO y regularización de stocks para exactitud IRA superior al 98.7%.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] text-gray-600">
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">SAP MM/SD</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">MIGO/MI04</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Control de Bodega</span>
                </div>
              </div>

              {/* Card 2: Macros OTIF */}
              <div className="p-3 bg-[#fafafa] border border-[#c3c5d8] rounded hover:border-[#0055ea] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-[12px] text-[#0040b5]">
                      Generador de Informes OTIF & Cubicación
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#a8dab5] shrink-0">
                      ✓ Terminado
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                    Cálculo automático de cubicaje según dimensiones estándar y emisión de reportes diarios de cumplimiento de despachos.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] text-gray-600">
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Excel VBA</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Power Query</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Métricas OTIF</span>
                </div>
              </div>

              {/* Card 3: Bot Python (En desarrollo) */}
              <div className="p-3 bg-[#fffef5] border border-[#fcd34d] rounded hover:border-[#e06d10] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-[12px] text-[#b06000]">
                      Bot de Alertas de Quiebres de Stock
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#fef7e0] text-[#b06000] border border-[#fcd34d] shrink-0 animate-pulse">
                      ⚙ En desarrollo (70%)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                    Script en Python que monitorea las diferencias de stock y emite alertas instantáneas vía Webhook antes de llegar al stock de seguridad.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] text-gray-600">
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Python</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Pandas</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Webhooks / n8n</span>
                </div>
              </div>

              {/* Card 4: WMS Dashboard Power BI */}
              <div className="p-3 bg-[#fafafa] border border-[#c3c5d8] rounded hover:border-[#0055ea] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-[12px] text-[#0040b5]">
                      Dashboard WMS de Productividad
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#a8dab5] shrink-0">
                      ✓ Terminado
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
                    Tablero de control interactivo en Power BI para visualización de tiempos de preparación por operario y rotación de SKU (ABC).
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 text-[9px] text-gray-600">
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">Power BI</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">DAX</span>
                  <span className="bg-[#ece9d8] px-1 py-0.5 rounded">SQL Server</span>
                </div>
              </div>
            </div>

            {/* Bottom Call-to-action */}
            <div className="pt-2 flex justify-between items-center text-[11px]">
              <span className="text-gray-500 italic">
                ¿Deseas ver más detalles o añadir un proyecto personalizado?
              </span>
              <button
                type="button"
                className="text-[#0040b5] hover:underline font-bold cursor-pointer"
                onClick={() => onOpenModal('portafolio')}
              >
                Abrir explorador de proyectos ▶
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Window Status Bar */}
      <footer className="bg-[#ece9d8] border-t border-[#c3c5d8] px-3 py-1 text-[10px] text-gray-600 flex justify-between items-center select-none shrink-0">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-[14px] text-[#0040b5]">
              check
            </span>
            <span id="status-bar-text">{statusText}</span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Tamaño: 248 KB</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[14px] text-[#106d20]">
            shield
          </span>
          <span>Mi PC (Zona Segura Intranet)</span>
        </div>
      </footer>
    </main>
  );
};
