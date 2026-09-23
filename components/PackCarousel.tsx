'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import styles from './PackCarousel.module.css';

export type GalleryImage = {
  readonly src: string;
  readonly view: 'front' | 'front-left' | 'left' | 'back' | 'front-right';
};

type Props = {
  gallery: readonly GalleryImage[];
  title: string;
  accent?: string;
};

const viewNames = {
  ru: { front: 'вид спереди', 'front-left': 'вид спереди слева', left: 'вид слева', back: 'вид сзади', 'front-right': 'вид спереди справа' },
  en: { front: 'front view', 'front-left': 'front-left view', left: 'left-side view', back: 'back view', 'front-right': 'front-right view' },
} as const;

export function PackCarousel({ gallery, title, accent = '#d8b16a' }: Props) {
  const { language } = useLanguage();
  const isRu = language === 'ru';
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const pointer = useRef<{ id: number; startX: number; startY: number } | null>(null);
  const pointerMoved = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gallery.slice(1).forEach(({ src }) => { const image = new window.Image(); image.src = src; });
    return () => { if (transitionTimer.current) clearTimeout(transitionTimer.current); };
  }, [gallery]);

  useEffect(() => {
    if (!modalOpen) return;
    const opener = stageRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      opener?.focus();
    };
  }, [modalOpen]);

  const select = (nextIndex: number, nextDirection?: 1 | -1) => {
    const normalized = (nextIndex + gallery.length) % gallery.length;
    if (normalized === activeIndex) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setDirection(nextDirection ?? (normalized > activeIndex ? 1 : -1));
    setPreviousIndex(activeIndex);
    setActiveIndex(normalized);
    setDragOffset(0);
    transitionTimer.current = setTimeout(() => setPreviousIndex(null), 480);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerMoved.current = false;
    pointer.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.startX;
    const dy = event.clientY - pointer.current.startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) pointerMoved.current = true;
    if (Math.abs(dx) > Math.abs(dy)) setDragOffset(Math.max(-80, Math.min(80, dx)));
  };
  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const dx = event.clientX - pointer.current.startX;
    pointer.current = null;
    setDragOffset(0);
    if (Math.abs(dx) >= 50) select(activeIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!modalOpen && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setModalOpen(true);
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), event.key === 'ArrowRight' ? 1 : -1);
  };
  const alt = (index: number) => `NOIRA ${title} — ${viewNames[language][gallery[index].view]}`;

  const pagination = (modal = false) => (
    <div className={styles.status} aria-live="polite">
      <span>{String(activeIndex + 1).padStart(2, '0')}</span>
      <div className={styles.progress} aria-label={isRu ? `Ракурс ${activeIndex + 1} из ${gallery.length}` : `View ${activeIndex + 1} of ${gallery.length}`}>
        {gallery.map((item, index) => <button key={`${modal ? 'modal-' : ''}${item.src}`} type="button" className={index === activeIndex ? styles.current : ''} onClick={() => select(index)} aria-label={isRu ? `Показать ракурс ${index + 1}` : `Show view ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} />)}
      </div>
      <span>{String(gallery.length).padStart(2, '0')}</span>
    </div>
  );

  const arrows = (modal = false) => (
    <div className={`${styles.arrows} ${modal ? styles.modalArrows : ''}`}>
      <button type="button" onClick={() => select(activeIndex - 1, -1)} aria-label={isRu ? 'Предыдущий ракурс' : 'Previous view'}><ChevronLeft size={19} /></button>
      <button type="button" onClick={() => select(activeIndex + 1, 1)} aria-label={isRu ? 'Следующий ракурс' : 'Next view'}><ChevronRight size={19} /></button>
    </div>
  );

  return (
    <div className={styles.gallery} style={{ '--gallery-accent': accent } as React.CSSProperties}>
      <div
        ref={stageRef}
        className={styles.stage}
        role="region"
        aria-roledescription={isRu ? 'карусель изображений' : 'image carousel'}
        aria-label={`${title} NOIRA`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={(event) => { pointer.current = null; setDragOffset(0); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onClick={() => { if (pointerMoved.current) { pointerMoved.current = false; return; } setModalOpen(true); }}
      >
        <div className={styles.orbit} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />
        {previousIndex !== null && (
          <Image className={`${styles.pack} ${direction > 0 ? styles.exitLeft : styles.exitRight}`} src={gallery[previousIndex].src} alt="" aria-hidden width={1122} height={1402} sizes="(max-width: 599px) 78vw, (max-width: 899px) 54vw, 38vw" />
        )}
        <Image
          key={`${gallery[activeIndex].src}-${activeIndex}`}
          className={`${styles.pack} ${direction > 0 ? styles.enterRight : styles.enterLeft}`}
          src={gallery[activeIndex].src}
          alt={alt(activeIndex)}
          width={1122}
          height={1402}
          priority={activeIndex === 0}
          sizes="(max-width: 599px) 78vw, (max-width: 899px) 54vw, 38vw"
          style={{ '--drag-x': `${dragOffset}px` } as React.CSSProperties}
          draggable={false}
        />
      </div>

      <div className={styles.controls}>
        {pagination()}
        <span className={styles.dragHint}><span className={styles.mouseHint}>{isRu ? 'Перетащите, чтобы посмотреть' : 'Drag to explore'}</span><span className={styles.touchHint}>{isRu ? 'Свайпните, чтобы посмотреть' : 'Swipe to explore'}</span></span>
        {arrows()}
      </div>

      {modalOpen && createPortal(
        <div className={styles.modal} style={{ '--gallery-accent': accent } as React.CSSProperties} role="dialog" aria-modal="true" aria-label={isRu ? `Галерея ${title}` : `${title} gallery`} onClick={() => setModalOpen(false)}>
          <button ref={closeButtonRef} className={styles.closeButton} type="button" onClick={() => setModalOpen(false)} aria-label={isRu ? 'Закрыть галерею' : 'Close gallery'}><X size={22} /></button>
          <div className={styles.modalPanel} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalStage} tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishPointer} onPointerCancel={() => { pointer.current = null; setDragOffset(0); }}>
              <div className={styles.modalGlow} aria-hidden="true" />
              <Image key={`modal-${gallery[activeIndex].src}`} className={`${styles.modalPack} ${direction > 0 ? styles.enterRight : styles.enterLeft}`} src={gallery[activeIndex].src} alt={alt(activeIndex)} width={1122} height={1402} sizes="(max-width: 599px) 92vw, 72vw" draggable={false} />
            </div>
            <div className={styles.modalControls}>{pagination(true)}<span>{isRu ? 'Свайпните или используйте стрелки' : 'Swipe or use the arrows'}</span>{arrows(true)}</div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
