import React, { useState } from 'react';
import { soundManager } from '../utils/soundManager';
import { XP_ICONS } from '../data/cvData';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenProperties: () => void;
  onArrangeIcons?: (criteria: string) => void;
  autoArrange?: boolean;
  alignToGrid?: boolean;
  onToggleAutoArrange?: () => void;
  onToggleAlignToGrid?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  onRefresh,
  onOpenProperties,
  onArrangeIcons,
  autoArrange = true,
  alignToGrid = true,
  onToggleAutoArrange,
  onToggleAlignToGrid,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<'arrange' | 'new' | null>(null);

  if (!position) return null;

  // Viewport clamping to prevent menu overflow
  const menuWidth = 190;
  const menuHeight = 180;
  const clampedX = Math.max(5, Math.min(position.x, window.innerWidth - menuWidth - 10));
  const clampedY = Math.max(5, Math.min(position.y, window.innerHeight - menuHeight - 40));

  const handleAction = (action: () => void) => {
    soundManager.playClick();
    action();
    onClose();
  };

  return (
    <div
      id="desktop-context-menu"
      className="fixed z-50 select-none bg-white border border-[#716f64] shadow-[3px_3px_5px_rgba(0,0,0,0.35)] py-0.5 text-[11px] font-normal text-black w-48 font-sans"
      style={{
        left: `${clampedX}px`,
        top: `${clampedY}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* 1. Organizar iconos (Arrange Icons) */}
      <div
        className="relative group"
        onMouseEnter={() => setActiveSubmenu('arrange')}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="px-5 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-pointer transition-none">
          <span>Organizar iconos por</span>
          <span className="text-[9px] ml-2">▶</span>
        </div>

        {/* Submenu for Arrange Icons */}
        {activeSubmenu === 'arrange' && (
          <div
            className="absolute left-[98%] top-0 bg-white border border-[#716f64] shadow-[3px_3px_5px_rgba(0,0,0,0.35)] py-0.5 w-44 z-50 text-black"
            style={{
              left: clampedX + menuWidth + 180 > window.innerWidth ? '-175px' : '98%',
            }}
          >
            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
              onClick={() => handleAction(() => onArrangeIcons && onArrangeIcons('name'))}
            >
              Nombre
            </div>
            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
              onClick={() => handleAction(() => onArrangeIcons && onArrangeIcons('size'))}
            >
              Tamaño
            </div>
            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
              onClick={() => handleAction(() => onArrangeIcons && onArrangeIcons('type'))}
            >
              Tipo
            </div>
            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer"
              onClick={() => handleAction(() => onArrangeIcons && onArrangeIcons('date'))}
            >
              Modificado
            </div>

            <div className="h-[1px] bg-[#aca899] my-0.5 mx-1" />

            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center justify-between"
              onClick={() => handleAction(() => onToggleAutoArrange && onToggleAutoArrange())}
            >
              <span>Autoorganizar</span>
              {autoArrange && <span className="font-bold text-[10px]">✓</span>}
            </div>
            <div
              className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center justify-between"
              onClick={() => handleAction(() => onToggleAlignToGrid && onToggleAlignToGrid())}
            >
              <span>Alinear a la cuadrícula</span>
              {alignToGrid && <span className="font-bold text-[10px]">✓</span>}
            </div>
          </div>
        )}
      </div>

      {/* 2. Actualizar (Refresh) */}
      <div
        className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer transition-none flex items-center justify-between"
        onClick={() => handleAction(onRefresh)}
      >
        <span>Actualizar</span>
        <span className="text-[10px] opacity-60">F5</span>
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-[#aca899] my-0.5 mx-1" />

      {/* 3. Pegar (Paste) - Disabled */}
      <div className="px-5 py-1 text-[#808080] cursor-default flex items-center justify-between select-none">
        <span>Pegar</span>
        <span className="text-[10px] opacity-40">Ctrl+V</span>
      </div>

      {/* 4. Pegar acceso directo - Disabled */}
      <div className="px-5 py-1 text-[#808080] cursor-default select-none">
        <span>Pegar acceso directo</span>
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-[#aca899] my-0.5 mx-1" />

      {/* 5. Nuevo (New) */}
      <div
        className="relative group"
        onMouseEnter={() => setActiveSubmenu('new')}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <div className="px-5 py-1 flex items-center justify-between hover:bg-[#316ac5] hover:text-white cursor-pointer transition-none">
          <span>Nuevo</span>
          <span className="text-[9px] ml-2">▶</span>
        </div>

        {activeSubmenu === 'new' && (
          <div
            className="absolute left-[98%] top-0 bg-white border border-[#716f64] shadow-[3px_3px_5px_rgba(0,0,0,0.35)] py-0.5 w-44 z-50 text-black"
            style={{
              left: clampedX + menuWidth + 180 > window.innerWidth ? '-175px' : '98%',
            }}
          >
            <div
              className="px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
              onClick={() =>
                handleAction(() =>
                  alert('Crear nueva carpeta: función de simulación de Windows XP.')
                )
              }
            >
              <img src={XP_ICONS.folder} alt="Carpeta" className="w-3.5 h-3.5 object-contain" />
              <span>Carpeta</span>
            </div>
            <div
              className="px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
              onClick={() =>
                handleAction(() =>
                  alert('Crear acceso directo: función de simulación de Windows XP.')
                )
              }
            >
              <span className="material-symbols-outlined text-[13px] text-blue-600">
                shortcut
              </span>
              <span>Acceso directo</span>
            </div>
            <div
              className="px-3 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer flex items-center gap-2"
              onClick={() =>
                handleAction(() =>
                  alert('Documento de texto nuevo: Bloc de notas XP.')
                )
              }
            >
              <img src={XP_ICONS.notepad} alt="Texto" className="w-3.5 h-3.5 object-contain" />
              <span>Documento de texto</span>
            </div>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-[#aca899] my-0.5 mx-1" />

      {/* 6. Propiedades (Properties) */}
      <div
        className="px-5 py-1 hover:bg-[#316ac5] hover:text-white cursor-pointer font-semibold transition-none"
        onClick={() => handleAction(onOpenProperties)}
      >
        Propiedades
      </div>
    </div>
  );
};
