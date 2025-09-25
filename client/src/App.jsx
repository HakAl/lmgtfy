import BouncingSvg from './components/BouncingSvg';
import AnimatedTitle from './components/AnimatedTitle';
import Terminal from './components/Terminal';
import Subtitle from './components/Subtitle';

function App() {
  return (
    <>
      <section className={'hero'}>
        <div className="container">
          <BouncingSvg />
          <AnimatedTitle title={"LMGTFY"} />
        </div>
        <Subtitle />
        <Terminal />
      </section>
    </>
  );
}

export default App;
