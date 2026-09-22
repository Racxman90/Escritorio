import React, { useState, useEffect } from 'react';
import { ActiveModal } from '../types';
import { XP_ICONS, CV_DATA } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface DesktopIconItem {
  id: string;
  label: string;
  iconSrc: string;
  isShortcut?: boolean;
  isCV?: boolean;
  isSap?: boolean;
  category: 'system' | 'shortcut' | 'file';
  onDoubleClick: () => void;
}

interface DesktopIconsProps {
  selectedIcon: string | null;
  onSelectIcon: (id: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
  onRestoreCV: () => void;
  sortBy?: string;
  isRefreshing?: boolean;
  autoArrange?: boolean;
  alignToGrid?: boolean;
}

interface IconPosition {
  col: number;
  row: number;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  selectedIcon,
  onSelectIcon,
  onOpenModal,
  onRestoreCV,
  sortBy = 'default',
  isRefreshing = false,
  autoArrange = true,
  alignToGrid = true,
}) => {
  // Base desktop icons in authentic Windows XP hierarchy
  const baseIcons: DesktopIconItem[] = [
    {
      id: 'mipc',
      label: 'Mi PC',
      iconSrc: XP_ICONS.computer,
      category: 'system',
      onDoubleClick: () => onOpenModal('mipc'),
    },
    {
      id: 'mis-docs',
      label: 'Mis Documentos',
      iconSrc: XP_ICONS.documents,
      category: 'system',
      onDoubleClick: () => onOpenModal('mis-docs'),
    },
    {
      id: 'portafolio',
      label: 'Mis Proyectos',
      iconSrc: XP_ICONS.folder,
      category: 'system',
      onDoubleClick: () => onOpenModal('portafolio'),
    },
    {
      id: 'red',
      label: 'Mis sitios de red',
      iconSrc: XP_ICONS.network,
      category: 'system',
      onDoubleClick: () => onOpenModal('red'),
    },
    {
      id: 'papelera',
      label: 'Papelera de reciclaje',
      iconSrc: XP_ICONS.recycle,
      category: 'system',
      onDoubleClick: () => onOpenModal('papelera'),
    },
    {
      id: 'cv-doc',
      label: 'CV_Raul_Ayala.doc',
      iconSrc: XP_ICONS.file,
      isShortcut: true,
      isCV: true,
      category: 'file',
      onDoubleClick: () => onRestoreCV(),
    },
    {
      id: 'sap',
      label: 'SAP Logon',
      iconSrc: XP_ICONS.sap,
      isShortcut: true,
      isSap: true,
      category: 'shortcut',
      onDoubleClick: () => onOpenModal('sap'),
    },
    {
      id: 'ie',
      label: 'Internet Explorer',
      iconSrc: XP_ICONS.ie,
      isShortcut: true,
      category: 'shortcut',
      onDoubleClick: () => {
        window.open(CV_DATA.linkedin, '_blank');
      },
    },
    {
      id: 'notepad',
      label: 'Bloc de notas',
      iconSrc: XP_ICONS.notepad,
      isShortcut: true,
      category: 'shortcut',
      onDoubleClick: () => onRestoreCV(),
    },
  ];

  // Store custom manual positions when autoArrange is false
  const [customPositions, setCustomPositions] = useState<Record<string, IconPosition>>({});
  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);

  // Sorting logic based on criteria
  const getSortedIcons = () => {
    const list = [...baseIcons];
    if (sortBy === 'name') {
      list.sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === 'type') {
      const typeRank = { system: 1, file: 2, shortcut: 3 };
      list.sort((a, b) => typeRank[a.category] - typeRank[b.category] || a.label.localeCompare(b.label));
    } else if (sortBy === 'size') {
      // By importance/size (CV and SAP first)
      const sizeRank: Record<string, number> = {
        'cv-doc': 1,
        'sap': 2,
        'portafolio': 3,
        'mis-docs': 4,
        'mipc': 5,
        'ie': 6,
        'notepad': 7,
        'red': 8,
        'papelera': 9,
      };
      list.sort((a, b) => (sizeRank[a.id] || 99) - (sizeRank[b.id] || 99));
    } else if (sortBy === 'date') {
      // Recent modifications
      const dateRank: Record<string, number> = {
        'cv-doc': 1,
        'portafolio': 2,
        'sap': 3,
        'mis-docs': 4,
        'notepad': 5,
        'ie': 6,
        'mipc': 7,
        'red': 8,
        'papelera': 9,
      };
      list.sort((a, b) => (dateRank[a.id] || 99) - (dateRank[b.id] || 99));
    }
    return list;
  };

  const sortedIcons = getSortedIcons();

  // Reset custom positions when autoArrange is enabled or sortBy changes
  useEffect(() => {
    if (autoArrange) {
      setCustomPositions({});
    }
  }, [autoArrange, sortBy]);

  // Compute column and row for auto-arrange
  // Max 5 icons per column to keep desktop balanced and avoid taskbar overlap
  const MAX_ROWS = 5;
  const CELL_WIDTH = 78;
  const CELL_HEIGHT = 80;
  const OFFSET_X = 12;
  const OFFSET_Y = 12;

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingIconId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggingIconId;
    if (!id) return;

    // Calculate grid coordinates based on drop location
    const desktopRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - desktopRect.left;
    const clientY = e.clientY - desktopRect.top;

    let targetCol = Math.floor((clientX - OFFSET_X) / CELL_WIDTH);
    let targetRow = Math.floor((clientY - OFFSET_Y) / CELL_HEIGHT);

    targetCol = Math.max(0, Math.min(targetCol, 12));
    targetRow = Math.max(0, Math.min(targetRow, 8));

    if (alignToGrid) {
      setCustomPositions((prev) => ({
        ...prev,
        [id]: { col: targetCol, row: targetRow },
      }));
    }

    setDraggingIconId(null);
    soundManager.playClick();
  };

  return (
    <div
      id="desktop-icons-area"
      className="absolute inset-0 bottom-8 z-10 overflow-hidden pointer-events-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={`w-full h-full relative transition-opacity duration-150 ${
          isRefreshing ? 'opacity-25 scale-[0.99]' : 'opacity-100 scale-100'
        }`}
      >
        {sortedIcons.map((item, index) => {
          const isSelected = selectedIcon === item.id;

          // Determine grid position: custom or auto-arranged
          let col = 0;
          let row = 0;

          if (!autoArrange && customPositions[item.id]) {
            col = customPositions[item.id].col;
            row = customPositions[item.id].row;
          } else {
            col = Math.floor(index / MAX_ROWS);
            row = index % MAX_ROWS;
          }

          const left = OFFSET_X + col * CELL_WIDTH;
          const top = OFFSET_Y + row * CELL_HEIGHT;

          return (
            <div
              key={item.id}
              id={`icon-${item.id}`}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`absolute flex flex-col items-center justify-start w-[72px] h-[74px] p-1 rounded-xs cursor-pointer select-none transition-transform duration-75 group ${
                isSelected
                  ? 'bg-[#316ac5]/70 ring-1 ring-[#316ac5] border border-dotted border-white/60'
                  : 'hover:bg-[#316ac5]/25 active:bg-[#316ac5]/50'
              }`}
              style={{
                left: `${left}px`,
                top: `${top}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onSelectIcon(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                item.onDoubleClick();
              }}
            >
              {/* Icon Container with optional Windows XP shortcut arrow */}
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                {item.isSap ? (
                  <div className="w-9 h-9 bg-white border border-[#7f9db9] rounded-xs shadow-xs flex items-center justify-center p-0.5">
                    <img
                      src={item.iconSrc}
                      alt={item.label}
                      className="w-7 h-7 object-contain"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <img
                    src={item.iconSrc}
                    alt={item.label}
                    className="w-8 h-8 object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    draggable={false}
                  />
                )}

                {/* Authentic Windows XP Curved Shortcut Arrow */}
                {item.isShortcut && (
                  <div
                    className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-white border border-black/50 rounded-[1px] flex items-center justify-center shadow-xs"
                    title="Acceso directo"
                  >
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-[#0055ea]" fill="currentColor">
                      <path d="M1.5 8.5V5h2.2L2.3 6.4 6 2.7l1.3 1.3-3.7 3.7 1.4-1.4V8.5H1.5z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Icon Label with Windows XP drop-shadow */}
              <span
                className={`text-[10px] text-center leading-tight tracking-tight mt-1 line-clamp-2 px-1 rounded-[1px] ${
                  isSelected
                    ? 'bg-[#316ac5] text-white font-medium'
                    : 'text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.95)]'
                }`}
                style={{
                  textShadow: isSelected ? 'none' : '1px 1px 2px #000, 0 0 1px #000',
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
