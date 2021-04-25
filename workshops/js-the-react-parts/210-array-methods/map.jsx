import * as React from 'react';
import styled from '@emotion/styled';

export function MapAnimation() {
  const [runState, setRunState] = React.useState('not_run');

  return (
    <div>
      <div
        className={runState !== 'not_run' ? 'activated' : undefined}
        id="map-demo"
      >
        <div className="box-container">
          <Box className="box" />
          <Circle className="box shrinked" />
          <Box className="box" />
          <Box className="box" />
          <Circle
            className="box shrinked"
            onTransitionEnd={() =>
              runState === 'running' && setRunState('complete')
            }
          />
        </div>
      </div>
      <div className="my-2 h-12 flex justify-center items-center">
        {runState !== 'running' && (
          <button
            type="button"
            onClick={() =>
              setRunState(runState === 'not_run' ? 'running' : 'not_run')
            }
          >
            {runState === 'complete' ? 'Restart' : 'Run'}
          </button>
        )}
      </div>
    </div>
  );
}
