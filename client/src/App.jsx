import BouncingSvg from './components/BouncingSvg';
import AnimatedTitle from './components/AnimatedTitle';
import Terminal from './components/Terminal';
import Subtitle from './components/Subtitle';
import FallingLink from './components/FallingLink';

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
      <div className='footer'>
        <p>LMGTFY v1.0 service droid source code: <FallingLink text='Help!' href='https://github.com/HakAl/lmgtfy' /></p> 
      </div>
      </section>
    </>
  );
}

export default App;
