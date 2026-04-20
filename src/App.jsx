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
          <div className="logo-main"><span className="logo-dot" />ROLLER</div>
          <div className="logo-sub">Turn Order Generator</div>
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