import { useEffect, useRef, useState } from 'react';
import {
  VOICES,
  blobToObjectUrl,
  downloadBlob,
  getOpenAiKey,
  hasOpenAiKey,
  setOpenAiKey,
  synthesizeSpeech,
} from '../../lib/aiVoice';
import type { TtsVoice } from '../../lib/aiVoice';
import { showToast } from '../../lib/toast';

interface Props {
  greetingText: string;
  onAttachAsBgm?: (url: string) => void;
}

export function AiVoiceStudio({ greetingText, onAttachAsBgm }: Props) {
  const [open, setOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(getOpenAiKey());
  const [showKey, setShowKey] = useState(!hasOpenAiKey());
  const [voice, setVoice] = useState<TtsVoice>('nova');
  const [speed, setSpeed] = useState(1.0);
  const [overrideText, setOverrideText] = useState('');
  const [busy, setBusy] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function saveKey() {
    setOpenAiKey(keyInput);
    showToast(keyInput.trim() ? 'API 키 저장됨' : 'API 키 삭제됨');
    if (keyInput.trim()) setShowKey(false);
  }

  async function generate() {
    const text = overrideText.trim() || greetingText.trim();
    if (!text) {
      showToast('인사말 본문이 비어 있어요. 직접 입력하거나 위 인사말 본문을 작성해주세요.');
      return;
    }
    if (!hasOpenAiKey()) {
      setShowKey(true);
      showToast('OpenAI API 키부터 입력해주세요');
      return;
    }
    setBusy(true);
    setAudioUrl('');
    setAudioBlob(null);
    try {
      const blob = await synthesizeSpeech({ text, voice, speed });
      const url = blobToObjectUrl(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
      showToast('음성 생성 완료. 미리듣기 후 다운로드해서 호스팅하세요');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!audioBlob) return;
    downloadBlob(audioBlob, `voice-greeting-${Date.now()}.mp3`);
  }

  if (!open) {
    return (
      <div style={{ marginTop: 12, padding: 12, background: '#f0f7ff', border: '1px dashed #93c5fd', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: '#1e3a8a' }}>
            🎙️ <b>본인 목소리로 인사말</b> — 인사말 텍스트 → 한국어 음성 mp3로 변환
          </div>
          <button type="button" onClick={() => setOpen(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}>
            AI 음성 스튜디오 열기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12, padding: 16, background: '#fff', border: '1px solid #93c5fd', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>🎙️ AI 음성 스튜디오</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>×</button>
      </div>

      {(showKey || !hasOpenAiKey()) && (
        <div style={{ marginBottom: 14, padding: 10, background: '#fffbe9', border: '1px solid #f0d97a', borderRadius: 6 }}>
          <p style={{ fontSize: 12, color: '#7a5a14', margin: '0 0 6px' }}>
            OpenAI에서 API 키 발급:{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>
              platform.openai.com/api-keys
            </a>
            {' '}— 1분 음성 약 $0.015 (TTS-HD)
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-...로 시작하는 키"
              style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}
            />
            <button type="button" onClick={saveKey} style={primaryBtn()}>저장</button>
          </div>
          <p style={{ fontSize: 11, color: '#999', margin: '6px 0 0' }}>
            ※ 키는 이 브라우저에만 저장됩니다 (서버 전송 없음)
          </p>
        </div>
      )}

      {hasOpenAiKey() && !showKey && (
        <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
          ✓ API 키 저장됨 · <button type="button" onClick={() => setShowKey(true)} style={linkBtn()}>키 변경</button>
        </p>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>1. 음성 선택</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
            {VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVoice(v.id)}
                style={{
                  background: voice === v.id ? '#2563eb' : '#fff',
                  color: voice === v.id ? '#fff' : '#333',
                  border: `1px solid ${voice === v.id ? '#2563eb' : '#ddd'}`,
                  padding: '8px',
                  fontSize: 11,
                  borderRadius: 6,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 600 }}>{v.label}</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>{v.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>2. 변환할 인사말</label>
          <textarea
            value={overrideText}
            onChange={(e) => setOverrideText(e.target.value)}
            placeholder={greetingText ? `(비워두면 위 인사말 본문 사용:\n"${greetingText.slice(0, 80)}…")` : '인사말 본문을 입력해주세요'}
            style={{ width: '100%', minHeight: 80, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, color: '#666' }}>속도</label>
          <input
            type="range"
            min={0.7}
            max={1.3}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 12, color: '#666', minWidth: 32 }}>{speed.toFixed(2)}x</span>
        </div>

        <button type="button" onClick={generate} disabled={busy} style={primaryBtn(busy)}>
          {busy ? '생성 중… (5~15초)' : '🎤 음성 생성'}
        </button>

        {audioUrl && (
          <div style={{ padding: 10, background: '#f9fafb', borderRadius: 6 }}>
            <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={download} style={primaryBtn()}>mp3 다운로드</button>
              {onAttachAsBgm && (
                <button type="button" onClick={() => onAttachAsBgm(audioUrl)} style={secondaryBtn()}>
                  미리보기에 BGM으로 (이 브라우저만)
                </button>
              )}
              <button type="button" onClick={generate} style={secondaryBtn()}>다시 생성</button>
            </div>
            <p style={{ fontSize: 10, color: '#666', margin: '8px 0 0', lineHeight: 1.5 }}>
              📌 <b>공유 링크에 음성을 포함하려면</b> mp3를 다운로드한 뒤 <a href="https://imgur.com" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Imgur</a>·<a href="https://www.dropbox.com" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Dropbox</a>·<a href="https://drive.google.com" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Google Drive</a>에 업로드하고 직링크를 BGM URL 필드에 붙여넣으세요. (브라우저 blob URL은 다른 기기에서 재생 불가)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function primaryBtn(disabled?: boolean): React.CSSProperties {
  return {
    background: disabled ? '#93c5fd' : '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    fontSize: 13,
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

function secondaryBtn(): React.CSSProperties {
  return {
    background: '#fff',
    color: '#2563eb',
    border: '1px solid #2563eb',
    padding: '8px 14px',
    fontSize: 12,
    borderRadius: 6,
    cursor: 'pointer',
  };
}

function linkBtn(): React.CSSProperties {
  return {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 11,
    padding: 0,
  };
}
