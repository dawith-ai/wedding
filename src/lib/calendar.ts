import type { WeddingData } from '../types';

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

function localDateTime(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
}

function toUtcStamp(d: Date): string {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    '00Z'
  );
}

export function googleCalendarLink(d: WeddingData): string {
  const start = localDateTime(d.wedding.date, d.wedding.time);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${d.groom.name} ♥ ${d.bride.name} 결혼식`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: d.greeting.title,
    location: `${d.wedding.venue} ${d.wedding.venueDetail || ''} ${d.wedding.address}`.trim(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsContent(d: WeddingData): string {
  const start = localDateTime(d.wedding.date, d.wedding.time);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const uid = `${Date.now()}@wedding-invitation`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//KO',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${d.groom.name} ♥ ${d.bride.name} 결혼식`,
    `LOCATION:${d.wedding.venue} ${d.wedding.address}`.replace(/\n/g, ' '),
    `DESCRIPTION:${d.greeting.title}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadIcs(d: WeddingData) {
  const blob = new Blob([icsContent(d)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wedding-${d.wedding.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function dDay(date: string, time: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
} {
  const target = localDateTime(date, time).getTime();
  const diff = target - Date.now();
  const past = diff < 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((abs / (1000 * 60)) % 60);
  const seconds = Math.floor((abs / 1000) % 60);
  return { days, hours, minutes, seconds, past };
}

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export function formatKoreanDate(date: string, time: string): string {
  const d = localDateTime(date, time);
  const ampm = d.getHours() < 12 ? '오전' : '오후';
  const h12 = d.getHours() % 12 || 12;
  const min = d.getMinutes();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일 · ${ampm} ${h12}시${min ? ' ' + min + '분' : ''}`;
}

export function formatShortDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${y}.${m}.${d}`;
}
