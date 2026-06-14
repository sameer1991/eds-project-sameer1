const FIELD_CLASSES = ['mrp', 'discount', 'final-price'];

function getValueElement(row) {
  return row.children[1] || row.children[0] || row;
}

function parseNumber(value) {
  const match = String(value || '').replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

function createFinalPriceRow() {
  const row = document.createElement('div');
  const label = document.createElement('div');
  const value = document.createElement('div');

  label.textContent = 'Final Price';
  row.append(label, value);

  return row;
}

function updateFinalPrice(mrpElement, discountElement, finalPriceElement) {
  const mrp = parseNumber(mrpElement.value || mrpElement.textContent);
  const discount = parseNumber(discountElement.value || discountElement.textContent);

  if (Number.isNaN(mrp) || Number.isNaN(discount)) {
    finalPriceElement.textContent = '';
    return;
  }

  const finalPrice = mrp - ((mrp * discount) / 100);
  finalPriceElement.textContent = formatPrice(finalPrice);
}

export default function decorate(block) {
  const rows = [...block.children];
  const mrpRow = rows[0];
  const discountRow = rows[1];
  let finalPriceRow = rows[2];

  if (!mrpRow || !discountRow) return;

  if (!finalPriceRow) {
    finalPriceRow = createFinalPriceRow();
    block.append(finalPriceRow);
  }

  [mrpRow, discountRow, finalPriceRow].forEach((row, index) => {
    row.classList.add(`price-tag-${FIELD_CLASSES[index]}`);
  });

  const mrpElement = getValueElement(mrpRow);
  const discountElement = getValueElement(discountRow);
  const finalPriceElement = getValueElement(finalPriceRow);

  updateFinalPrice(mrpElement, discountElement, finalPriceElement);

  [mrpElement, discountElement].forEach((element) => {
    if ('value' in element) {
      element.addEventListener('input', () => {
        updateFinalPrice(mrpElement, discountElement, finalPriceElement);
      });
    }
  });
}
