import { useState, useEffect } from 'react';
import useIdentity from './hooks/useIdentity';

function App() {
  const [status, setStatus] = useState<"idle" | "fetching" | "error">(
    "fetching",
  );
  const { users, identity, client } = useIdentity();

  if (!identity) {
    return null;
  }

  return (
    <section className="h-screen w-full flex justify-center items-center bg-grey-100">
      <div className="w-full max-w-md bg-white-800">
        <h2 className="text-5xl font-normal leading-normal mt-0 mb-2">Textile & IPFS</h2>
        <p>
          Identity:  {identity.toString()}<br />
          Users:  {users.toString()}<br />
          Identity: {status === "idle" && identity.toString()} {status === "fetching" && 'Fetching...'}<br />
          {/* Users: {users.toString()}<br /> */}
        </p>
      </div>
    </section>
  );
}

export default App;
