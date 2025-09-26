import BouncingSvg from './components/BouncingSvg';
import AnimatedTitle from './components/AnimatedTitle';
import Terminal from './components/Terminal';
import Subtitle from './components/Subtitle';

function App() {
  return (
    <>
      <section className={'hero'}>
        <div className="container">
          <AnimatedTitle title={"Hi, I'm LMGTFY."} />
        </div>
        <div className="container">
          <BouncingSvg />
        <Subtitle />
        </div>
        <Terminal />
      </section>
    </>
  );
}

export default App;
