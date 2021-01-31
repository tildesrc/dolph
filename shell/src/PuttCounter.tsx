import React, { useState } from 'react';
import { Container, Grid, Button, Typography, Box, Paper, Card, CardContent, CardHeader, Fade, Collapse, Grow } from '@material-ui/core';
import { Refresh as NewRepSetIcon, CallMissedOutgoing as MissIcon, SaveAlt as HitIcon, Undo as UndoIcon, Timeline, Cached } from '@material-ui/icons';
import styled from '@emotion/styled';
import { get, set } from 'idb-keyval';
import { FormatPercentage } from './common';
import { RepSet } from './types';
import {useHistory} from 'react-router-dom';
import PATHS from './paths';

const StyledContainer = styled(Container)`
  .main-card {
   padding-top: 1rem;
  }
  .counter-button-grid {
    .counter-button {
      padding: 0.5rem;
    }
  }
  .counter-icon {
    font-size: 10rem;
  }
  .count-line {
    display: flex;
    .count-number {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin-left: 0.5rem;
      margin-bottom: 0.1rem;
    }
  }
`;

function PuttCounter() {
  const [repSet, setRepSet] = useState<RepSet>();

  async function loadRepSet() {
    let repSets = await get('repSets');
    if (!repSets) {
      repSets = [new RepSet({goal: 100})]
      set('repSets', repSets);
    }
    setRepSet(new RepSet({as: repSets[0]}));
  }
  if (!repSet) loadRepSet();

  async function updateRepSet(repSet: RepSet) {
    let repSets = await get('repSets');
    repSets[0] = repSet;
    set('repSets', repSets);
    setRepSet(repSet);
 }

  async function handleCounterButton(field: 'hits' | 'misses') {
    updateRepSet(new RepSet({from: repSet, [field]: repSet![field] + 1}));
  }

  function handleUndo() {
    updateRepSet(repSet!.undo!);
  }

  async function handleNewRepSet() {
    let repSets = await get('repSets');
    set('repSets', [undefined, ...repSets]);
    updateRepSet(new RepSet({goal: 100}));
  }

  let history = useHistory();

  function CounterButton({color, CounterIcon, onClick}: {color: 'primary' | 'secondary', CounterIcon: typeof HitIcon | typeof MissIcon, onClick: () => void}) {
    return (
       <Button fullWidth size='large' color={color} variant='contained' onClick={onClick} disabled={!repSet}>
         <CounterIcon className='counter-icon'/>
       </Button>
     );
  }

  function CountLine({count, outOf, label}: {count: number | undefined, outOf: number | undefined, label: string}) {
    return <Typography variant='h6' className='count-line'>
              <>
                <Box fontWeight="bold">{label}:</Box>
                <Box fontFamily='Monospace' className='count-number'>{count ?? '—'}</Box>
                {!count || !outOf ||
                  <Box fontFamily='Monospace' fontStyle='italic' className='count-number'>
                    (<FormatPercentage>{count / outOf}</FormatPercentage>)
                  </Box>
                }
              </>
            </Typography>;
  }

  const loadAnimationTimeOut = 250;

  return (
    <StyledContainer>
      <>
        <Grid container>
          <Grid item xs={12}>
            <Collapse in={!repSet} timeout={loadAnimationTimeOut}>
              <Typography align='center'>
                <Box  color='text.disabled' fontSize='10rem'>
                  <Cached fontSize='inherit' />
                  <Typography variant='h4'>Loading...</Typography>
                </Box>
              </Typography>
            </Collapse>
          </Grid>
          <Grid item xs={12}>
            <Grow in={!!repSet} timeout={loadAnimationTimeOut}>
              <Grid container>
                <Grid item xs={12} spacing={2} className='main-card'>
                  <Card>
                    <CardContent>
                      <Grid container>
                        <Grid container item sm={6} xs={12}>
                          <Grid item md={6} xs={12}>
                            <CountLine label='Throws' count={repSet?.throws} outOf={repSet?.goal} />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <CountLine label='Rep Goal' count={repSet?.goal} outOf={0} />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <CountLine label='Hits' count={repSet?.hits} outOf={repSet?.throws} />
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <CountLine label='Misses' count={repSet?.misses} outOf={repSet?.throws} />
                          </Grid>
                        </Grid>
                        <Grid container item sm={6} xs={12}>
                          <Grid item xs={6} style={{ padding: '0.5rem'}}>
                            <Button fullWidth variant='contained' startIcon={<NewRepSetIcon />} disabled={!repSet?.undo} onClick={handleNewRepSet}>New Set</Button>
                          </Grid>
                          <Grid item xs={6} style={{ padding: '0.5rem'}}>
                            <Button fullWidth variant='contained' startIcon={<Timeline />} onClick={() => history.push(PATHS.PUTTS.HISTORY)}>History</Button>
                          </Grid>
                          <Grid item xs={12} style={{ padding: '0.5rem'}}>
                            <Button fullWidth variant='contained' startIcon={<UndoIcon />} disabled={!repSet?.undo} onClick={handleUndo}>Undo</Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} className='main-card'>
                  <Card>
                    <CardContent>
                      <Grid container className='counter-button-grid'>
                        <Grid item sm={6} xs={12} className='counter-button'>
                          <CounterButton color='primary' CounterIcon={HitIcon} onClick={() => handleCounterButton('hits')} />
                        </Grid>
                        <Grid item sm={6} xs={12} className='counter-button'>
                          <CounterButton color='secondary' CounterIcon={MissIcon} onClick={() => handleCounterButton('misses')} />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grow>
          </Grid>
        </Grid>
      </>
    </StyledContainer>
  );
}

export default PuttCounter;

