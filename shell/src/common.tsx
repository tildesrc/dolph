import React from 'react';
import numeral from 'numeral';

export function FormatPercentage({children} : {children: number}) {
  return <>{`${numeral(100 * children).format('0.00')}%`}</>;
}
