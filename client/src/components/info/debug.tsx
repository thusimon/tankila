import React from 'react';
import { DebugInfo } from '../../data/Types';

const Debug = (props: DebugInfo): JSX.Element => {
  return (<div id='debug-info'>
    <p>Pos:{props.playerPosition.x.toFixed(2)},{props.playerPosition.y.toFixed(2)},{props.playerPosition.z.toFixed(2)}</p>
    <p>Dir:{props.playerRotation.x.toFixed(2)},{props.playerRotation.y.toFixed(2)},{props.playerRotation.z.toFixed(2)}</p>
  </div>);
};

export default Debug;