import { useCallback, useEffect, useMemo, useState } from 'react';
import { Camera, Check, Heart, ImagePlus, Star } from 'lucide-react';
import type { GuestPhoto, GuestPhotoVote } from '../../types';
import {
  addGuestPhoto as lsAddPhoto,
  addGuestPhotoVote as lsAddVote,
  listGuestPhotoVotes as lsListVotes,
  listGuestPhotos as lsListPhotos,
} from '../../lib/storage';
import {
  fbAddGuestPhoto,
  fbAddGuestPhotoVote,
  fbListGuestPhotoVotes,
  fbListGuestPhotos,
  isFirebaseEnabled,
} from '../../lib/firebase';
import { showToast } from '../../lib/toast';

interface Props {
  inviteId: string;
  config: NonNullable<import('../../types').WeddingData['guestPhotoWall']>;
  isPreview?: boolean;
}

function newId(prefix: string): string {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replaceAll('-', '').slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${random}`;
}

function timestamp(): number {
  return Date.now();
}

function getVoterId(inviteId: string): string {
  const key = `wedding_photo_voter_${inviteId}`;
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const value = newId('voter');
    localStorage.setItem(key, value);
    return value;
  } catch {
    return newId('voter');
  }
}

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('이미지 파일만 올릴 수 있어요');
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = source;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('사진을 읽지 못했어요'));
    });
    const max = 960;
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('사진을 준비하지 못했어요');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let result = canvas.toDataURL('image/jpeg', 0.72);
    if (result.length > 360_000) {
      canvas.width = Math.max(1, Math.round(canvas.width * 0.72));
      canvas.height = Math.max(1, Math.round(canvas.height * 0.72));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      result = canvas.toDataURL('image/jpeg', 0.58);
    }
    return result;
  } finally {
    URL.revokeObjectURL(source);
  }
}

export function GuestPhotoWall({ inviteId, config, isPreview = false }: Props) {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [votes, setVotes] = useState<GuestPhotoVote[]>([]);
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const voterId = useMemo(() => getVoterId(inviteId), [inviteId]);

  const refresh = useCallback(async () => {
    if (isFirebaseEnabled()) {
      try {
        const [remotePhotos, remoteVotes] = await Promise.all([
          fbListGuestPhotos(inviteId),
          config.allowVoting ? fbListGuestPhotoVotes(inviteId) : Promise.resolve([]),
        ]);
        setPhotos(remotePhotos);
        setVotes(remoteVotes);
        return;
      } catch {
        showToast('사진 서버를 불러오지 못해 이 기기 저장본을 보여드려요');
      }
    }
    setPhotos(lsListPhotos(inviteId));
    setVotes(config.allowVoting ? lsListVotes(inviteId) : []);
  }, [config.allowVoting, inviteId]);

  useEffect(() => {
    if (isPreview) return;
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [isPreview, refresh]);

  const visiblePhotos = photos.filter((photo) => photo.approved || !config.requireApproval);
  const voteCount = (photoId: string) => votes.filter((vote) => vote.photoId === photoId).length;
  const hasVoted = (photoId: string) => votes.some((vote) => vote.photoId === photoId && vote.voterId === voterId);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !name.trim()) {
      showToast('사진과 이름을 먼저 입력해주세요');
      return;
    }
    setBusy(true);
    try {
      const image = await compressImage(file);
      const entry: GuestPhoto = {
        id: newId('photo'),
        name: name.trim(),
        image,
        caption: caption.trim(),
        createdAt: timestamp(),
        approved: !config.requireApproval,
        featured: false,
      };
      if (isFirebaseEnabled()) await fbAddGuestPhoto(inviteId, entry);
      else lsAddPhoto(inviteId, entry);
      setName('');
      setCaption('');
      setFile(null);
      const input = document.getElementById(`guest-photo-file-${inviteId}`) as HTMLInputElement | null;
      if (input) input.value = '';
      showToast(config.requireApproval ? '사진을 보냈어요. 주인공의 승인을 기다려주세요' : '사진을 올렸어요');
      void refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '사진을 올리지 못했어요');
    } finally {
      setBusy(false);
    }
  }

  async function vote(photoId: string) {
    if (!config.allowVoting || hasVoted(photoId)) return;
    const entry: GuestPhotoVote = { id: newId('vote'), photoId, voterId, createdAt: timestamp() };
    try {
      if (isFirebaseEnabled()) await fbAddGuestPhotoVote(inviteId, entry);
      else if (!lsAddVote(inviteId, entry)) return;
      setVotes((current) => [...current, entry]);
      showToast('포토제닉 후보에 마음을 보탰어요');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '투표하지 못했어요');
    }
  }

  return (
    <section className="invite-section guest-photo-wall">
      <p className="section-title"><Camera size={13} /> GUEST PHOTO WALL</p>
      <h2 className="section-heading">{config.title || '오늘의 포토제닉'}</h2>
      <p className="guest-photo-intro">{config.intro || '오늘 찍은 사진을 한 장씩 남겨주세요.'}</p>

      {!isPreview && (
        <form className="guest-photo-form" onSubmit={submit}>
          <label className="guest-photo-upload" htmlFor={`guest-photo-file-${inviteId}`}>
            <ImagePlus size={19} />
            <span>{file ? file.name : '사진을 선택해주세요'}</span>
            <small>모바일 사진은 자동으로 가볍게 줄여요</small>
          </label>
          <input
            id={`guest-photo-file-${inviteId}`}
            className="visually-hidden"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <div className="guest-photo-form-row">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름" maxLength={20} aria-label="사진 올린 사람 이름" />
            <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="한 줄 메모 (선택)" maxLength={80} aria-label="사진 메모" />
          </div>
          <button className="guest-photo-submit" type="submit" disabled={busy}>
            {busy ? '사진 준비 중…' : '오늘의 사진 보내기'}
          </button>
        </form>
      )}

      <div className="guest-photo-grid">
        {visiblePhotos.length === 0 ? (
          <div className="guest-photo-empty"><Camera size={22} /><p>첫 번째 장면을 기다리고 있어요.</p><span>식이 끝난 뒤 사진을 올려주세요.</span></div>
        ) : visiblePhotos.map((photo) => (
          <figure className={`guest-photo-card${photo.featured ? ' is-featured' : ''}`} key={photo.id}>
            <div className="guest-photo-image-wrap">
              <img src={photo.image} alt={`${photo.name}님이 올린 사진`} loading="lazy" />
              {photo.featured && <span className="guest-photo-badge"><Star size={12} fill="currentColor" /> 주인공의 선택</span>}
            </div>
            <figcaption>
              <span><b>{photo.name}</b>{photo.caption && ` · ${photo.caption}`}</span>
              {config.allowVoting && (
                <button type="button" className={hasVoted(photo.id) ? 'is-voted' : ''} onClick={() => void vote(photo.id)} aria-label={`${photo.name}님의 사진 포토제닉 투표`}>
                  <Heart size={14} fill={hasVoted(photo.id) ? 'currentColor' : 'none'} /> {voteCount(photo.id)}
                </button>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {config.requireApproval && <p className="guest-photo-footnote"><Check size={13} /> 사진은 두 사람의 확인 후 공개돼요.</p>}
    </section>
  );
}
