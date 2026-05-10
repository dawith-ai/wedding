import type { WeddingData, ThemeId } from '../../types';
import { ThemePicker } from './ThemePicker';
import { CustomThemeEditor } from './CustomThemeEditor';
import { AiPhotoStudio } from './AiPhotoStudio';
import { AiVoiceStudio } from './AiVoiceStudio';
import { LifeEventsEditor } from './LifeEventsEditor';
import { OgCardGenerator } from './OgCardGenerator';
import { ImageUpload } from './ImageUpload';
import { PhotoListEditor } from './PhotoListEditor';
import { AccountEditor } from './AccountEditor';
import { EVENT_LIST, EVENT_LABELS, applyEventTemplate } from '../../data/events';
import { hasImgurClientId, setImgurClientId } from '../../lib/imgur';
import {
  getFirebaseConfig,
  isFirebaseEnabled,
  setFirebaseConfig,
} from '../../lib/firebase';
import { getKakaoKey, hasKakaoKey, setKakaoKey } from '../../lib/kakao';
import { useState } from 'react';

interface Props {
  data: WeddingData;
  onChange: (next: WeddingData) => void;
  onPublish: () => void;
}

export function BuilderForm({ data, onChange, onPublish }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [imgurId, setImgurId] = useState(localStorage.getItem('imgur_client_id') || '');
  const [kakaoKey, setKakaoKeyState] = useState(getKakaoKey());
  const [fb, setFb] = useState(
    getFirebaseConfig() || { apiKey: '', authDomain: '', projectId: '' }
  );

  function set<K extends keyof WeddingData>(k: K, v: WeddingData[K]) {
    onChange({ ...data, [k]: v });
  }

  return (
    <div className="builder-form">
      <div className="builder-toolbar">
        <h1>청첩장 만들기</h1>
        <button className="secondary" type="button" onClick={() => setShowSettings(true)}>설정</button>
        <button type="button" onClick={onPublish}>공유 링크 생성</button>
      </div>

      <div className="note-box">
        💡 입력하시는 모든 내용은 <b>이 브라우저에만</b> 저장됩니다. 공유 링크를 만들면 모든 정보가 URL에 인코딩되어 누구나 그 링크로 청첩장을 볼 수 있어요.
      </div>

      <h2>1. 어떤 행사인가요?</h2>
      <div className="event-type-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 24 }}>
        {EVENT_LIST.map((ev) => {
          const meta = EVENT_LABELS[ev];
          const active = (data.eventType ?? 'wedding') === ev;
          return (
            <button
              key={ev}
              type="button"
              onClick={() => onChange(applyEventTemplate(data, ev))}
              style={{
                background: active ? '#222' : '#fff',
                color: active ? '#fff' : '#333',
                border: `1px solid ${active ? '#222' : '#ddd'}`,
                borderRadius: 10,
                padding: '10px 6px',
                fontSize: 12,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22 }}>{meta.emoji}</div>
              <div style={{ marginTop: 4 }}>{meta.name}</div>
            </button>
          );
        })}
      </div>

      <h2>2. 테마 선택</h2>
      <ThemePicker value={data.theme} onChange={(id: ThemeId) => set('theme', id)} />
      <CustomThemeEditor onSelect={(id) => set('theme', id)} />

      <h2>3. 주인공 (신랑·신부)</h2>
      <div className="row-2">
        <div className="field">
          <label>신랑 이름</label>
          <input value={data.groom.name} onChange={(e) => set('groom', { ...data.groom, name: e.target.value })} />
        </div>
        <div className="field">
          <label>신부 이름</label>
          <input value={data.bride.name} onChange={(e) => set('bride', { ...data.bride, name: e.target.value })} />
        </div>
      </div>
      <div className="row-2">
        <div>
          <div className="field">
            <label>신랑 아버지</label>
            <input value={data.groom.father} onChange={(e) => set('groom', { ...data.groom, father: e.target.value })} />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={!!data.groom.fatherDeceased}
              onChange={(e) => set('groom', { ...data.groom, fatherDeceased: e.target.checked })}
            />
            故 표시
          </label>
          <div className="field">
            <label>신랑 어머니</label>
            <input value={data.groom.mother} onChange={(e) => set('groom', { ...data.groom, mother: e.target.value })} />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={!!data.groom.motherDeceased}
              onChange={(e) => set('groom', { ...data.groom, motherDeceased: e.target.checked })}
            />
            故 표시
          </label>
        </div>
        <div>
          <div className="field">
            <label>신부 아버지</label>
            <input value={data.bride.father} onChange={(e) => set('bride', { ...data.bride, father: e.target.value })} />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={!!data.bride.fatherDeceased}
              onChange={(e) => set('bride', { ...data.bride, fatherDeceased: e.target.checked })}
            />
            故 표시
          </label>
          <div className="field">
            <label>신부 어머니</label>
            <input value={data.bride.mother} onChange={(e) => set('bride', { ...data.bride, mother: e.target.value })} />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={!!data.bride.motherDeceased}
              onChange={(e) => set('bride', { ...data.bride, motherDeceased: e.target.checked })}
            />
            故 표시
          </label>
        </div>
      </div>

      <h2>4. 일시·장소</h2>
      <div className="row-2">
        <div className="field">
          <label>날짜</label>
          <input type="date" value={data.wedding.date} onChange={(e) => set('wedding', { ...data.wedding, date: e.target.value })} />
        </div>
        <div className="field">
          <label>시간</label>
          <input type="time" value={data.wedding.time} onChange={(e) => set('wedding', { ...data.wedding, time: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>예식장 이름</label>
        <input value={data.wedding.venue} onChange={(e) => set('wedding', { ...data.wedding, venue: e.target.value })} />
      </div>
      <div className="field">
        <label>층/홀 (선택)</label>
        <input value={data.wedding.venueDetail || ''} onChange={(e) => set('wedding', { ...data.wedding, venueDetail: e.target.value })} />
      </div>
      <div className="field">
        <label>주소</label>
        <input value={data.wedding.address} onChange={(e) => set('wedding', { ...data.wedding, address: e.target.value })} />
      </div>
      <div className="field">
        <label>예식장 전화번호 (선택)</label>
        <input value={data.wedding.phone || ''} onChange={(e) => set('wedding', { ...data.wedding, phone: e.target.value })} />
      </div>
      <div className="field">
        <label>카카오맵 링크 (선택, 비워두면 자동)</label>
        <input value={data.wedding.mapKakao || ''} onChange={(e) => set('wedding', { ...data.wedding, mapKakao: e.target.value })} />
      </div>
      <div className="field">
        <label>네이버지도 링크 (선택)</label>
        <input value={data.wedding.mapNaver || ''} onChange={(e) => set('wedding', { ...data.wedding, mapNaver: e.target.value })} />
      </div>
      <div className="field">
        <label>T맵 링크 (선택)</label>
        <input value={data.wedding.mapTmap || ''} onChange={(e) => set('wedding', { ...data.wedding, mapTmap: e.target.value })} />
      </div>

      <h2>5. 메인 사진 & 인사말</h2>
      <div className="field">
        <label>대표 사진 (세로 비율 권장)</label>
        <ImageUpload value={data.hero} onChange={(url) => set('hero', url)} aspectHint="세로 3:4 비율 추천" />
      </div>
      <AiPhotoStudio
        onPhotoReady={(dataUrl, action) => {
          if (action === 'hero') {
            set('hero', dataUrl);
          } else {
            set('gallery', [...data.gallery, dataUrl]);
          }
        }}
        onVideoReady={(videoUrl) => set('videoHero', videoUrl)}
      />
      <div className="field">
        <label>대표 영상 URL (선택, mp4/webm 직링크)</label>
        <input
          value={data.videoHero || ''}
          onChange={(e) => set('videoHero', e.target.value)}
          placeholder="https://...mp4"
        />
        <div className="hint" style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
          입력하면 지원 테마의 첫 화면에서 무음 반복 재생되고, 대표 사진은 포스터로 사용됩니다
        </div>
      </div>
      <div className="field">
        <label>인사말 제목</label>
        <input value={data.greeting.title} onChange={(e) => set('greeting', { ...data.greeting, title: e.target.value })} />
      </div>
      <div className="field">
        <label>인사말 본문</label>
        <textarea value={data.greeting.body} onChange={(e) => set('greeting', { ...data.greeting, body: e.target.value })} />
      </div>
      <AiVoiceStudio
        greetingText={data.greeting.body}
        onAttachAsBgm={(url) => set('bgm', url)}
      />

      <h2>6. 우리의 이야기 (선택)</h2>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.story.enabled}
          onChange={(e) => set('story', { ...data.story, enabled: e.target.checked })}
        />
        스토리 섹션 표시
      </label>
      {data.story.enabled && (
        <>
          <div className="field">
            <label>제목</label>
            <input value={data.story.title} onChange={(e) => set('story', { ...data.story, title: e.target.value })} />
          </div>
          <div className="field">
            <label>본문</label>
            <textarea value={data.story.body} onChange={(e) => set('story', { ...data.story, body: e.target.value })} />
          </div>
          <div className="field">
            <label>스토리 사진 (최대 4장)</label>
            <PhotoListEditor
              photos={data.story.photos}
              onChange={(photos) => set('story', { ...data.story, photos })}
              max={4}
            />
          </div>
        </>
      )}

      <h2>7. 갤러리</h2>
      <PhotoListEditor photos={data.gallery} onChange={(p) => set('gallery', p)} max={24} />

      <h2>8. 약도 이미지 (선택)</h2>
      <ImageUpload value={data.mapImage || ''} onChange={(url) => set('mapImage', url)} aspectHint="가로형 16:9 추천" />

      <h2>9. 마음 전하실 곳 (계좌)</h2>
      <div style={{ marginBottom: 18 }}>
        <p className="muted-text" style={{ marginBottom: 6 }}>신랑측</p>
        <AccountEditor list={data.accounts.groom} onChange={(groom) => set('accounts', { ...data.accounts, groom })} />
      </div>
      <div>
        <p className="muted-text" style={{ marginBottom: 6 }}>신부측</p>
        <AccountEditor list={data.accounts.bride} onChange={(bride) => set('accounts', { ...data.accounts, bride })} />
      </div>

      <h2>10. 방명록 / RSVP</h2>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.guestbook.enabled}
          onChange={(e) => set('guestbook', { enabled: e.target.checked })}
        />
        방명록 표시
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.rsvp.enabled}
          onChange={(e) => set('rsvp', { ...data.rsvp, enabled: e.target.checked })}
        />
        참석 의사(RSVP) 표시
      </label>
      {data.rsvp.enabled && (
        <div className="field">
          <label>RSVP 마감일 (선택)</label>
          <input type="date" value={data.rsvp.deadline || ''} onChange={(e) => set('rsvp', { ...data.rsvp, deadline: e.target.value })} />
        </div>
      )}
      {!isFirebaseEnabled() && (
        <p className="muted-text">
          ※ 방명록·RSVP는 기본적으로 보는 사람의 기기에만 저장됩니다. 모든 응답을 한 곳에 모으려면 설정에서 Firebase를 연결해주세요.
        </p>
      )}

      <h2>11. 배경음악 / 옵션</h2>
      <div className="field">
        <label>BGM URL (선택, mp3 직링크)</label>
        <input
          value={data.bgm || ''}
          onChange={(e) => set('bgm', e.target.value)}
          placeholder="https://...mp3"
        />
        <div className="hint" style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
          모바일에서는 자동재생이 막혀 있어 우측 상단 버튼으로 켜야 합니다
        </div>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.useCurtain}
          onChange={(e) => set('useCurtain', e.target.checked)}
        />
        커튼 인트로 사용
      </label>

      <h2>12. 식순 (예식 순서)</h2>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.timeline.enabled}
          onChange={(e) => set('timeline', { ...data.timeline, enabled: e.target.checked })}
        />
        식순 표시
      </label>
      {data.timeline.enabled && (
        <>
          <div className="field">
            <label>제목</label>
            <input
              value={data.timeline.title}
              onChange={(e) => set('timeline', { ...data.timeline, title: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {data.timeline.items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr 1fr auto',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                <input
                  placeholder="13:00"
                  value={it.time}
                  onChange={(e) => {
                    const items = data.timeline.items.map((x, idx) =>
                      idx === i ? { ...x, time: e.target.value } : x
                    );
                    set('timeline', { ...data.timeline, items });
                  }}
                  style={{ padding: '8px 10px', fontSize: 13 }}
                />
                <input
                  placeholder="순서"
                  value={it.label}
                  onChange={(e) => {
                    const items = data.timeline.items.map((x, idx) =>
                      idx === i ? { ...x, label: e.target.value } : x
                    );
                    set('timeline', { ...data.timeline, items });
                  }}
                  style={{ padding: '8px 10px', fontSize: 13 }}
                />
                <input
                  placeholder="비고 (선택)"
                  value={it.note || ''}
                  onChange={(e) => {
                    const items = data.timeline.items.map((x, idx) =>
                      idx === i ? { ...x, note: e.target.value } : x
                    );
                    set('timeline', { ...data.timeline, items });
                  }}
                  style={{ padding: '8px 10px', fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const items = data.timeline.items.filter((_, idx) => idx !== i);
                    set('timeline', { ...data.timeline, items });
                  }}
                  style={{ background: 'transparent', border: 0, color: '#b00', fontSize: 16 }}
                >×</button>
              </div>
            ))}
            <button
              type="button"
              className="add-row"
              onClick={() =>
                set('timeline', {
                  ...data.timeline,
                  items: [...data.timeline.items, { time: '', label: '', note: '' }],
                })
              }
            >
              + 순서 추가
            </button>
          </div>
        </>
      )}

      <h2>13. 셔틀버스 / 응원하기</h2>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.shuttle.enabled}
          onChange={(e) => set('shuttle', { ...data.shuttle, enabled: e.target.checked })}
        />
        셔틀버스 안내 표시
      </label>
      {data.shuttle.enabled && (
        <div className="field">
          <label>셔틀버스 안내 (운행 시간·정류장 등)</label>
          <textarea
            value={data.shuttle.info}
            onChange={(e) => set('shuttle', { ...data.shuttle, info: e.target.value })}
            placeholder={'서울역 출발 12:00 / 13:00\n예식장 출발 15:30 (신랑측 / 신부측)'}
          />
        </div>
      )}
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={data.likes.enabled}
          onChange={(e) => set('likes', { enabled: e.target.checked })}
        />
        응원하기(♥ 카운터) 표시
      </label>

      <h2>14. 평생 가족 페이지 (선택)</h2>
      <LifeEventsEditor
        enabled={data.lifeEvents?.enabled ?? false}
        title={data.lifeEvents?.title ?? '결혼 그 후'}
        intro={data.lifeEvents?.intro ?? ''}
        items={data.lifeEvents?.items ?? []}
        onChange={(next) => set('lifeEvents', next)}
      />

      <h2>15. 공유 정보 (메타)</h2>
      <div className="field">
        <label>공유 시 제목</label>
        <input value={data.meta.title} onChange={(e) => set('meta', { ...data.meta, title: e.target.value })} />
      </div>
      <div className="field">
        <label>공유 시 설명</label>
        <input value={data.meta.description} onChange={(e) => set('meta', { ...data.meta, description: e.target.value })} />
      </div>
      <div className="field">
        <label>공유 시 미리보기 이미지 URL (선택)</label>
        <input value={data.ogImage || ''} onChange={(e) => set('ogImage', e.target.value)} placeholder="https://..." />
        <div className="hint" style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
          비워두면 대표 사진을 그대로 사용. 아래 OG 카드 생성기로 자동 만들 수 있어요.
        </div>
      </div>
      <OgCardGenerator data={data} onChange={(url) => set('ogImage', url)} />

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>환경설정</h3>
            <p className="muted-text" style={{ marginBottom: 18 }}>
              브라우저에만 저장되며 청첩장 데이터에 포함되지 않습니다.
            </p>

            <h4 style={{ margin: '0 0 6px', fontSize: 13 }}>Imgur Client ID (이미지 업로드)</h4>
            <p className="muted-text" style={{ marginBottom: 6 }}>
              <a href="https://api.imgur.com/oauth2/addclient" target="_blank" rel="noopener" style={{ color: '#3a6' }}>
                imgur 개발자 센터
              </a>에서 무료 발급. "Anonymous usage without user authorization" 선택.
            </p>
            <input
              value={imgurId}
              onChange={(e) => setImgurId(e.target.value)}
              placeholder="546c2..."
              style={{
                width: '100%', background: '#fafafa', border: '1px solid #e2e2e2',
                borderRadius: 6, padding: '10px 12px', fontSize: 13, marginBottom: 18,
              }}
            />

            <h4 style={{ margin: '0 0 6px', fontSize: 13 }}>Kakao JavaScript Key (카카오톡 공유)</h4>
            <p className="muted-text" style={{ marginBottom: 6 }}>
              <a href="https://developers.kakao.com/console/app" target="_blank" rel="noopener" style={{ color: '#3a6' }}>
                카카오 디벨로퍼스
              </a>에서 앱 등록 → JavaScript 키 복사. 플랫폼 → Web → 사이트 도메인에 배포 URL 등록 필요.
            </p>
            <input
              value={kakaoKey}
              onChange={(e) => setKakaoKeyState(e.target.value)}
              placeholder="abc123def456..."
              style={{
                width: '100%', background: '#fafafa', border: '1px solid #e2e2e2',
                borderRadius: 6, padding: '10px 12px', fontSize: 13, marginBottom: 18,
              }}
            />

            <h4 style={{ margin: '0 0 6px', fontSize: 13 }}>Firebase Firestore (방명록·RSVP 공유)</h4>
            <p className="muted-text" style={{ marginBottom: 6 }}>
              Firestore 보안 규칙을 공개 read/write로 설정해야 합니다 (개인 청첩장이라 무방).
            </p>
            <input
              value={fb.apiKey}
              onChange={(e) => setFb({ ...fb, apiKey: e.target.value })}
              placeholder="apiKey"
              style={{ width: '100%', background: '#fafafa', border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 10px', fontSize: 12, marginBottom: 6 }}
            />
            <input
              value={fb.authDomain}
              onChange={(e) => setFb({ ...fb, authDomain: e.target.value })}
              placeholder="authDomain"
              style={{ width: '100%', background: '#fafafa', border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 10px', fontSize: 12, marginBottom: 6 }}
            />
            <input
              value={fb.projectId}
              onChange={(e) => setFb({ ...fb, projectId: e.target.value })}
              placeholder="projectId"
              style={{ width: '100%', background: '#fafafa', border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 10px', fontSize: 12, marginBottom: 6 }}
            />

            <div className="actions">
              <button onClick={() => setShowSettings(false)}>닫기</button>
              <button
                className="primary"
                onClick={() => {
                  setImgurClientId(imgurId);
                  setKakaoKey(kakaoKey);
                  if (fb.apiKey && fb.projectId) {
                    setFirebaseConfig(fb);
                  } else {
                    setFirebaseConfig(null);
                  }
                  setShowSettings(false);
                }}
              >
                저장
              </button>
            </div>
            <p className="muted-text" style={{ marginTop: 14 }}>
              현재 상태: 이미지 업로드 {hasImgurClientId() ? '✓' : '✗'} · 카카오톡 공유{' '}
              {hasKakaoKey() ? '✓' : '✗'} · Firebase{' '}
              {isFirebaseEnabled() ? '✓' : '✗ (이 기기에만 저장)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
