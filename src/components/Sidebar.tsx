export default function Sidebar() {
  return (
    <aside className="sidebar guide-sidebar" aria-label="Stelegraphy Guide">
      <div className="sidebar-header">How Stelegraphy Works</div>
      
      <div className="guide-content">
        <div className="guide-step">
          <div className="guide-step-num">1</div>
          <div className="guide-step-body">
            <strong>XOR Masking</strong>
            <p>The original message is processed through an XOR masking operation against the provided Master Key, scrambling the input into randomized bytes.</p>
          </div>
        </div>

        <div className="guide-step">
          <div className="guide-step-num">2</div>
          <div className="guide-step-body">
            <strong>Base64 Encoding</strong>
            <p>The resulting randomized bytes are subsequently encoded and normalized into a standard Base64 format.</p>
          </div>
        </div>

        <div className="guide-step">
          <div className="guide-step-num">3</div>
          <div className="guide-step-body">
            <strong>Runic Translation</strong>
            <p>Each Base64 character is mapped precisely to one of 64 distinct Ancient Runic alphabets, yielding a highly aesthetic cryptographic output.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
