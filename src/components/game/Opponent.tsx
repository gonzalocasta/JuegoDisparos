type OpponentProps = {
  x: number;
  y: number;
  type: 'triangle' | 'pentagon';
};

function Triangle() {
    return (
        <div
            style={{
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '30px solid hsl(var(--accent))',
            }}
        />
    )
}

function Pentagon() {
    return (
        <div className="relative" style={{ width: '30px', height: '28px' }}>
            <div
                className="absolute"
                style={{
                    width: 0,
                    height: 0,
                    borderBottom: '10px solid hsl(var(--accent))',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    top: 0,
                    left: 0,
                }}
                aria-hidden="true"
            />
            <div
                className="absolute bg-accent"
                style={{
                    width: '30px',
                    height: '18px',
                    top: '10px',
                    clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
                }}
                aria-hidden="true"
            />
        </div>
    )
}

export function Opponent({ x, y, type }: OpponentProps) {
  return (
    <div
      style={{
        left: x,
        top: y,
      }}
      className="absolute"
      role="img"
      aria-label={`Opponent of type ${type}`}
    >
      {type === 'triangle' ? <Triangle /> : <Pentagon />}
    </div>
  );
}
