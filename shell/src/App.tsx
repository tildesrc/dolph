import React, { useState } from 'react';
import './App.css';
import { Grid, Button, Typography, Box } from '@material-ui/core';
import { CallMissedOutgoing as MissIcon, SaveAlt as HitIcon } from '@material-ui/icons';
import styled from '@emotion/styled';
import numeral from 'numeral';

const PuttingCounter = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .counter-button-grid {
    height: 100%;
    .counter-button {
      button { height: 100%; }
      .counter-icon {
        font-size: 10rem;
      }
    }
  }
  .header {
    margin: 0.5rem;
    .count-line {
      display: flex;
      paddingLeft: 0.5rem;
      paddingRight: 0.5rem;
      margin-left: 0.5rem;
      .count-number {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin-left: 0.5rem;
        margin-bottom: 0.1rem;
      }
    }
  }
`;

function App() {
  function CounterButton({color, CounterIcon}: {color: 'primary' | 'secondary', CounterIcon: typeof HitIcon | typeof MissIcon}) {
    return (
       <Button fullWidth size='large' color={color} variant='contained'>
         <CounterIcon className='counter-icon'/>
       </Button>
     );
  }

  function CountLine({count, outOf, label}: {count: number, outOf: number, label: string}) {
    return <Typography variant='h6' className='count-line'>
              <Box fontWeight="bold">{label}:</Box>
              <Box fontFamily='Monospace' className='count-number'>{count}</Box>
              {!outOf ||
                <Box fontFamily='Monospace' fontStyle='italic' className='count-number'>
                  ({numeral(100 * count / outOf).format('0.00')}%)
                </Box>
              }
            </Typography>;
  }

  return (
    <PuttingCounter>
      <div className='header'>
        <Grid container>
          <Grid xs={12}><CountLine label='Throws' count={3} outOf={10} /></Grid>
          <Grid md={3} sm={6} xs={12}><CountLine label='Hits' count={1} outOf={3} /></Grid>
          <Grid md={3} sm={6} xs={12}><CountLine label='Misses' count={2} outOf={3} /></Grid>
        </Grid>
      </div>
      <Grid container className='counter-button-grid'>
        <Grid item sm={6} xs={12} className='counter-button'>
          <CounterButton color='primary' CounterIcon={MissIcon} />
        </Grid>
        <Grid item sm={6} xs={12} className='counter-button'>
          <CounterButton color='secondary' CounterIcon={MissIcon} />
        </Grid>
      </Grid>
    </PuttingCounter>
  );
}

export default App;

