import { useState, useEffect } from "react";

export default function App() {
  // Countdown
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const nextDraw = new Date();
    nextDraw.setDate(nextDraw.getDate() + 3);
    const tick = () => setTimeLeft(Math.max(0, nextDraw - new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  // Token balance
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const raffleWallet = "GzBRbP7HMxTSYYMGL1RBxJUmabU1ZYi7yPDq5GSrxCwh";
  const tokenMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // TEMP: USDC
  const BACKEND_URL = "https://prizepool.onrender.com";

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/balance/${raffleWallet}/${tokenMint}`
      );
      const data = await response.json();
      console.log("Backend response:", data);

      if (data.balance !== undefined) {
        setBalance(data.balance);
      } else {
        setBalance(0);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      setBalance(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance(); // initial
    const interval = setInterval(fetchBalance, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-yellow-500 text-white font-bold overflow-hidden">
    {/* Hero */}
    <header className="relative flex flex-col items-center justify-center text-center h-screen px-4">
      {/* Background mascot */}
      <img
        src="/mascot.png"
        alt="PrizePool Mascot"
        className="absolute w-[600px] h-auto opacity-20 z-0 pointer-events-none"
        style={{ top: "30%", right: "-10%" }}
      />

      <h1 className="text-7xl md:text-8xl drop-shadow-xl mb-6 animate-bounce relative z-10">
        🎉 PrizePool
      </h1>
      <p className="text-2xl md:text-3xl mb-8 opacity-90 relative z-10">
        Win. Burn. Hold.
      </p>
      <div className="flex gap-6 flex-wrap justify-center relative z-10">
        <a
          href="https://pump.fun"
          target="_blank"
          rel="noreferrer"
          className="bg-yellow-400 text-black px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 transition"
        >
          🚀 Buy on Pump.Fun
        </a>
        <a
          href="https://x.com/PrizePool_Token"
          target="_blank"
          rel="noreferrer"
          className="bg-black text-white px-8 py-4 rounded-full text-xl shadow-lg hover:scale-105 transition"
        >
          ✖ Follow on X
        </a>
      </div>
    </header>

      {/* How it works */}
      <section className="bg-white text-black rounded-3xl max-w-5xl mx-auto p-10 shadow-2xl mb-16 text-center">
        <h2 className="text-4xl mb-6">📜 How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
            <h3 className="text-2xl mb-2">1️⃣ Buy</h3>
            <p>Get PrizePool tokens ($POOL).</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
            <h3 className="text-2xl mb-2">2️⃣ Enter</h3>
            <p>Send $POOL to the raffle wallet.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
            <h3 className="text-2xl mb-2">3️⃣ Win</h3>
            <p>Everyday → 90% winner / 10% burned.</p>
          </div>
        </div>
      </section>

      {/* Live raffle */}
      <section className="text-center max-w-4xl mx-auto mb-16 px-4">
        <h2 className="text-4xl mb-4">🎰 Live Raffle</h2>
        <p className="mb-3">
          Raffle Wallet:{" "}
          <a
            href={`https://solscan.io/account/${raffleWallet}`}
            target="_blank"
            rel="noreferrer"
            className="underline text-yellow-300 hover:text-yellow-200"
          >
            {raffleWallet.slice(0, 6)}...{raffleWallet.slice(-4)}
          </a>
        </p>
        <p className="mb-3">
          Current Pool:{" "}
          <b>{loading ? "Refreshing..." : `${balance.toLocaleString()} $POOL`}</b>
        </p>
        <button
          onClick={fetchBalance}
          className="mt-3 bg-yellow-400 text-black px-6 py-2 rounded-full shadow hover:scale-105 transition"
        >
          🔄 Refresh
        </button>
        <p className="text-2xl mt-6">Next Draw In: {formatTime(timeLeft)}</p>
      </section>

      {/* Past winners */}
      <section className="bg-white text-black max-w-5xl mx-auto rounded-3xl p-10 shadow-2xl mb-16">
        <h2 className="text-4xl mb-6 text-center">🏆 Past Winners</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Winner</th>
                <th className="p-3 text-left">Prize</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
                <td className="p-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto p-10 mb-20 text-black">
        <h2 className="text-4xl mb-6 text-center text-white">❓ FAQ</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl mb-2">How do I play?</h3>
            <p>Buy PrizePool ($POOL) and send it to the raffle wallet.  
            Each <b>50,000 $POOL = 1 raffle ticket</b>.  
            The more you send, the more tickets you get!</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl mb-2">Is it fair?</h3>
            <p>Winners picked using transparent verifiable randomness.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl mb-2">What about burns?</h3>
            <p>10% of every pool is burned forever → supply shrinks.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm py-6 bg-black">
        © 2025 PrizePool •{" "}
        <a href="https://x.com/" className="underline">
          Follow on X
        </a>
      </footer>
    </div>
  );
}
