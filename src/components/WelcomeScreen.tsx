import React, { useState } from 'react';
import { PROFILE_AVATAR_HEADER } from '../data/cvData';
import { soundManager } from '../utils/soundManager';

interface WelcomeScreenProps {
  isOpen: boolean;
  onLogin: () => void;
  onShutdown?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onLogin,
  onShutdown,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleUserClick = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    soundManager.playClick();
    soundManager.playStartup();
    setTimeout(() => {
      setIsLoggingIn(false);
      onLogin();
    }, 700);
  };

  return (
    <div
      id="xp-welcome-screen"
      className="fixed inset-0 z-[100] bg-[#00309c] text-white select-none flex flex-col justify-between font-sans overflow-hidden"
    >
      {/* Top Banner Ribbon */}
      <div className="h-14 bg-[#00134a] border-b-2 border-[#0051e0] relative flex items-center justify-between px-8 shadow-md">
        <div className="text-[11px] text-[#7ea9f5] font-semibold tracking-wider uppercase">
          Sistema Operativo Windows XP Professional
        </div>
        <div className="text-[10px] text-[#5581d6]">
          Edición de Operaciones y Logística
        </div>
      </div>

      {/* Main Center Area: Two Columns (Logo & Instruction | User Accounts) */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-8 md:gap-16 max-w-5xl mx-auto w-full">
        {/* Left Column: Windows XP Brand and Prompt */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3 md:pr-12 md:border-r border-[#3068db]/60">
          {/* Windows XP Logo Flag */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" fill="none">
                <circle cx="16" cy="16" r="15" fill="#002166" stroke="#487ee8" strokeWidth="1" />
                <path d="M8.5 14.5C8 10 11.5 8 14.5 7.5V14.2C12 14 9.5 14.2 8.5 14.5Z" fill="#F25022" />
                <path d="M15.8 7.3C19 6.8 23 8.5 24 12.8C21.5 13.5 18 13.8 15.8 14V7.3Z" fill="#7FBA00" />
                <path d="M8.5 15.8C10 16 12.5 15.8 14.5 15.6V22.5C11.5 22.8 8.5 20.8 8.5 15.8Z" fill="#00A4EF" />
                <path d="M15.8 15.4C18.5 15.2 21.5 15 24 16.5C23.2 21 19 23 15.8 22.8V15.4Z" fill="#FFB900" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] tracking-widest text-[#a8c6ff] font-light leading-none">
                Microsoft
              </div>
              <div className="text-[32px] font-bold leading-none tracking-tight">
                Windows<span className="text-[#ff8000] italic font-black ml-1">XP</span>
              </div>
            </div>
          </div>

          <div className="text-[13px] text-[#9fc2ff] max-w-xs leading-snug">
            Para comenzar, haga clic en su nombre de usuario
          </div>
        </div>

        {/* Right Column: User Account Tile */}
        <div className="flex flex-col items-start space-y-4 md:pl-6 w-full md:w-auto">
          <div
            id="xp-user-tile"
            onClick={handleUserClick}
            className={`group flex items-center gap-4 p-3 rounded-xl border border-transparent transition-all cursor-pointer select-none ${
              isLoggingIn
                ? 'bg-[#002166] border-[#5581d6]'
                : 'hover:bg-[#002166]/80 hover:border-[#4276df] active:bg-[#001747]'
            }`}
          >
            {/* Avatar Frame with XP yellow-orange border on hover */}
            <div className="w-16 h-16 rounded-md border-2 border-white group-hover:border-[#ff9900] overflow-hidden shadow-lg shrink-0 transition-colors">
              <img
                src={PROFILE_AVATAR_HEADER}
                alt="Raúl Ayala"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Username and status */}
            <div>
              <div className="text-[18px] font-bold text-white group-hover:text-[#ffd280] transition-colors leading-tight">
                Raúl Ayala
              </div>
              <div className="text-[12px] text-[#9fc2ff] mt-0.5">
                {isLoggingIn ? (
                  <span className="text-yellow-300 font-semibold animate-pulse">
                    Iniciando sesión...
                  </span>
                ) : (
                  <span>Técnico en Logística y Operaciones</span>
                )}
              </div>
              <div className="text-[11px] text-[#6997ea] mt-0.5">
                1 programa en ejecución
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Ribbon */}
      <div className="h-16 bg-[#00134a] border-t-2 border-[#0051e0] relative flex items-center justify-between px-8 shadow-inner">
        {/* Left: Turn Off Computer Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            if (onShutdown) onShutdown();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-[#c21b30] border border-white flex items-center justify-center shadow">
            <span className="material-symbols-outlined text-[14px] text-white">
              power_settings_new
            </span>
          </div>
          <span className="text-[12px] font-bold text-white group-hover:underline">
            Apagar el equipo
          </span>
        </button>

        {/* Right: Hint info */}
        <div className="text-[11px] text-[#6591ea] text-right hidden sm:block max-w-sm">
          Después de iniciar sesión, puede abrir el currículum, explorar documentos y revisar certificaciones.
        </div>
      </div>
    </div>
  );
};
