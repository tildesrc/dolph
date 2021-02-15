import {IconButton, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import {CloudDownload, Delete} from '@material-ui/icons';
import {get, set} from 'idb-keyval';
import React, { createRef, useState, useEffect } from 'react';
import { FormatDate, FormatPercentage } from './common';
import { RepSet } from './types';
import { createObjectCsvStringifier } from 'csv-writer';

export default function PuttHistory() {
  let [repSets, setRepSets] = useState<RepSet[]>();

  async function loadRepSets() {
    setRepSets((await get('repSets')).map((repSet: RepSet) => new RepSet({as: repSet})));
  }
  if (!repSets) loadRepSets();

  async function handleDelete(deleteIdx: number) {
    repSets = repSets!.filter((__, idx) => idx !== deleteIdx);
    set('repSets', repSets);
    setRepSets(repSets);
  }

  let downloadLinkRef = createRef<HTMLAnchorElement>();

  useEffect(() => {
    if (!repSets) return;
    let csvWriter = createObjectCsvStringifier({
      header: [
        { id: 'updatedAt', title: 'Last Updated' },
        { id: 'hits', title: 'Hits' },
        { id: 'misses', title: 'Misses' },
      ]
    });
    let payload = [
      csvWriter.getHeaderString(), csvWriter.stringifyRecords(repSets!.filter((__, idx) => idx !== 0))
    ].join('')
    downloadLinkRef!.current!.href = `data:text/plain;charset=utf-8,${encodeURIComponent(payload)}`
  }, [repSets, downloadLinkRef])

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={1}>
            <IconButton><a href='#' ref={downloadLinkRef} download='putts.csv'><CloudDownload /></a></IconButton>
          </TableCell>
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
              {repSet.throws}
            </TableCell>
            <TableCell>
              {repSet.hits}
            </TableCell>
            <TableCell>
              <FormatPercentage>{repSet.hits / repSet.throws}</FormatPercentage>
            </TableCell>
            <TableCell>
              {repSet.misses}
            </TableCell>
            <TableCell>
              <FormatPercentage>{repSet.misses / repSet.throws}</FormatPercentage>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


