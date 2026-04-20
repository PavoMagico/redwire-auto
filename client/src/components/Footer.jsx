import Logo from './Logo';

const socials = ['IG', 'FB', 'TW', 'YT'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Logo size={32} />
          <p style={{ fontSize: 13, marginTop: 14, maxWidth: 280 }}>
            Dime qué conduces y te diré quién eres. El test que encuentra tu coche ideal en 2026.
          </p>
        </div>
        <div>
          <div className="footer-links">
            <a href="#">FAQ</a>
            <a href="#">Conócenos</a>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
          <div className="copyright">© 2026 Red Wire Auto. Todos los derechos reservados.</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {socials.map(s => (
            <a key={s} href="#" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-2)', display: 'grid', placeItems: 'center',
              fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: 'var(--grafito)',
              transition: 'transform .3s var(--spring-bounce), background .2s, color .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) rotate(-6deg)'; e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--bg)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--grafito)'; }}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
