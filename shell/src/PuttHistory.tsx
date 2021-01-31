import {IconButton, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {get, set} from 'idb-keyval';
import React, { useState } from 'react';
import { FormatPercentage } from './common';
import { repSetType } from './types';

export default function PuttHistory() {
  let [repSets, setRepSets] = useState<repSetType[]>();

  async function loadRepSets() {
    setRepSets(await get('repSets'));
    console.log(await get('repSets'));
  }
  if (!repSets) loadRepSets();

  function FormatDate({ date }: {date: string}) {
    return (<div>{Intl.DateTimeFormat(navigator.language, { minute: 'numeric', hour: 'numeric', month: 'numeric', day: 'numeric', year: 'numeric' }).format(new Date(date))}</div>)
  }

  async function handleDelete(deleteIdx: number) {
    repSets = repSets!.filter((__, idx) => idx !== deleteIdx);
    set('repSets', repSets);
    setRepSets(repSets);
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={1}/>
          <TableCell>
            Last Updated
          </TableCell>
          <TableCell>
            Throws
          </TableCell>
          <TableCell>
            Hits
          </TableCell>
          <TableCell>
            Hit %
          </TableCell>
          <TableCell>
            Misses
          </TableCell>
          <TableCell>
            Miss %
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {repSets?.map((repSet, idx) => (idx !== 0) && (
          <TableRow>
            <TableCell>
              <IconButton onClick={() => handleDelete(idx)}><Delete /></IconButton>
            </TableCell>
            <TableCell>
              <FormatDate date={repSet.updatedAt} />
            </TableCell>
            <TableCell>
              {repSet.hits + repSet.misses}
            </TableCell>
            <TableCell>
              {repSet.hits}
            </TableCell>
            <TableCell>
              <FormatPercentage>{repSet.hits / (repSet.hits + repSet.misses)}</FormatPercentage>
            </TableCell>
            <TableCell>
              {repSet.misses}
            </TableCell>
            <TableCell>
              <FormatPercentage>{repSet.misses / (repSet.hits + repSet.misses)}</FormatPercentage>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


