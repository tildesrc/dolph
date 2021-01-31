import React, { useState } from 'react';
import { Grid, Button, Typography, Box, Paper } from '@material-ui/core';
import { Refresh as NewRepSetIcon, CallMissedOutgoing as MissIcon, SaveAlt as HitIcon, Undo as UndoIcon } from '@material-ui/icons';
import styled from '@emotion/styled';
import { get, set } from 'idb-keyval';
import { FormatPercentage } from './common';
import { repSetType } from './types';

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

function now() {
  return new Date().toJSON();
}

function PuttCounter() {
  const defaultRepSet = {
    updatedAt: now(),
    hits: 0,
    misses: 0,
    repGoal: 100,
    undo: undefined,
  };
  const [repSet, setRepSet] = useState<repSetType>();

  async function loadRepSet() {
    let repSets = await get('repSets');
    if (!repSets) {
      repSets = [defaultRepSet]
      set('repSets', repSets);
    }
    setRepSet(repSets[0]);
  }
  if (!repSet) loadRepSet();

  async function updateRepSet(repSet: repSetType) {
    let repSets = await get('repSets');
    repSets[0] = repSet;
    set('repSets', repSets);
    setRepSet(repSet);
 }

  async function handleCounterButton(field: 'hits' | 'misses') {
    updateRepSet({...repSet!, updatedAt: now(), [field]: repSet![field] + 1, undo: repSet})
  }

  function handleUndo() {
    updateRepSet(repSet!.undo!);
  }

  async function handleNewRepSet() {
    let repSets = await get('repSets');
    set('repSets', [defaultRepSet, ...repSets]);
    setRepSet(undefined);
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
                    (<FormatPercentage>{count / outOf}</FormatPercentage>)
                  </Box>
                }
              </>
            </Typography>;
  }

  return (
    <Container>
      { !repSet ? (
          <Paper className='header'>
            <Typography variant='h4' align='center'>Loading...</Typography>
          </Paper>
      ) : (
        <>
          <Paper className='header'>
            <Grid container>
              <Grid container item sm={6} xs={12}>
                <Grid item md={6} xs={12}>
                  <CountLine label='Throws' count={repSet.hits + repSet.misses} outOf={repSet.repGoal} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <CountLine label='Rep Goal' count={repSet.repGoal} outOf={0} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <CountLine label='Hits' count={repSet.hits} outOf={repSet.hits + repSet.misses} />
                </Grid>
                <Grid item md={6} xs={12}>
                  <CountLine label='Misses' count={repSet.misses} outOf={repSet.hits + repSet.misses} />
                </Grid>
              </Grid>
              <Grid container item sm={6} xs={12}>
                <Grid item xs={12} style={{ padding: '0.5rem'}}>
                  <Button fullWidth variant='contained' startIcon={<NewRepSetIcon />} disabled={!repSet.undo} onClick={handleNewRepSet}>Start New Rep Set</Button>
                </Grid>
                <Grid item xs={12} style={{ padding: '0.5rem'}}>
                  <Button fullWidth variant='contained' startIcon={<UndoIcon />} disabled={!repSet.undo} onClick={handleUndo}>Undo</Button>
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
        </>
        )
      }
    </Container>
  );
}

export default PuttCounter;

