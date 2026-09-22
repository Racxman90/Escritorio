import React, { useState } from 'react';
import { ActiveModal } from '../types';
import { PROFILE_AVATAR_SIDEBAR, XP_ICONS } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: (modal: ActiveModal) => void;
  onRestoreCV: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenSearch: () => void;
  onLogoff?: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenModal,
  onRestoreCV,
  onScrollToSection,
  onOpenSearch,
  onLogoff,
}) => {
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleItemClick = (action: () => void) => {
    soundManager.playClick();
    action();
    onClose();
  };

  return (
    <div
      id="start-menu"
      className="fixed bottom-[30px] left-0 w-[410px] max-w-[95vw] rounded-t-lg shadow-2xl z-50 overflow-visible text-xs select-none border-2 border-[#0055ea] bg-[#2257bb]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Authentic Windows XP Header: Luna Blue Gradient with Avatar & Name */}
      <div className="p-2.5 px-3 flex items-center gap-3 bg-gradient-to-r from-[#1752bd] via-[#2467e4] to-[#1a55c2] border-b border-[#123e8c] shadow-inner rounded-t-md">
        <div className="w-12 h-12 rounded-sm border-2 border-white overflow-hidden shadow-md shrink-0">
          <img
            src={PROFILE_AVATAR_SIDEBAR}
            alt="Raúl Ayala"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
          <div className="font-bold text-[15px] font-sans">Raúl Ayala</div>
          <div className="text-[11px] text-[#cfe0ff]">
            Administrador / Técnico Logístico
          </div>
        </div>
      </div>

      {/* 2. Start Menu Two-Column Body */}
      <div className="grid grid-cols-[1.1fr_1fr] bg-white relative">
        {/* Left Column: White background for Programs */}
        <div className="p-1.5 space-y-0.5 bg-white text-[#1c1c12] border-r border-[#96b7e5] flex flex-col justify-between min-h-[350px]">
          <div className="space-y-0.5">
            {/* Pinned 1: Internet Explorer */}
            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() =>
                handleItemClick(() => {
                  onRestoreCV();
                })
              }
            >
              <img
                src={XP_ICONS.ie}
                alt="Internet Explorer"
                className="w-8 h-8 object-contain shrink-0"
              />
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Internet</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Internet Explorer
                </div>
              </div>
            </button>

            {/* Pinned 2: Correo electrónico / Outlook */}
            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() =>
                handleItemClick(() => {
                  window.location.href = 'mailto:raul.ayala.contacto@gmail.com';
                })
              }
            >
              <div className="w-8 h-8 rounded bg-gradient-to-b from-[#1b73e8] to-[#0d47a1] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Correo electrónico</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Outlook Express
                </div>
              </div>
            </button>

            {/* Separator */}
            <div className="h-px bg-[#d3d3d3] mx-1 my-1" />

            {/* Most Frequently Used Programs */}
            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('sap'))}
            >
              <div className="w-7 h-7 bg-white border border-[#7f9db9] rounded shadow-xs flex items-center justify-center p-0.5 shrink-0">
                <img
                  src={XP_ICONS.sap}
                  alt="SAP"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[11px]">SAP Logon 7.40</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Gestión MM/SD y Bodega
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onScrollToSection('habilidades'))}
            >
              <span className="material-symbols-outlined text-[#106d20] group-hover:text-white text-[20px] p-1 bg-[#eef7ee] group-hover:bg-[#2055b8] rounded shrink-0">
                table_view
              </span>
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Microsoft Excel</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Planillas y Métricas OTIF
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() =>
                handleItemClick(() => {
                  soundManager.playStartup();
                })
              }
            >
              <div className="w-7 h-7 bg-gradient-to-br from-[#ff6b2b] to-[#1e88e5] text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[16px]">
                  play_arrow
                </span>
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Windows Media Player</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Audio & Sonidos XP
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('portafolio'))}
            >
              <div className="w-7 h-7 bg-white border border-[#7f9db9] rounded shadow-xs flex items-center justify-center p-0.5 shrink-0">
                <img
                  src={XP_ICONS.folder}
                  alt="Portafolio"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Portafolio de Proyectos</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Programas y scripts logísticos
                </div>
              </div>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() =>
                handleItemClick(() => {
                  onRestoreCV();
                })
              }
            >
              <img
                src={XP_ICONS.notepad}
                alt="Bloc de notas"
                className="w-7 h-7 object-contain shrink-0"
              />
              <div className="leading-tight">
                <div className="font-bold text-[11px]">Bloc de notas</div>
                <div className="text-[10px] text-gray-500 group-hover:text-white/80">
                  Editor de notas rápidas
                </div>
              </div>
            </button>
          </div>

          {/* Bottom of Left Column: Todos los programas (All Programs) */}
          <div className="relative pt-1 border-t border-[#d3d3d3]">
            <div
              className={`w-full flex items-center justify-between p-1.5 rounded text-left font-bold cursor-pointer transition-colors ${
                showAllPrograms
                  ? 'bg-[#316ac5] text-white'
                  : 'hover:bg-[#316ac5] hover:text-white text-black'
              }`}
              onMouseEnter={() => setShowAllPrograms(true)}
              onClick={() => setShowAllPrograms((prev) => !prev)}
            >
              <span className="text-[11px]">Todos los programas</span>
              <div className="w-4 h-4 rounded-full bg-[#106d20] text-white flex items-center justify-center text-[9px] shadow-xs">
                ▶
              </div>
            </div>

            {/* Cascading "Todos los programas" Flyout Menu */}
            {showAllPrograms && (
              <div
                className="absolute left-[98%] bottom-0 w-64 bg-white border border-[#716f64] shadow-[4px_4px_8px_rgba(0,0,0,0.35)] py-1 text-[11px] z-50 text-black font-sans"
                onMouseLeave={() => {
                  setShowAllPrograms(false);
                  setActiveSubMenu(null);
                }}
              >
                {/* Accesorios */}
                <div
                  className="relative px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center justify-between"
                  onMouseEnter={() => setActiveSubMenu('accesorios')}
                >
                  <div className="flex items-center gap-2">
                    <img src={XP_ICONS.folder} alt="Carpeta" className="w-4 h-4 object-contain" />
                    <span>Accesorios</span>
                  </div>
                  <span className="text-[8px]">▶</span>

                  {activeSubMenu === 'accesorios' && (
                    <div className="absolute left-[98%] top-0 w-52 bg-white border border-[#716f64] shadow-lg py-1 z-50 text-black">
                      <div
                        className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                        onClick={() => handleItemClick(() => onOpenModal('sap'))}
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#0055ea]">
                          terminal
                        </span>
                        <span>Símbolo del sistema</span>
                      </div>
                      <div
                        className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                        onClick={() => handleItemClick(() => onRestoreCV())}
                      >
                        <img src={XP_ICONS.notepad} alt="Notepad" className="w-4 h-4 object-contain" />
                        <span>Bloc de notas</span>
                      </div>
                      <div
                        className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                        onClick={() =>
                          handleItemClick(() =>
                            alert('Calculadora de cubicaje: 1 pallet estándar = 1.2 x 1.0 m, 48 cajas.')
                          )
                        }
                      >
                        <span className="material-symbols-outlined text-[16px] text-orange-600">
                          calculate
                        </span>
                        <span>Calculadora</span>
                      </div>
                      <div
                        className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                        onClick={() => handleItemClick(() => onOpenModal('display-properties'))}
                      >
                        <span className="material-symbols-outlined text-[16px] text-pink-600">
                          palette
                        </span>
                        <span>Paint</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Microsoft Office */}
                <div
                  className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                  onClick={() => handleItemClick(() => onScrollToSection('habilidades'))}
                >
                  <img src={XP_ICONS.folder} alt="Carpeta" className="w-4 h-4 object-contain" />
                  <span>Microsoft Office</span>
                </div>

                {/* SAP GUI */}
                <div
                  className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                  onClick={() => handleItemClick(() => onOpenModal('sap'))}
                >
                  <img src={XP_ICONS.sap} alt="SAP" className="w-4 h-4 object-contain" />
                  <span>SAP GUI Logon</span>
                </div>

                <div className="h-px bg-[#aca899] my-1 mx-2" />

                {/* Direct program shortcuts */}
                <div
                  className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                  onClick={() => handleItemClick(() => onRestoreCV())}
                >
                  <img src={XP_ICONS.file} alt="CV" className="w-4 h-4 object-contain" />
                  <span className="font-semibold">Currículum Vitae (Raúl Ayala)</span>
                </div>

                <div
                  className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                  onClick={() => handleItemClick(() => onOpenModal('mis-docs'))}
                >
                  <img src={XP_ICONS.documents} alt="Docs" className="w-4 h-4 object-contain" />
                  <span>Documentos y Certificaciones</span>
                </div>

                <div
                  className="px-3 py-1.5 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
                  onClick={() => handleItemClick(() => onOpenModal('mipc'))}
                >
                  <img src={XP_ICONS.computer} alt="Mi PC" className="w-4 h-4 object-contain" />
                  <span>Explorador de Windows (Mi PC)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Authentic Windows XP Pale Blue (`#d3e5fa`) for System Places */}
        <div className="p-1.5 space-y-0.5 bg-[#d3e5fa] text-[#1c1c12] border-l border-[#9bbde8] flex flex-col justify-between">
          <div className="space-y-0.5">
            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('mis-docs'))}
            >
              <img
                src={XP_ICONS.documents}
                alt="Mis documentos"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span className="font-bold text-[11px]">Mis documentos</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('portafolio'))}
            >
              <img
                src={XP_ICONS.folder}
                alt="Mis proyectos"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span className="font-bold text-[11px]">Mis proyectos (Portafolio)</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('mis-docs'))}
            >
              <span className="material-symbols-outlined text-[#0055ea] group-hover:text-white text-[18px]">
                photo_library
              </span>
              <span className="font-bold text-[11px]">Mis imágenes</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => soundManager.playStartup())}
            >
              <span className="material-symbols-outlined text-[#e06d10] group-hover:text-white text-[18px]">
                library_music
              </span>
              <span className="font-bold text-[11px]">Mi música</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('mipc'))}
            >
              <img
                src={XP_ICONS.computer}
                alt="Mi PC"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span className="font-bold text-[11px]">Mi PC</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('red'))}
            >
              <img
                src={XP_ICONS.network}
                alt="Sitios de red"
                className="w-5 h-5 object-contain shrink-0"
              />
              <span className="text-[11px]">Mis sitios de red</span>
            </button>

            {/* Separator */}
            <div className="h-px bg-[#a0c5f0] my-1 mx-1" />

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('control-panel'))}
            >
              <span className="material-symbols-outlined text-[#0040b5] group-hover:text-white text-[18px]">
                settings
              </span>
              <span className="text-[11px]">Panel de control</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('red'))}
            >
              <span className="material-symbols-outlined text-[#106d20] group-hover:text-white text-[18px]">
                router
              </span>
              <span className="text-[11px]">Conectar a</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => window.print())}
            >
              <span className="material-symbols-outlined text-[#0040b5] group-hover:text-white text-[18px]">
                print
              </span>
              <span className="text-[11px]">Impresoras y faxes</span>
            </button>

            {/* Separator */}
            <div className="h-px bg-[#a0c5f0] my-1 mx-1" />

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('acerca'))}
            >
              <span className="material-symbols-outlined text-[#0040b5] group-hover:text-white text-[18px]">
                help
              </span>
              <span className="text-[11px]">Ayuda y soporte técnico</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenSearch())}
            >
              <span className="material-symbols-outlined text-[#106d20] group-hover:text-white text-[18px]">
                search
              </span>
              <span className="text-[11px]">Buscar</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer group"
              onClick={() => handleItemClick(() => onOpenModal('run'))}
            >
              <span className="material-symbols-outlined text-[#0040b5] group-hover:text-white text-[18px]">
                terminal
              </span>
              <span className="text-[11px]">Ejecutar...</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Authentic Windows XP Bottom Footer: Deep Blue Banner with Logoff and Shutdown */}
      <div className="bg-gradient-to-r from-[#1752bd] via-[#2467e4] to-[#1a55c2] p-2 px-3 flex justify-end items-center gap-4 border-t border-[#123e8c] text-white">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/15 text-[11px] font-medium cursor-pointer transition-colors group"
          onClick={() => {
            soundManager.playClick();
            if (onLogoff) {
              onLogoff();
            } else {
              onOpenModal('logoff');
            }
            onClose();
          }}
        >
          <div className="w-5 h-5 rounded bg-[#f59e0b] border border-white/60 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[13px]">
              key
            </span>
          </div>
          <span className="drop-shadow">Cerrar sesión</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/15 text-[11px] font-bold text-white cursor-pointer transition-colors group"
          onClick={() => {
            soundManager.playClick();
            onOpenModal('shutdown');
            onClose();
          }}
        >
          <div className="w-5 h-5 rounded-full bg-[#dc2626] border border-white/60 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[13px]">
              power_settings_new
            </span>
          </div>
          <span className="drop-shadow">Apagar equipo</span>
        </button>
      </div>
    </div>
  );
};
