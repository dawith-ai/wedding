import { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronDown, Copy, Database, Download, ExternalLink, Heart, MessageCircle, Pencil, Plus, Star, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildShareUrl } from '../lib/encode';
import { showToast } from '../lib/toast';
import { listGuestPhotoVotes, listGuestPhotos, listGuestbook, listPublishedInvitations, listRsvp, removeGuestPhoto, removePublishedInvitation, updateGuestPhoto } from '../lib/storage';
import { fbDeleteGuestPhoto, fbListGuestPhotoVotes, fbListGuestPhotos, fbListGuestbook, fbListRsvp, fbUpdateGuestPhoto, setFirebaseConfig } from '../lib/firebase';
import { downloadCsv } from '../lib/csv';
import type { GuestPhoto, GuestPhotoVote, GuestbookEntry, PublishedInvitation, RsvpEntry } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { copyText } from '../lib/clipboard';

function formatDate(value: string): string {
  if (!value) return '날짜 미정';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function publicUrl(invitation: PublishedInvitation): string {
  return buildShareUrl(invitation.encoded, invitation.coupleId);
}

interface ResponseData {
  rsvps: RsvpEntry[];
  guestbook: GuestbookEntry[];
  photos: GuestPhoto[];
  votes: GuestPhotoVote[];
}

export function Manage() {
  const [items, setItems] = useState(() => listPublishedInvitations());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<Record<string, ResponseData>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const countLabel = useMemo(() => `${items.length}개의 초대장`, [items.length]);

  async function copyUrl(invitation: PublishedInvitation) {
    const url = publicUrl(invitation);
    if (await copyText(url)) {
      setCopiedId(invitation.coupleId);
      showToast('커플 전용 링크를 복사했어요');
      window.setTimeout(() => setCopiedId(null), 1800);
    } else {
      showToast('복사하지 못했어요. 미리보기에서 주소를 복사해주세요.');
    }
  }

  async function loadResponses(invitation: PublishedInvitation) {
    if (openId === invitation.coupleId) {
      setOpenId(null);
      return;
    }
    setOpenId(invitation.coupleId);
    if (responseData[invitation.coupleId]) return;

    setLoadingId(invitation.coupleId);
    try {
      const remote = Boolean(invitation.data.firebase?.apiKey && invitation.data.firebase.projectId);
      if (remote) setFirebaseConfig(invitation.data.firebase!);
      const [rsvps, guestbook, photos, votes] = remote
        ? await Promise.all([
            fbListRsvp(invitation.coupleId),
            fbListGuestbook(invitation.coupleId),
            fbListGuestPhotos(invitation.coupleId),
            fbListGuestPhotoVotes(invitation.coupleId),
          ])
        : [
            listRsvp(invitation.coupleId),
            listGuestbook(invitation.coupleId),
            listGuestPhotos(invitation.coupleId),
            listGuestPhotoVotes(invitation.coupleId),
          ];
      setResponseData((current) => ({ ...current, [invitation.coupleId]: { rsvps, guestbook, photos, votes } }));
    } catch (error) {
      showToast(error instanceof Error ? error.message : '응답을 불러오지 못했어요');
    } finally {
      setLoadingId(null);
    }
  }

  async function updatePhoto(invitation: PublishedInvitation, photo: GuestPhoto, patch: Partial<GuestPhoto>) {
    try {
      const remote = Boolean(invitation.data.firebase?.apiKey && invitation.data.firebase.projectId);
      if (remote) {
        setFirebaseConfig(invitation.data.firebase!);
        await fbUpdateGuestPhoto(invitation.coupleId, photo.id, patch);
      } else {
        updateGuestPhoto(invitation.coupleId, photo.id, patch);
      }
      setResponseData((current) => ({
        ...current,
        [invitation.coupleId]: {
          ...current[invitation.coupleId],
          photos: current[invitation.coupleId].photos.map((item) => item.id === photo.id ? { ...item, ...patch } : item),
        },
      }));
      showToast(patch.featured ? '포토제닉으로 선정했어요' : patch.approved ? '사진을 공개했어요' : '사진 상태를 바꿨어요');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '사진 상태를 바꾸지 못했어요');
    }
  }

  async function deletePhoto(invitation: PublishedInvitation, photo: GuestPhoto) {
    if (!confirm('이 하객 사진을 삭제할까요?')) return;
    try {
      const remote = Boolean(invitation.data.firebase?.apiKey && invitation.data.firebase.projectId);
      if (remote) {
        setFirebaseConfig(invitation.data.firebase!);
        await fbDeleteGuestPhoto(invitation.coupleId, photo.id);
      } else {
        removeGuestPhoto(invitation.coupleId, photo.id);
      }
      setResponseData((current) => ({
        ...current,
        [invitation.coupleId]: {
          ...current[invitation.coupleId],
          photos: current[invitation.coupleId].photos.filter((item) => item.id !== photo.id),
        },
      }));
      showToast('사진을 삭제했어요');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '사진을 삭제하지 못했어요');
    }
  }

  function exportRsvps(invitation: PublishedInvitation, entries: RsvpEntry[]) {
    downloadCsv(
      `rsvp-${invitation.groomName}-${invitation.brideName}.csv`,
      ['이름', '측', '참석', '인원', '식사', '연락처', '메시지', '응답일시'],
      entries.map((entry) => ({
        이름: entry.name,
        측: entry.side === 'groom' ? invitation.groomName : invitation.brideName,
        참석: entry.attending === 'yes' ? '참석' : '불참',
        인원: entry.count,
        식사: entry.meal === 'yes' ? '식사' : entry.meal === 'no' ? '식사 안 함' : '미정',
        연락처: entry.phone,
        메시지: entry.message,
        응답일시: new Date(entry.createdAt).toLocaleString('ko-KR'),
      })),
    );
    showToast('RSVP 목록을 CSV로 저장했어요');
  }

  function exportGuestbook(invitation: PublishedInvitation, entries: GuestbookEntry[]) {
    downloadCsv(
      `guestbook-${invitation.groomName}-${invitation.brideName}.csv`,
      ['이름', '메시지', '작성일시'],
      entries.map((entry) => ({
        이름: entry.name,
        메시지: entry.message,
        작성일시: new Date(entry.createdAt).toLocaleString('ko-KR'),
      })),
    );
    showToast('방명록을 CSV로 저장했어요');
  }

  function remove(invitation: PublishedInvitation) {
    if (!confirm(`${invitation.groomName} · ${invitation.brideName} 초대장을 목록에서 삭제할까요?`)) return;
    if (removePublishedInvitation(invitation.coupleId)) {
      setItems((current) => current.filter((item) => item.coupleId !== invitation.coupleId));
      showToast('관리 목록에서 삭제했어요. 이미 공유된 링크는 계속 열립니다.');
    }
  }

  return (
    <main className="manage-shell">
      <header className="manage-nav">
        <Link to="/" className="manage-brand">
          <span className="manage-brand-mark"><Heart size={14} fill="currentColor" /></span>
          <span>moment<span className="manage-brand-dot">.</span></span>
        </Link>
        <Button asChild size="sm" className="manage-new-link"><Link to="/builder"><Plus size={16} /> 새 초대장</Link></Button>
      </header>

      <section className="manage-hero">
        <div>
          <p className="manage-eyebrow"><Database size={14} /> couple workspace</p>
          <h1>내 초대장<br /><em>배포 보관함</em></h1>
          <p>커플마다 다른 공개 링크와 데이터 공간을 관리합니다.<br />브라우저에 저장된 초대장은 이 기기에서만 보입니다.</p>
        </div>
        <Card className="manage-hero-note">
          <CardHeader>
            <Badge tone="coral">WORKSPACE</Badge>
          </CardHeader>
          <CardContent>
          <strong>{countLabel}</strong>
          <span>새로 발행할 때마다<br />고유한 couple ID가 만들어져요.</span>
          </CardContent>
        </Card>
      </section>

      <section className="manage-list" aria-label="배포된 초대장 목록">
        {items.length === 0 ? (
          <div className="manage-empty">
            <div className="manage-empty-icon"><Heart size={23} /></div>
            <h2>아직 배포한 초대장이 없어요.</h2>
            <p>첫 초대장을 만들고 커플 전용 링크를 발행해보세요.</p>
            <Button asChild className="manage-primary-link"><Link to="/builder"><Plus size={16} /> 초대장 만들기</Link></Button>
          </div>
        ) : (
          items.map((invitation) => {
            const url = publicUrl(invitation);
            return (
              <Card className="manage-card" key={invitation.coupleId}>
                <div className="manage-card-top">
                  <div>
                    <span className="manage-card-label">PUBLIC INVITATION</span>
                    <h2>{invitation.groomName} <i>♥</i> {invitation.brideName}</h2>
                  </div>
                  <Badge tone="success"><Check size={13} /> LIVE</Badge>
                </div>
                <div className="manage-card-meta">
                  <span><CalendarDays size={15} /> {formatDate(invitation.date)}</span>
                  <span className="manage-couple-id">{invitation.coupleId}</span>
                </div>
                <div className="manage-url" title={url}>{url}</div>
                <CardContent className="manage-card-actions">
                  <a href={url} target="_blank" rel="noopener" className="manage-action manage-action-primary"><ExternalLink size={15} /> 초대장 열기</a>
                  <Link to={`/builder?invite=${encodeURIComponent(invitation.coupleId)}`} className="manage-action"><Pencil size={15} /> 수정</Link>
                  <Button type="button" variant="outline" size="sm" className="manage-action" onClick={() => copyUrl(invitation)}>
                    {copiedId === invitation.coupleId ? <Check size={15} /> : <Copy size={15} />}
                    {copiedId === invitation.coupleId ? '복사됨' : '링크 복사'}
                  </Button>
                  <Button type="button" variant="soft" size="sm" className="manage-action" onClick={() => void loadResponses(invitation)}>
                    <Users size={15} /> 응답 관리 <ChevronDown size={14} className={openId === invitation.coupleId ? 'manage-chevron-open' : ''} />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="manage-action manage-action-danger" onClick={() => remove(invitation)}><Trash2 size={15} /> 목록에서 삭제</Button>
                </CardContent>
                {openId === invitation.coupleId && (
                  <div className="manage-responses">
                    {loadingId === invitation.coupleId ? <p className="manage-response-loading">응답을 불러오는 중…</p> : (() => {
                      const records = responseData[invitation.coupleId];
                      if (!records) return null;
                      const attending = records.rsvps.filter((entry) => entry.attending === 'yes');
                      const people = attending.reduce((sum, entry) => sum + entry.count, 0);
                      return (
                        <>
                          <div className="manage-response-head">
                            <div>
                              <span className="manage-card-label">RESPONSE DESK</span>
                              <strong>{attending.length}명 참석 · 총 {people}자리</strong>
                            </div>
                            <span className="manage-response-count"><MessageCircle size={14} /> 방명록 {records.guestbook.length} · 사진 {records.photos.length}</span>
                          </div>
                          <div className="manage-response-actions">
                            <Button type="button" variant="outline" size="sm" onClick={() => exportRsvps(invitation, records.rsvps)}><Download size={14} /> RSVP CSV</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => exportGuestbook(invitation, records.guestbook)}><Download size={14} /> 방명록 CSV</Button>
                          </div>
                          {records.rsvps.length === 0 && records.guestbook.length === 0 && records.photos.length === 0 ? (
                            <p className="manage-response-empty">아직 도착한 응답이 없어요. Firebase를 연결하면 방문자의 응답이 이곳에 모입니다.</p>
                          ) : (
                            <div className="manage-response-preview">
                              {records.rsvps.slice(0, 5).map((entry) => (
                                <div key={entry.id}><span>{entry.name}</span><span>{entry.attending === 'yes' ? `참석 ${entry.count}명` : '불참'}</span></div>
                              ))}
                            </div>
                          )}
                          {records.photos.length > 0 && (
                            <div className="manage-photo-desk">
                              <div className="manage-photo-desk-head">
                                <strong><Star size={14} /> 하객 사진 수집함</strong>
                                <span>{records.photos.filter((photo) => photo.approved).length} 공개 · {records.photos.filter((photo) => !photo.approved).length} 대기</span>
                              </div>
                              <div className="manage-photo-grid">
                                {records.photos.map((photo) => (
                                  <div className={`manage-photo-item${photo.featured ? ' is-featured' : ''}`} key={photo.id}>
                                    <img src={photo.image} alt="" />
                                    <div className="manage-photo-info"><b>{photo.name}</b><span>{photo.caption || '메모 없음'} · ♥ {records.votes.filter((vote) => vote.photoId === photo.id).length}</span></div>
                                    <div className="manage-photo-actions">
                                      <Button type="button" variant={photo.approved ? 'soft' : 'outline'} size="sm" onClick={() => void updatePhoto(invitation, photo, { approved: !photo.approved })}>{photo.approved ? '공개됨' : '승인'}</Button>
                                      <Button type="button" variant={photo.featured ? 'soft' : 'ghost'} size="sm" onClick={() => void updatePhoto(invitation, photo, { featured: !photo.featured })}><Star size={13} fill={photo.featured ? 'currentColor' : 'none'} /></Button>
                                      <Button type="button" variant="ghost" size="sm" className="manage-action-danger" onClick={() => void deletePhoto(invitation, photo)}>삭제</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </section>

      <footer className="manage-footer">
        <Link to="/">← 홈으로</Link>
        <span>데이터는 기본적으로 이 브라우저에 저장됩니다.</span>
        <Link to="/privacy">개인정보 처리방침</Link>
      </footer>
    </main>
  );
}
