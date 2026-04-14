import { FLAVORS } from '../data/products';
import { FlavorIcon } from '../utils';

export default function FlavorSubModal({ open, title, currentFlavor, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="sub-ov open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sub-modal">
        <div className="sub-hdr">
          <div className="sub-title">{title}</div>
          <button className="sub-x" onClick={onClose}>×</button>
        </div>
        <div className="sub-fg">
          {FLAVORS.map(f => (
            <div
              key={f.key}
              className={`sfi${currentFlavor === f.name ? ' selected' : ''}`}
              onClick={() => onSelect(f.name)}
            >
              <FlavorIcon f={f} sz={52} />
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--brown)', textAlign: 'center' }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
