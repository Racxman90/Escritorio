import React, { useState } from 'react';
import { ActiveModal } from '../types';
import { PROFILE_AVATAR_SIDEBAR, XP_ICONS, BLISS_WALLPAPER_URL } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface SystemModalsProps {
  activeModal: ActiveModal;
  onClose: () => void;
  onRestoreCV: () => void;
  onDownloadCV: () => void;
  onConfirmCloseCV: () => void;
  onOpenSection: (sectionId: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
  onShowWelcomeScreen?: () => void;
}

export const SystemModals: React.FC<SystemModalsProps> = ({
  activeModal,
  onClose,
  onRestoreCV,
  onDownloadCV,
  onConfirmCloseCV,
  onOpenSection,
  onOpenModal,
  onShowWelcomeScreen,
}) => {
  const [activeDisplayTab, setActiveDisplayTab] = useState('Escritorio');
  const [runInput, setRunInput] = useState('');

  const handleRunSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = runInput.trim().toLowerCase();
    soundManager.playClick();
    if (!cmd) {
      onClose();
      return;
    }
    if (cmd === 'notepad' || cmd === 'cv' || cmd === 'curriculum') {
      onRestoreCV();
      onClose();
    } else if (cmd === 'sap' || cmd === 'saplogon' || cmd === 'sap gui') {
      onOpenModal('sap');
    } else if (cmd === 'excel' || cmd === 'excel.exe') {
      onOpenSection('habilidades');
      onClose();
    } else if (cmd === 'control' || cmd === 'panel') {
      onOpenModal('control-panel');
    } else if (cmd === 'winver' || cmd === 'about') {
      onOpenModal('acerca');
    } else if (cmd === 'cmd' || cmd === 'cmd.exe') {
      onOpenModal('sap');
    } else if (cmd === 'calc' || cmd === 'calc.exe') {
      alert('Calculadora de Inventario: Stock proyectado = 14,250 cajas | Cubicaje = 98.4%');
      onClose();
    } else if (cmd === 'portafolio' || cmd === 'proyectos' || cmd === 'portfolio') {
      onOpenModal('portafolio');
      onClose();
    } else {
      alert(`Windows no puede encontrar el archivo '${runInput}'. Asegúrese de que el nombre esté escrito correctamente.`);
    }
    setRunInput('');
  };

  if (!activeModal || activeModal === 'portafolio') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Close Warning Modal */}
        {activeModal === 'close-warning' && (
          <div
            id="modal-close-warning"
            className="w-84 max-w-sm bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">warning</span>
                <span>Windows XP - Confirmación</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white flex items-start gap-3">
              <span className="material-symbols-outlined text-[36px] text-[#0055ea] shrink-0">
                help
              </span>
              <div>
                <p className="text-[12px] text-[#1c1c12]">
                  ¿Desea cerrar el Currículum Vitae de{' '}
                  <strong>Raúl Alejandro Ayala Covarrubias</strong>?
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Podrá volver a abrirlo en cualquier momento desde el acceso directo del escritorio.
                </p>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end gap-2 border-t border-[#c3c5d8]">
              <button
                className="px-4 py-1 text-[11px] xp-btn-classic"
                onClick={onConfirmCloseCV}
              >
                Aceptar
              </button>
              <button
                className="px-4 py-1 text-[11px] xp-btn-classic font-bold"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 2. Mi PC Modal */}
        {activeModal === 'mipc' && (
          <div
            id="modal-mipc"
            className="w-96 max-w-md bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <img src={XP_ICONS.computer} alt="Mi PC" className="w-4 h-4 object-contain" />
                <span>Mi PC - Sistema de Archivos</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white space-y-3">
              <div className="text-[12px] font-bold text-[#0040b5]">
                Unidades de disco duro
              </div>
              <div
                className="flex items-center gap-3 p-2 border border-[#c3c5d8] rounded bg-[#f7f4e3] cursor-pointer hover:bg-[#ece9d8] transition-colors"
                onClick={() => {
                  onRestoreCV();
                  onClose();
                }}
              >
                <img src={XP_ICONS.computer} alt="Disco C" className="w-8 h-8 object-contain shrink-0" />
                <div>
                  <div className="font-bold text-[12px]">Disco Local (C:)</div>
                  <div className="text-[10px] text-gray-500">
                    220 GB libres de 500 GB (Contiene CV_Raul_Ayala_2024.html)
                  </div>
                </div>
              </div>
              <div className="text-[12px] font-bold text-[#0040b5]">
                Dispositivos de almacenamiento extraíble
              </div>
              <div
                className="flex items-center gap-3 p-2 border border-[#c3c5d8] rounded bg-[#f7f4e3] cursor-pointer hover:bg-[#ece9d8] transition-colors"
                onClick={() => {
                  onDownloadCV();
                }}
              >
                <span className="material-symbols-outlined text-[#106d20] text-[32px]">
                  usb
                </span>
                <div>
                  <div className="font-bold text-[12px]">
                    Pendrive BACKUP_LOGISTICA (D:)
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Haga clic para descargar respaldo del CV (.doc)
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* 3. Mis Documentos Modal */}
        {activeModal === 'mis-docs' && (
          <div
            id="modal-mis-docs"
            className="w-96 max-w-md bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <img src={XP_ICONS.documents} alt="Mis Documentos" className="w-4 h-4 object-contain" />
                <span>Mis Documentos - Raúl Ayala</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-white grid grid-cols-2 gap-2 text-center">
              <div
                className="p-2 border border-[#c3c5d8] rounded hover:bg-[#ece9d8] cursor-pointer transition-colors flex flex-col items-center justify-center"
                onClick={() => {
                  onRestoreCV();
                  onClose();
                }}
              >
                <img src={XP_ICONS.file} alt="CV" className="w-8 h-8 object-contain" />
                <div className="font-bold text-[11px] mt-1">CV_Raul_Ayala.html</div>
              </div>
              <div
                className="p-2 border border-[#c3c5d8] rounded hover:bg-[#ece9d8] cursor-pointer transition-colors flex flex-col items-center justify-center"
                onClick={() => {
                  onDownloadCV();
                  onClose();
                }}
              >
                <img src={XP_ICONS.notepad} alt="Descargar" className="w-8 h-8 object-contain" />
                <div className="font-bold text-[11px] mt-1">Descargar_CV.doc</div>
              </div>
              <div
                className="p-2 border border-[#c3c5d8] rounded hover:bg-[#ece9d8] cursor-pointer transition-colors"
                onClick={() => {
                  onOpenSection('experiencia');
                  onRestoreCV();
                  onClose();
                }}
              >
                <span className="material-symbols-outlined text-[#0055ea] text-[32px]">
                  bar_chart
                </span>
                <div className="font-bold text-[11px] mt-1">Reportes_SAP_OTIF.xlsx</div>
              </div>
              <div
                className="p-2 border border-[#c3c5d8] rounded hover:bg-[#ece9d8] cursor-pointer transition-colors"
                onClick={() => {
                  onOpenSection('certificaciones');
                  onRestoreCV();
                  onClose();
                }}
              >
                <span className="material-symbols-outlined text-[#0051e0] text-[32px]">
                  verified
                </span>
                <div className="font-bold text-[11px] mt-1">Certificados_AIEP.pdf</div>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* 4. SAP Logon Modal */}
        {activeModal === 'sap' && (
          <div
            id="modal-sap"
            className="w-96 max-w-md bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <img src={XP_ICONS.sap} alt="SAP" className="w-4 h-4 object-contain bg-white rounded-xs p-0.5" />
                <span>SAP Logon 7.40 - Servidores Corporativos</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white space-y-3">
              <div className="bg-[#0040b5]/10 border border-[#0040b5]/30 p-2 rounded text-[11px] text-[#0040b5]">
                <strong>Conexión activa:</strong> Sistema Producción PRD (Módulos MM/SD)
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-gray-600 font-bold">
                  Mandante / Client:
                </label>
                <input
                  className="w-full text-[11px] bg-[#f7f4e3] px-2 py-1 border border-[#737687] rounded-sm xp-inset-border outline-none"
                  readOnly
                  value="100 - Distribución Central"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-gray-600 font-bold">
                  Usuario Logístico:
                </label>
                <input
                  className="w-full text-[11px] bg-[#f7f4e3] px-2 py-1 border border-[#737687] rounded-sm xp-inset-border outline-none"
                  readOnly
                  value="RAYALA_OPERACIONES"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-gray-600 font-bold">
                  Especialidad & Transacciones:
                </label>
                <div className="text-[11px] text-[#1c1c12] bg-[#f1eedd] p-2 rounded border border-[#c3c5d8]">
                  Transacciones MIGO (Entradas de mercancía), MB51, VA01 (Pedidos), VL01N (Entregas), Control de Lotes y Despachos.
                </div>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end gap-2 border-t border-[#c3c5d8]">
              <button
                className="px-4 py-1 text-[11px] xp-btn-classic font-bold"
                onClick={() => {
                  alert(
                    '✓ Conexión exitosa a SAP R/3.\nExperiencia comprobada de Raúl Ayala validada al 90% (MM/SD).'
                  );
                  onClose();
                }}
              >
                Iniciar sesión
              </button>
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 5. Sitios de Red Modal */}
        {activeModal === 'red' && (
          <div
            id="modal-red"
            className="w-80 max-w-sm bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <img src={XP_ICONS.network} alt="Red" className="w-4 h-4 object-contain" />
                <span>Mis sitios de red</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 text-[#106d20]">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
                <span className="font-bold text-[12px]">Red Corporativa Conectada</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Servidor WMS Aeropuerto / Bodega Central activo y sincronizado vía TCP/IP.
              </p>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* 6. Papelera Modal */}
        {activeModal === 'papelera' && (
          <div
            id="modal-papelera"
            className="w-84 max-w-sm bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <img src={XP_ICONS.recycle} alt="Papelera" className="w-4 h-4 object-contain" />
                <span>Papelera de reciclaje</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-5 bg-white text-center text-gray-600 flex flex-col items-center">
              <img src={XP_ICONS.recycle} alt="Papelera" className="w-12 h-12 object-contain mb-2 opacity-80" />
              <p className="font-bold text-[#1c1c12] text-[12px]">
                La papelera de reciclaje está vacía.
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Todos los registros de trazabilidad y KPIs se encuentran debidamente archivados.
              </p>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* 7. Panel de Control Modal */}
        {activeModal === 'control-panel' && (
          <div
            id="modal-control-panel"
            className="w-96 max-w-md bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">settings</span>
                <span>Panel de Control - Configuración</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-white grid grid-cols-2 gap-3">
              <div
                className="flex items-center gap-2 p-2 border border-[#c3c5d8] rounded hover:bg-[#f1eedd] cursor-pointer transition-colors"
                onClick={() => alert('Resolución: 100% Pantalla Óptima Windows XP Luna')}
              >
                <span className="material-symbols-outlined text-[#0040b5] text-[24px]">
                  display_settings
                </span>
                <span className="font-bold text-[11px]">Pantalla y Temas</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 border border-[#c3c5d8] rounded hover:bg-[#f1eedd] cursor-pointer transition-colors"
                onClick={() => alert('Conexión de red: 100 Mbps OK - Servidores CD')}
              >
                <span className="material-symbols-outlined text-[#106d20] text-[24px]">
                  network_check
                </span>
                <span className="font-bold text-[11px]">Conexiones de red</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 border border-[#c3c5d8] rounded hover:bg-[#f1eedd] cursor-pointer transition-colors"
                onClick={() =>
                  alert('Usuario: Raúl Ayala (Disponibilidad Completa / Inmediata)')
                }
              >
                <span className="material-symbols-outlined text-[#0040b5] text-[24px]">
                  manage_accounts
                </span>
                <span className="font-bold text-[11px]">Cuentas de usuario</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 border border-[#c3c5d8] rounded hover:bg-[#f1eedd] cursor-pointer transition-colors"
                onClick={() => window.print()}
              >
                <span className="material-symbols-outlined text-[#0040b5] text-[24px]">
                  print
                </span>
                <span className="font-bold text-[11px]">Impresoras (CV)</span>
              </div>
              <div
                className="col-span-2 flex items-center justify-between p-2 border border-[#c3c5d8] rounded bg-[#f7f6f0]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d97706] text-[24px]">
                    volume_up
                  </span>
                  <div>
                    <span className="font-bold text-[11px] block">Dispositivos de sonido (XP Audio)</span>
                    <span className="text-[10px] text-gray-500">Esquema de sonido clásico de Windows XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="xp-btn-classic px-2 py-0.5 text-[10px]"
                    onClick={() => soundManager.playStartup()}
                    title="Reproducir Inicio de Windows XP"
                  >
                    ▶ Probar Inicio
                  </button>
                  <button
                    type="button"
                    className="xp-btn-classic px-2 py-0.5 text-[10px]"
                    onClick={() => soundManager.playClick()}
                    title="Reproducir Clic"
                  >
                    🔔 Clic
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* 8. Acerca de Modal */}
        {activeModal === 'acerca' && (
          <div
            id="modal-acerca"
            className="w-96 max-w-md bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">info</span>
                <span>Acerca de Raúl Alejandro Ayala Covarrubias</span>
              </span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#0040b5] shrink-0">
                  <img
                    src={PROFILE_AVATAR_SIDEBAR}
                    alt="Raúl Ayala"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#0040b5] text-[13px]">
                    Raúl Ayala Covarrubias
                  </h3>
                  <p className="text-[11px] text-gray-600">
                    Técnico Superior en Logística
                  </p>
                  <p className="text-[10px] text-gray-500">Santiago, Chile</p>
                </div>
              </div>
              <p className="text-[11px] text-[#1c1c12] leading-relaxed">
                Portafolio interactivo presentado en estilo visual Windows XP Luna. Optimizado para procesos de selección y reclutamiento en Operaciones, Cadena de Suministro y Supervisión de Centros de Distribución.
              </p>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* 9. Apagar Equipo Modal */}
        {activeModal === 'shutdown' && (
          <div
            id="modal-shutdown"
            className="w-80 max-w-sm bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span>Apagar el equipo</span>
              <button
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-white text-center space-y-4">
              <p className="text-[12px] font-bold text-[#1c1c12]">¿Qué desea hacer?</p>
              <div className="flex justify-around items-center pt-2">
                <button
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => {
                    alert('Modo Suspensión Activado');
                    onClose();
                  }}
                >
                  <span className="material-symbols-outlined text-[32px] text-yellow-500 group-hover:scale-110 transition-transform">
                    bedtime
                  </span>
                  <span className="text-[10px]">Suspender</span>
                </button>
                <button
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => {
                    onConfirmCloseCV();
                    onClose();
                  }}
                >
                  <span className="material-symbols-outlined text-[32px] text-red-600 group-hover:scale-110 transition-transform">
                    power_settings_new
                  </span>
                  <span className="text-[10px] font-bold text-red-700">Apagar</span>
                </button>
                <button
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <span className="material-symbols-outlined text-[32px] text-green-600 group-hover:scale-110 transition-transform">
                    restart_alt
                  </span>
                  <span className="text-[10px]">Reiniciar</span>
                </button>
              </div>
            </div>
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button className="px-4 py-1 text-[11px] xp-btn-classic" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 10. Propiedades de Pantalla (Display Properties) */}
        {activeModal === 'display-properties' && (
          <div
            id="modal-display-properties"
            className="w-[430px] max-w-full bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs"
          >
            {/* Titlebar */}
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                <span>Propiedades de Pantalla</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-4 h-4 bg-[#ece9d8] text-black border border-[#7f9db9] flex items-center justify-center rounded-xs text-[10px] font-bold shadow-xs hover:bg-white"
                  onClick={() => alert('Ayuda: Configuración de fondo y apariencia de Windows XP.')}
                >
                  ?
                </button>
                <button
                  type="button"
                  className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold"
                  onClick={onClose}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-2 pt-2 bg-[#ece9d8] flex space-x-0.5 border-b border-[#737687]">
              {['Temas', 'Escritorio', 'Protector de pantalla', 'Apariencia', 'Configuración'].map((tab) => {
                const isSelected = activeDisplayTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveDisplayTab(tab)}
                    className={`px-2 py-1 text-[11px] rounded-t border-t border-l border-r border-[#737687] font-semibold transition-none ${
                      isSelected
                        ? 'bg-white text-black -mb-[1px] border-b-transparent pt-1.5 z-10'
                        : 'bg-[#d8d5c4] text-gray-700 hover:bg-[#ece9d8]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-3 bg-white space-y-3">
              {activeDisplayTab === 'Escritorio' && (
                <div>
                  {/* CRT Monitor Preview */}
                  <div className="flex justify-center mb-3">
                    <div className="relative w-44 h-32 bg-[#d8d4c7] border-2 border-[#b5af9f] rounded-lg p-2 shadow-inner flex flex-col items-center">
                      <div className="w-full h-24 bg-black border-2 border-[#8e8979] rounded overflow-hidden relative shadow-inner flex items-center justify-center">
                        <img
                          src={BLISS_WALLPAPER_URL}
                          alt="Bliss Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between items-center w-full px-2 mt-1">
                        <span className="text-[7px] text-[#716f64] font-bold">LUNA CRT 17"</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs" title="Encendido" />
                      </div>
                    </div>
                  </div>

                  {/* Wallpaper List */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-gray-700">
                      Fondo:
                    </label>
                    <div className="h-20 bg-white border border-[#7f9db9] p-1 overflow-y-auto space-y-0.5 text-[11px]">
                      <div className="px-2 py-0.5 bg-[#316ac5] text-white font-semibold cursor-pointer">
                        Bliss (Predeterminado de Windows XP)
                      </div>
                      <div className="px-2 py-0.5 hover:bg-[#ece9d8] text-gray-700 cursor-pointer">
                        Azul Windows XP
                      </div>
                      <div className="px-2 py-0.5 hover:bg-[#ece9d8] text-gray-700 cursor-pointer">
                        Otoño Dorado
                      </div>
                      <div className="px-2 py-0.5 hover:bg-[#ece9d8] text-gray-700 cursor-pointer">
                        Viento Cristalino
                      </div>
                      <div className="px-2 py-0.5 hover:bg-[#ece9d8] text-gray-700 cursor-pointer">
                        Luna Plata
                      </div>
                    </div>
                  </div>

                  {/* Position selector */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-700">Posición:</span>
                      <select className="border border-[#7f9db9] px-2 py-0.5 text-[11px] bg-white rounded-xs">
                        <option>Expandir</option>
                        <option>Centrada</option>
                        <option>Mosaico</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="xp-btn-classic px-3 py-1 text-[11px]"
                      onClick={() => alert('Color de fondo: Azul Luna')}
                    >
                      Color...
                    </button>
                  </div>
                </div>
              )}

              {activeDisplayTab === 'Temas' && (
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <span className="font-bold text-[11px]">Tema actual:</span>
                    <select className="w-full border border-[#7f9db9] px-2 py-1 text-[11px] bg-white rounded-xs">
                      <option>Windows XP (estilo predeterminado Luna)</option>
                      <option>Windows Clásico</option>
                    </select>
                  </div>
                  <div className="p-2 border border-[#c3c5d8] rounded bg-[#f7f6f0] text-[11px] text-gray-600">
                    Un tema consta de fondos de escritorio, protectores de pantalla, colores y sonidos clásicos de Windows XP.
                  </div>
                </div>
              )}

              {activeDisplayTab === 'Protector de pantalla' && (
                <div className="space-y-3 py-2 text-center">
                  <div className="flex justify-center">
                    <div className="w-40 h-28 bg-[#2d2b27] border-2 border-[#b5af9f] rounded-lg p-2 flex items-center justify-center text-white">
                      <span className="text-xl font-bold tracking-widest animate-pulse text-[#4585f5]">
                        WINDOWS XP
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-bold text-[11px]">Protector de pantalla:</span>
                    <select className="w-full border border-[#7f9db9] px-2 py-1 text-[11px] bg-white rounded-xs">
                      <option>Texto 3D - Windows XP</option>
                      <option>Tuberías 3D</option>
                      <option>Marquesina</option>
                    </select>
                  </div>
                </div>
              )}

              {activeDisplayTab === 'Apariencia' && (
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <span className="font-bold text-[11px]">Ventanas y botones:</span>
                    <select className="w-full border border-[#7f9db9] px-2 py-1 text-[11px] bg-white rounded-xs">
                      <option>Estilo Windows XP</option>
                      <option>Estilo clásico de Windows</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-[11px]">Combinación de colores:</span>
                    <select className="w-full border border-[#7f9db9] px-2 py-1 text-[11px] bg-white rounded-xs">
                      <option>Azul predeterminado (Luna)</option>
                      <option>Verde oliva</option>
                      <option>Plateado</option>
                    </select>
                  </div>
                </div>
              )}

              {activeDisplayTab === 'Configuración' && (
                <div className="space-y-3 py-2">
                  <div className="border border-[#c3c5d8] p-2 rounded bg-[#f7f6f0] text-[11px]">
                    <strong>Pantalla:</strong> Monitor Plug and Play en Intel Graphics Accelerator XP
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold block">Resolución de pantalla:</span>
                      <span className="text-gray-600">1920 x 1080 píxeles</span>
                    </div>
                    <div>
                      <span className="font-bold block">Calidad del color:</span>
                      <span className="text-gray-600">La más alta (32 bits)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom standard XP Action Buttons */}
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end gap-2 border-t border-[#c3c5d8]">
              <button
                type="button"
                className="px-4 py-1 text-[11px] xp-btn-classic font-semibold"
                onClick={onClose}
              >
                Aceptar
              </button>
              <button
                type="button"
                className="px-4 py-1 text-[11px] xp-btn-classic"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-1 text-[11px] xp-btn-classic"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* 11. Authentic Windows XP 'Ejecutar' (Run) Dialog */}
        {activeModal === 'run' && (
          <div
            id="modal-run"
            className="w-[400px] max-w-full bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs font-sans"
          >
            {/* Titlebar */}
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  terminal
                </span>
                <span>Ejecutar</span>
              </span>
              <button
                type="button"
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold cursor-pointer"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleRunSubmit} className="p-4 bg-[#ece9d8] space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded bg-white border border-[#7f9db9] flex items-center justify-center p-1 shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[#0055ea] text-[28px]">
                    wysiwyg
                  </span>
                </div>
                <p className="text-[11px] text-[#1c1c12] leading-snug">
                  Escriba el nombre del programa, carpeta, documento o recurso de Internet que desea que Windows abra para usted.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label htmlFor="run-cmd-input" className="text-[11px] font-semibold text-[#1c1c12] w-12 shrink-0">
                  Abrir:
                </label>
                <input
                  id="run-cmd-input"
                  type="text"
                  autoFocus
                  value={runInput}
                  onChange={(e) => setRunInput(e.target.value)}
                  placeholder="ej. notepad, sap, excel, cmd, winver"
                  className="flex-1 bg-white border border-[#7f9db9] px-2 py-1 text-[11px] rounded-xs text-black focus:outline-none focus:border-[#0055ea]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c3c5d8]">
                <button
                  type="submit"
                  className="px-4 py-1 text-[11px] xp-btn-classic font-semibold"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  className="px-4 py-1 text-[11px] xp-btn-classic"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-1 text-[11px] xp-btn-classic"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenModal('mis-docs');
                  }}
                >
                  Examinar...
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 12. Authentic Windows XP 'Cerrar sesión en Windows' Dialog */}
        {activeModal === 'logoff' && (
          <div
            id="modal-logoff"
            className="w-[420px] max-w-full bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-md shadow-2xl overflow-hidden xp-window-shadow text-xs font-sans"
          >
            {/* Titlebar */}
            <div className="xp-titlebar text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold">
              <span>Cerrar sesión en Windows</span>
              <button
                type="button"
                className="w-4 h-4 bg-[#c21b30] text-white flex items-center justify-center rounded-xs text-[11px] font-bold cursor-pointer"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-white space-y-4">
              <p className="text-[12px] font-bold text-[#1c1c12] text-center">
                ¿Desea cerrar la sesión de Raúl Ayala?
              </p>

              <div className="flex justify-around items-center pt-2">
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                    if (onShowWelcomeScreen) {
                      onShowWelcomeScreen();
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#f59e0b] border-2 border-white flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-white">
                      switch_account
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold">Cambiar de usuario</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  onClick={() => {
                    soundManager.playClick();
                    onClose();
                    if (onShowWelcomeScreen) {
                      onShowWelcomeScreen();
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0055ea] border-2 border-white flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px] text-white">
                      key
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0055ea]">Cerrar sesión</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#ece9d8] px-3 py-2 flex justify-end border-t border-[#c3c5d8]">
              <button
                type="button"
                className="px-4 py-1 text-[11px] xp-btn-classic"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
