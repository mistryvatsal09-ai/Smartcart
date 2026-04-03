function AboutUs() {
  return (
    <main className="main-container">
      <header className="page-header">
        <h1>About Us</h1>
        <p>Learn more about SmartCart and our mission.</p>
      </header>

      <section className="card" style={{ padding: "2rem" }}>
        <h2 style={{ marginTop: 0 }}>Who We Are</h2>
        <p>
          SmartCart is an online shopping platform focused on simple browsing,
          transparent pricing, and fast checkout.
        </p>

        <h2>Our Mission</h2>
        <p>
          We aim to make everyday shopping easier by offering a reliable
          experience with quality products and responsive support.
        </p>

        <h2>What We Value</h2>
        <ul>
          <li>Customer-first service</li>
          <li>Clear product information</li>
          <li>Secure and smooth transactions</li>
        </ul>
      </section>
    </main>
  );
}

export default AboutUs;
