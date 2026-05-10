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
import {
  cloneVoice,
  getClonedVoiceId,
  getElevenKey,
  hasElevenKey,
  setClonedVoiceId,
  setElevenKey,
  speakWithClone,
} from '../../lib/elevenlabs';
import { showToast } from '../../lib/toast';

interface Props {
  greetingText: string;
  onAttachAsBgm?: (url: string) => void;
}

type Mode = 'openai' | 'eleven';

export function AiVoiceStudio({ greetingText, onAttachAsBgm }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('openai');
  const [keyInput, setKeyInput] = useState(getOpenAiKey());
  const [showKey, setShowKey] = useState(!hasOpenAiKey());
  const [voice, setVoice] = useState<TtsVoice>('nova');
  const [speed, setSpeed] = useState(1.0);
  const [overrideText, setOverrideText] = useState('');
  const [busy, setBusy] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ElevenLabs state
  const [elevenKeyInput, setElevenKeyInput] = useState(getElevenKey());
  const [showElevenKey, setShowElevenKey] = useState(!hasElevenKey());
  const [voiceName, setVoiceName] = useState('내 청첩장 목소리');
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [clonedVoiceId, setClonedVoiceIdState] = useState(getClonedVoiceId());
  const [cloning, setCloning] = useState(false);

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
    if (mode === 'openai' && !hasOpenAiKey()) {
      setShowKey(true);
      showToast('OpenAI API 키부터 입력해주세요');
      return;
    }
    if (mode === 'eleven' && (!hasElevenKey() || !clonedVoiceId)) {
      showToast('먼저 본인 목소리를 클로닝해주세요');
      return;
    }
    setBusy(true);
    setAudioUrl('');
    setAudioBlob(null);
    try {
      let blob: Blob;
      if (mode === 'openai') {
        blob = await synthesizeSpeech({ text, voice, speed });
      } else {
        blob = await speakWithClone({ voiceId: clonedVoiceId, text });
      }
      const url = blobToObjectUrl(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
      showToast('음성 생성 완료');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function saveElevenKey() {
    setElevenKey(elevenKeyInput);
    showToast(elevenKeyInput.trim() ? 'ElevenLabs 키 저장됨' : 'ElevenLabs 키 삭제됨');
    if (elevenKeyInput.trim()) setShowElevenKey(false);
  }

  async function performClone() {
    if (!hasElevenKey()) {
      setShowElevenKey(true);
      showToast('ElevenLabs API 키부터 입력해주세요');
      return;
    }
    if (sampleFiles.length === 0) {
      showToast('샘플 음성 파일을 1개 이상 선택해주세요 (30초~3분 권장)');
      return;
    }
    setCloning(true);
    try {
      const id = await cloneVoice({ name: voiceName, files: sampleFiles });
      setClonedVoiceIdState(id);
      showToast('클로닝 완료. 이제 인사말을 본인 목소리로 변환할 수 있어요');
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setCloning(false);
    }
  }

  function clearClone() {
    if (!confirm('저장된 voice ID를 삭제할까요? (ElevenLabs 계정에는 남아있어요)')) return;
    setClonedVoiceId('');
    setClonedVoiceIdState('');
    showToast('voice ID 삭제됨');
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

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: '1px solid #eee' }}>
        {(['openai', 'eleven'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              background: mode === m ? '#2563eb' : 'transparent',
              color: mode === m ? '#fff' : '#666',
              border: 'none',
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
              borderRadius: '6px 6px 0 0',
            }}
          >
            {m === 'openai' ? 'OpenAI TTS (6 보이스)' : '✨ ElevenLabs 클로닝 (본인 목소리)'}
          </button>
        ))}
      </div>

      {mode === 'openai' && (showKey || !hasOpenAiKey()) && (
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
        </div>
      )}

      {mode === 'openai' && hasOpenAiKey() && !showKey && (
        <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
          ✓ OpenAI 키 저장됨 · <button type="button" onClick={() => setShowKey(true)} style={linkBtn()}>키 변경</button>
        </p>
      )}

      {mode === 'eleven' && (
        <div style={{ marginBottom: 14 }}>
          {(showElevenKey || !hasElevenKey()) && (
            <div style={{ marginBottom: 10, padding: 10, background: '#fffbe9', border: '1px solid #f0d97a', borderRadius: 6 }}>
              <p style={{ fontSize: 12, color: '#7a5a14', margin: '0 0 6px' }}>
                ElevenLabs에서 API 키 발급:{' '}
                <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>
                  elevenlabs.io/app/settings/api-keys
                </a>
                {' '}— Starter 플랜($5/월)부터 voice cloning 가능, 1분 한국어 음성 약 1,000자
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="password"
                  value={elevenKeyInput}
                  onChange={(e) => setElevenKeyInput(e.target.value)}
                  placeholder="sk_..."
                  style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}
                />
                <button type="button" onClick={saveElevenKey} style={primaryBtn()}>저장</button>
              </div>
            </div>
          )}
          {hasElevenKey() && !showElevenKey && (
            <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>
              ✓ ElevenLabs 키 저장됨 · <button type="button" onClick={() => setShowElevenKey(true)} style={linkBtn()}>키 변경</button>
            </p>
          )}

          {!clonedVoiceId ? (
            <div style={{ padding: 12, background: '#fafafa', border: '1px dashed #ddd', borderRadius: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px' }}>1단계: 본인 목소리 클로닝</p>
              <p style={{ fontSize: 11, color: '#666', margin: '0 0 10px', lineHeight: 1.5 }}>
                30초~3분 분량의 본인 음성 샘플 (mp3/wav)을 업로드하세요. 한국어 또는 영어 둘 다 OK. 깨끗한 환경에서 자연스럽게 말한 샘플이 가장 좋습니다.
              </p>
              <input
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="목소리 이름 (예: 신랑 김민수)"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 12, marginBottom: 8 }}
              />
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={(e) => setSampleFiles(Array.from(e.target.files || []))}
                style={{ fontSize: 12, marginBottom: 8 }}
              />
              {sampleFiles.length > 0 && (
                <p style={{ fontSize: 11, color: '#666', margin: '0 0 8px' }}>{sampleFiles.length}개 파일 선택됨</p>
              )}
              <button type="button" onClick={performClone} disabled={cloning} style={{ ...primaryBtn(cloning), width: '100%' }}>
                {cloning ? '클로닝 중… (10~30초)' : '🎙️ 내 목소리 클로닝'}
              </button>
            </div>
          ) : (
            <div style={{ padding: 10, background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 6, marginBottom: 10 }}>
              <p style={{ fontSize: 12, color: '#065f46', margin: 0 }}>
                ✓ 본인 목소리 클로닝 완료 (Voice ID: <code style={{ fontSize: 10 }}>{clonedVoiceId.slice(0, 12)}…</code>)
                {' · '}<button type="button" onClick={clearClone} style={linkBtn()}>다시 클로닝</button>
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {mode === 'openai' && (
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
        )}

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 6 }}>2. 변환할 인사말</label>
          <textarea
            value={overrideText}
            onChange={(e) => setOverrideText(e.target.value)}
            placeholder={greetingText ? `(비워두면 위 인사말 본문 사용:\n"${greetingText.slice(0, 80)}…")` : '인사말 본문을 입력해주세요'}
            style={{ width: '100%', minHeight: 80, padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}
          />
        </div>

        {mode === 'openai' && (
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
        )}

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
