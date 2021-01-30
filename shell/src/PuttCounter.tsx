import React, { useState } from 'react';
import { Grid, Button, Typography, Box, Paper } from '@material-ui/core';
import { Refresh as NewRepSetIcon, CallMissedOutgoing as MissIcon, SaveAlt as HitIcon, Undo as UndoIcon } from '@material-ui/icons';
import styled from '@emotion/styled';
import numeral from 'numeral';

const Container = styled.div`
  position: absolute;
  left: 1%;
  top: 1%;
  height: 98%;
  width: 98%;
  display: flex;
  flex-direction: column;
  .counter-button-grid {
    height: 100%;
    .counter-button {
      button {
        left: 1%;
        top: 1%;
        height: 98%;
        width: 98%;
      }
      .counter-icon {
        font-size: 10rem;
      }
    }
  }
  .header {
    margin: 0.5rem;
    padding: 0.5rem;
    .count-line {
      display: flex;
      padding-left: 0.5rem;
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

type counterStateType = {
  hits: number;
  misses: number;
  repGoal: number;
};

function PuttCounter() {
  const defaultCounterState = {
    hits: 0,
    misses: 0,
    repGoal: 100
  };
  const [counterState, setCounterState] = useState<counterStateType>(defaultCounterState);
  const [undo, setUndo] = useState<counterStateType[]>([]);

  function handleCounterButton(field: 'hits' | 'misses') {
    setUndo([...undo, counterState]);
    setCounterState({...counterState, [field]: counterState[field] + 1});
  }

  function handleUndo() {
    setCounterState(undo.pop()!);
    setUndo([...undo]);
  }

  function handleNewRepSet() {
    setCounterState(defaultCounterState);
    setUndo([]);
  }

  function CounterButton({color, CounterIcon, onClick}: {color: 'primary' | 'secondary', CounterIcon: typeof HitIcon | typeof MissIcon, onClick: () => void}) {
    return (
       <Button fullWidth size='large' color={color} variant='contained' onClick={onClick}>
         <CounterIcon className='counter-icon'/>
       </Button>
     );
  }

  function CountLine({count, outOf, label}: {count: number, outOf: number, label: string}) {
    return <Typography variant='h6' className='count-line'>
              <>
                <Box fontWeight="bold">{label}:</Box>
                <Box fontFamily='Monospace' className='count-number'>{count}</Box>
                {!outOf ||
                  <Box fontFamily='Monospace' fontStyle='italic' className='count-number'>
                    ({numeral(100 * count / outOf).format('0.00')}%)
                  </Box>
                }
              </>
            </Typography>;
  }

  return (
    <Container>
      <Paper className='header'>
        <Grid container>
          <Grid container item sm={6} xs={12}>
            <Grid item md={6} xs={12}>
              <CountLine label='Throws' count={counterState.hits + counterState.misses} outOf={counterState.repGoal} />
            </Grid>
            <Grid item md={6} xs={12}>
              <CountLine label='Rep Goal' count={counterState.repGoal} outOf={0} />
            </Grid>
            <Grid item md={6} xs={12}>
              <CountLine label='Hits' count={counterState.hits} outOf={counterState.hits + counterState.misses} />
            </Grid>
            <Grid item md={6} xs={12}>
              <CountLine label='Misses' count={counterState.misses} outOf={counterState.hits + counterState.misses} />
            </Grid>
          </Grid>
          <Grid container item sm={6} xs={12}>
            <Grid item xs={12} style={{ padding: '0.5rem'}}>
              <Button fullWidth variant='contained' startIcon={<NewRepSetIcon />} disabled={undo.length === 0} onClick={handleNewRepSet}>Start New Rep Set</Button>
            </Grid>
            <Grid item xs={12} style={{ padding: '0.5rem'}}>
              <Button fullWidth variant='contained' startIcon={<UndoIcon />} disabled={undo.length === 0} onClick={handleUndo}>Undo</Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid container className='counter-button-grid'>
        <Grid item sm={6} xs={12} className='counter-button'>
          <CounterButton color='primary' CounterIcon={HitIcon}  onClick={() => handleCounterButton('hits')} />
        </Grid>
        <Grid item sm={6} xs={12} className='counter-button'>
          <CounterButton color='secondary' CounterIcon={MissIcon} onClick={() => handleCounterButton('misses')} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default PuttCounter;

