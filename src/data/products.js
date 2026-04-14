export const FLAVORS = [
  { key: 'chanh_day',   name: 'Chanh dây',    emoji: '🍋', color: '#fef3c7' },
  { key: 'kiwi',        name: 'Kiwi',          emoji: '🥝', color: '#dcfce7' },
  { key: 'viet_quat',   name: 'Việt quất',     emoji: '🫐', color: '#ede9fe' },
  { key: 'dau',         name: 'Dâu',           emoji: '🍓', color: '#fce7f3' },
  { key: 'milo',        name: 'Milo',          emoji: '🍫', color: '#fef3c7' },
  { key: 'phuc_bon_tu', name: 'Phúc bồn tử',  emoji: '🍇', color: '#f3e8ff' },
  { key: 'dao',         name: 'Đào',           emoji: '🍑', color: '#ffedd5' },
];

export const META = {
  jar50:  { name: 'Panna Cotta 50ml',           price: 10000,  type: 'jar',  size: '50ml',  emoji: '🍮', desc: 'Hũ nhỏ xinh. Mua 5 hũ cùng size tặng 1, mua 10 tặng 2!' },
  jar100: { name: 'Panna Cotta 100ml',          price: 15000,  type: 'jar',  size: '100ml', emoji: '🥛', desc: 'Hũ vừa đủ đã. Mua 5 hũ cùng size tặng 1, mua 10 tặng 2!' },
  jar500: { name: 'Panna Cotta 500ml',          price: 65000,  type: 'jar',  size: '500ml', emoji: '🫙', desc: 'Hũ lớn cho cả gia đình.' },
  mini4:  { name: 'Mini Vuông 4',               price: 109000, type: 'set',  slots: 4,      emoji: '🎁', desc: 'Set 4 hũ mini vuông — chọn 4 vị cho 4 ô nhé!' },
  mini6:  { name: 'Mini Vuông 6',               price: 139000, type: 'set',  slots: 6,      emoji: '🎀', desc: 'Set 6 hũ mini vuông — chọn 6 vị tuỳ thích!' },
  box4:   { name: 'Box of 4',                   price: 160000, type: 'set',  slots: 4, hasSwap: true, emoji: '📦', desc: 'Hộp 4 hũ sang trọng — có thể đổi 2 hũ tròn sang trái tim!' },
  cake:   { name: 'Bánh sinh nhật Panna Cotta', price: 0,      type: 'cake',              emoji: '🎂', desc: 'Bánh thủ công theo yêu cầu. Shop báo giá sau.' },
};

export const BANK = {
  bank: 'TECHCOMBANK',
  number: 'XXXXXXXXXXXXX',   // ← thay STK thật vào đây
  owner: 'NGUYEN THI A — Oh Bunnie',
};

// URL Web App Google Apps Script của bạn
export const API_URL = 'https://script.google.com/macros/s/AKfycby-z1ZrlZ7gxsVRpKDFsQM3NUyIGywbI4fT98OtEu53chlf7VVW6ye2ZFpo8mW7yWmq/exec';
