function TrustBar() {
  const logos = ['TechCorp', 'InnovateLabs', 'CloudScale', 'DataFlow', 'NextGen'];
  
  return (
    <section className="trust-bar">
      <p className="trust-label">Trusted by fast-growing companies</p>
      <div className="logo-row">
        {logos.map((logo) => (
          <span key={logo} className="company-logo">{logo}</span>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;