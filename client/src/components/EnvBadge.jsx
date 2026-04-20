const classMap = { ECO: 'eco', ZERO: 'zero', '0': 'zero', C: 'c', B: 'b' };

export default function EnvBadge({ type }) {
  return (
    <span className={`env-badge ${classMap[type] || 'c'}`}>
      {type === 'ZERO' ? '0' : type}
    </span>
  );
}
