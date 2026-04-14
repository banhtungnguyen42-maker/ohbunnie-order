export const money = (n) => (n || 0).toLocaleString('vi-VN') + 'đ';

export const genId = () => 'i' + Date.now() + Math.random().toString(36).slice(2, 5);

export const genOId = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const t = d.getTime().toString().slice(-5);
  return `OHB-${y}${m}${day}-${t}`;
};

export const fHtml = (f, sz = 58) =>
  `<div style="width:${sz}px;height:${sz}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${Math.round(sz * 0.44)}px;background:${f.color}">${f.emoji}</div>`;

// JSX version of flavor icon
export const FlavorIcon = ({ f, sz = 58 }) => (
  <div style={{
    width: sz, height: sz,
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: Math.round(sz * 0.44),
    background: f.color,
  }}>
    {f.emoji}
  </div>
);
