import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import Toast from './components/Toast'
import { useGameState } from './hooks/useGameState'

export default function App() {
  const game = useGameState()

  return (
    <>
      <header className="site-header">
        <div className="logo">
          <div className="logo-main">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px', position: 'relative', top: '-2px' }}>
              <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
              <circle cx="16" cy="16" r="9" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
              <circle cx="16" cy="16" r="4" fill="white" fillOpacity="0.9"/>
              <line x1="16" y1="7" x2="16" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="28" x2="16" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="16" x2="4" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="28" y1="16" x2="25" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="12" x2="16" y2="16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="16" y1="16" x2="20" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="1.5" fill="url(#logoGrad)"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#22d3ee"/>
                  <stop offset="50%" stopColor="#a78bfa"/>
                  <stop offset="100%" stopColor="#fb7185"/>
                </linearGradient>
              </defs>
            </svg>
            TURNPICKER
          </div>
          <div className="logo-sub">Who Goes First? We Decide.</div>
        </div>
      </header>

      {!game.state
        ? <SetupScreen
            playerCount={game.playerCount}
            setPlayerCount={game.setPlayerCount}
            onStart={game.startGame}
          />
        : <GameScreen
            state={game.state}
            spinning={game.spinning}
            setSpinning={game.setSpinning}
            commitSpin={game.commitSpin}
            commitAutoAssign={game.commitAutoAssign}
            finishGame={game.finishGame}
            doUndo={game.doUndo}
            resetGame={game.resetGame}
          />
      }

      <Toast message={game.toast} />
    </>
  )
}