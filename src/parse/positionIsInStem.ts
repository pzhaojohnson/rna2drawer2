import stemOfPosition from './stemOfPosition';

function positionIsInStem(p: number, partners: [number, null]): boolean {
  if (stemOfPosition(p, partners)) {
    return true;
  }
  return false;
}

export default positionIsInStem;
