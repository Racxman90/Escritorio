import React, { useState, useEffect } from 'react';
import { ActiveModal } from './types';
import { BLISS_WALLPAPER_URL, CV_DATA } from './data/cvData';
import { DesktopIcons } from './components/DesktopIcons';
import { ExplorerWindow } from './components/ExplorerWindow';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { SystemModals } from './components/SystemModals';
import { ContextMenu, ContextMenuPosition } from './components/ContextMenu';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PortfolioModal } from './components/PortfolioModal';
import { soundManager } from './utils/soundManager';

export default function App() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>('cv-doc');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [isWindowClosed, setIsWindowClosed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(false);

  // Desktop context menu and icons management
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoArrange, setAutoArrange] = useState(true);
  const [alignToGrid, setAlignToGrid] = useState(true);

  // Play authentic Windows XP click sound on interactive element interactions
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest(
        'button, a, [role="button"], .cursor-pointer, input, select, textarea, .desktop-icon, .xp-btn-classic'
      );
      if (isInteractive) {
        soundManager.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  // Close menus when clicking outside
  const handleDesktopClick = () => {
    soundManager.playClick();
    setContextMenu(null);
    setSelectedIcon(null);
    setIsStartMenuOpen(false);
    setActiveMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInsideInteractiveApp = target.closest(
      '#cv-explorer-window, #start-menu, #xp-taskbar, [id^="modal-"], #volume-control-popup'
    );
    if (isInsideInteractiveApp) {
      return;
    }
    e.preventDefault();
    soundManager.playClick();
    setIsStartMenuOpen(false);
    setActiveMenu(null);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedIcon(null);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 200);
  };

  const handleArrangeIcons = (criteria: string) => {
    setSortBy(criteria);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
      } else if (e.key === 'F5') {
        e.preventDefault();
        soundManager.playClick();
        handleRefresh();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDownloadCV = () => {
    const cvText = `=====================================================
RAÚL ALEJANDRO AYALA COVARRUBIAS
Técnico en Logística y Gestión de Operaciones
Santiago, Chile | +56 9 8765 4321
raul.ayala.contacto@gmail.com
linkedin.com/in/raul-ayala-logistica
=====================================================

PERFIL PROFESIONAL:
Técnico en Logística de Nivel Superior con sólida experiencia en control de inventarios, administración de bodegas, supervisión de despachos y aseguramiento de la trazabilidad en centros de distribución de alta exigencia. Especializado en el apalancamiento de tecnologías de información para optimizar operaciones: dominio operativo de módulos ERP SAP R/3 (MM/SD), construcción de tableros de control en Power BI, análisis y automatización mediante Python y flujos inteligentes. Capacidad probada para coordinar equipos humanos, mitigar desviaciones en la cadena de suministro y garantizar KPIs de entrega on-time in-full (OTIF).

EXPERIENCIA LABORAL:
1. Supervisor de Bodega & Control de Despachos (2022 - Actualidad)
   Expro Servicios Logísticos y RRHH — Santiago
   - Supervisión integral de operaciones de recepción, almacenamiento, picking y despacho en centro de distribución principal.
   - Gestión directa de entradas, salidas y regularización de stocks mediante SAP R/3 (Módulos MM/SD), alcanzando una exactitud de inventario (IRA) superior al 98.7%.
   - Liderazgo de turnos rotativos de hasta 25 operadores de bodega y conductores de grúa horquilla, asegurando cumplimiento de normas de seguridad laboral.
   - Implementación de paneles de reportería semanal en Power BI para seguimiento de rotación de SKU y productividad horaria.

2. Operador y Analista de Envíos Express (2019 - 2022)
   Chilexpress S.A. — Hub Logístico Aeropuerto / Región Metropolitana
   - Control, clasificación y ruteo dinámico de paquetería de alta velocidad con lectura y pistoleo por radiofrecuencia (RF).
   - Auditoría continua de trazabilidad y resolución de discrepancias en envíos observados, reduciendo las tasas de extravío en un 14%.
   - Coordinación directa con transportistas de última milla y despacho a sucursales regionales para cumplimiento de ventanas horarias estrictas.

EDUCACIÓN:
- Técnico de Nivel Superior en Logística | Instituto Profesional AIEP
  Titulado con Distinción — Mención en Gestión de Operaciones, Distribución y Cadena de Suministro.

CERTIFICACIONES:
- Programación y Análisis de Datos con Python (Pandas, NumPy, scripts de automatización)
- Excel Financiero y Avanzado para Operaciones (Macros VBA, Power Query)
- Automatización de Procesos (n8n & Webhooks)
- Normativas de Seguridad en Bodega & Almacenamiento (Ley 16.744)

SOFTWARE & COMPETENCIAS:
- SAP R/3 (MM / SD): 90%
- MS Excel (Macros, Power Query): 95%
- Power BI (Dashboards Logísticos): 85%
- Python & Scripts de Automatización: 75%
- SQL / Consultas a Bases de Datos: 70%
- Licencia de Conducir: Clase B vigente
`;
    const blob = new Blob([cvText], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV_Raul_Ayala_Covarrubias.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestoreCV = () => {
    setIsWindowClosed(false);
    setIsWindowMinimized(false);
  };

  const handleToggleWindowFromTaskbar = () => {
    if (isWindowClosed) {
      handleRestoreCV();
    } else if (isWindowMinimized) {
      setIsWindowMinimized(false);
    } else {
      setIsWindowMinimized(true);
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    handleRestoreCV();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.remove('highlight-flash');
        void el.offsetWidth;
        el.classList.add('highlight-flash');
      }
    }, 100);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none bg-[#0040b5] font-sans flex flex-col justify-between relative"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* 1. Desktop Bliss Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('${BLISS_WALLPAPER_URL}')` }}
      />

      {/* 2. Desktop Icons */}
      <DesktopIcons
        selectedIcon={selectedIcon}
        onSelectIcon={(id) => setSelectedIcon(id)}
        onOpenModal={(modal) => setActiveModal(modal)}
        onRestoreCV={handleRestoreCV}
        sortBy={sortBy}
        isRefreshing={isRefreshing}
        autoArrange={autoArrange}
        alignToGrid={alignToGrid}
      />

      {/* 3. Main Explorer Window (CV) */}
      {!isWindowClosed && (
        <ExplorerWindow
          isMinimized={isWindowMinimized}
          isMaximized={isWindowMaximized}
          onMinimize={() => setIsWindowMinimized(true)}
          onToggleMaximize={() => setIsWindowMaximized(!isWindowMaximized)}
          onCloseWarning={() => setActiveModal('close-warning')}
          onOpenModal={(modal) => setActiveModal(modal)}
          onDownloadCV={handleDownloadCV}
          activeMenu={activeMenu}
          onToggleSubMenu={(menu) =>
            setActiveMenu(activeMenu === menu ? null : menu)
          }
          onCloseSubMenus={() => setActiveMenu(null)}
        />
      )}

      {/* 4. Windows XP Start Menu Popover */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenModal={(modal) => setActiveModal(modal)}
        onRestoreCV={handleRestoreCV}
        onScrollToSection={handleScrollToSection}
        onLogoff={() => setIsWelcomeScreenOpen(true)}
        onOpenSearch={() => {
          handleRestoreCV();
          // dispatch or open search inside window
          const searchBtn = document.querySelector<HTMLButtonElement>(
            'button[title="Buscar en currículum"]'
          );
          if (searchBtn) searchBtn.click();
        }}
      />

      {/* 5. System Modals (Mi PC, SAP Logon, Mis Docs, etc.) */}
      <SystemModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onRestoreCV={handleRestoreCV}
        onDownloadCV={handleDownloadCV}
        onConfirmCloseCV={() => {
          setIsWindowClosed(true);
          setActiveModal(null);
        }}
        onOpenSection={handleScrollToSection}
        onOpenModal={(modal) => setActiveModal(modal)}
        onShowWelcomeScreen={() => setIsWelcomeScreenOpen(true)}
      />

      {/* 6. Authentic Windows XP Taskbar */}
      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={(e) => {
          e.stopPropagation();
          setActiveMenu(null);
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
        isWindowMinimized={isWindowMinimized}
        isWindowClosed={isWindowClosed}
        onToggleWindowFromTaskbar={handleToggleWindowFromTaskbar}
        onOpenModal={(modal) => setActiveModal(modal)}
        onScrollToSection={handleScrollToSection}
        activeModal={activeModal}
      />

      {/* 7. Classic Windows XP Desktop Context Menu */}
      <ContextMenu
        position={contextMenu}
        onClose={() => setContextMenu(null)}
        onRefresh={handleRefresh}
        onOpenProperties={() => setActiveModal('display-properties')}
        onArrangeIcons={handleArrangeIcons}
        autoArrange={autoArrange}
        alignToGrid={alignToGrid}
        onToggleAutoArrange={() => setAutoArrange((prev) => !prev)}
        onToggleAlignToGrid={() => setAlignToGrid((prev) => !prev)}
      />

      {/* 8. Authentic Windows XP Welcome / Startup Screen */}
      <WelcomeScreen
        isOpen={isWelcomeScreenOpen}
        onLogin={() => setIsWelcomeScreenOpen(false)}
        onShutdown={() => {
          setIsWelcomeScreenOpen(false);
          setActiveModal('shutdown');
        }}
      />

      {/* 9. Windows XP Portfolio Explorer Window */}
      <PortfolioModal
        isOpen={activeModal === 'portafolio'}
        onClose={() => setActiveModal(null)}
        onOpenModal={(modal) => setActiveModal(modal)}
        onRestoreCV={handleRestoreCV}
      />
    </div>
  );
}
