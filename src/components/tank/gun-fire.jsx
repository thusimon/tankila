import React, {useEffect, useRef, useState} from 'react';
import './gun-fire.scss';

const getGunFireClassName = (idleState) => {
  const initClass = {
    red: 'gun-flame-init gun-flame-red',
    orange: 'gun-flame-init gun-flame-orange',
    yellow: 'gun-flame-init gun-flame-yellow'
  };
  if (idleState) {
    return initClass;
  } else {
    return {
      red: initClass.red + ' gun-flame-red-end',
      orange: initClass.orange + ' gun-flame-orange',
      yellow: initClass.yellow + ' gun-flame-yellow'
    };
  }
}

const GunFire = (props) => {
  // 0, idle
  // 1, during cooldown
  let [gunFireState, setGunFireState] = useState({idle: true});
  const redRef = useRef(null);
  const orangeRef = useRef(null);
  const yellowRef = useRef(null);
  useEffect(() => {
    if (gunFireState.idle && redRef.current && orangeRef.current && yellowRef.current) {
      setGunFireState(prevState => {
        return { ...prevState, idle: false}
      });
      setTimeout(() => {
        setGunFireState(prevState => {
          return { ...prevState, idle: true}
        });
      }, 1000);
    }
  }, [props.fire]);
  const gunFireClasses = getGunFireClassName(gunFireState.idle);
  return (<div className='gun-fire-container'>
    <div className={gunFireClasses.red} ref={redRef}></div>
    <div className={gunFireClasses.orange} ref={orangeRef}></div>
    <div className={gunFireClasses.yellow} ref={yellowRef}></div>
  </div>);
}

export default GunFire;
