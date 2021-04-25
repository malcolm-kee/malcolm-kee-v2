import styled from '@emotion/styled';
import cx from 'classnames';
import * as React from 'react';

export function FilterAnimation() {
  const [runState, setRunState] = React.useState('not_run');

  return (
    <div>
      <div
        className={cx(
          'relative h-44 bg-white max-w-lg mx-auto',
          runState !== 'not_run' ? 'activated' : undefined
        )}
        id="filter-demo"
      >
        <div className="box-container">
          <Box className="box" />
          <Circle className="box filtered" />
          <Box className="box" />
          <Box className="box" />
          <Circle
            className="box filtered"
            onTransitionEnd={() =>
              runState === 'running' && setRunState('complete')
            }
          />
        </div>
      </div>
      <div className="my-2 h-12 flex justify-center items-center">
        {runState !== 'running' && (
          <Button
            onClick={() =>
              setRunState(runState === 'not_run' ? 'running' : 'not_run')
            }
          >
            {runState === 'complete' ? 'Restart' : 'Run'}
          </Button>
        )}
      </div>
    </div>
  );
}

export function MapAnimation() {
  const [runState, setRunState] = React.useState('not_run');

  const isActivated = runState !== 'not_run';

  return (
    <div>
      <div
        className={cx(
          'h-44 bg-white max-w-lg mx-auto',
          runState !== 'not_run' ? 'activated' : undefined
        )}
        id="map-demo"
      >
        <div className="h-full relative">
          <Box
            className={cx(
              'box filter bg-green-500 ease-linear duration-1000',
              isActivated
                ? 'left-full hue-rotate-90 transition-all'
                : 'left-2 hue-rotate-0 transition-none'
            )}
            style={{ top: 8 }}
          />
          <Circle
            className={cx(
              'filter transform shrinked bg-blue-500 ease-linear duration-1000',
              isActivated
                ? 'left-full hue-rotate-90 transition-all scale-50'
                : 'left-2 hue-rotate-0 transition-none scale-100'
            )}
            style={{ top: 40 }}
          />
          <Box
            className={cx(
              'filter bg-yellow-600 ease-linear duration-1000',
              isActivated
                ? 'left-full hue-rotate-90 transition-all'
                : 'left-2 hue-rotate-0 transition-none'
            )}
            style={{ top: 72 }}
          />
          <Box
            className={cx(
              'filter bg-red-500 ease-linear duration-1000',
              isActivated
                ? 'left-full hue-rotate-90 transition-all'
                : 'left-2 hue-rotate-0 transition-none'
            )}
            style={{ top: 104 }}
          />
          <Circle
            className={cx(
              'filter transform bg-purple-500 ease-linear duration-1000',
              isActivated
                ? 'left-full hue-rotate-90 transition-all scale-50'
                : 'left-2 hue-rotate-0 transition-none scale-100'
            )}
            style={{ top: 136 }}
            onTransitionEnd={() =>
              runState === 'running' && setRunState('complete')
            }
          />
        </div>
      </div>
      <div className="my-2 h-12 flex justify-center items-center">
        {runState !== 'running' && (
          <Button
            onClick={() =>
              setRunState(runState === 'not_run' ? 'running' : 'not_run')
            }
          >
            {runState === 'complete' ? 'Restart' : 'Run'}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ReduceAnimation() {
  const [runState, setRunState] = React.useState('not_run');

  return (
    <div>
      <div>
        <div
        // className={cx(innerContainer, runState !== 'not_run' && activated)}
        >
          <Box />
          <Box />
          <Box />
          <Box onAnimationEnd={() => setRunState('complete')} />
        </div>
      </div>
      <div className="my-2 h-12 flex justify-center items-center">
        {runState !== 'running' && (
          <Button
            onClick={() =>
              setRunState(runState === 'not_run' ? 'running' : 'not_run')
            }
          >
            {runState === 'complete' ? 'Restart' : 'Run'}
          </Button>
        )}
      </div>
    </div>
  );
}

const Button = (props) => (
  <button
    type="button"
    className="px-3 py-1 bg-green-600 text-white rounded relative active:top-px"
    {...props}
  />
);

const Box = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  border: 1px solid;
`;

const Circle = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  border: 1px solid;
  border-radius: 50%;
`;
