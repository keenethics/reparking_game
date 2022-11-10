import { Link } from 'react-router-dom';

function GameMenu () {
  return (
    <div className="">
      <button>Create Game</button>
      <Link to="/game/123">http.../game/123</Link>
    </div>
  );
}

export default GameMenu;
