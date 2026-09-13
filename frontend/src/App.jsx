function App() {
  return (
    <main className="page">
      <div className="glow" aria-hidden="true" />
      <div className="content">
        <span className="badge">
          <span className="dot" />
          Coming soon
        </span>
        <h1 className="title">
          Frontier AI
          <br />
          Deployment Company
        </h1>
        <p className="tagline">Launching soon.</p>
      </div>
      <footer className="footer">
        © {new Date().getFullYear()} Frontier AI Deployment Company
      </footer>
    </main>
  )
}

export default App
