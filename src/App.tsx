import { FutureView } from "./components/FutureView";
import { futures } from "./data/futures";

function Launcher() {
  return (
    <main className="launcher">
      <section className="launcher-panel">
        <p className="eyebrow">Researcher launcher</p>
        <h1>ARKI cooling futures</h1>
        <p className="launcher-copy">
          Open each future directly. These labels are for setup only and do not
          appear inside participant screens.
        </p>
        <div className="launcher-links">
          {futures.map((future) => (
            <a key={future.id} href={future.route}>
              <span>{future.launcherLabel}</span>
              <small>{future.scenario.event}</small>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const future = futures.find((item) => item.route === path);

  if (!future) {
    return <Launcher />;
  }

  return <FutureView future={future} />;
}
