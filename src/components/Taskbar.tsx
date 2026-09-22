import React, { useState, useEffect, useRef } from 'react';
import { ActiveModal } from '../types';
import { XP_ICONS } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface TaskbarProps {
  isStartMenuOpen: boolean;
  onToggleStartMenu: (e: React.MouseEvent) => void;
  isWindowMinimized: boolean;
  isWindowClosed: boolean;
  onToggleWindowFromTaskbar: () => void;
  onOpenModal: (modal: ActiveModal) => void;
  onScrollToSection: (sectionId: string) => void;
  activeModal?: ActiveModal;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  onToggleStartMenu,
  isWindowMinimized,
  isWindowClosed,
  onToggleWindowFromTaskbar,
  onOpenModal,
  onScrollToSection,
  activeModal,
}) => {
  const [timeString, setTimeString] = useState('');
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [volume, setVolumeState] = useState(
    Math.round(soundManager.getVolume() * 100)
  );
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setIsVolumeOpen(false);
      }
    };
    if (isVolumeOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isVolumeOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes: string | number = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTimeString(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="xp-taskbar"
      className="fixed bottom-0 left-0 w-full z-40 flex justify-between items-center h-8 xp-taskbar text-white shadow-inner select-none border-t border-[#589bfa]"
    >
      {/* Left: Start Button + Quick Launch + Open Taskbar Tabs */}
      <div className="flex items-center h-full space-x-1.5">
        {/* Real Windows XP 'inicio' Button */}
        <button
          id="btn-inicio"
          type="button"
          className={`xp-start-btn h-full px-3.5 pr-4.5 flex items-center space-x-1.5 rounded-r-2xl shadow-[2px_0_5px_rgba(0,0,0,0.4)] hover:brightness-110 active:brightness-95 cursor-pointer border-r border-t border-[#82db7e] select-none transition-all ${
            isStartMenuOpen ? 'active brightness-95' : ''
          }`}
          onClick={onToggleStartMenu}
        >
          {/* Windows XP Flying Flag Logo in glowing disk */}
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#taskbar-xp-orb)" />
              {/* Four wavy flag panes */}
              <path d="M8.5 14.5C8 10 11.5 8 14.5 7.5V14.2C12 14 9.5 14.2 8.5 14.5Z" fill="#F25022" />
              <path d="M15.8 7.3C19 6.8 23 8.5 24 12.8C21.5 13.5 18 13.8 15.8 14V7.3Z" fill="#7FBA00" />
              <path d="M8.5 15.8C10 16 12.5 15.8 14.5 15.6V22.5C11.5 22.8 8.5 20.8 8.5 15.8Z" fill="#00A4EF" />
              <path d="M15.8 15.4C18.5 15.2 21.5 15 24 16.5C23.2 21 19 23 15.8 22.8V15.4Z" fill="#FFB900" />
              <defs>
                <radialGradient id="taskbar-xp-orb" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[14.5px] font-bold italic tracking-wide text-white font-sans drop-shadow-[1px_1px_1px_rgba(0,0,0,0.9)]">
            inicio
          </span>
        </button>

        {/* Quick Launch Icons */}
        <div className="hidden sm:flex items-center space-x-1 px-1 border-r border-white/20">
          <button
            className="p-1 hover:bg-white/20 active:bg-white/40 rounded transition-colors"
            onClick={() => onOpenModal('sap')}
            title="Abrir SAP R/3"
          >
            <img
              src={XP_ICONS.sap}
              alt="SAP"
              className="w-4 h-4 object-contain bg-white rounded-xs p-0.5"
            />
          </button>
          <button
            className="p-1 hover:bg-white/20 active:bg-white/40 rounded transition-colors"
            onClick={() => onScrollToSection('habilidades')}
            title="Ver Habilidades y Power BI"
          >
            <span className="material-symbols-outlined text-[16px] text-white">
              analytics
            </span>
          </button>
          <button
            className="p-1 hover:bg-white/20 active:bg-white/40 rounded transition-colors"
            onClick={() => onScrollToSection('certificaciones')}
            title="Ver Certificaciones y Python"
          >
            <span className="material-symbols-outlined text-[16px] text-white">
              terminal
            </span>
          </button>
        </div>

        {/* Active Window Tab in Taskbar (CV Window) */}
        {!isWindowClosed && (
          <div
            id="taskbar-cv-tab"
            className={`h-6 px-2.5 rounded flex items-center space-x-1.5 shadow-inner cursor-pointer max-w-xs truncate transition-all ${
              !isWindowMinimized
                ? 'bg-[#0055ea]/90 border border-white/50 text-white font-bold'
                : 'bg-[#00369e]/60 border border-transparent text-white/80 opacity-80 hover:opacity-100'
            }`}
            onClick={onToggleWindowFromTaskbar}
          >
            <img
              src={XP_ICONS.file}
              alt="CV"
              className="w-3.5 h-3.5 object-contain shrink-0"
              draggable={false}
            />
            <span className="text-[11px] truncate">
              Raúl Alejandro Ayala - CV
            </span>
          </div>
        )}

        {/* Portfolio Window Tab in Taskbar */}
        {activeModal === 'portafolio' && (
          <div
            id="taskbar-portfolio-tab"
            className="h-6 px-2.5 rounded flex items-center space-x-1.5 shadow-inner cursor-pointer max-w-xs truncate transition-all bg-[#0055ea] border border-white/50 text-white font-bold"
            onClick={() => onOpenModal('portafolio')}
          >
            <span className="material-symbols-outlined text-[15px] text-yellow-300">
              folder_special
            </span>
            <span className="text-[11px] truncate">
              Portafolio de Proyectos
            </span>
          </div>
        )}
      </div>

      {/* Right Section: Copyright Info + Luna Systray */}
      <div className="flex items-center h-full">
        <span className="hidden md:inline text-[10px] text-[#d8dfff] opacity-80 mr-3">
          Microsoft Windows XP Professional © 2001-2024
        </span>

        {/* System Tray (Sunken Bevel Container) */}
        <div className="xp-systray h-full px-3 flex items-center space-x-2.5 text-white border-l border-[#00287a]">
          <span
            className="material-symbols-outlined text-[15px] text-[#82db7e] hover:opacity-100 opacity-90 cursor-pointer"
            onClick={() =>
              alert(
                'Protección en tiempo real activa: Perfil de Raúl Ayala certificado sin virus ni fallas de inventario.'
              )
            }
            title="Seguridad de Windows: Activo"
          >
            security
          </span>
          <img
            src={XP_ICONS.network}
            alt="Red"
            className="w-3.5 h-3.5 object-contain cursor-pointer opacity-90 hover:opacity-100"
            onClick={() => onOpenModal('red')}
            title="Conexión de red: 100 Mbps OK"
          />
          <span
            className={`material-symbols-outlined text-[15px] hover:opacity-100 cursor-pointer ${
              isMuted ? 'text-red-300 opacity-90' : 'text-white opacity-90'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsVolumeOpen((prev) => !prev);
            }}
            title={isMuted ? 'Sonido silenciado' : `Volumen: ${volume}% (Clic para ajustar)`}
          >
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
          <span
            id="digital-clock"
            className="text-[11px] font-bold tracking-tight ml-1 text-white"
          >
            {timeString || '12:00 PM'}
          </span>
        </div>
      </div>

      {/* Windows XP Volume Control Popover */}
      {isVolumeOpen && (
        <div
          ref={volumeRef}
          className="absolute bottom-9 right-8 w-60 bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-sm shadow-2xl p-2 z-50 text-xs text-black select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0055ea] to-[#3a93ff] text-white font-bold text-[11px] px-2 py-0.5 flex justify-between items-center -mx-2 -mt-2 mb-2 rounded-t-sm">
            <span>Control de volumen</span>
            <button
              className="text-white hover:bg-red-600 px-1 rounded text-[10px]"
              onClick={() => setIsVolumeOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col items-center py-1">
            <span className="text-[11px] text-gray-700 font-semibold mb-1">
              Volumen: {isMuted ? 'Silenciado' : `${volume}%`}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              disabled={isMuted}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolumeState(val);
                soundManager.setVolume(val / 100);
              }}
              className="w-full accent-[#0055ea] cursor-pointer"
            />
            <label className="flex items-center space-x-1.5 mt-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={isMuted}
                onChange={(e) => {
                  const muted = e.target.checked;
                  setIsMuted(muted);
                  soundManager.setMuted(muted);
                }}
                className="cursor-pointer"
              />
              <span>Silenciar todo</span>
            </label>
            <button
              type="button"
              className="mt-1.5 text-[10.5px] text-[#0055ea] hover:underline cursor-pointer self-start"
              onClick={() => {
                setVolumeState(13);
                soundManager.setVolume(0.13);
                setIsMuted(false);
                soundManager.setMuted(false);
              }}
            >
              Restablecer volumen a 13%
            </button>
          </div>

          {/* Sound Testing Buttons */}
          <div className="border-t border-[#d0ccc0] pt-2 mt-1 flex flex-col gap-1.5">
            <button
              type="button"
              className="xp-btn-classic w-full py-1 text-[11px] flex items-center justify-center space-x-1 font-semibold"
              onClick={() => {
                soundManager.playStartup();
              }}
              title="Reproducir la melodía de inicio de Windows XP"
            >
              <span>▶ Reproducir Inicio (Startup)</span>
            </button>
            <button
              type="button"
              className="xp-btn-classic w-full py-1 text-[11px] flex items-center justify-center space-x-1"
              onClick={() => {
                soundManager.playClick();
              }}
              title="Reproducir el clic de navegación"
            >
              <span>🔔 Probar Clic</span>
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
