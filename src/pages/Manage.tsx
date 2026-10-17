import { useMemo, useState } from 'react';
import { CalendarDays, Check, Copy, Database, ExternalLink, Heart, Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildShareUrl } from '../lib/encode';
import { showToast } from '../lib/toast';
import { listPublishedInvitations, removePublishedInvitation } from '../lib/storage';
import type { PublishedInvitation } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

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

export function Manage() {
  const [items, setItems] = useState(() => listPublishedInvitations());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const countLabel = useMemo(() => `${items.length}개의 초대장`, [items.length]);

  async function copyUrl(invitation: PublishedInvitation) {
    const url = publicUrl(invitation);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(invitation.coupleId);
      showToast('커플 전용 링크를 복사했어요');
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      showToast('복사하지 못했어요. 미리보기에서 주소를 복사해주세요.');
    }
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
                  <Button type="button" variant="ghost" size="sm" className="manage-action manage-action-danger" onClick={() => remove(invitation)}><Trash2 size={15} /> 목록에서 삭제</Button>
                </CardContent>
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
