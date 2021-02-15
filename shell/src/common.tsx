import React from 'react';
import numeral from 'numeral';

export function FormatDate({ date }: {date: string}) {
  return (<div>{Intl.DateTimeFormat(navigator.language, { minute: 'numeric', hour: 'numeric', month: 'numeric', day: 'numeric', year: 'numeric' }).format(new Date(date))}</div>)
}

export function FormatPercentage({children} : {children: number}) {
  return <>{`${numeral(100 * children).format('0.00')}%`}</>;
}
