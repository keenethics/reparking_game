import soundMp3 from '../../../assets/start.mp3';
import soundWav from '../../../assets/start.wav';

function Audio({ audioRef }) {
  return (
    <audio ref={audioRef}>
      <source src={soundMp3} type="audio/mpeg" />
      <source src={soundWav} type="audio/wav" />
    </audio>
  );
}

export default Audio;
